import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, Stack, Snackbar, Alert, 
  Box, Divider, InputAdornment, Paper, Grid
} from '@mui/material';
import { 
  Receipt as ReceiptIcon, Add as AddIcon, AttachMoney as MoneyIcon, 
  Description as DescriptionIcon, CalendarToday as CalendarIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function AddExpense() {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) {
      setToast({ open: true, message: 'Please fill all fields', severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://54.167.21.79:5000/api/expenses/add', form);
      setToast({ open: true, message: 'Expense added successfully!', severity: 'success' });
      setForm({ description: '', amount: '', date: '' });
    } catch (error) {
      setToast({ open: true, message: error.response?.data?.message || 'Error adding expense', severity: 'error' });
    }
    setLoading(false);
  };

  return (
    <Box sx={{ 
      maxWidth: { xs: '100%', sm: 600, md: 700 }, 
      mx: 'auto', 
      mt: { xs: 2, sm: 4 }, 
      p: { xs: 1, sm: 2 }
    }}>
      <Card elevation={4} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }, 
            mb: { xs: 2, sm: 3 },
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <ReceiptIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}>
              Add Expense
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, backgroundColor: '#fff3e0', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'warning.dark' }}>
              Expense Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in the details below to record a new expense
            </Typography>
          </Paper>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField 
                  label="Description" 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                  placeholder="Enter expense description"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Amount" 
                  name="amount" 
                  type="number" 
                  value={form.amount} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Date" 
                  name="date" 
                  type="date" 
                  value={form.date} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading}
                    startIcon={<AddIcon />}
                    sx={{ 
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderRadius: 2,
                      minWidth: 200
                    }}
                  >
                    {loading ? 'Adding...' : 'Add Expense'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>

          <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
            <Alert severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert>
          </Snackbar>
        </CardContent>
      </Card>
    </Box>
  );
}