import { useState } from 'react'
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Stack,
    IconButton,
    CssBaseline,
    ThemeProvider,
    createTheme
} from '@mui/material'

import {
    LightMode,
    DarkMode,
    AccountBalanceWallet,
    Contacts,
    WifiOff,
    BarChart,
    Security,
    Language,
    PersonAdd,
    AddCard,
    TrendingUp,
    VerifiedUser
} from '@mui/icons-material'

import { Link } from 'react-router-dom'

function Home() {
    const [dark, setDark] = useState(false)

    const theme = createTheme({
        palette: {
            mode: dark ? 'dark' : 'light',
            primary: {
                main: '#2563eb'
            },
            background: {
                default: dark ? '#0f172a' : '#f8fafc',
                paper: dark ? '#1e293b' : '#ffffff'
            }
        },
        typography: {
            fontFamily: 'Arial, sans-serif'
        }
    })

    const features = [
        {
            icon: <AccountBalanceWallet />,
            title: 'Книга долгов',
            text: 'Записывайте каждый долг и отслеживайте финансовые обязательства.'
        },
        {
            icon: <Contacts />,
            title: 'Менеджер контактов',
            text: 'Организуйте контакты с детальной информацией.'
        },
        {
            icon: <WifiOff />,
            title: 'Офлайн-режим',
            text: 'Работайте без интернета. Данные хранятся на вашем устройстве.'
        },
        {
            icon: <BarChart />,
            title: 'Аналитика',
            text: 'Наблюдайте за доходами, расходами и динамикой долгов.'
        },
        {
            icon: <Security />,
            title: 'Безопасность',
            text: 'Защищайте финансовые данные и контролируйте доступ.'
        },
        {
            icon: <Language />,
            title: 'Многоязычность',
            text: 'Используйте приложение на нескольких языках.'
        }
    ]

    const statistics = [
        { number: '10K+', text: 'Активных пользователей' },
        { number: '50K+', text: 'Долгов отслежено' },
        { number: '99.9%', text: 'Доступность' },
        { number: '3', text: 'Языка' }
    ]

    const steps = [
        {
            number: '01',
            icon: <PersonAdd />,
            title: 'Создайте аккаунт',
            text: 'Зарегистрируйтесь и настройте личное пространство.'
        },
        {
            number: '02',
            icon: <AddCard />,
            title: 'Добавляйте долги',
            text: 'Записывайте суммы, контакты и даты платежей.'
        },
        {
            number: '03',
            icon: <TrendingUp />,
            title: 'Отслеживайте прогресс',
            text: 'Следите за погашениями и изменением финансов.'
        },
        {
            number: '04',
            icon: <VerifiedUser />,
            title: 'Оставайтесь организованными',
            text: 'Управляйте долгами и держите записи в порядке.'
        }
    ]

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    transition: 'background-color 0.3s, color 0.3s'
                }}
            >
                {/* Header */}
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        transition: 'background-color 0.3s'
                    }}
                >
                    <Container maxWidth="lg">
                        <Toolbar
                            disableGutters
                            sx={{
                                justifyContent: 'space-between',
                                py: 1
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 800,
                                    color: 'primary.main',
                                    letterSpacing: 1
                                }}
                            >
                                ADL.
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ alignItems: 'center' }}
                            >
                                <IconButton
                                    onClick={() => setDark(!dark)}
                                    color="inherit"
                                    aria-label="Переключить тему"
                                >
                                    {dark ? <LightMode /> : <DarkMode />}
                                </IconButton>

                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="contained"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        px: 3,
                                        boxShadow: '0 4px 14px #2563eb35',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 7px 20px #2563eb50'
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Авторизоваться
                                </Button>
                            </Stack>
                        </Toolbar>
                    </Container>
                </AppBar>

                {/* Hero section */}
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            minHeight: '75vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            py: 8
                        }}
                    >
                        <Box sx={{ maxWidth: 760 }}>
                            <Typography
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 700,
                                    mb: 2,
                                    letterSpacing: 2,
                                    fontSize: 13
                                }}
                            >
                                УПРАВЛЕНИЕ ФИНАНСАМИ
                            </Typography>

                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: {
                                        xs: 36,
                                        sm: 48,
                                        md: 64
                                    },
                                    lineHeight: 1.15,
                                    mb: 3,
                                    letterSpacing: '-1.5px'
                                }}
                            >
                                Учитывай каждый долг.
                                <br />

                                <Box
                                    component="span"
                                    sx={{ color: 'primary.main' }}
                                >
                                    Управляй финансами.
                                </Box>
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 18,
                                    color: 'text.secondary',
                                    lineHeight: 1.8,
                                    maxWidth: 650,
                                    mx: 'auto',
                                    mb: 4
                                }}
                            >
                                Мощная офлайн-платформа для управления долгами,
                                отслеживания контактов и организации финансовых
                                записей — даже без интернета.
                            </Typography>

                            <Stack
                                direction={{
                                    xs: 'column',
                                    sm: 'row'
                                }}
                                spacing={2}
                                sx={{
                                    mb: 5,
                                    justifyContent: 'center'
                                }}
                            >
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        boxShadow: '0 6px 18px #2563eb35',
                                        '&:hover': {
                                            transform: 'translateY(-3px)',
                                            boxShadow: '0 10px 25px #2563eb50'
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Начать работу →
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => {
                                        document.getElementById('features')?.scrollIntoView({
                                            behavior: 'smooth'
                                        })
                                    }}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        '&:hover': {
                                            bgcolor: dark
                                                ? '#ffffff10'
                                                : '#2563eb08',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Узнать больше
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Container>

                {/* Features heading */}
                <Box
                    id="features"
                    sx={{
                        textAlign: 'center',
                        px: 2,
                        pt: 4
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 800
                        }}
                    >
                        Возможности
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            mt: 2,
                            fontSize: {
                                xs: 25,
                                sm: 32
                            }
                        }}
                    >
                        Всё, что нужно для управления долгами
                    </Typography>
                </Box>

                {/* Features cards */}
                <Box sx={{ py: 8 }}>
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)'
                                },
                                gap: 2
                            }}
                        >
                            {features.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        p: 2.5,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        transition: '0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            borderColor: 'primary.main',
                                            boxShadow: 3
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: 'primary.main',
                                            bgcolor: dark
                                                ? '#ffffff12'
                                                : '#2563eb12',
                                            display: 'inline-flex',
                                            p: 1,
                                            borderRadius: 1,
                                            mb: 1.5
                                        }}
                                    >
                                        {item.icon}
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1
                                        }}
                                    >
                                        {item.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {item.text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Container>
                </Box>

                {/* Statistics */}
                <Box sx={{ py: 8 }}>
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: 'repeat(2, 1fr)',
                                    md: 'repeat(4, 1fr)'
                                },
                                textAlign: 'center',
                                gap: 3
                            }}
                        >
                            {statistics.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        borderRight: {
                                            md: index !== 3
                                                ? '1px solid'
                                                : 'none'
                                        },
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 32,
                                            fontWeight: 800,
                                            color: 'primary.main'
                                        }}
                                    >
                                        {item.number}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {item.text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Container>
                </Box>

                {/* How it works */}
                <Box
                    sx={{
                        py: 8,
                        bgcolor: dark ? '#111c30' : '#e9eef7'
                    }}
                >
                    <Container maxWidth="lg">
                        <Typography
                            sx={{
                                textAlign: 'center',
                                color: '#f59e0b',
                                fontSize: 12,
                                fontWeight: 700,
                                mb: 1
                            }}
                        >
                            КАК ЭТО РАБОТАЕТ
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                textAlign: 'center',
                                fontWeight: 800,
                                mb: 6,
                                fontSize: {
                                    xs: 26,
                                    sm: 34
                                }
                            }}
                        >
                            Начните за{' '}
                            <Box
                                component="span"
                                sx={{ color: 'text.secondary' }}
                            >
                                четыре простых шага
                            </Box>
                        </Typography>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(4, 1fr)'
                                },
                                gap: 2
                            }}
                        >
                            {steps.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        p: 2.5,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        transition: '0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 2
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 24,
                                                fontWeight: 800,
                                                color: dark
                                                    ? '#475569'
                                                    : '#dbe2ee'
                                            }}
                                        >
                                            {item.number}
                                        </Typography>

                                        <Box sx={{ color: 'primary.main' }}>
                                            {item.icon}
                                        </Box>
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1
                                        }}
                                    >
                                        {item.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {item.text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Container>
                </Box>

                {/* Call to action */}
                <Box sx={{ py: 8 }}>
                    <Container maxWidth="md">
                        <Box
                            sx={{
                                textAlign: 'center',
                                p: {
                                    xs: 3,
                                    md: 5
                                },
                                border: '1px solid',
                                borderColor: dark
                                    ? '#334155'
                                    : '#cbdcff',
                                borderRadius: 3,
                                bgcolor: dark
                                    ? '#1e293b'
                                    : '#edf2ff'
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    fontSize: {
                                        xs: 27,
                                        sm: 34
                                    }
                                }}
                            >
                                Готовы взять контроль
                                <br />

                                <Box
                                    component="span"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    над финансами?
                                </Box>
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    maxWidth: 480,
                                    mx: 'auto',
                                    mb: 3
                                }}
                            >
                                Присоединяйтесь к тем, кто управляет своими
                                финансовыми записями.
                            </Typography>

                            <Stack
                                direction={{
                                    xs: 'column',
                                    sm: 'row'
                                }}
                                spacing={2}
                                sx={{ justifyContent: 'center' }}
                            >
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="contained"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2
                                    }}
                                >
                                    Начать бесплатно →
                                </Button>

                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="outlined"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 2
                                    }}
                                >
                                    Войти
                                </Button>
                            </Stack>
                        </Box>
                    </Container>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        py: 3,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        textAlign: 'center'
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        © {new Date().getFullYear()} ADL. Управление финансами.
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Home
