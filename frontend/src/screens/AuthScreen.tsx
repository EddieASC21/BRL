// src/screens/AuthScreen.tsx
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
import { Ionicons } from '@expo/vector-icons'
import { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>

export default function AuthScreen({ navigation, route }: Props) {
  const { bankName, logo } = route.params

  return (
    <SafeAreaView style={styles.safe}>
      {/* Back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Welcome to {bankName}</Text>

        <TouchableOpacity
          style={[styles.button, styles.login]}
          onPress={() => navigation.navigate('Login', { bankName, logo })}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#FFF8E7' },
  header:    {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backBtn:   {
    padding: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo:      {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title:     {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 32,
    color: '#111',
  },
  button:    {
    width: '80%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  login:     { backgroundColor: '#333' },
  buttonText:{
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
