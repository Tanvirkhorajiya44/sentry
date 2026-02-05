import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './responsive.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddProductForm from './components/Inventory/AddProductForm';
import DispatchProductForm from './components/Inventory/DispatchProductForm';
import DispatchedProductsTable from './components/Inventory/DispatchedProductsTable';
import ProductsOverviewTable from './components/Inventory/ProductsOverviewTable';
import GodownPage from './components/Godown/GodownPage';
import StockManagement from './components/Stock/StockManagement';
import PartyManagement from './components/Party/PartyManagement';
import CustomerManagement from './components/CustomersSuppliers/CustomerManagement';
import SupplierManagement from './components/CustomersSuppliers/SupplierManagement';
import AddExpense from './components/ExpensesCashBook/AddExpense';
import CashFlow from './components/ExpensesCashBook/CashFlow';
import StockReport from './components/ReportsAnalytics/StockReport';
import SalesReport from './components/ReportsAnalytics/SalesReport';
import PurchaseReport from './components/ReportsAnalytics/PurchaseReport';
import ProfitLoss from './components/ReportsAnalytics/ProfitLoss';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
  },
});

export default function App() {
  const [loggedIn, setLoggedIn] = React.useState(() => localStorage.getItem('loggedIn') === 'true');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/" element={loggedIn ? <Navigate to="/dashboard" /> : <Login setLoggedIn={setLoggedIn} />} />
          <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/" /> }>
                    <Route path="inventory/add" element={<AddProductForm />} />
                    <Route path="inventory/dispatch" element={<DispatchProductForm />} />
                    <Route path="inventory/dispatched" element={<DispatchedProductsTable />} />
                    <Route path="inventory/overview" element={<ProductsOverviewTable />} />
            <Route path="godown/manage" element={<GodownPage />} />
            <Route path="stock/manage" element={<StockManagement />} />
            <Route path="party/manage" element={<PartyManagement />} />
            <Route path="customersuppliers/customer" element={<CustomerManagement />} />
            <Route path="customersuppliers/supplier" element={<SupplierManagement />} />
            <Route path="expenses/add" element={<AddExpense />} />
            <Route path="expenses/cashflow" element={<CashFlow />} />
            <Route path="reports/stock" element={<StockReport />} />
            <Route path="reports/sales" element={<SalesReport />} />
            <Route path="reports/purchase" element={<PurchaseReport />} />
            <Route path="reports/profitloss" element={<ProfitLoss />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}