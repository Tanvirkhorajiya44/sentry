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
  Alert
} from '@mui/material';
import axios from 'axios';

export default function DispatchedProductsTable() {
  const [dispatchedProducts, setDispatchedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDispatchedProducts();
  }, []);

  const fetchDispatchedProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://54.167.21.79:5000/api/inventory/dispatched');
      setDispatchedProducts(response.data.dispatchedProducts || []);
    } catch (err) {
      console.error('Error fetching dispatched products:', err);
      setError('Error loading dispatched products');
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

  return (
    <Card sx={{
      maxWidth: {
        xs: "100%", // on extra-small screens
        sm: '600',    // on small screens
        md: '900',    // on medium screens
        lg: '1200',   // on large screens
        xlg: '1200'
      },
      mx: "auto",
    }}
  >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          DISPATCHED PRODUCTS
        </Typography>
        
        <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>DISPATCH ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>PRODUCT NAME</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>QUANTITY</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>RATE</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>BATCH</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>LOCATION</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>PARTY NAME</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>DISPATCH DATE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dispatchedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      NO DISPATCHED PRODUCTS FOUND
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                dispatchedProducts.map((product) => (
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
                      {product.party_name?.toUpperCase()}
                    </TableCell>
                    <TableCell>{formatDate(product.dispatch_date || product.date)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {dispatchedProducts.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              TOTAL DISPATCHED PRODUCTS: {dispatchedProducts.length}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
