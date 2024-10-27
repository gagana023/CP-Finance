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
  Button,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TransactionFilter from './TransactionFilter';

const TransactionList = ({ transactions, handleEditTransaction = () => {} }) => {
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateRange, setFilterDateRange] = useState([null, null]);

  // Sorting states
  const [sortColumn, setSortColumn] = useState('date'); // default sort by date
  const [sortOrder, setSortOrder] = useState('desc'); // default ascending order

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

  // Sort transactions
  const sortedTransactions = filteredTransactions.sort((a, b) => {
    const aValue = sortColumn === 'amount' ? parseFloat(a.amount) : a[sortColumn];
    const bValue = sortColumn === 'amount' ? parseFloat(b.amount) : b[sortColumn];

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Handle sort change
  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortOrder === 'asc';
    setSortColumn(column);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Transactions
      </Typography>

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
              <TableCell onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                Type {sortColumn === 'type' ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                Amount {sortColumn === 'amount' ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                Category {sortColumn === 'category' ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                Date {sortColumn === 'date' ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
              </TableCell>
              <TableCell>Edit</TableCell> {/* New Edit column header */}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.type === 'income' ? 'Income' : 'Expense'}</TableCell>
                <TableCell>
                  {transaction.type === 'income' ? '+' : '-'} ${transaction.amount}
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditTransaction(transaction)} // Call handleEditTransaction with the current transaction
                  >
                    Edit
                  </Button>
                </TableCell> {/* Edit button */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TransactionList;
