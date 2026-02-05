import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, MenuItem, Card, CardContent, Typography, Stack, Snackbar, Alert, 
  Box, Divider, InputAdornment, Paper, Grid
} from '@mui/material';
import { 
  Inventory as InventoryIcon, Add as AddIcon, 
  CalendarToday as CalendarIcon, LocationOn as LocationIcon, 
  Business as BusinessIcon, QrCode as QrCodeIcon, Numbers as NumbersIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function AddProductForm() {
  const [form, setForm] = useState({
    itemName: '',
    quantity: '',
    rate: '',
    date: '',
    batch: '',
    location: '',
    party: '',
  });
  const [godowns, setGodowns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/godown/list').then(res => setGodowns(res.data.locations || []));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.itemName || !form.quantity || !form.rate || !form.date || !form.batch || !form.location || !form.party) {
      setToast({ open: true, message: 'Please fill all fields', severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/inventory/add', form);
      setToast({ open: true, message: 'Product added successfully!', severity: 'success' });
      setForm({ itemName: '', quantity: '', rate: '', date: '', batch: '', location: '', party: '' });
    } catch {
      setToast({ open: true, message: 'Error adding product', severity: 'error' });
    }
    setLoading(false);
  };

  return (
    <Box sx={{ 
      maxWidth: { xs: '100%', sm: 800, md: 900, lg: 1000 },
      mx: 'auto', 
      mt: { xs: 2, sm: 4 }, 
      p: { xs: 1, sm: 2 },
      width: '100%'
    }}>
      <Card elevation={4} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          '&:last-child': { pb: { xs: 2, sm: 3, md: 4 } }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }, 
            mb: { xs: 2, sm: 3 },
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <InventoryIcon sx={{ 
              fontSize: { xs: 32, sm: 40 }, 
              color: 'primary.main' 
            }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}>
              Add New Product
            </Typography>
          </Box>

          <Divider sx={{ mb: { xs: 3, sm: 4 } }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Item Name - Full width for better ERP feel */}
              <Grid item xs={12}>
                <TextField 
                  label="Item Name" 
                  name="itemName" 
                  value={form.itemName} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                  placeholder="Enter product/item name"
                  autoComplete="on"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      fontSize: '1rem',
                      '& .MuiInputBase-input': {
                        padding: '14px 14px 14px 0'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  }}
                />
              </Grid>

              {/* Quantity and Rate - Side by side on larger screens */}
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField 
                  label="Quantity" 
                  name="quantity" 
                  type="number" 
                  value={form.quantity} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                  placeholder="0"
                  inputMode="numeric"
                  onWheel={(e) => e.target.blur()}
                  inputProps={{ min: 0, step: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      fontSize: '1rem',
                      '& .MuiInputBase-input': {
                        padding: '14px 14px 14px 0'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField 
                  label="Rate / Price" 
                  name="rate" 
                  type="number" 
                  value={form.rate} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                  placeholder="0.00"
                  inputMode="decimal"
                  onWheel={(e) => e.target.blur()}
                  inputProps={{ min: 0, step: '0.01' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ color: 'action.active', fontWeight: 'bold', fontSize: '1.2rem' }}>
                          ₹
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      fontSize: '1rem',
                      '& .MuiInputBase-input': {
                        padding: '14px 14px 14px 0'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  }}
                />
              </Grid>

              {/* Date and Batch - Side by side on larger screens */}
              <Grid item xs={12} sm={6} md={6} lg={6}>
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
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      fontSize: '1rem',
                      '& .MuiInputBase-input': {
                        padding: '14px 14px 14px 0'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField 
                  label="Batch Number" 
                  name="batch" 
                  value={form.batch} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                  placeholder="Enter batch number"
                  autoComplete="on"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <QrCodeIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      fontSize: '1rem',
                      '& .MuiInputBase-input': {
                        padding: '14px 14px 14px 0'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  }}
                />
              </Grid>

              {/* Location and Party - Side by side on larger screens */}
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField 
                  select 
                  label="Location / Godown" 
                  name="location" 
                  value={form.location} 
                  onChange={handleChange} 
                  required 
                  fullWidth
                  placeholder="Select location"
                  autoComplete="on"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      fontSize: '1rem',
                      '& .MuiInputBase-input': {
                        padding: '14px 14px 14px 0'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  }}
                >
                  {godowns.map((g, index) => (
                    <MenuItem key={g.id ?? index} value={g.name}>
                      {g.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField 
                  label="Party Name" 
                  name="party" 
                  value={form.party} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                  placeholder="Enter party/supplier name"
                  autoComplete="on"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      fontSize: '1rem',
                      '& .MuiInputBase-input': {
                        padding: '14px 14px 14px 0'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  }}
                />
              </Grid>

              {/* Submit Button - Full width with proper spacing */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading}
                    startIcon={<AddIcon />}
                    sx={{ 
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      px: 6,
                      py: 2,
                      fontSize: '1.1rem',
                      borderRadius: 2,
                      minWidth: 250,
                      height: 56,
                      boxShadow: 3,
                      letterSpacing: 0.5,
                      // Responsive button sizing
                      '@media (max-width: 600px)': {
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        minWidth: 200,
                        height: 48
                      }
                    }}
                  >
                    {loading ? 'Adding...' : 'Add Product'}
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