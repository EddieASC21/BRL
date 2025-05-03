// App.tsx
import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import WelcomeScreen        from './src/screens/WelcomeScreen'
import SelectBankScreen     from './src/screens/SelectBankScreen'
import AuthScreen           from './src/screens/AuthScreen'
import RegisterScreen       from './src/screens/RegisterScreen'
import LoginScreen          from './src/screens/LoginScreen'
import ConnectSuccessScreen from './src/screens/ConnectSuccessScreen'
import HomeScreen           from './src/screens/HomeScreen'
import TransactionsScreen   from './src/screens/TransactionsScreen'
import SpendingOverview     from './src/screens/SpendingOverviewScreen'

export type RootStackParamList = {
  Welcome:        undefined
  SelectBank:     undefined
  Auth:           { bankName: string; logo: any }
  Register:       { bankName: string; logo: any }
  Login:          { bankName: string; logo: any }
  ConnectSuccess: undefined
  Home:           undefined
  Transactions:   { accountName: string }
  SpendingOverview: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome"    component={WelcomeScreen} />
        <Stack.Screen name="SelectBank" component={SelectBankScreen} />
        <Stack.Screen name="Auth"       component={AuthScreen} />
        <Stack.Screen name="Register"   component={RegisterScreen} />
        <Stack.Screen name="Login"      component={LoginScreen} />
        <Stack.Screen name="ConnectSuccess" component={ConnectSuccessScreen} />
        <Stack.Screen name="Home"       component={HomeScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
        <Stack.Screen name="SpendingOverview" component={SpendingOverview} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
