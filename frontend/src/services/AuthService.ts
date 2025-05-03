// src/services/AuthService.ts
import api from './apiClient'
import TokenManager from '../utils/TokenManager'

export default {
  register: (email: string, password: string, bank: string) =>
    api.post('/auth/register', { email, password, bank }),

  // login now takes the bank too
  login: (email: string, password: string, bank: string) =>
    api.post('/auth/login', { email, password, bank }),

  // pull bank & userId out of TokenManager before calling
  fetchAccounts: async () => {
    const session = await TokenManager.getSession()
    if (!session) throw new Error('No session available')
    return api.get('/user/accounts', {
      params: { bank: session.bank, userId: session.userId },
    })
  },

  fetchTransactions: async () => {
    const session = await TokenManager.getSession()
    if (!session) throw new Error('No session available')
    return api.get('/user/transactions', {
      params: { userId: session.userId },
    })
  },
}
