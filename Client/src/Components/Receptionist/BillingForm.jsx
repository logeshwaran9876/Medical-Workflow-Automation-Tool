import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

import {
  FiDollarSign,
  FiUser,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiSave,
} from "react-icons/fi";
import { FaBed, FaPercentage } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const BillingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patients, setPatients] = useState([]);
  const [beds, setBeds] = useState([]);

  const [formData, setFormData] = useState({
    patient: "",
    bed: "",
    items: [],
    discount: 0,
    notes: "",
    dueDate: "",
    status: "draft",
  });

  const [newItem, setNewItem] = useState({
    description: "",
    quantity: 1,
    rate: 0,
    taxRate: 0,
    category: "other",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch patients and available beds
        const [patientsRes, bedsRes] = await Promise.all([
          axios.get(" http://localhost:5000/api/patients"),
          axios.get(" http://localhost:5000/api/beds"),
        ]);

        setPatients(patientsRes.data);
        setBeds(bedsRes.data.data);

        // If editing existing bill, fetch bill data
        if (id) {
          const billingRes = await axios.get(
            ` http://localhost:5000/api/billing/${id}`
          );
          setFormData({
            patient: billingRes.data.data.patient?._id || "",
            bed: billingRes.data.data.bed?._id || "",
            items: billingRes.data.data.items,
            discount: billingRes.data.data.discount,
            notes: billingRes.data.data.notes,
            dueDate: billingRes.data.data.dueDate
              ? new Date(billingRes.data.data.dueDate)
                  .toISOString()
                  .split("T")[0]
              : "",
            status: billingRes.data.data.status,
          });
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        toast.error("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const calculateItemAmount = (item) => {
    return item.quantity * item.rate * (1 + (item.taxRate || 0) / 100);
  };

  const addItem = () => {
    if (!newItem.description || newItem.rate <= 0) {
      toast.error("Please enter description and valid rate");
      return;
    }

    const amount = calculateItemAmount(newItem);

    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          ...newItem,
          amount,
        },
      ],
    });

    setNewItem({
      description: "",
      quantity: 1,
      rate: 0,
      taxRate: 0,
      category: "other",
    });
  };

  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patient) {
      toast.error("Please select a patient");
      return;
    }

    if (formData.items.length === 0 && formData.status !== "draft") {
      toast.error("Please add at least one item for generated bills");
      return;u
    }

    try {
      setSaving(true);

      const payload = {
        patientId: formData.patient,
        bedId: formData.bed || undefined,
        items: formData.items,
        discount: formData.discount,
        notes: formData.notes,
        dueDate: formData.dueDate || undefined,
      };

      if (id) {
        // Update existing bill
        await axios.put(` http://localhost:5000/api/billing/${id}`, payload);
        toast.success("Bill updated successfully");
      } else {
        // Create new bill
        await axios.post(" http://localhost:5000/api/billing", payload);
        toast.success("Bill created successfully");
      }

      navigate("/receptionist/billing");
    } catch (err) {
      console.error("Error saving bill:", err);
      toast.error(err.response?.data?.message || "Failed to save bill");
    } finally {
      setSaving(false);
    }
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? "Edit Bill" : "Create New Bill"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm overflow-hidden p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient *
            </label>
            <select
              value={formData.patient}
              onChange={(e) =>
                setFormData({ ...formData, patient: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select Patient</option>
              {Array.isArray(patients) &&
                patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} ({patient.contact})
                  </option>
                ))}
            </select>
          </div>

          {/* Bed Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bed Assignment
            </label>
            <select
              value={formData.bed}
              onChange={(e) =>
                setFormData({ ...formData, bed: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">No Bed Assignment</option>
              {Array.isArray(beds) &&
                beds.map((bed) => (
                  <option key={bed._id} value={bed._id}>
                    Bed {bed.bedNumber} ({bed.ward?.name || "Unknown Ward"})
                  </option>
                ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={!id} // Only allow status change when editing
            >
              <option value="draft">Draft</option>
              <option value="generated">Generated</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bill Items */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Bill Items</h2>

          {/* Add Item Form */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Item description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qty
              </label>
              <div className="flex">
                <button
                  type="button"
                  onClick={() =>
                    setNewItem({
                      ...newItem,
                      quantity: Math.max(1, newItem.quantity - 1),
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-100 hover:bg-gray-200"
                >
                  <FiMinus size={14} />
                </button>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quantity: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full border-t border-b border-gray-300 px-3 py-2 text-center"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() =>
                    setNewItem({ ...newItem, quantity: newItem.quantity + 1 })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-100 hover:bg-gray-200"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate (₹) *
              </label>
              <input
                type="number"
                value={newItem.rate}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    rate: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={newItem.taxRate}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      taxRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="0"
                />
                <FaPercentage className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={addItem}
                disabled={!newItem.description || newItem.rate <= 0}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <FiPlus className="mr-2" />
                Add Item
              </button>
            </div>
          </div>

          {/* Items Table */}
          {formData.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tax
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        ₹{item.rate.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {item.taxRate}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        ₹{item.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No items added to this bill
            </div>
          )}
        </div>

        {/* Discount and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
              placeholder="Additional notes about this bill..."
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Discount (₹)
              </label>
              <div className="w-32">
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  ₹
                  {formData.items
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-600">
                  -₹{formData.discount.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>
                    ₹
                    {(
                      formData.items.reduce(
                        (sum, item) => sum + item.amount,
                        0
                      ) - formData.discount
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/receptionist/billing")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
            disabled={saving}
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                {id ? "Update Bill" : "Create Bill"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingForm;
