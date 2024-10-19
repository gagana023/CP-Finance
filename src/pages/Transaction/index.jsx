import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import Firestore functions
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Auth methods
import { db } from '../firebase'; // Adjust the path as needed
import TransactionForm from '../../components/TransactionForm';
import TransactionList from '../../components/TransactionList';
import Summary from '../../components/Summary';
import TransactionChart from '../../components/TransactionChart';  // Import the chart component


const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);  // State to control dialog visibility
  const [user, setUser] = useState(null); // To hold the logged-in user

  const auth = getAuth();
  useEffect(() => {
    // Check the authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  // Function to fetch transactions from Firestore
  const fetchTransactions = async () => {
    try {
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', user?.uid) // Filter by userId
      );
      const querySnapshot = await getDocs(transactionsQuery);
      //const querySnapshot = await getDocs(collection(db, 'transactions')); // Fetch all documents from 'transactions' collection
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
  }, [user]); // Empty dependency array ensures this runs once

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
