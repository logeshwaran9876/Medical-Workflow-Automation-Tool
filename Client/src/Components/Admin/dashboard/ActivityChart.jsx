import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FiActivity } from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ActivityChart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6B7280' // gray-500
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280' // gray-500
        }
      },
      y: {
        grid: {
          color: '#E5E7EB' // gray-200
        },
        ticks: {
          color: '#6B7280' // gray-500
        }
      }
    }
  };

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Appointments',
        data: [12, 19, 15, 22, 18, 8, 5],
        backgroundColor: 'rgba(79, 70, 229, 0.7)', // indigo-600
        borderRadius: 6
      },
      {
        label: 'Procedures',
        data: [5, 8, 6, 10, 7, 3, 2],
        backgroundColor: 'rgba(99, 102, 241, 0.7)', // indigo-500
        borderRadius: 6
      }
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Weekly Activity</h3>
        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
          <FiActivity size={20} />
        </div>
      </div>
      <div className="h-64">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default ActivityChart;