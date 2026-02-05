import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody, 
  Tabs, Tab, Snackbar, Alert, Box, Paper, Divider, InputAdornment, Chip
} from '@mui/material';
import { 
  Group as GroupIcon, Person as PersonIcon, Business as BusinessIcon, 
  Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function PartyManagement() {
  const [tab, setTab] = useState(0);
  const [name, setName] = useState('');
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [msg, setMsg] = useState({ open: false, text: '', severity: 'success' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/customersuppliers/customer/list').then(res => setCustomers(res.data.customers || []));
    axios.get('http://localhost:5000/api/customersuppliers/supplier/list').then(res => setSuppliers(res.data.suppliers || []));
  }, [msg.open]);

  const handleAdd = async () => {
    if (!name) return;
    try {
      if (tab === 0) {
        await axios.post('http://localhost:5000/api/customersuppliers/customer/add', { name });
        setMsg({ open: true, text: 'Customer added successfully!', severity: 'success' });
      } else {
        await axios.post('http://localhost:5000/api/customersuppliers/supplier/add', { name });
        setMsg({ open: true, text: 'Supplier added successfully!', severity: 'success' });
      }
      setName('');
    } catch {
      setMsg({ open: true, text: 'Error adding party', severity: 'error' });
    }
  };

  const currentList = tab === 0 ? customers : suppliers;
  const currentType = tab === 0 ? 'Customers' : 'Suppliers';

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Party Management
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Tabs 
            value={tab} 
            onChange={(_, v) => setTab(v)} 
            sx={{ 
              mb: 3,
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 'bold' }
            }}
          >
            <Tab 
              icon={<PersonIcon />} 
              iconPosition="start" 
              label="Customers" 
            />
            <Tab 
              icon={<BusinessIcon />} 
              iconPosition="start" 
              label="Suppliers" 
            />
          </Tabs>

          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, backgroundColor: '#f8f9fa', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Add New {currentType.slice(0, -1)}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField 
                label={`${currentType.slice(0, -1)} Name`}
                value={name} 
                onChange={e => setName(e.target.value)} 
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {tab === 0 ? <PersonIcon color="action" /> : <BusinessIcon color="action" />}
                    </InputAdornment>
                  ),
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleAdd}
                startIcon={<AddIcon />}
                sx={{ 
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  minWidth: 120
                }}
              >
                Add
              </Button>
            </Stack>
          </Paper>

          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {currentType} List ({currentList.length})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your {currentType.toLowerCase()} database
              </Typography>
            </Box>
            
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: tab === 0 ? '#e3f2fd' : '#e8f5e8' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {currentType.slice(0, -1)} Name
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentList.length === 0 ? (
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No {currentType.toLowerCase()} found. Add your first {currentType.slice(0, -1).toLowerCase()}!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentList.map((party, index) => (
                    <TableRow key={party.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip 
                            label={index + 1} 
                            size="small" 
                            color={tab === 0 ? 'primary' : 'success'} 
                            variant="outlined"
                          />
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {party.name}
                          </Typography>
                        </Box>
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
    </Box>
  );
}
