import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, MenuItem, Card, CardContent, Typography, Stack, Snackbar, Alert, 
  Box, Divider, InputAdornment, Paper, Grid
} from '@mui/material';
import { 
  LocalShipping as DispatchIcon, Inventory as InventoryIcon, 
  CalendarToday as CalendarIcon, LocationOn as LocationIcon, 
  Business as BusinessIcon, QrCode as QrCodeIcon, Numbers as NumbersIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function DispatchProductForm() {
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
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    axios.get('http://54.167.21.79:5000/api/godown/list').then(res => setGodowns(res.data.locations || []));
    axios.get('http://54.167.21.79:5000/api/customersuppliers/customer/list').then(res => setCustomers(res.data.customers || []));
    axios.get('http://54.167.21.79:5000/api/reports/stock').then(res => {
      const stockItems = res.data.stock || [];
      const uniqueProducts = [...new Map(stockItems.map(item => [item.product, item])).values()];
      setProducts(uniqueProducts);
    });
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
      await axios.post('http://54.167.21.79:5000/api/inventory/dispatch', form);
      setToast({ open: true, message: 'Product dispatched successfully!', severity: 'success' });
      setForm({ itemName: '', quantity: '', rate: '', date: '', batch: '', location: '', party: '' });
      // Notify other screens to refresh without a full page reload
      window.dispatchEvent(new Event('refresh:products'));
      window.dispatchEvent(new CustomEvent('refresh:godown', { detail: { location: form.location } }));
    } catch (err) {
      setToast({ open: true, message: err.response?.data?.message || 'Error dispatching product', severity: 'error' });
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
            <DispatchIcon sx={{ 
              fontSize: { xs: 32, sm: 40 }, 
              color: 'primary.main' 
            }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}>
              Dispatch Product
            </Typography>
          </Box>

          <Divider sx={{ mb: { xs: 3, sm: 4 } }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Item Name - Full width */}
              <Grid item xs={12}>
                <TextField 
                  select 
                  label="Item Name" 
                  name="itemName" 
                  value={form.itemName} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                  placeholder="Select product to dispatch"
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
                >
                  {products.map(product => (
                    <MenuItem key={`${product.product}-${product.batch}-${product.location}`} value={product.product}>
                      {product.product}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Quantity and Rate - Side by side */}
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

              {/* Date and Batch - Side by side */}
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

              {/* Location and Party - Side by side */}
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
                    <MenuItem key={g.id || `godown-${index}`} value={g.name}>
                      {g.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField 
                  select 
                  label="Party Name" 
                  name="party" 
                  value={form.party} 
                  onChange={handleChange} 
                  required 
                  fullWidth 
                  placeholder="Select customer"
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
                >
                  {customers.map((customer, index) => (
                    <MenuItem key={customer.id || `customer-${index}`} value={customer.name}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading}
                    startIcon={<DispatchIcon />}
                    sx={{ 
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      px: 6,
                      py: 2,
                      fontSize: '1.1rem',
                      borderRadius: 2,
                      minWidth: 250,
                      height: 56,
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
                    {loading ? 'Dispatching...' : 'Dispatch Product'}
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
