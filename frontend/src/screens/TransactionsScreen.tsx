// src/screens/TransactionsScreen.tsx

import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AuthService from '../services/AuthService'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, 'Transactions'>
type Txn   = { date: string; description: string; amount: number }

export default function TransactionsScreen({ navigation, route }: Props) {
  const { accountName } = route.params
  const [txns, setTxns] = useState<Txn[]>([])

  useEffect(() => {
    AuthService.fetchTransactions()
      .then(r => setTxns(r.data))
      .catch(() => {})
  }, [])

  return (
    <SafeAreaView style={styles.safe}>
      {/* back + title */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#333"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>{accountName}</Text>
      </View>

      {txns.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No transactions found.</Text>
        </View>
      ) : (
        <FlatList
          data={txns}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={item.amount < 0 ? styles.neg : styles.pos}>
                ${Math.abs(item.amount).toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#FFF8E7' },
  header:    { flexDirection: 'row', alignItems: 'center', padding: 16 },
  title:     { marginLeft: 12, fontSize: 20, fontWeight: '700' },
  empty:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  date: { width: 80, color: '#555' },
  desc: { flex: 1, marginHorizontal: 8 },
  neg:  { color: 'red' },
  pos:  { color: 'green' },
})
