import React from 'react';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function InventoryModule() {
  const navigate = useNavigate();
  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 6 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Select Operation
        </Typography>
        <Stack spacing={2}>
          <Button variant="contained" onClick={() => navigate('add')} fullWidth>
            Add Product
          </Button>
          <Button variant="outlined" onClick={() => navigate('dispatch')} fullWidth>
            Dispatch Product
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
