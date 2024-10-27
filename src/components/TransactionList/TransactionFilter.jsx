import React, { useState } from 'react';
import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {categories} from '../../helpers/constacts';

const TransactionFilter = ({
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  filterDateRange,
  setFilterDateRange,
}) => {
  return (
    <Box sx={{ padding: 2, marginBottom: 4, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filter Transactions
      </Typography>
      <Grid container spacing={3} alignItems="center">
        {/* Transaction Type Filter */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Category Filter */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Date Range Filter */}
        <Grid item xs={12} sm={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DatePicker
                  label="From"
                  value={filterDateRange[0]}
                  onChange={(newValue) => setFilterDateRange([newValue, filterDateRange[1]])}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="To"
                  value={filterDateRange[1]}
                  onChange={(newValue) => setFilterDateRange([filterDateRange[0], newValue])}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Grid>
      </Grid>

      {/* Reset Button */}
      <Box textAlign="right" sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setFilterType('');
            setFilterCategory('');
            setFilterDateRange([null, null]);
          }}
        >
          Reset Filters
        </Button>
      </Box>
    </Box>
  );
};

export default TransactionFilter;
