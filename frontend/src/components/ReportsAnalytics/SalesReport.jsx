import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, Box, TableContainer, Paper } from '@mui/material';
import axios from 'axios';

export default function SalesReport() {
  const [sales, setSales] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get('http://54.167.21.79:5000/api/reports/sales');
      setSales(res.data.sales || []);
      const total = res.data.sales?.reduce((sum, sale) => sum + (parseFloat(sale.quantity || 0) * parseFloat(sale.rate || 0)), 0) || 0;
      setTotalValue(total);
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>LOADING...</div>;

  return (
    <Card sx={{ 
      maxWidth: { xs: '100%', sm: 800, md: 1000, lg: 1200 }, 
      mx: 'auto', 
      mt: { xs: 2, sm: 4 },
      p: { xs: 1, sm: 2 }
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h6" gutterBottom sx={{ 
          fontWeight: 'bold', 
          fontSize: { xs: '1rem', sm: '1.25rem' },
          mb: { xs: 2, sm: 3 }
        }}>
          SALES REPORT
        </Typography>
        <Box sx={{ 
          mb: { xs: 2, sm: 3 }, 
          p: { xs: 1.5, sm: 2 }, 
          bgcolor: 'success.light', 
          borderRadius: 1,
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Typography variant="h6" color="success.contrastText" sx={{ 
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 'bold'
          }}>
            TOTAL SALES VALUE: ₹{totalValue.toFixed(2)}
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
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>DATE</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>PRODUCT NAME</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>BATCH</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>QUANTITY</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>RATE</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>TOTAL VALUE</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>LOCATION</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>PARTY</TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
            {sales.map((sale, index) => {
              const totalValue = parseFloat(sale.quantity || 0) * parseFloat(sale.rate || 0);
              return (
                <TableRow key={sale.id || `sale-${index}`}>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.product?.toUpperCase()}</TableCell>
                  <TableCell>{sale.batch?.toUpperCase()}</TableCell>
                  <TableCell><strong>{sale.quantity}</strong></TableCell>
                  <TableCell>₹{sale.rate}</TableCell>
                  <TableCell><strong>₹{totalValue.toFixed(2)}</strong></TableCell>
                  <TableCell>{sale.location?.toUpperCase()}</TableCell>
                  <TableCell>{sale.party?.toUpperCase()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </TableContainer>
        {sales.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
            NO SALES FOUND
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}