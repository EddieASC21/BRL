// src/services/apiClient.ts
import axios, {
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
  } from 'axios'
  import { Platform } from 'react-native'
  import TokenManager from '../utils/TokenManager'
  
  // On Android use 10.0.2.2, on iOS simulator/local use localhost
  const BASE_URL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080'
      : 'http://localhost:8080'
  
  const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
  })
  
  // Before each request, inject userId & bank from your saved session
  apiClient.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
      const session = await TokenManager.getSession()
      if (session) {
        config.params = {
          ...(config.params || {}),
          userId: session.userId,
          bank:   session.bank,
        }
      }
      return config
    },
    err => Promise.reject(err)
  )
  
  export default apiClient
  