// src/screens/RegisterScreen.tsx
import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  StyleSheet,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import AuthService from '../services/AuthService'

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>

export default function RegisterScreen({ navigation, route }: Props) {
  const { bankName, logo } = route.params
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onRegister = async () => {
    try {
      await AuthService.register(email, password, bankName)
      Alert.alert('Success', 'Registered! Please log in.')
      navigation.replace('Login', { bankName, logo })
    } catch (err: any) {
      Alert.alert('Registration failed', err.response?.data?.error || err.message)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Bank logo */}
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Register for {bankName}</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={onRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.replace('Login', { bankName, logo })}
        >
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#B31B1B',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#B31B1B',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
})
