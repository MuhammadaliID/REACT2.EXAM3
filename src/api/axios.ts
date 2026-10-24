
import axios, { type InternalAxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_API_URL



const axiosRequest = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})


axiosRequest.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})


axiosRequest.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/refresh')
        ) {
            return Promise.reject(error)
        }

        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')

            return Promise.reject(error)
        }

        originalRequest._retry = true

        try {
            
            const { data } = await axios.post(
                `${API_URL}/auth/refresh`,
                {
                    refreshToken,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            const accessToken =
                data.accessToken || data.access_token

            const newRefreshToken =
                data.refreshToken || data.refresh_token

            if (!accessToken) {
                throw new Error('Сервер не вернул access token')
            }

            localStorage.setItem('accessToken', accessToken)

            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken)
            }

            
            originalRequest.headers.Authorization = `Bearer ${accessToken}`

           
            return axiosRequest(originalRequest)
        } catch (refreshError) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')

            
            window.location.href = '/login'

            return Promise.reject(refreshError)
        }
    }
)

export default axiosRequest
