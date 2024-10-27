import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const Summary = ({ transactions }) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h5" gutterBottom>
        Financial Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ backgroundColor: '#e0f7fa' }}>
            <CardContent>
              <Typography variant="h6">Total Income</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                ${totalIncome.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ backgroundColor: '#ffebee' }}>
            <CardContent>
              <Typography variant="h6">Total Expense</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                ${totalExpense.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ backgroundColor: balance >= 0 ? '#c8e6c9' : '#ffccbc' }}>
            <CardContent>
              <Typography variant="h6">Balance</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                ${balance.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Summary;
