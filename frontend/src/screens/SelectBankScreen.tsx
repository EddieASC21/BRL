// src/screens/SelectBankScreen.tsx
import React from 'react'
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'              // ← import this
import { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, 'SelectBank'>

const BANKS = [
  { id: 'boa',    name: 'Bank of America', logo: require('../../assets/logos/boa.png') },
  { id: 'chase',  name: 'Chase',            logo: require('../../assets/logos/chase.png') },
  { id: 'wells',  name: 'Wells Fargo',      logo: require('../../assets/logos/wellsfargo.png') },
  { id: 'capone', name: 'Capital One',      logo: require('../../assets/logos/capitalone.png') },
]

export default function SelectBankScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      {/* ← BACK BUTTON */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* ← TITLE */}
      <Text style={styles.title}>Select your bank</Text>

      {/* ← BANK GRID */}
      <View style={styles.grid}>
        {BANKS.map(bank => (
          <TouchableOpacity
            key={bank.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('Auth', {
                bankName: bank.name,
                logo:     bank.logo,
              })
            }
          >
            <Image source={bank.logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.bankName}>{bank.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF8E7',
    padding: 16,
  },
  header: {
    flexDirection: 'row',      // lay out back arrow
    alignItems: 'center',
    paddingBottom: 8,
  },
  backBtn: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#B31B1B',
    textAlign: 'center',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    elevation: 2,
  },
  logo: {
    width: 60,
    height: 60,
  },
  bankName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
})
