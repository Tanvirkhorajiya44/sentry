import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, Box, TableContainer, Paper } from '@mui/material';
import axios from 'axios';

export default function PurchaseReport() {
  const [purchases, setPurchases] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports/purchase');
      setPurchases(res.data.purchases || []);
      const total = res.data.purchases?.reduce((sum, purchase) => sum + (parseFloat(purchase.quantity || 0) * parseFloat(purchase.rate || 0)), 0) || 0;
      setTotalValue(total);
    } catch (err) {
      console.error('Error fetching purchases:', err);
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
          PURCHASE REPORT
        </Typography>
        <Box sx={{ 
          mb: { xs: 2, sm: 3 }, 
          p: { xs: 1.5, sm: 2 }, 
          bgcolor: 'info.light', 
          borderRadius: 1,
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Typography variant="h6" color="info.contrastText" sx={{ 
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 'bold'
          }}>
            TOTAL PURCHASE VALUE: ₹{totalValue.toFixed(2)}
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
            {purchases.map((purchase, index) => {
              const totalValue = parseFloat(purchase.quantity || 0) * parseFloat(purchase.rate || 0);
              return (
                <TableRow key={purchase.id || `purchase-${index}`}>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell>{purchase.product?.toUpperCase()}</TableCell>
                  <TableCell>{purchase.batch?.toUpperCase()}</TableCell>
                  <TableCell><strong>{purchase.quantity}</strong></TableCell>
                  <TableCell>₹{purchase.rate}</TableCell>
                  <TableCell><strong>₹{totalValue.toFixed(2)}</strong></TableCell>
                  <TableCell>{purchase.location?.toUpperCase()}</TableCell>
                  <TableCell>{purchase.party?.toUpperCase()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </TableContainer>
        {purchases.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
            NO PURCHASES FOUND
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}