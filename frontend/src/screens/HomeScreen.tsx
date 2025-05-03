// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AuthService from '../services/AuthService'
import TokenManager from '../utils/TokenManager'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'

type Account = { name: string; balance: number }
type Txn     = { date: string; description: string; amount: number }

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

export default function HomeScreen({ navigation }: Props) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [txns, setTxns]         = useState<Txn[]>([])

  useEffect(() => {
    AuthService.fetchAccounts().then(r => setAccounts(r.data))
    AuthService.fetchTransactions().then(r => setTxns(r.data))
  }, [])

  const onLogout = async () => {
    await TokenManager.clear()
    navigation.replace('Welcome')
  }

  // only show first 5 recent txns
  const recentTxns = txns.slice(0, 5)

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={recentTxns}
        keyExtractor={(_, i) => i.toString()}
        ListHeaderComponent={
          <>
            {/* Top toolbar */}
            <View style={styles.topBar}>
              <Text style={styles.topBarTitle}>Your Accounts</Text>
              <TouchableOpacity onPress={onLogout}>
                <Ionicons name="log-out-outline" size={24} color="#B31B1B" />
              </TouchableOpacity>
            </View>

            {/* account cards */}
            {accounts.map((acct, i) => (
              <TouchableOpacity
                key={i}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('Transactions', { accountName: acct.name })
                }
              >
                <Text style={styles.name}>{acct.name}</Text>
                <Text style={styles.balance}>${acct.balance.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Recent Transactions</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.txnRow}>
            <Text style={styles.txnDate}>{item.date}</Text>
            <Text style={styles.txnDesc}>{item.description}</Text>
            <Text style={item.amount < 0 ? styles.neg : styles.pos}>
              ${Math.abs(item.amount).toFixed(2)}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => navigation.navigate('SpendingOverview')}
          >
            <Text style={styles.viewAllText}>View All Transactions</Text>
          </TouchableOpacity>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF8E7' },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  name:    { fontWeight: '600' },
  balance: { marginTop: 4, color: '#555' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 8,
    color: '#111',
  },

  txnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  txnDate: { width: 80, color: '#555' },
  txnDesc: { flex: 1, marginHorizontal: 8, color: '#333' },
  neg:     { color: 'red' },
  pos:     { color: 'green' },

  viewAllBtn: {
    backgroundColor: '#B31B1B',
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  viewAllText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
