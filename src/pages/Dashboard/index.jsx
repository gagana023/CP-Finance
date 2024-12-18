import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import Firestore functions
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Auth methods
import { db } from '../firebase'; // Adjust the path as needed
import TransactionChart from '../../components/TransactionChart';  // Import the chart component
import Summary from '../../components/Summary';  // Import the chart component
import TransactionCategoryChart from '../../components/TransactionCategoryChart';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
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

  // Calculate totals for earnings and expenses based on category
  const calculateCategoryTotals = () => {
      const totals = transactions.reduce((acc, transaction) => {
        const { category, amount, type } = transaction; // Assuming type is 'earn' or 'expense'
  
        if (!acc[category]) {
          acc[category] = { earn: 0, expense: 0 };
        }
  
        if (type === 'income') {
          acc[category].earn += amount;
        } else if (type === 'expense') {
          acc[category].expense += amount;
        }
  
        return acc;
      }, {});
  
      return totals;
    };
  
    const categoryTotals = calculateCategoryTotals();

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>

      {/* Summary Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Summary transactions={transactions} />
      </Paper>

      {/* Chart Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <TransactionChart transactions={transactions} />
      </Paper>

      {/* Chart Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <TransactionCategoryChart categoryTotals={categoryTotals} />
      </Paper>

    </Container>
  );
};

export default Dashboard;
