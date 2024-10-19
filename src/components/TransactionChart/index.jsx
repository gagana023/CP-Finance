import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransactionChart = ({ transactions }) => {
  const incomeData = transactions
    .filter((transaction) => transaction.type === 'income')
    .map((transaction) => transaction.amount);

  const expenseData = transactions
    .filter((transaction) => transaction.type === 'expense')
    .map((transaction) => transaction.amount);

  const labels = transactions.map((transaction) => transaction.date);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expense',
        data: expenseData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income vs. Expense',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default TransactionChart;
