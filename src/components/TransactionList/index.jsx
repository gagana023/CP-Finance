import React from 'react';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

const TransactionList = ({ transactions }) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
       Transactions
      </Typography>
      <List>
        {transactions.map((transaction, index) => (
          <div key={index}>
            <ListItem>
              <ListItemText
                primary={`${transaction.type === 'income' ? '+' : '-'} $${transaction.amount}`}
                secondary={`${transaction.category} | ${transaction.date}`}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
};

export default TransactionList;
