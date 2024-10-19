import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { db } from '../../pages/firebase'; // Import your firebase config
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Auth methods

const TransactionForm = ({onClose}) => {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(dayjs());
  const [user, setUser] = useState(null); // To hold the logged-in user

  const auth = getAuth(); // Initialize Firebase Authentication

  useEffect(() => {
    // Check the authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add a transaction.");
      return;
    }

    const transaction = {
      type,
      amount: parseFloat(amount),
      category,
      date: date.format('YYYY-MM-DD'),
      userId: user.uid, // Optional: store the user's ID with the transaction
    };

    try {
      // Add transaction to Firestore
      await addDoc(collection(db, 'transactions'), transaction);
      // Reset form fields
      setAmount('');
      setCategory('');
      setDate(dayjs());
      onClose(true)
      alert('Transaction added successfully!'); // Optional: add success feedback
    } catch (error) {
      console.error("Error adding transaction: ", error); // Handle error appropriately
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

      <TextField
        fullWidth
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        margin="normal"
        required
      />

      <LocalizationProvider dateAdapter={AdapterDayjs} >
        <DatePicker
            sx={{width: '100%', mt: 2}}
          label="Date"
          value={date}
          className="mt-2"
          onChange={(newValue) => setDate(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
        />
      </LocalizationProvider>

      <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
        Add Transaction
      </Button>
    </Box>
  );
};

export default TransactionForm;
