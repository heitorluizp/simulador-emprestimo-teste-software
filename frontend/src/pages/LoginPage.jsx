import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'password123';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setError('');
      console.log('Login successful!');
      onLoginSuccess();
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: '8px',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',

        }}
        component="form"
        onSubmit={handleLogin}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => { window.location.hash = ''; }}
          sx={{
            position: 'absolute',
            left: 16,
            top: 16,
            textTransform: 'none',
          }}
          color="inherit"
        >
          Voltar para Simulação
        </Button>
        <Box sx={{ height: 40 }} />

        <Typography variant="h4" textAlign="center" gutterBottom>
          Admin Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          id="username"
          label="Usuário"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          id="password"
          label="Senha"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" size="large">
          Entrar
        </Button>
      </Paper>
    </Box>
  );
}
