import React from 'react';
import { Bar } from 'react-chartjs-2'; // or any other chart library you are using

const TransactionCategoryChart = ({ categoryTotals }) => {
  const categories = Object.keys(categoryTotals);
  const earnings = categories.map(category => categoryTotals[category].earn);
  const expenses = categories.map(category => categoryTotals[category].expense);

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Earnings',
        data: earnings,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Expenses',
        data: expenses,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Transactions by Category</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TransactionCategoryChart;
