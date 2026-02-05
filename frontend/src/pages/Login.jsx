import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container,
  Alert,
  Paper
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import axios from 'axios';

export default function Login({ setLoggedIn }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/login', { password });
      if (res.data.success) {
        localStorage.setItem('loggedIn', 'true');
        setLoggedIn(true);
      }
    } catch (err) {
      setError('INVALID PASSWORD');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: { xs: 4, sm: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          py: { xs: 2, sm: 4 }
        }}
      >
        <Paper elevation={3} sx={{ 
          padding: { xs: 2, sm: 4 }, 
          width: '100%', 
          marginTop: { xs: 1, sm: 2 },
          borderRadius: 2
        }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                backgroundColor: 'primary.main',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 2
              }}
            >
              <LockOutlined sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            
            <Typography component="h1" variant="h4" sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main', 
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.125rem' }
            }}>
              SENETRY ERP
            </Typography>
            
            <Typography component="h2" variant="h6" sx={{ 
              mb: 3, 
              color: 'text.secondary',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              ENTER YOUR PASSWORD
            </Typography>
            
            <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="PASSWORD"
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '1.1rem',
                  }
                }}
              />
              
              {error && (
                <Alert severity="error" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {error}
                </Alert>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </Button>
              
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
                ENTER THE CORRECT PASSWORD TO ACCESS THE DASHBOARD
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
