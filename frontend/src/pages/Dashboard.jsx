import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemIcon, ListItemText, IconButton, useTheme, useMediaQuery } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

const menuItems = [
  { text: 'Add Product', icon: <InventoryIcon />, path: 'inventory/add' },
  { text: 'Dispatch Product', icon: <InventoryIcon />, path: 'inventory/dispatch' },
  { text: 'Products Overview', icon: <InventoryIcon />, path: 'inventory/overview' },
  { text: 'Dispatched Products', icon: <InventoryIcon />, path: 'inventory/dispatched' },
  { text: 'Godown', icon: <StoreIcon />, path: 'godown/manage' },
  { text: 'Stock Management', icon: <InventoryIcon />, path: 'stock/manage' },
  { text: 'Customer Management', icon: <PeopleIcon />, path: 'customersuppliers/customer' },
  { text: 'Supplier Management', icon: <PeopleIcon />, path: 'customersuppliers/supplier' },
  { text: 'Add Expense', icon: <MoneyIcon />, path: 'expenses/add' },
  { text: 'Cash Flow / Ledger', icon: <MoneyIcon />, path: 'expenses/cashflow' },
  { text: 'Stock Report', icon: <BarChartIcon />, path: 'reports/stock' },
  { text: 'Sales Report', icon: <BarChartIcon />, path: 'reports/sales' },
  { text: 'Purchase Report', icon: <BarChartIcon />, path: 'reports/purchase' },
  { text: 'Profit & Loss', icon: <BarChartIcon />, path: 'reports/profitloss' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout = () => {
    localStorage.removeItem('loggedIn');
    navigate('/');
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map(item => (
          <ListItem key={item.text} component={Link} to={item.path} onClick={() => isMobile && setMobileOpen(false)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: 1201
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={mobileOpen ? "close drawer" : "open drawer"}
            aria-expanded={mobileOpen}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Senetry ERP Dashboard
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ flexShrink: 0 }}
        aria-label="navigation menu"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
            disableAutoFocus: true,
            disableEnforceFocus: true,
            disableRestoreFocus: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              zIndex: 1200
            },
          }}
          aria-label="navigation menu"
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 3 },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          overflowX: 'hidden'
        }}
      >
        <Toolbar />
        <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
