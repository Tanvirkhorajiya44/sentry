import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, Box, TableContainer, Paper } from '@mui/material';
import axios from 'axios';

export default function StockReport() {
  const [stock, setStock] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports/stock');
      setStock(res.data.stock || []);
      const total = res.data.stock?.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0) || 0;
      setTotalItems(total);
    } catch (err) {
      console.error('Error fetching stock:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>LOADING...</div>;

  return (
    <Card sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          STOCK REPORT
        </Typography>
        <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
          <Typography variant="h6" color="success.contrastText">
            TOTAL ITEMS IN STOCK: {totalItems}
          </Typography>
        </Box>
        <TableContainer 
          component={Paper} 
          sx={{ 
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
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>PRODUCT NAME</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>BATCH NUMBER</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>LOCATION/GODOWN</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>QUANTITY</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
            {stock.map((item, index) => (
              <TableRow key={item.id || `stock-${index}`}>
                <TableCell>{item.product?.toUpperCase()}</TableCell>
                <TableCell>{item.batch?.toUpperCase()}</TableCell>
                <TableCell>{item.location?.toUpperCase()}</TableCell>
                <TableCell><strong>{item.quantity}</strong></TableCell>
                <TableCell>
                  <Chip 
                    label={item.quantity > 10 ? "IN STOCK" : "LOW STOCK"} 
                    color={item.quantity > 10 ? "success" : "warning"} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
        {stock.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
            NO STOCK FOUND
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}