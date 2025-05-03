// src/utils/TokenManager.ts
import * as SecureStore from 'expo-secure-store'

const USER_ID_KEY = 'USER_ID'
const BANK_KEY    = 'BANK'

export default {
  saveSession: async (userId: string, bank: string) => {
    await SecureStore.setItemAsync(USER_ID_KEY, userId)
    await SecureStore.setItemAsync(BANK_KEY, bank)
  },

  getSession: async (): Promise<{ userId: string; bank: string } | null> => {
    const userId = await SecureStore.getItemAsync(USER_ID_KEY)
    const bank   = await SecureStore.getItemAsync(BANK_KEY)
    if (userId && bank) {
      return { userId, bank }
    }
    return null
  },

  clear: async () => {
    await SecureStore.deleteItemAsync(USER_ID_KEY)
    await SecureStore.deleteItemAsync(BANK_KEY)
  },
}
