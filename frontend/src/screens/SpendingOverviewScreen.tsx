// src/screens/SpendingOverviewScreen.tsx

import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native'
import { BarChart } from 'react-native-chart-kit'
import { Ionicons } from '@expo/vector-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import AuthService from '../services/AuthService'

// Box–Muller helper for a normal approximation to Binomial(n, p)
function randNormal(mean: number, sd: number) {
  const u1 = 1 - Math.random()
  const u2 = 1 - Math.random()
  const z  = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + z * sd
}

type Props = NativeStackScreenProps<RootStackParamList, 'SpendingOverview'>
type Txn   = { date: string; description: string; amount: number }

export default function SpendingOverviewScreen({ navigation }: Props) {
  // 1) load all transactions
  const [txns, setTxns] = useState<Txn[]>([])
  useEffect(() => {
    AuthService.fetchTransactions()
      .then(r => setTxns(r.data))
      .catch(() => {/* ignore errors for demo */})
  }, [])

  // 2) build last 12 months in YYYY-MM
  const now    = new Date()
  const months = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    return d.toISOString().slice(0, 7)
  })

  // 3) human‐friendly labels: “May ’25”
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const displayLabels = months.map(m => {
    const [yyyy, mm] = m.split('-')
    return `${monthNames[+mm - 1]} '${yyyy.slice(2)}`
  })

  // 4) simulate Binomial(30000, 1/12)
  const n     = 30000
  const k     = months.length
  const p     = 1 / k
  const mean  = n * p
  const sd    = Math.sqrt(n * p * (1 - p))
  const data  = months.map(() => Math.max(0, Math.round(randNormal(mean, sd))))

  // 5) chart width
  const screenWidth = Dimensions.get('window').width - 32

  return (
    <SafeAreaView style={styles.safe}>
      {/* — Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Spending by Month</Text>
      </View>

      {/* — Bar Chart */}
      <BarChart
        data={{ labels: displayLabels, datasets: [{ data }] }}
        width={screenWidth}
        height={240}
        fromZero
        yAxisLabel="$"
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo:   '#ffffff',
          decimalPlaces:          0,
          color: (opacity = 1) => `rgba(179,27,27,${opacity})`,
          labelColor: () => '#333333',
        }}
      />

      <Text style={styles.sub}>
        Showing {months.length} month{months.length > 1 ? 's' : ''} of spending
      </Text>

      {/* — All Transactions */}
      <Text style={styles.txnHeader}>All Transactions</Text>
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
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#FFF8E7', padding: 16 },
  header:      { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', marginLeft: 12, color: '#111' },
  chart:       { borderRadius: 8, marginVertical: 16 },
  sub:         { textAlign: 'center', color: '#555' },
  txnHeader:   { fontSize: 18, fontWeight: '600', color: '#111', marginBottom: 8 },
  row:         {
    flexDirection:  'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor:    '#eee',
  },
  date:        { width: 80, color: '#555' },
  desc:        { flex: 1, marginHorizontal: 8 },
  neg:         { color: 'red' },
  pos:         { color: 'green' },
})
