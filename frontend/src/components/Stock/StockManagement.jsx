import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, 
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  Snackbar, Alert, Box, Chip, Paper, Divider, InputAdornment, TableContainer
} from '@mui/material';
import { 
  Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, 
  Inventory as InventoryIcon, LocationOn as LocationIcon, 
  QrCode as QrCodeIcon, Numbers as NumbersIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function StockManagement() {
  const [stock, setStock] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ product: '', batch: '', location: '', quantity: '' });
  const [msg, setMsg] = useState({ open: false, text: '', severity: 'success' });

  const fetchStock = () => {
    axios.get('http://54.167.21.79:5000/api/stock/list').then(res => setStock(res.data.stock || []));
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    setForm({ product: '', batch: '', location: '', quantity: '' });
    setOpen(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({ 
      product: item.product, 
      batch: item.batch, 
      location: item.location, 
      quantity: item.quantity 
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('ARE YOU SURE YOU WANT TO DELETE THIS STOCK ITEM?')) {
      try {
        await axios.delete(`http://54.167.21.79:5000/api/stock/delete/${id}`);
        setMsg({ open: true, text: 'STOCK ITEM DELETED!', severity: 'success' });
        fetchStock();
      } catch {
        setMsg({ open: true, text: 'ERROR DELETING STOCK ITEM', severity: 'error' });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await axios.put(`http://54.167.21.79:5000/api/stock/update/${editing.id}`, form);
        setMsg({ open: true, text: 'STOCK UPDATED!', severity: 'success' });
      } else {
        await axios.post('http://54.167.21.79:5000/api/stock/add', form);
        setMsg({ open: true, text: 'STOCK ADDED!', severity: 'success' });
      }
      setOpen(false);
      fetchStock();
    } catch {
      setMsg({ open: true, text: 'ERROR SAVING STOCK', severity: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 2 }}>
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Stock Management
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={handleAdd} 
              sx={{ 
                textTransform: 'uppercase',
                fontWeight: 'bold',
                borderRadius: 2,
                px: 3
              }}
            >
              Add Stock
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Stock Overview ({stock.length} items)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your inventory stock levels and locations
            </Typography>
          </Paper>
          
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer sx={{ 
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
            }}>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Batch</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
              <TableBody>
                {stock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No stock items found. Add your first stock item!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  stock.map((item, index) => (
                    <TableRow key={item.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip 
                            label={index + 1} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {item.product}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.batch} 
                          color="secondary" 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.location} 
                          color="primary" 
                          size="small" 
                          icon={<LocationIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.quantity} 
                          color={item.quantity > 10 ? 'success' : item.quantity > 5 ? 'warning' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(item)} color="primary" size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.id)} color="error" size="small">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </TableContainer>
          </Paper>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {editing ? 'Edit Stock Item' : 'Add Stock Item'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Product Name"
            value={form.product}
            onChange={e => setForm({ ...form, product: e.target.value })}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InventoryIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Batch Number"
            value={form.batch}
            onChange={e => setForm({ ...form, batch: e.target.value })}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <QrCodeIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Location"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NumbersIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'uppercase' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            {editing ? 'Update' : 'Add'} Stock
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={msg.open} autoHideDuration={3000} onClose={() => setMsg({ ...msg, open: false })}>
        <Alert severity={msg.severity} sx={{ width: '100%', textTransform: 'uppercase' }}>
          {msg.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
