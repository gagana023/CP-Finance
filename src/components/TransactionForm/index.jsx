import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, Box, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { db } from '../../pages/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {categories} from '../../helpers/constacts';

const TransactionForm = ({ onClose, transaction, triggerToast = ()=> {} }) => {
  const [type, setType] = useState(transaction?.type || 'income'); // Prefill if transaction exists
  const [amount, setAmount] = useState(transaction?.amount || '');
  const [category, setCategory] = useState(transaction?.category || '');
  const [date, setDate] = useState(transaction ? dayjs(transaction.date) : dayjs());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to add or edit a transaction."); // Show error toast
      return;
    }

    const transactionData = {
      type,
      amount: parseFloat(amount),
      category,
      date: date.format('YYYY-MM-DD'),
      userId: user.uid,
    };

    setLoading(true); // Start loading

    try {
      if (transaction) {
        // If editing, update the transaction in Firestore
        const transactionDocRef = doc(db, 'transactions', transaction.id);
        await updateDoc(transactionDocRef, transactionData);
        triggerToast('success', 'Transaction updated successfully!')
      } else {
        // If adding a new transaction
        await addDoc(collection(db, 'transactions'), transactionData);
        triggerToast('success', 'Transaction added successfully!')
      }

      // Reset form fields
      setAmount('');
      setCategory('');
      setDate(dayjs());
      onClose(true); // Close form and refresh list
     
    } catch (error) {
      console.error("Error submitting transaction: ", error);
      toast.error("Error submitting transaction."); // Show error toast
      triggerToast('error', 'Error submitting transaction.')
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ my: 2, maxWidth: '400px', margin: 'auto' }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        margin="normal"
        required
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
          {categories.map((cat, index) => (
            <MenuItem key={index} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{ width: '100%', mt: 2 }}
          label="Date"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
        />
      </LocalizationProvider>

      <Button 
        variant="contained" 
        color="primary" 
        type="submit" 
        fullWidth 
        sx={{ mt: 2 }}
        disabled={loading} // Disable button while loading
      >
        {loading ? <CircularProgress size={24} /> : (transaction ? 'Update Transaction' : 'Add Transaction')}
      </Button>

      
    </Box>
  );
};

export default TransactionForm;
