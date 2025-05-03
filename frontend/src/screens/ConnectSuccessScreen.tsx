// src/screens/ConnectSuccessScreen.tsx
import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, 'ConnectSuccess'>
export default function ConnectSuccessScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.checkmarkContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <Text style={styles.title}>Bank Connected!</Text>
        <Text style={styles.subtitle}>
          You’re ready to use BRL services.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex:1, backgroundColor: '#FFF8E7', },
  container: {
    flex:1, justifyContent:'center', alignItems:'center', padding:24
  },
  checkmarkContainer: {
    width:100, height:100, borderRadius:50, borderWidth:4,
    borderColor:'green', alignItems:'center', justifyContent:'center',
    marginBottom:32
  },
  checkmark: { fontSize:48, color:'green' },
  title:    { fontSize:28, fontWeight:'700', marginBottom:8 },
  subtitle: { fontSize:16, color:'#555', marginBottom:32, textAlign:'center' },
  button:   {
    backgroundColor:'#B31B1B', paddingVertical:14, paddingHorizontal:48,
    borderRadius:8,
  },
  buttonText: { color:'#FFF', fontSize:16, fontWeight:'600' },
})
