import { useState } from 'react'
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress
} from '@mui/material'
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material'
import axiosRequest from './api/axios'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { data } = await axiosRequest.post('/auth/login', {
                email,
                password,
            })

            const accessToken = data.accessToken || data.access_token
            const refreshToken = data.refreshToken || data.refresh_token

            if (accessToken) {
                localStorage.setItem('accessToken', accessToken)
            }

            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken)
            }

            if (accessToken) {
                navigate('/navigation')
                return
            }

            setError('Сервер ответил без accessToken.')
        } catch (err) {
            const responseError = err?.response?.data
            setError(
                responseError?.detail ||
                responseError?.error ||
                responseError?.message ||
                'Не удалось войти. Проверьте email и пароль.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                bgcolor: '#f4f6fb',
                background: 'linear-gradient(135deg, #eef2ff, #f8fafc)'
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    p: { xs: 3, sm: 5 },
                    borderRadius: 4,
                    border: '1px solid #e5e7eb'
                }}
            >
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        bgcolor: '#2563eb',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                    }}
                >
                    <LockOutlined fontSize="large" />
                </Box>

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        textAlign: 'center',
                        color: '#111827'
                    }}
                >
                    С возвращением!
                </Typography>

                <Typography
                    sx={{
                        textAlign: 'center',
                        color: 'text.secondary',
                        mt: 1,
                        mb: 3
                    }}
                >
                    Войдите в свой аккаунт ADL
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleLogin}>
                    <Typography sx={{ fontWeight: 600, mb: 1 }}>
                        Email
                    </Typography>

                    <TextField
                        fullWidth
                        type="email"
                        placeholder="Введите email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        sx={{ mb: 2.5 }}
                    />

                    <Typography sx={{ fontWeight: 600, mb: 1 }}>
                        Пароль
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder="Введите пароль"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        sx={{ mb: 3 }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            aria-label="Показать или скрыть пароль"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: 16,
                            fontWeight: 700,
                            bgcolor: '#2563eb',
                            '&:hover': { bgcolor: '#1d4ed8' }
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Войти в аккаунт'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}

export default Login
