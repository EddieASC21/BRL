// src/screens/WelcomeScreen.tsx
import React from 'react'
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>

export default function WelcomeScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                {/* Placeholder graphic */}
                <Image
                    source={require('../../assets/cornell_placeholder.png')}
                    style={styles.hero}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Welcome to Big Red Link</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('SelectBank', undefined)}
                >
                    <Text style={styles.buttonText}>Connect to Bank</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    hero: {
        width: '80%',
        height: 200,
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#B31B1B',
        marginBottom: 48,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#B31B1B',
        paddingVertical: 14,
        paddingHorizontal: 48,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
})
