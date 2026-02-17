import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody, 
  Snackbar, Alert, Box, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Divider,
  Paper, InputAdornment
} from '@mui/material';
import { Add as AddIcon, Business as BusinessIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

export default function SupplierManagement() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState({ open: false, text: '', severity: 'success' });
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchSuppliers = () => {
    axios.get('http://54.167.21.79:5000/api/customersuppliers/supplier/list').then(res => setSuppliers(res.data.suppliers || []));
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ open: false, text: '', severity: 'success' });
    try {
      await axios.post('http://54.167.21.79:5000/api/customersuppliers/supplier/add', { name });
      setMsg({ open: true, text: 'Supplier added successfully!', severity: 'success' });
      setName('');
      setOpen(false);
      fetchSuppliers();
    } catch {
      setMsg({ open: true, text: 'Error adding supplier', severity: 'error' });
    }
  };

  const handleEdit = (supplier) => {
    setEditing(supplier);
    setName(supplier.name);
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://54.167.21.79:5000/api/customersuppliers/supplier/update/${editing.id}`, { name });
      setMsg({ open: true, text: 'Supplier updated successfully!', severity: 'success' });
      setName('');
      setOpen(false);
      setEditing(null);
      fetchSuppliers();
    } catch {
      setMsg({ open: true, text: 'Error updating supplier', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`http://54.167.21.79:5000/api/customersuppliers/supplier/delete/${id}`);
        setMsg({ open: true, text: 'Supplier deleted successfully!', severity: 'success' });
        fetchSuppliers();
      } catch {
        setMsg({ open: true, text: 'Error deleting supplier', severity: 'error' });
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
              <BusinessIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Supplier Management
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
                Suppliers List ({suppliers.length})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your supplier database
              </Typography>
            </Box>
            
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e8f5e8' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Supplier Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No suppliers found. Add your first supplier!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  suppliers.map((supplier, index) => (
                    <TableRow key={supplier.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip 
                            label={index + 1} 
                            size="small" 
                            color="success" 
                            variant="outlined"
                          />
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {supplier.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(supplier)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(supplier.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>

          <Snackbar open={msg.open} autoHideDuration={3000} onClose={() => setMsg({ ...msg, open: false })}>
            <Alert severity={msg.severity} sx={{ width: '100%' }}>{msg.text}</Alert>
          </Snackbar>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {editing ? 'Edit Supplier' : 'Add New Supplier'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Supplier Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon color="action" />
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
            {editing ? 'Update' : 'Add'} Supplier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
