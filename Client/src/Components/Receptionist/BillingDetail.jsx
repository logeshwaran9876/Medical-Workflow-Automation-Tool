import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiDollarSign, FiCalendar, FiUser, FiPhone, FiCreditCard, 
  FiPrinter, FiEdit, FiTrash2, FiPlus, FiMinus 
} from 'react-icons/fi';
import { 
  FaBed, FaRegMoneyBillAlt, FaFileInvoice, FaPercentage,
  FaReceipt, FaHistory 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf' }, // regular
    { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc9.ttf', fontWeight: 'bold' }
  ]
});
const InvoicePDF = ({ billing }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Helvetica'
    },
    header: {
      marginBottom: 20,
      borderBottom: 1,
      paddingBottom: 10
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5
    },
    invoiceNumber: {
      fontSize: 12,
      color: '#666'
    },
    section: {
      marginBottom: 20
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      backgroundColor: '#f0f0f0',
      padding: 5
    },
    row: {
      flexDirection: 'row',
      marginBottom: 5
    },
    label: {
      width: 100,
      fontSize: 12,
      fontWeight: 'bold'
    },
    value: {
      fontSize: 12
    },
    table: {
      width: '100%',
      marginTop: 10
    },
    tableHeader: {
      flexDirection: 'row',
      borderBottom: 1,
      paddingBottom: 5,
      marginBottom: 5,
      fontWeight: 'bold'
    },
    tableRow: {
      flexDirection: 'row',
      borderBottom: 1,
      paddingBottom: 5,
      marginBottom: 5
    },
    col1: { width: '40%' },
    col2: { width: '15%' },
    col3: { width: '15%' },
    col4: { width: '15%' },
    col5: { width: '15%' },
    summary: {
      marginTop: 20,
      borderTop: 1,
      paddingTop: 10
    },
    total: {
      fontSize: 14,
      fontWeight: 'bold'
    },
    notes: {
      marginTop: 20,
      fontSize: 10,
      color: '#666'
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>
            #{billing._id.substring(18, 24).toUpperCase()}
          </Text>
          <Text style={styles.invoiceNumber}>
            Date: {new Date(billing.billingDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billed To</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{billing.patient?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>{billing.patient?.contact}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Age/Gender:</Text>
            <Text style={styles.value}>
              {billing.patient?.age} years, {billing.patient?.gender}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Condition:</Text>
            <Text style={styles.value}>{billing.patient?.condition || 'N/A'}</Text>
          </View>
        </View>

        {billing.bed && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bed Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Bed Number:</Text>
              <Text style={styles.value}>{billing.bed.bedNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Ward:</Text>
              <Text style={styles.value}>
                {billing.bed.ward?.name} ({billing.bed.ward?.type})
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Rate:</Text>
              <Text style={styles.value}>₹{billing.bed.ratePerDay} per day</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Description</Text>
              <Text style={styles.col2}>Qty</Text>
              <Text style={styles.col3}>Rate</Text>
              <Text style={styles.col4}>Tax</Text>
              <Text style={styles.col5}>Amount</Text>
            </View>
            {billing.items?.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>{item.description}</Text>
                <Text style={styles.col2}>{item.quantity}</Text>
                <Text style={styles.col3}>₹{item.rate.toFixed(2)}</Text>
                <Text style={styles.col4}>{item.taxRate}%</Text>
                <Text style={styles.col5}>₹{item.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.summary}>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal:</Text>
            <Text style={styles.value}>₹{billing.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax:</Text>
            <Text style={styles.value}>₹{billing.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discount:</Text>
            <Text style={styles.value}>₹{billing.discount.toFixed(2)}</Text>
          </View>
          <View style={[styles.row, styles.total]}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>₹{billing.totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Paid Amount:</Text>
            <Text style={styles.value}>₹{billing.paidAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.row, styles.total]}>
            <Text style={styles.label}>Balance Due:</Text>
            <Text style={styles.value}>
              ₹{(billing.totalAmount - billing.paidAmount).toFixed(2)}
            </Text>
          </View>
        </View>

        {billing.notes && (
          <View style={styles.notes}>
            <Text>Notes: {billing.notes}</Text>
          </View>
        )}

        <View style={styles.notes}>
          <Text>Thank you for your business!</Text>
          <Text>Generated on: {new Date().toLocaleString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

const BillingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [editMode, setEditMode] = useState(false);
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    rate: 0,
    taxRate: 0,
    discount: 0,
    category: 'other'
  });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/billing/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        const data = await response.json();
        setBilling(data.data);
      } catch (err) {
        console.error('Error fetching billing:', err);
        toast.error('Failed to load billing details');
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, [id]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentAmount || isNaN(paymentAmount) || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/billing/${id}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          paymentMethod,
          notes: 'Payment received'
        }),
      });
      const updatedBilling = await response.json();
      setBilling(updatedBilling.data);
      setPaymentAmount('');
      toast.success('Payment recorded successfully');
    } catch (err) {
      console.error('Error submitting payment:', err);
      toast.error(err.response?.data?.message || 'Failed to record payment');
    }
  };

  const handleAddItem = async () => {
    if (!newItem.description || newItem.rate <= 0) {
      toast.error('Please enter description and valid rate');
      return;
    }

    try {
      const amount = newItem.quantity * newItem.rate * (1 - newItem.discount / 100) * (1 + newItem.taxRate / 100);
      
      const response = await fetch(`http://localhost:5000/api/billing/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: [...billing.items, {
            ...newItem,
            amount: parseFloat(amount.toFixed(2))
          }]
        }),
      });
      const updatedBilling = await response.json();
      setBilling(updatedBilling.data);
      setNewItem({
        description: '',
        quantity: 1,
        rate: 0,
        taxRate: 0,
        discount: 0,
        category: 'other'
      });
      toast.success('Item added successfully');
    } catch (err) {
      console.error('Error adding item:', err);
      toast.error(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleRemoveItem = async (index) => {
    try {
      const updatedItems = [...billing.items];
      updatedItems.splice(index, 1);
      
      const response = await fetch(`http://localhost:5000/api/billing/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: updatedItems
        }),
      });
      const updatedBilling = await response.json();
      setBilling(updatedBilling.data);
      toast.success('Item removed successfully');
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleUpdateDiscount = async (discount) => {
    try {
      const response = await fetch(`http://localhost:5000/api/billing/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          discount: parseFloat(discount)
        }),
      });
      const updatedBilling = await response.json();
      setBilling(updatedBilling.data);
      toast.success('Discount updated successfully');
    } catch (err) {
      console.error('Error updating discount:', err);
      toast.error(err.response?.data?.message || 'Failed to update discount');
    }
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    generated: 'bg-blue-100 text-blue-800',
    partial: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-purple-100 text-purple-800',
    refunded: 'bg-pink-100 text-pink-800'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!billing) {
    return <div className="p-8 text-center text-gray-500">Billing record not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Invoice Details</h1>
          <div className="flex items-center mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[billing.status]}`}>
              {billing.status}
            </span>
            <span className="ml-4 text-gray-500 text-sm">
              Created: {new Date(billing.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setEditMode(!editMode)}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <FiEdit className="mr-2" />
            {editMode ? 'Cancel Edit' : 'Edit Invoice'}
          </button>
          <PDFDownloadLink
            document={<InvoicePDF billing={billing} />}
            fileName={`invoice-${billing._id.substring(18, 24).toUpperCase()}.pdf`}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            {({ loading }) => (
              <>
                <FiPrinter className="mr-2" />
                {loading ? 'Preparing document...' : 'Print Invoice'}
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-800">INVOICE</h2>
                <p className="text-gray-500">#{billing._id.substring(18, 24).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Billing Date</p>
                <p className="font-medium">{new Date(billing.billingDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Billed To</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{billing.patient?.name}</p>
                  <p className="text-gray-500">{billing.patient?.contact}</p>
                  <p className="text-gray-500">{billing.patient?.age} years, {billing.patient?.gender}</p>
                  <p className="text-gray-500 mt-2">{billing.patient?.condition}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Bed Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {billing.bed ? (
                    <>
                      <p className="font-medium">Bed {billing.bed.bedNumber}</p>
                      <p className="text-gray-500">{billing.bed.ward?.name} ({billing.bed.ward?.type})</p>
                      <p className="text-gray-500">₹{billing.bed.ratePerDay} per day</p>
                    </>
                  ) : (
                    <p className="text-gray-500">No bed assigned</p>
                  )}
                </div>
              </div>
            </div>

            {}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Invoice Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      {editMode && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {billing.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{item.rate.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.taxRate}%</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.discount}%</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{item.amount.toFixed(2)}</td>
                        {editMode && (
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <button 
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {}
            {editMode && (
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                  <FiPlus className="mr-2" />
                  Add New Item
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <input
                      type="text"
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Item description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹) *</label>
                    <input
                      type="number"
                      value={newItem.rate}
                      onChange={(e) => setNewItem({...newItem, rate: parseFloat(e.target.value) || 0})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={newItem.taxRate}
                        onChange={(e) => setNewItem({...newItem, taxRate: parseFloat(e.target.value) || 0})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0"
                      />
                      <FaPercentage className="absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={newItem.discount}
                      onChange={(e) => setNewItem({...newItem, discount: parseFloat(e.target.value) || 0})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.description}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Add Item
                </button>
              </div>
            )}

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={billing.notes || ''}
                  readOnly={!editMode}
                  onChange={(e) => setBilling({...billing, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                  placeholder="Additional notes about this bill..."
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Discount (₹)</label>
                  {editMode ? (
                    <div className="w-32">
                      <input
                        type="number"
                        value={billing.discount}
                        onChange={(e) => handleUpdateDiscount(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  ) : (
                    <span className="font-medium">₹{billing.discount.toFixed(2)}</span>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{billing.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">₹{billing.tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-red-600">-₹{billing.discount.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Amount:</span>
                      <span>₹{billing.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-green-600 mb-1">
                    <span>Paid Amount:</span>
                    <span>₹{billing.paidAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Balance Due:</span>
                    <span>₹{(billing.totalAmount - billing.paidAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div>
          {billing.status !== 'paid' && billing.status !== 'cancelled' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="bg-indigo-600 p-4 text-white flex items-center">
                <FaRegMoneyBillAlt className="mr-2" />
                <h3 className="font-medium">Record Payment</h3>
              </div>
              <div className="p-4">
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0.01"
                      max={(billing.totalAmount - billing.paidAmount).toFixed(2)}
                      step="0.01"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum: ₹{(billing.totalAmount - billing.paidAmount).toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="insurance">Insurance</option>
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <FaReceipt className="mr-2" />
                    Record Payment
                  </button>
                </form>
              </div>
            </div>
          )}

          {}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-indigo-600 p-4 text-white flex items-center">
              <FaHistory className="mr-2" />
              <h3 className="font-medium">Payment History</h3>
            </div>
            <div className="p-4">
              {billing.payments?.length > 0 ? (
                <div className="space-y-3">
                  {billing.payments.map((payment, index) => (
                    <div key={index} className="border-l-4 border-indigo-500 pl-3 py-2">
                      <div className="flex justify-between">
                        <span className="font-medium">₹{payment.amount.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{payment.paymentMethod}</span>
                        {payment.transactionId && (
                          <span className="font-mono">#{payment.transactionId.substring(0, 6)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No payment history available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDetail;