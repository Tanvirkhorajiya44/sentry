import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  TextField,
  MenuItem,
  Stack,
  Snackbar
} from '@mui/material';
import {
  CheckCircle as DispatchedIcon,
  Inventory as AvailableIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function ProductsOverviewTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [godowns, setGodowns] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProducts();
    fetchGodowns();
  }, []);

  // Live refresh after dispatches
  useEffect(() => {
    const handler = () => fetchProducts();
    window.addEventListener('refresh:products', handler);
    return () => window.removeEventListener('refresh:products', handler);
  }, []);

  const fetchGodowns = async () => {
    try {
      const response = await axios.get('http://54.167.21.79:5000/api/godown/list');
      setGodowns(response.data.locations || []);
    } catch (err) {
      console.error('Error fetching godowns:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://54.167.21.79:5000/api/inventory/list');
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusChip = (status, dispatchDate) => {
    if (status === 'DISPATCHED') {
      return (
        <Chip
          icon={<DispatchedIcon />}
          label="DISPATCHED"
          color="success"
          variant="filled"
          sx={{ fontWeight: 'bold' }}
        />
      );
    } else {
      return (
        <Chip
          icon={<AvailableIcon />}
          label="AVAILABLE"
          color="warning"
          variant="filled"
          sx={{ fontWeight: 'bold' }}
        />
      );
    }
  };

  const getTotalValue = (quantity, rate) => {
    return parseFloat(quantity || 0) * parseFloat(rate || 0);
  };

  const handleViewDispatch = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleViewAvailable = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setEditForm({
      itemName: product.product_name,
      quantity: product.quantity,
      rate: product.rate,
      date: product.date,
      batch: product.batch,
      location: product.location,
      party: product.party
    });
    setEditDialogOpen(true);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.product_name}"?`)) {
      try {
        await axios.delete(`http://54.167.21.79:5000/api/inventory/delete/${product.id}`);
        setToast({ open: true, message: 'PRODUCT DELETED SUCCESSFULLY!', severity: 'success' });
        fetchProducts(); // Refresh the list
      } catch (err) {
        setToast({ 
          open: true, 
          message: err.response?.data?.message || 'Error deleting product', 
          severity: 'error' 
        });
      }
    }
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://54.167.21.79:5000/api/inventory/update/${editProduct.id}`, editForm);
      setToast({ open: true, message: 'PRODUCT UPDATED SUCCESSFULLY!', severity: 'success' });
      setEditDialogOpen(false);
      fetchProducts(); // Refresh the list
    } catch (err) {
      setToast({ 
        open: true, 
        message: err.response?.data?.message || 'Error updating product', 
        severity: 'error' 
      });
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditProduct(null);
    setEditForm({});
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  const dispatchedCount = products.filter(p => p.dispatch_status === 'DISPATCHED').length;
  const availableCount = products.filter(p => p.dispatch_status === 'AVAILABLE').length;
  const totalValue = products.reduce((sum, product) => sum + getTotalValue(product.quantity, product.rate), 0);

  return (
    <Card sx={{
      width: "100%",
      mx: "auto",
      maxWidth: "100%",
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          PRODUCTS OVERVIEW
        </Typography>
        
        {/* Summary Cards */}
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 }, 
          mb: 3, 
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}>
          <Card sx={{ 
            minWidth: { xs: 140, sm: 150 }, 
            flex: { xs: '1 1 calc(50% - 8px)', sm: 'none' },
            backgroundColor: 'primary.main', 
            color: 'white' 
          }}>
            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {products.length}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                TOTAL PRODUCTS
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            minWidth: { xs: 140, sm: 150 }, 
            flex: { xs: '1 1 calc(50% - 8px)', sm: 'none' },
            backgroundColor: 'success.main', 
            color: 'white' 
          }}>
            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {dispatchedCount}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                DISPATCHED
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            minWidth: { xs: 140, sm: 150 }, 
            flex: { xs: '1 1 calc(50% - 8px)', sm: 'none' },
            backgroundColor: 'warning.main', 
            color: 'white' 
          }}>
            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {availableCount}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                AVAILABLE
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            minWidth: { xs: 140, sm: 150 }, 
            flex: { xs: '1 1 calc(50% - 8px)', sm: 'none' },
            backgroundColor: 'info.main', 
            color: 'white' 
          }}>
            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {formatCurrency(totalValue)}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                TOTAL VALUE
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <TableContainer 
          component={Paper} 
          sx={{ 
            maxHeight: 600,
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
          }}
        >
          <Table stickyHeader sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>PRODUCT ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>PRODUCT NAME</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>QUANTITY</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>RATE</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>TOTAL VALUE</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>BATCH</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>LOCATION</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>PARTY</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>DATE</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      NO PRODUCTS FOUND
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Chip 
                        label={`#${product.id}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {product.product_name?.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.quantity} 
                        size="small" 
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(product.rate)}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {formatCurrency(getTotalValue(product.quantity, product.rate))}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.batch} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.location?.toUpperCase()} 
                        size="small" 
                        color="success"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {product.party?.toUpperCase()}
                    </TableCell>
                    <TableCell>{formatDate(product.date)}</TableCell>
                    <TableCell>
                      {getStatusChip(product.dispatch_status, product.dispatch_date)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {/* View Button */}
                        {product.dispatch_status === 'DISPATCHED' ? (
                          <Tooltip title="View Dispatch Details">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleViewDispatch(product)}
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: 'success.light',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="View Product Details">
                            <IconButton 
                              size="small" 
                              color="warning"
                              onClick={() => handleViewAvailable(product)}
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: 'warning.light',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <AvailableIcon />
                            </IconButton>
                          </Tooltip>
              )}
                        
                        {/* Edit Button - Only for available products */}
                        {product.dispatch_status === 'AVAILABLE' && (
                          <Tooltip title="Edit Product">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleEditProduct(product)}
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: 'primary.light',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
              )}
                        
                        {/* Delete Button - Only for available products */}
                        {product.dispatch_status === 'AVAILABLE' && (
                          <Tooltip title="Delete Product">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteProduct(product)}
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: 'error.light',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
              )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {products.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              SHOWING {products.length} PRODUCTS
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                DISPATCHED: {dispatchedCount}
              </Typography>
              <Typography variant="body2" color="warning.main" sx={{ fontWeight: 'bold' }}>
                AVAILABLE: {availableCount}
              </Typography>
            </Box>
          </Box>
              )}
      </CardContent>
      
      {/* Product Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {selectedProduct?.dispatch_status === 'DISPATCHED' ? 'DISPATCH DETAILS' : 'PRODUCT DETAILS'}
        </DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  PRODUCT NAME:
                </Typography>
                <Typography variant="body1">
                  {selectedProduct.product_name?.toUpperCase()}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  QUANTITY:
                </Typography>
                <Typography variant="body1">
                  {selectedProduct.quantity}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  RATE:
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(selectedProduct.rate)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  TOTAL VALUE:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {formatCurrency(getTotalValue(selectedProduct.quantity, selectedProduct.rate))}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  BATCH:
                </Typography>
                <Typography variant="body1">
                  {selectedProduct.batch}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  LOCATION:
                </Typography>
                <Typography variant="body1">
                  {selectedProduct.location?.toUpperCase()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  PARTY:
                </Typography>
                <Typography variant="body1">
                  {selectedProduct.party?.toUpperCase()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  DATE:
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedProduct.date)}
                </Typography>
              </Box>
              
              {selectedProduct.dispatch_status === 'DISPATCHED' && selectedProduct.dispatch_date && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      DISPATCH DATE:
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedProduct.dispatch_date)}
                    </Typography>
                  </Box>
                </>
              )}
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  STATUS:
                </Typography>
                {getStatusChip(selectedProduct.dispatch_status, selectedProduct.dispatch_date)}
              </Box>
            </Box>
              )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" sx={{ fontWeight: 'bold' }}>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          EDIT PRODUCT
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="ITEM NAME"
              name="itemName"
              value={editForm.itemName || ''}
              onChange={handleEditFormChange}
              required
              fullWidth
            />
            <TextField
              label="QUANTITY"
              name="quantity"
              type="number"
              value={editForm.quantity || ''}
              onChange={handleEditFormChange}
              required
              fullWidth
            />
            <TextField
              label="RATE / PRICE"
              name="rate"
              type="number"
              value={editForm.rate || ''}
              onChange={handleEditFormChange}
              required
              fullWidth
            />
            <TextField
              label="DATE"
              name="date"
              type="date"
              value={editForm.date || ''}
              onChange={handleEditFormChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="BATCH NUMBER"
              name="batch"
              value={editForm.batch || ''}
              onChange={handleEditFormChange}
              required
              fullWidth
            />
            <TextField
              select
              label="LOCATION / GODOWN"
              name="location"
              value={editForm.location || ''}
              onChange={handleEditFormChange}
              required
              fullWidth
            >
              {godowns.map((g, index) => (
                <MenuItem key={g.id || `godown-${index}`} value={g.name}>
                  {g.name?.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="PARTY NAME"
              name="party"
              value={editForm.party || ''}
              onChange={handleEditFormChange}
              required
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} variant="outlined">
            CANCEL
          </Button>
          <Button onClick={handleUpdateProduct} variant="contained" sx={{ fontWeight: 'bold' }}>
            UPDATE PRODUCT
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Toast Notifications */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
