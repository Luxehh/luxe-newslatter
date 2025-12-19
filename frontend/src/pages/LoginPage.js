import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Paper, Typography, TextField, Button, Box, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../assets/logoluxe.png';
import { useAuth } from './AuthContext';
import { apiUrl } from './constant';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const { setAuthenticated } = useAuth();

    const validate = () => {
        let valid = true;
        setUsernameError('');
        setPasswordError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!username || !emailRegex.test(username)) {
            setUsernameError('Enter a valid email address');
            valid = false;
        }

        if (!password || password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            valid = false;
        }

        return valid;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        try {
            // const res = await fetch('https://luxe-api-production-d5c9.up.railway.app/api/patients/login', {
            const res = await fetch(`${apiUrl}/api/patients/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            console.log("data",data)
            if (data?.token) {
                localStorage.setItem('authToken', data.token);
                setAuthenticated(true);
                navigate('/newsletter-management');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{ fontFamily: "'Oxygen', Helvetica, Arial, Lucida, sans-serif" }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        textAlign: 'center',
                        fontFamily: "'Oxygen', Helvetica, Arial, Lucida, sans-serif"
                    }}
                >
                    <img src={logo} alt="Logo" style={{ width: 150, marginBottom: 16 }} />
                    <Typography variant="h5" mb={2}>Welcome to Luxe Hospice</Typography>

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={!!usernameError}
                        helperText={usernameError}
                        InputProps={{
                            sx: { borderRadius: '12px' }
                        }}
                        sx={{
                            '& label.Mui-focused': { color: '#7b6e4b' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#ccc' },
                                '&:hover fieldset': { borderColor: '#7b6e4b' },
                                '&.Mui-focused fieldset': { borderColor: '#7b6e4b' },
                            },
                        }}
                    />

                    <TextField
                        label="Password"
                        variant="outlined"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                        InputProps={{
                            sx: { borderRadius: '12px' },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& label.Mui-focused': { color: '#7b6e4b' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#ccc' },
                                '&:hover fieldset': { borderColor: '#7b6e4b' },
                                '&.Mui-focused fieldset': { borderColor: '#7b6e4b' },
                            },
                        }}
                    />

                    {error && <Typography color="error" mt={1}>{error}</Typography>}

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 2,
                            backgroundColor: '#7b6e4b',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#6c6240',
                            },
                        }}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
