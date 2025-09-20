import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Table from "../components/table/Table";
import IncrementRow from "../components/table/rows/IncrementRow";
import { useGetIncrementsQuery, useAddIncrementMutation, useUpdateIncrementMutation, useDeleteIncrementMutation } from "../features/api/incrementApi";
import { useGetEmployeesQuery } from "../features/api/employeeApi";

import Modal from "../components/Modal/Modal";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Increment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addValues, setAddValues] = useState({ employeeId: '', salary: '', lastIncrementDate: '' });
  const [addIncrement, { isLoading: adding }] = useAddIncrementMutation();
  // Add Increment Button
  const handleAddIncrement = () => {
    setShowAddModal(true);
    setAddValues({ employeeId: '', salary: '', lastIncrementDate: '' });
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addIncrement({
        employee_id: addValues.employeeId,
        salary: addValues.salary,
        last_increment_date: addValues.lastIncrementDate || ''
      }).unwrap();
      toast.success("Increment added successfully");
      setShowAddModal(false);
      setAddValues({ employeeId: '', salary: '', lastIncrementDate: '' });
    } catch {
      toast.error("Failed to add increment");
    }
  };

  const handleAddCancel = () => {
    setShowAddModal(false);
    setAddValues({ employeeId: '', salary: '', lastIncrementDate: '' });
  };
    const [editingIncrement, setEditingIncrement] = useState(null);
    const [newIncrement, setNewIncrement] = useState({ salary: '', lastIncrementDate: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingIncrement, setDeletingIncrement] = useState(null);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkValues, setBulkValues] = useState({ salary: '', lastIncrementDate: '' });

  const [updateIncrement, { isLoading: updating }] = useUpdateIncrementMutation();
  const [deleteIncrement] = useDeleteIncrementMutation();

  // Fetch increments and employees from backend
  const handleBulkIncrement = () => {
    setShowBulkModal(true);
    setBulkValues({ salary: '', lastIncrementDate: '' });
  };

  const handleBulkInputChange = (e) => {
    const { name, value } = e.target;
    setBulkValues(prev => ({ ...prev, [name]: value }));
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployees.length) return;
    try {
      await Promise.all(selectedEmployees.map(id =>
        updateIncrement({ id, salary: bulkValues.salary, last_increment_date: bulkValues.lastIncrementDate || '' }).unwrap()
      ));
      toast.success("Bulk increment applied successfully");
      setShowBulkModal(false);
      setBulkValues({ salary: '', lastIncrementDate: '' });
      setSelectedEmployees([]);
    } catch {
      toast.error("Bulk increment failed");
    }
  };

  const handleBulkCancel = () => {
    setShowBulkModal(false);
    setBulkValues({ salary: '', lastIncrementDate: '' });
  };
  const { data: increments = [], isLoading: incrementsLoading } = useGetIncrementsQuery();
  const { data: employees = [], isLoading: employeesLoading } = useGetEmployeesQuery();

  // Table headers for increment
  const incrementLabels = [
    { title: "Name", sort: true },
    { title: "Employee ID", sort: true },
    { title: "Email", sort: true },
    { title: "Mobile", sort: true },
    { title: "Joining Date", sort: true },
    { title: "Salary", sort: true },
    { title: "Last Increment Date", sort: true },
    { title: "Action", sort: false },
  ];

  // Merge increments with employee info
  const incrementData = useMemo(() => {
    if (!increments.length || !employees.length) return [];
    return increments.map((inc) => {
      const emp = inc.employee || employees.find(e => e.employee_id === inc.employee_id);
      return {
        id: inc.id,
        name: emp?.name || '',
        employeeId: inc.employee_id,
        email: emp?.email || '',
        mobile: emp?.mobile || '',
        joiningDate: emp?.joining_date || '',
        salary: inc.salary,
        lastIncrementDate: inc.last_increment_date,
        image: emp?.image || '',
      };
    });
  }, [increments, employees]);

  // Filter data based on search term
  const filteredData = incrementData.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit handler
  const handleEdit = (data) => {
    setEditingIncrement(data);
    setShowEditModal(true);
  };

  useEffect(() => {
    if (editingIncrement) {
      setNewIncrement({
        salary: editingIncrement.salary,
        last_increment_date: editingIncrement.lastIncrementDate || editingIncrement.last_increment_date || ''
      });
    }
  }, [editingIncrement]);

  // Delete handler
  const handleDelete = (data) => {
    setDeletingIncrement(data);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingIncrement) return;
    try {
      await deleteIncrement(deletingIncrement.id).unwrap();
      toast.success("Increment deleted successfully");
    } catch {
      toast.error("Failed to delete increment");
    }
    setShowDeleteModal(false);
    setDeletingIncrement(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingIncrement(null);
  };

  // Edit modal input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'lastIncrementDate') {
      setNewIncrement(prev => ({ ...prev, last_increment_date: value }));
    } else {
      setNewIncrement(prev => ({ ...prev, [name]: value }));
    }
  };

  // Edit modal submit
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: editingIncrement.id,
        salary: newIncrement.salary,
        last_increment_date: newIncrement.last_increment_date || ''
      };
      await updateIncrement(payload).unwrap();
      toast.success("Increment updated successfully");
      setShowEditModal(false);
      setEditingIncrement(null);
    } catch {
      toast.error("Failed to update increment");
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingIncrement(null);
    setNewIncrement({ salary: '', lastIncrementDate: '' });
  };
  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredData.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredData.map(emp => emp.id));
    }
  };

  // Reset selection
  const resetSelection = () => {
    setSelectedEmployees([]);
  };

  if (incrementsLoading || employeesLoading) {
    return <div className="p-8 text-center text-lg">Loading...</div>;
  }

  return (
    <section className="px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">
              Payroll - Increment
            </h1>
            <p className="text-gray-600 mt-2">Manage employee salary increments and adjustments</p>
          </div>
          <div className="flex space-x-3">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={handleAddIncrement}
          >
            Add Increment
          </button>
          <Link to="/payroll">
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Back to Payroll
            </button>
          </Link>
          </div>
        </div>
      </div>
  {/* Add Increment Modal */}
  {showAddModal && (
    <Modal title="Add Increment" onClose={handleAddCancel}>
      <form onSubmit={handleAddSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
          <input
            type="text"
            name="employeeId"
            value={addValues.employeeId}
            onChange={handleAddInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
          <input
            type="number"
            name="salary"
            value={addValues.salary}
            onChange={handleAddInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Increment Date</label>
          <input
            type="date"
            name="lastIncrementDate"
            value={addValues.lastIncrementDate}
            onChange={handleAddInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleAddCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={adding}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {adding ? "Saving..." : "Add Increment"}
          </button>
        </div>
      </form>
    </Modal>
  )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Salary</p>
              <p className="text-2xl font-bold text-gray-900">৳{
                (() => {
                  const validSalaries = filteredData.map(emp => Number(emp.salary)).filter(s => !isNaN(s));
                  if (validSalaries.length === 0) return 0;
                  return Math.round(validSalaries.reduce((sum, s) => sum + s, 0) / validSalaries.length).toLocaleString();
                })()
              }</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Highest Salary</p>
              <p className="text-2xl font-bold text-gray-900">৳{filteredData.length ? Math.max(...filteredData.map(emp => emp.salary)).toLocaleString() : 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{
                filteredData.filter(emp => {
                  if (!emp.lastIncrementDate) return false;
                  const date = new Date(emp.lastIncrementDate);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length
              }</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img src="/icons/search-icon.svg" alt="Search" className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {selectedEmployees.length > 0 && `${selectedEmployees.length} selected`}
            </span>
            <button
              className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center text-sm"
              onClick={handleBulkIncrement}
              disabled={!selectedEmployees.length}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Bulk Increment
            </button>
            <button
              className="px-3 py-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors flex items-center text-sm"
              onClick={handleAddIncrement}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Increment
            </button>
          </div>
        </div>
      </div>

      {/* Increment Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Employee Increment Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredData.length} of {incrementData.length} employees
          </p>
        </div>
        <div className="p-6">
          <Table
            tableLabels={incrementLabels}
            dataSet={filteredData.length}
            itemsPerPage={10}
            selectAll={handleSelectAll}
            selectedData={selectedEmployees}
            resetSelection={resetSelection}
          >
            {filteredData.map((employee) => (
              <IncrementRow
                key={employee.id}
                data={employee}
                selectRow={() => handleSelectEmployee(employee.id)}
                selectedData={selectedEmployees}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </Table>
        </div>
      </div>
      {/* Edit Increment Modal */}
      {showEditModal && (
        <Modal title="Edit Increment" onClose={handleCloseModal}>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
              <input
                type="number"
                name="salary"
                value={newIncrement.salary}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Increment Date</label>
              <input
                type="date"
                name="lastIncrementDate"
                value={newIncrement.last_increment_date || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {updating ? "Saving..." : "Update Increment"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal title="Delete Increment" onClose={cancelDelete}>
          <div className="space-y-4">
            <p className="text-gray-700">Are you sure you want to delete this increment record?</p>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* Bulk Increment Modal */}
      {showBulkModal && (
        <Modal title="Bulk Increment" onClose={handleBulkCancel}>
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
              <input
                type="number"
                name="salary"
                value={bulkValues.salary}
                onChange={handleBulkInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Increment Date</label>
              <input
                type="date"
                name="lastIncrementDate"
                value={bulkValues.lastIncrementDate}
                onChange={handleBulkInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleBulkCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Apply
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
