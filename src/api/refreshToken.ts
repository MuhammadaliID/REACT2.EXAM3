import axiosRequest from './axios'

export async function refreshToken() {
    const token = localStorage.getItem('refreshToken')

    if (!token) {
        throw new Error('Refresh token отсутствует')
    }

    const { data } = await axiosRequest.post('/auth/refresh', {
        refreshToken: token
    })

    const accessToken = data.accessToken || data.access_token
    const newRefreshToken = data.refreshToken || data.refresh_token

    if (!accessToken) {
        throw new Error('Сервер не вернул access token')
    }

    localStorage.setItem('accessToken', accessToken)

    if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken)
    }

    return accessToken
}
