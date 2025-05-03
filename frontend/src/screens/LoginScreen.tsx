// src/screens/LoginScreen.tsx
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
import { Ionicons } from '@expo/vector-icons'
import { RootStackParamList } from '../../App'
import AuthService from '../services/AuthService'
import TokenManager from '../utils/TokenManager'

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>

export default function LoginScreen({ navigation, route }: Props) {
  const { bankName, logo } = route.params

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = async () => {
    try {
      // pass bankName through so backend can enforce correct‐bank login
      const { data } = await AuthService.login(email, password, bankName)

      if (data.bank !== bankName) {
        return Alert.alert(
          'Wrong bank',
          `Your account is registered with ${data.bank}, not ${bankName}`
        )
      }

      // save session then show success screen
      await TokenManager.saveSession(data.userId, data.bank)
      navigation.replace('ConnectSuccess')
    } catch (err: any) {
      Alert.alert('Login failed', err.response?.data?.error || err.message)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* 1) BACK BUTTON AT TOP */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* bank logo & title */}
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Sign In to {bankName}</Text>

        {/* credentials */}
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

        {/* 3) ON SUCCESS NAVIGATE TO CONNECTSUCCESSSCREEN */}
        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* 2) REGISTER BUTTON REMOVED */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: '#FFF8E7' },
  header:   { flexDirection: 'row', alignItems: 'center', padding: 8 },
  backBtn:  { padding: 8 },
  container:{ flex: 1, padding: 24, justifyContent: 'center' },
  logo:     { width: 120, height: 120, alignSelf: 'center', marginBottom: 24 },
  title:    { fontSize: 24, fontWeight: '700', color: '#B31B1B', textAlign: 'center', marginBottom: 24 },
  input:    { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button:   { backgroundColor: '#B31B1B', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  buttonText:{ color: '#FFF', fontSize: 16, fontWeight: '600' },
})
