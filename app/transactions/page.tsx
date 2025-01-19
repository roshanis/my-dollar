import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { MonthlyExpense } from '@/types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default async function TransactionsPage() {
  // Fetch monthly expenses data from your database             
  const monthlyExpenses = await fetchMonthlyExpenses(); // You'll need to implement this

  const chartData = {
    labels: monthlyExpenses.map(item => item.month), // e.g., ['Jan', 'Feb', 'Mar'...]
    datasets: [{
      label: 'Monthly Expenses',
      data: monthlyExpenses.map(item => item._sum.amount),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Expenses Overview'
      }
    }
  };

  return (
    <div className="w-full">
      {/* Bar Chart Container */}
      <div className="w-full h-[300px] mb-8">
        <Bar options={options} data={chartData} />
      </div>
      
      {/* Existing transactions list */}
      {/* ... rest of your transactions page content ... */}
    </div>
  );
}

// Helper function to fetch monthly expenses
async function fetchMonthlyExpenses(): Promise<MonthlyExpense[]> {
  const response = await fetch('/api/monthly-expenses', {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch monthly expenses');
  }

  return response.json();
} 