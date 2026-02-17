import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, Snackbar, Alert, 
  Box, InputAdornment, Paper, Divider
} from '@mui/material';
import { 
  LocalShipping as DispatchIcon, Inventory as InventoryIcon, 
  CheckCircle as SuccessIcon, Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function DispatchProduct() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState({ open: false, text: '', severity: 'success' });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch available products for dropdown
    axios.get('http://54.167.21.79:5000/api/reports/stock').then(res => {
      const stockItems = res.data.stock || [];
      const uniqueProducts = [...new Map(stockItems.map(item => [item.product, item])).values()];
      setProducts(uniqueProducts);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ open: false, text: '', severity: 'success' });
    try {
      await axios.post('http://54.167.21.79:5000/api/inventory/dispatch', { name });
      setMsg({ open: true, text: 'Product dispatched successfully!', severity: 'success' });
      setName('');
    } catch {
      setMsg({ open: true, text: 'Error dispatching product', severity: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Card elevation={4} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <DispatchIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Dispatch Product
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, backgroundColor: '#fff3e0', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.dark' }}>
              Quick Dispatch
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select a product to dispatch from inventory
            </Typography>
          </Paper>

          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth
              label="Product Name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter product name to dispatch"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InventoryIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                type="submit" 
                variant="contained"
                startIcon={<DispatchIcon />}
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
                Dispatch Product
              </Button>
            </Box>
          </form>

          {products.length > 0 && (
            <Paper elevation={1} sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Available Products ({products.length}):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {products.slice(0, 10).map((product, index) => (
                  <Box
                    key={index}
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: 'primary.light',
                      color: 'white',
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'primary.main' }
                    }}
                    onClick={() => setName(product.product)}
                  >
                    {product.product}
                  </Box>
                ))}
                {products.length > 10 && (
                  <Box sx={{ px: 2, py: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                    +{products.length - 10} more...
                  </Box>
                )}
              </Box>
            </Paper>
          )}

          <Snackbar open={msg.open} autoHideDuration={3000} onClose={() => setMsg({ ...msg, open: false })}>
            <Alert 
              severity={msg.severity} 
              sx={{ width: '100%' }}
              icon={msg.severity === 'success' ? <SuccessIcon /> : <ErrorIcon />}
            >
              {msg.text}
            </Alert>
          </Snackbar>
        </CardContent>
      </Card>
    </Box>
  );
}
