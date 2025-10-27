import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiDollarSign, FiCalendar, FiUser, FiPhone, FiCreditCard, 
  FiFilter, FiPieChart, FiPlus, FiCheck 
} from 'react-icons/fi';
import { 
  FaBed, FaRegMoneyBillAlt, FaFileInvoiceDollar, FaSearch 
} from 'react-icons/fa';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const BillingDashboard = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    patient: '',
    dateRange: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(),
      key: 'selection'
    }
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.patient) params.append('patientId', filters.patient);
        if (filters.dateRange.startDate) params.append('fromDate', filters.dateRange.startDate.toISOString());
        if (filters.dateRange.endDate) params.append('toDate', filters.dateRange.endDate.toISOString());
        
        const billingRes = await axios.get(`http://localhost:5000/api/billing?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        setBillings(billingRes.data.data);
        const statsRes = await axios.get('http://localhost:5000/api/billing/summary', {
            headers: { Authorization: `Bearer ${token}` },
          });
        setStats(statsRes.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load billing data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filters]);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    generated: 'bg-blue-100 text-blue-800',
    partial: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-purple-100 text-purple-800',
    refunded: 'bg-pink-100 text-pink-800',
    completed: 'bg-green-100 text-green-800'
  };

  const handleDateSelect = (ranges) => {
    setFilters({
      ...filters,
      dateRange: ranges.selection
    });
    setShowDatePicker(false);
  };

  const filteredBillings = Array.isArray(billings)
    ? billings.filter(billing => {
        const searchLower = searchQuery.toLowerCase();
        return (
          billing.patient?.name?.toLowerCase().includes(searchLower) ||
          billing.bed?.bedNumber?.toLowerCase().includes(searchLower) ||
          billing._id?.toLowerCase().includes(searchLower)
        );
      })
    : [];
  const isBillPaid = (billing) => {
    return Math.abs(billing.paidAmount - billing.totalAmount) < 0.01;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Billing Management</h1>
        <button 
          onClick={() => navigate('/receptionist/billing/new')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-colors flex items-center"
        >
          <FiPlus className="mr-2" />
          Create New Bill
        </button>
      </div>

      {}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Billed</p>
                <p className="text-2xl font-bold text-gray-800">₹{stats.totalBilled.toLocaleString()}</p>
              </div>
              <FiDollarSign className="text-blue-500 text-xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Paid</p>
                <p className="text-2xl font-bold text-gray-800">₹{stats.totalPaid.toLocaleString()}</p>
              </div>
              <FaRegMoneyBillAlt className="text-green-500 text-xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Outstanding</p>
                <p className="text-2xl font-bold text-gray-800">₹{stats.totalOutstanding.toLocaleString()}</p>
              </div>
              <FiCreditCard className="text-red-500 text-xl" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bills</p>
                <p className="text-2xl font-bold text-gray-800">{stats.count}</p>
              </div>
              <FiPieChart className="text-indigo-500 text-xl" />
            </div>
          </div>
        </div>
      )}

      {}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by patient, bed, or invoice #"
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="generated">Generated</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiCalendar className="mr-2" />
              Date Range
            </button>
          </div>
        </div>
        
        {showDatePicker && (
          <div className="mt-4 z-10">
            <DateRangePicker
              ranges={[filters.dateRange]}
              onChange={handleDateSelect}
              className="shadow-lg"
            />
          </div>
        )}
      </div>

      {}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 p-4 font-medium text-gray-700 border-b">
          <div className="col-span-3 md:col-span-2">Invoice #</div>
          <div className="col-span-4 md:col-span-3">Patient</div>
          <div className="hidden md:block md:col-span-2">Bed</div>
          <div className="hidden md:block md:col-span-2">Date</div>
          <div className="col-span-3 md:col-span-2">Amount</div>
          <div className="col-span-2 md:col-span-1">Status</div>
        </div>

        {filteredBillings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No billing records found
          </div>
        ) : (
          filteredBillings.map((billing) => {
            const isPaid = isBillPaid(billing);
            const displayStatus = isPaid ? 'completed' : billing.status;
            
            return (
              <div 
                key={billing._id}
                className={`grid grid-cols-12 items-center p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer ${
                  isPaid ? 'bg-green-50 hover:bg-green-100' : ''
                }`}
                onClick={() => navigate(`/receptionist/billing/${billing._id}`)}
              >
                <div className="col-span-3 md:col-span-2 font-mono text-sm text-indigo-600 flex items-center">
                  {billing._id.substring(18, 24).toUpperCase()}
                  {isPaid && <FiCheck className="ml-2 text-green-500" />}
                </div>
                <div className="col-span-4 md:col-span-3">
                  <div className="font-medium">{billing.patient?.name}</div>
                  <div className="text-xs text-gray-500">{billing.patient?.contact}</div>
                </div>
                <div className="hidden md:block md:col-span-2">
                  {billing.bed ? (
                    <div className="flex items-center">
                      <FaBed className="text-gray-500 mr-1" size={12} />
                      <span>{billing.bed.bedNumber}</span>
                    </div>
                  ) : 'N/A'}
                </div>
                <div className="hidden md:block md:col-span-2 text-sm text-gray-500">
                  {new Date(billing.billingDate).toLocaleDateString()}
                </div>
                <div className="col-span-3 md:col-span-2">
                  <div className="font-medium">₹{billing.totalAmount.toFixed(2)}</div>
                  {billing.paidAmount > 0 && (
                    <div className={`text-xs ${
                      isPaid ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      Paid: ₹{billing.paidAmount.toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="col-span-2 md:col-span-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    statusColors[displayStatus]
                  }`}>
                    {displayStatus}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BillingDashboard;