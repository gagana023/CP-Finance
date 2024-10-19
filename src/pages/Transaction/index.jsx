import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase'; // Adjust the path as needed
import TransactionForm from '../../components/TransactionForm';
import TransactionList from '../../components/TransactionList';
import Summary from '../../components/Summary';
import TransactionChart from '../../components/TransactionChart';  // Import the chart component

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);  // State to control dialog visibility

  // Function to fetch transactions from Firestore
  const fetchTransactions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'transactions')); // Fetch all documents from 'transactions' collection
      const fetchedTransactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(fetchedTransactions); // Set the fetched transactions to state
    } catch (error) {
      console.error("Error fetching transactions: ", error);
    }
  };

  // Fetch transactions when the component mounts
  useEffect(() => {
    fetchTransactions();
  }, []); // Empty dependency array ensures this runs once

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
    setOpenDialog(false);  // Close dialog after adding transaction
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (refreshList = false) => {
    setOpenDialog(false);
    if(refreshList){
        fetchTransactions();
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Personal Finance Manager
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Track your income, expenses, and manage your finances efficiently
        </Typography>
      </Box>

      {/* Button to open the form in dialog */}
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Add New Transaction
        </Button>
      </Box>

      {/* Dialog for Transaction Form */}
      <Dialog open={openDialog} onClose={handleCloseDialog}  maxWidth="sm" fullWidth>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <TransactionForm addTransaction={addTransaction} onClose={handleCloseDialog}  />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Summary Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Summary transactions={transactions} />
      </Paper>

      {/* Chart Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <TransactionChart transactions={transactions} />
      </Paper>

      {/* Transaction List Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <TransactionList transactions={transactions} />
      </Paper>
    </Container>
  );
};

export default Transaction;
