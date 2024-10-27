import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
} from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // Icon for income
import TrendingDownIcon from '@mui/icons-material/TrendingDown'; // Icon for expenses
import { red } from '@mui/material/colors'; // For conditional styling

const Account = () => {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchTransactions = async () => {
    try {
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', user?.uid)
      );
      const querySnapshot = await getDocs(transactionsQuery);
      const fetchedTransactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching transactions: ", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  // Function to calculate monthly expenses by category
  const calculateMonthlyExpensesByCategory = () => {
    const monthlyExpensesByCategory = {};

    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transaction.type === 'expense' && 
          transactionDate >= firstDayCurrentMonth && 
          transactionDate <= lastDayCurrentMonth) {
        monthlyExpensesByCategory[transaction.category] = 
          (monthlyExpensesByCategory[transaction.category] || 0) + transaction.amount;
      }
    });

    return monthlyExpensesByCategory;
  };

  const monthlyExpensesByCategory = calculateMonthlyExpensesByCategory();

  // Find the category with the highest expenses
  const mostExpensiveCategory = Object.keys(monthlyExpensesByCategory).reduce((max, category) => {
    return monthlyExpensesByCategory[category] > (monthlyExpensesByCategory[max] || 0) ? category : max;
  }, '');

  // Function to calculate monthly and weekly summaries
  const calculateSummaries = () => {
    const now = new Date();
    const weeklySummary = { income: 0, expenses: 0 };
    const monthlySummary = { income: 0, expenses: 0 };

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const isSameWeek = now.getFullYear() === transactionDate.getFullYear() &&
                         Math.floor(now.getTime() / 604800000) === Math.floor(transactionDate.getTime() / 604800000);
      const isSameMonth = now.getFullYear() === transactionDate.getFullYear() &&
                          now.getMonth() === transactionDate.getMonth();

      if (transaction.type === 'income') {
        if (isSameWeek) weeklySummary.income += transaction.amount;
        if (isSameMonth) monthlySummary.income += transaction.amount;
      } else {
        if (isSameWeek) weeklySummary.expenses += transaction.amount;
        if (isSameMonth) monthlySummary.expenses += transaction.amount;
      }
    });

    return { weeklySummary, monthlySummary };
  };

  const { weeklySummary, monthlySummary } = calculateSummaries();

  // Function to calculate predictions for the previous month and upcoming month
  const calculatePredictions = () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const firstDayLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const lastDayLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
    

    const currentMonth = new Date();
    const firstDayCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    const monthlyExpenses = transactions.reduce((acc, transaction) => {
      
      const transactionDate = new Date(transaction.date);
      console.log('firstDayLastMonth',acc,transaction,transactionDate)
      if (transaction.type === 'expense') {
        if (transactionDate >= firstDayLastMonth && transactionDate <= lastDayLastMonth) {
          acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        }
      }
      return acc;
    }, {});

    const averagePredictions = Object.keys(monthlyExpenses).reduce((acc, category) => {
      acc[category] = Math.round(monthlyExpenses[category] / (lastDayLastMonth.getDate() || 1)); // Avoid division by zero
      return acc;
    }, {});

    return { averagePredictions, firstDayCurrentMonth };
  };

  const { averagePredictions } = calculatePredictions();

// Generate dynamic expense suggestions based on transaction data
const getExpenseSuggestions = () => {
  const suggestions = [];
  const averageSpending = {};

  // Calculate average spending per category
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      averageSpending[transaction.category] = 
        (averageSpending[transaction.category] || 0) + transaction.amount;
    }
  });

  // Determine suggestions based on spending habits
  for (const category in averageSpending) {
    const avgExpense = averageSpending[category];

    if (avgExpense > 100) {
      suggestions.push({
        id: category,
        suggestion: `Consider reducing your spending on ${category}. Current average: $${avgExpense.toFixed(2)}`,
      });
    } else {
      suggestions.push({
        id: category,
        suggestion: `Your spending on ${category} is reasonable. Keep it up! Current average: $${avgExpense.toFixed(2)}`,
      });
    }
  }

  return suggestions;
};

const expenseSuggestions = getExpenseSuggestions();

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Account Overview
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: '#4caf50', color: 'white' }}>
              <CardHeader
                title="Weekly Summary"
                action={
                  <Tooltip title="Income Overview">
                    <IconButton>
                      <TrendingUpIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </Tooltip>
                }
              />
              <CardContent>
                <Typography variant="h6">Income: ${weeklySummary.income}</Typography>
                <Typography variant="h6">Expenses: ${weeklySummary.expenses}</Typography>
                <Typography variant="h6">
                  Net: ${weeklySummary.income - weeklySummary.expenses}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: '#f44336', color: 'white' }}>
              <CardHeader
                title="Monthly Summary"
                action={
                  <Tooltip title="Expenses Overview">
                    <IconButton>
                      <TrendingDownIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </Tooltip>
                }
              />
              <CardContent>
                <Typography variant="h6">Income: ${monthlySummary.income}</Typography>
                <Typography variant="h6">Expenses: ${monthlySummary.expenses}</Typography>
                <Typography variant="h6">
                  Net: ${monthlySummary.income - monthlySummary.expenses}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Smart Expense Suggestions
          </Typography>
          <Paper elevation={1} sx={{ p: 2 }}>
            {expenseSuggestions.map(suggestion => (
              <Typography key={suggestion.id} variant="body1" sx={{ mb: 1 }}>
                - {suggestion.suggestion}
              </Typography>
            ))}
          </Paper>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Expense Predictions for Upcoming Month
          </Typography>
          <Paper elevation={1} sx={{ p: 2 }}>
            {Object.entries(averagePredictions).length > 0 ? (
              Object.entries(averagePredictions).map(([category, average]) => (
                <Typography
                  key={category}
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontWeight: category === mostExpensiveCategory ? 'bold' : 'normal',
                    color: category === mostExpensiveCategory ? red[500] : 'inherit', // Highlighting the most expensive category
                  }}
                >
                  {category}: Estimated Monthly Expense: ${average}
                </Typography>
              ))
            ) : (
              <Typography variant="body1">No predictions available.</Typography>
            )}
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default Account;
