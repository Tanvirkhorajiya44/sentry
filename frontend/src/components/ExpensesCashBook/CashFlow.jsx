import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, Box, TableContainer, Paper } from '@mui/material';
import axios from 'axios';

export default function CashFlow() {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://54.167.21.79:5000/api/expenses/cashflow');
      setExpenses(res.data.cashflow || []);
      const total = res.data.cashflow?.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0) || 0;
      setTotalExpenses(total);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>LOADING...</div>;

  return (
    <Card sx={{ 
      maxWidth: { xs: '100%', sm: 800, md: 1000 }, 
      mx: 'auto', 
    }}>
      <CardContent sx={{ p: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ 
          fontWeight: 'bold', 
          fontSize: { xs: '1rem', sm: '1.25rem' },
          mb: { xs: 2, sm: 3 }
        }}>
          CASH FLOW / LEDGER
        </Typography>
        <Box sx={{ 
          mb: { xs: 2, sm: 3 }, 
          p: 1, 
          bgcolor: 'grey.100', 
          borderRadius: 1,
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Typography variant="h6" color="error" sx={{ 
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 'bold'
          }}>
            TOTAL EXPENSES: ₹{totalExpenses.toFixed(2)}
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
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>DATE</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>DESCRIPTION</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>AMOUNT</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }}>TYPE</TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
            {expenses.map(expense => (
              <TableRow key={expense.id}>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.description?.toUpperCase()}</TableCell>
                <TableCell>₹{expense.amount}</TableCell>
                <TableCell>
                  <Chip label="EXPENSE" color="error" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
        {expenses.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
            NO EXPENSES FOUND
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}