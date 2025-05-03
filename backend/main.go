// main.go
package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"fmt"


	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

var fs *firestore.Client

// User represents a registered user in Firestore.
type User struct {
	Email    string `firestore:"email"`
	Password string `firestore:"password"` // PLAINTEXT for demo only!
	Bank     string `firestore:"bank"`
}

// Account is a dummy bank account response.
type Account struct {
	Name    string  `json:"name"`
	Balance float64 `json:"balance"`
}

// Transaction is a dummy transaction response.
type Transaction struct {
	Date        string  `json:"date"`
	Description string  `json:"description"`
	Amount      float64 `json:"amount"`
}

func main() {
	// 1) Load .env if present
	_ = godotenv.Load()

	// 2) Read Firestore config from env
	projectID := os.Getenv("GCP_PROJECT_ID")
	credPath := os.Getenv("GCP_FIRESTORE_CREDENTIALS")
	if projectID == "" || credPath == "" {
		log.Fatal("GCP_PROJECT_ID or GCP_FIRESTORE_CREDENTIALS not set in environment")
	}

	// 3) Initialize Firestore client
	ctx := context.Background()
	sa := option.WithCredentialsFile(credPath)
	client, err := firestore.NewClient(ctx, projectID, sa)
	if err != nil {
		log.Fatalf("firestore.NewClient: %v", err)
	}
	fs = client
	defer fs.Close()

	// 4) Set up Gin router
	r := gin.Default()

	// 5) Auth endpoints
	r.POST("/auth/register", registerHandler)
	r.POST("/auth/login", loginHandler)

	// 6) Demo data endpoints (no real auth)
	r.GET("/user/accounts", accountsHandler)
	r.GET("/user/transactions", transactionsHandler)

	// 7) Start server
	log.Println("🚀 Listening on :8080")
	r.Run(":8080")
}

// registerHandler creates a new User doc in Firestore.
func registerHandler(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Bank     string `json:"bank"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	// ensure email is unique
	existing, _ := fs.Collection("users").
		Where("email", "==", req.Email).
		Documents(c).GetAll()
	if len(existing) > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "email already registered"})
		return
	}

	// save new user
	_, _, err := fs.Collection("users").Add(c, User{
		Email:    req.Email,
		Password: req.Password,
		Bank:     req.Bank,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusCreated)
}

// loginHandler verifies credentials *and* bank, then returns userId + bank.
func loginHandler(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Bank     string `json:"bank"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	iter := fs.Collection("users").
		Where("email", "==", req.Email).
		Where("password", "==", req.Password).
		Where("bank", "==", req.Bank). // ← enforce that user’s bank matches
		Limit(1).
		Documents(c)

	doc, err := iter.Next()
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "bad credentials or wrong bank"})
		return
	}

	// echo back the Firestore doc ID and bank
	c.JSON(http.StatusOK, gin.H{
		"userId": doc.Ref.ID,
		"bank":   doc.Data()["bank"],
	})
}

// accountsHandler returns two fake accounts based on bank query param.
func accountsHandler(c *gin.Context) {
	bank := c.Query("bank")
	c.JSON(http.StatusOK, []Account{
		{Name: bank + " Checking • 0000", Balance: 123.45},
		{Name: bank + " Savings  • 1111", Balance: 9876.54},
	})
}

// main.go (only the transactionsHandler shown)
func transactionsHandler(c *gin.Context) {
	// Start with a few “realistic” entries…
	txns := []Transaction{
		{"2025-05-01", "Coffee Shop", -4.25},
		{"2025-05-02", "Paycheck", 1500.00},
		{"2025-05-03", "Groceries", -76.80},
	}

	// Then append 30+ more random‐looking entries
	for i := 1; i <= 3000; i++ {
		// alternate positive/negative
		amt := float64((i%2)*1* (i*3)%100) * 1.23
		if i%2 == 0 {
			amt = -amt
		}
		date := fmt.Sprintf("2025-04-%02d", (i%28)+1)
		desc := fmt.Sprintf("Mock Transaction %d", i)
		txns = append(txns, Transaction{Date: date, Description: desc, Amount: amt})
	}

	c.JSON(http.StatusOK, txns)
}
