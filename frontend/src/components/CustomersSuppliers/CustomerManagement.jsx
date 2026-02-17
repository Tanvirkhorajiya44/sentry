import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody, 
  Snackbar, Alert, Box, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider,
  Paper, InputAdornment, TableContainer
} from '@mui/material';
import { Add as AddIcon, Person as PersonIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

export default function CustomerManagement() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState({ open: false, text: '', severity: 'success' });
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchCustomers = () => {
    axios.get('http://54.167.21.79:5000/api/customersuppliers/customer/list').then(res => setCustomers(res.data.customers || []));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ open: false, text: '', severity: 'success' });
    try {
      await axios.post('http://54.167.21.79:5000/api/customersuppliers/customer/add', { name });
      setMsg({ open: true, text: 'Customer added successfully!', severity: 'success' });
      setName('');
      setOpen(false);
      fetchCustomers();
    } catch {
      setMsg({ open: true, text: 'Error adding customer', severity: 'error' });
    }
  };

  const handleEdit = (customer) => {
    setEditing(customer);
    setName(customer.name);
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://54.167.21.79:5000/api/customersuppliers/customer/update/${editing.id}`, { name });
      setMsg({ open: true, text: 'Customer updated successfully!', severity: 'success' });
      setName('');
      setOpen(false);
      setEditing(null);
      fetchCustomers();
    } catch {
      setMsg({ open: true, text: 'Error updating customer', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://54.167.21.79:5000/api/customersuppliers/customer/delete/${id}`);
        setMsg({ open: true, text: 'Customer deleted successfully!', severity: 'success' });
        fetchCustomers();
      } catch {
        setMsg({ open: true, text: 'Error deleting customer', severity: 'error' });
      }
    }
  };

  const handleAddNew = () => {
    setEditing(null);
    setName('');
    setOpen(true);
  };

  return (
    <Box sx={{
      maxWidth: {
        xs: "100%", // on extra-small screens
        sm: 600,    // on small screens
        md: 900,    // on medium screens
        lg: 1200,   // on large screens
      },
      mx: "auto",
    }}
  >
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Customer Management
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={handleAddNew}
              sx={{ 
                textTransform: 'uppercase',
                fontWeight: 'bold',
                borderRadius: 2,
              }}
            >
              Add
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Customers List ({customers.length})
              </Typography>
            </Box>
            
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
              <Table sx={{ minWidth: 400 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Customer Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No customers found. Add your first customer!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer, index) => (
                    <TableRow key={customer.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip 
                            label={index + 1} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {customer.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(customer)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(customer.id)} color="error">
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

          <Snackbar open={msg.open} autoHideDuration={3000} onClose={() => setMsg({ ...msg, open: false })}>
            <Alert severity={msg.severity} sx={{ width: '100%' }}>{msg.text}</Alert>
          </Snackbar>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {editing ? 'Edit Customer' : 'Add New Customer'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            placeholder="Enter Customer Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'uppercase' }}>
            Cancel
          </Button>
          <Button 
            onClick={editing ? handleUpdate : handleSubmit} 
            variant="contained"
            sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            {editing ? 'Update' : 'Add'} Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
