import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import axios from 'axios';

export default function ProfitLoss() {
  const [profitData, setProfitData] = useState({ profit: 0, loss: 0 });
  const [salesTotal, setSalesTotal] = useState(0);
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfitLoss();
  }, []);

  const fetchProfitLoss = async () => {
    try {
      const res = await axios.get('http://54.167.21.79:5000/api/reports/profitloss');
      setProfitData(res.data);
      
      // Fetch individual totals for breakdown
      const salesRes = await axios.get('http://54.167.21.79:5000/api/reports/sales');
      const purchaseRes = await axios.get('http://54.167.21.79:5000/api/reports/purchase');
      const expenseRes = await axios.get('http://54.167.21.79:5000/api/expenses/cashflow');
      
      const sales = salesRes.data.sales?.reduce((sum, sale) => sum + (parseFloat(sale.quantity || 0) * parseFloat(sale.rate || 0)), 0) || 0;
      const purchases = purchaseRes.data.purchases?.reduce((sum, purchase) => sum + (parseFloat(purchase.quantity || 0) * parseFloat(purchase.rate || 0)), 0) || 0;
      const expenses = expenseRes.data.cashflow?.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0) || 0;
      
      setSalesTotal(sales);
      setPurchaseTotal(purchases);
      setExpenseTotal(expenses);
    } catch (err) {
      console.error('Error fetching profit/loss:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>LOADING...</div>;

  const netProfit = salesTotal - purchaseTotal - expenseTotal;

  return (
    <Card sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          PROFIT & LOSS STATEMENT
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Typography variant="h6">TOTAL SALES</Typography>
              <Typography variant="h4">₹{salesTotal.toFixed(2)}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Typography variant="h6">TOTAL PURCHASES</Typography>
              <Typography variant="h4">₹{purchaseTotal.toFixed(2)}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'error.light', color: 'error.contrastText' }}>
            <CardContent>
              <Typography variant="h6">TOTAL EXPENSES</Typography>
              <Typography variant="h4">₹{expenseTotal.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ textAlign: 'center', p: 3, bgcolor: netProfit >= 0 ? 'success.light' : 'error.light', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ color: netProfit >= 0 ? 'success.contrastText' : 'error.contrastText' }}>
            {netProfit >= 0 ? 'NET PROFIT' : 'NET LOSS'}
          </Typography>
          <Typography variant="h3" sx={{ color: netProfit >= 0 ? 'success.contrastText' : 'error.contrastText', fontWeight: 'bold' }}>
            ₹{Math.abs(netProfit).toFixed(2)}
          </Typography>
          <Chip 
            label={netProfit >= 0 ? 'PROFITABLE' : 'LOSS'} 
            color={netProfit >= 0 ? 'success' : 'error'} 
            size="large"
            sx={{ mt: 1 }}
          />
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            CALCULATION: SALES (₹{salesTotal.toFixed(2)}) - PURCHASES (₹{purchaseTotal.toFixed(2)}) - EXPENSES (₹{expenseTotal.toFixed(2)}) = ₹{netProfit.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}