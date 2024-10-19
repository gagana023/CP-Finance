import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
  InputLabel,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TransactionFilter from './TransactionFilter'

const TransactionList = ({ transactions }) => {
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateRange, setFilterDateRange] = useState([null, null]);

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = filterType ? transaction.type === filterType : true;
    const matchesCategory = filterCategory ? transaction.category.toLowerCase().includes(filterCategory.toLowerCase()) : true;
    const matchesDate =
      filterDateRange[0] && filterDateRange[1]
        ? dayjs(transaction.date).isBetween(filterDateRange[0], filterDateRange[1], null, '[]')
        : true;

    return matchesType && matchesCategory && matchesDate;
  });

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Transactions
      </Typography>

      {/* Filter Controls */}
      {/* <div style={{ marginBottom: '16px' }}>
        <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Type">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Category"
          variant="outlined"
          size="small"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          sx={{ marginRight: 2 }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From"
            value={filterDateRange[0]}
            onChange={(newValue) => setFilterDateRange([newValue, filterDateRange[1]])}
            renderInput={(params) => <TextField {...params} sx={{ marginRight: 2 }} />}
          />
          <DatePicker
            label="To"
            value={filterDateRange[1]}
            onChange={(newValue) => setFilterDateRange([filterDateRange[0], newValue])}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setFilterType('');
            setFilterCategory('');
            setFilterDateRange([null, null]);
          }}
          sx={{ marginLeft: 2 }}
        >
          Reset
        </Button>
      </div> */}

<TransactionFilter
  filterType={filterType}
  setFilterType={setFilterType}
  filterCategory={filterCategory}
  setFilterCategory={setFilterCategory}
  filterDateRange={filterDateRange}
  setFilterDateRange={setFilterDateRange}
/>

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>
                  {transaction.type === 'income' ? 'Income' : 'Expense'}
                </TableCell>
                <TableCell>
                  {transaction.type === 'income' ? '+' : '-'} ${transaction.amount}
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TransactionList;
