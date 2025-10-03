import React, { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import Table from "../components/table/Table";
import SalarySettingsRow from "../components/table/rows/SalarySettingsRow";
import SalaryListRow from "../components/table/rows/SalaryListRow";
import Modal from "../components/Modal/Modal";
import {
  useGetSalaryStructuresQuery,
  useCreateSalaryStructureMutation,
  useUpdateSalaryStructureMutation,
  useDeleteSalaryStructureMutation,
} from "../features/api/salaryStructureApiSlice";
import {
  useGetEmployeeSalariesQuery,
  useCreateEmployeeSalaryMutation,
  useUpdateEmployeeSalaryMutation,
  useDeleteEmployeeSalaryMutation,
} from "../features/api/employeeSalariesApiSlice";
import { useGetIncrementsQuery } from "../features/api/incrementApi";

export default function Salary() {
  const [activeTab, setActiveTab] = useState('payslip'); // Changed to show payslip tab by default
  const [newComponent, setNewComponent] = useState({ name: '', percentage: '' });
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [editingPayslip, setEditingPayslip] = useState(null);
  const [showEditPayslipModal, setShowEditPayslipModal] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [payslipToShow, setPayslipToShow] = useState(null);
  // Payslip modal states
  const [showGeneratePayslipModal, setShowGeneratePayslipModal] = useState(false);
  const [showViewPayslipModal, setShowViewPayslipModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  
  const [payslipForm, setPayslipForm] = useState({
    employeeName: '',
    employeeId: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    overtimeHours: '',
    overtimeRate: '',
    bonus: '',
    month: '',
    year: ''
  });
  const [newSalary, setNewSalary] = useState({
    name: '',
    employee_id: '',
    salary: '',
    monthYear: '', // e.g., 'August 2025'
    status: 'pending'
  });
  const [showMissingSearchModal, setShowMissingSearchModal] = useState(false);

  // API hooks - Salary Structures
  const { data: salaryStructures = [], isLoading, error } = useGetSalaryStructuresQuery();
  const [createSalaryStructure] = useCreateSalaryStructureMutation();
  const [updateSalaryStructure] = useUpdateSalaryStructureMutation();
  const [deleteSalaryStructure] = useDeleteSalaryStructureMutation();

  // API hooks - Employee Salaries  
  const { 
    data: employeeSalaries = [], 
    isLoading: isLoadingEmployeeSalaries, 
    error: employeeSalariesError 
  } = useGetEmployeeSalariesQuery();
  const [createEmployeeSalary] = useCreateEmployeeSalaryMutation();
  const [updateEmployeeSalary] = useUpdateEmployeeSalaryMutation();
  const [deleteEmployeeSalary] = useDeleteEmployeeSalaryMutation();

  // API hooks - Increments (for getting current salary data)
  const { data: increments = [], isLoading: isLoadingIncrements } = useGetIncrementsQuery();

  // Merge employee salaries with increment data to ensure salary consistency
  const mergedSalaryData = useMemo(() => {
    if (!employeeSalaries.length || !increments.length) return employeeSalaries;
    
    return employeeSalaries.map(salaryRecord => {
      // Find the corresponding increment record by employee_id
      const incrementRecord = increments.find(inc => inc.employee_id === salaryRecord.employeeId);
      
      // If increment exists, use its salary as the authoritative source
      if (incrementRecord) {
        return {
          ...salaryRecord,
          salary: incrementRecord.salary, // Use increment salary as authoritative
        };
      }
      
      // If no increment record found, keep original salary
      return salaryRecord;
    });
  }, [employeeSalaries, increments]);

  // Debug logs
  console.log('🔍 Employee Salaries Debug:');
  console.log('- Data:', employeeSalaries);
  console.log('- Loading:', isLoadingEmployeeSalaries);
  console.log('- Error:', employeeSalariesError);
  console.log('- Data length:', employeeSalaries?.length);
  console.log('🔍 Increments Debug:');
  console.log('- Increments Data:', increments);
  console.log('- Loading Increments:', isLoadingIncrements);
  console.log('🔍 Merged Data Sample:');
  if (mergedSalaryData.length > 0) {
    const sample = mergedSalaryData[0];
    console.log('- Sample Record:', sample);
    console.log('- Salary:', sample.salary);
  }

  // Filter payslip records by employee name search
  const displayPayslipRecords = employeeSearch.trim()
    ? mergedSalaryData.filter(record =>
        record.name.toLowerCase().includes(employeeSearch.toLowerCase())
      )
    : mergedSalaryData;

  // Table headers for salary settings
  const salarySettingsLabels = [
    { title: "Name", sort: true },
    { title: "Percentage", sort: true },
    { title: "Action", sort: false },
  ];

  // Table headers for payslip records
  const payslipLabels = [
    { title: "Name", sort: true },
    { title: "Employee ID", sort: true },
    { title: "Month & Year", sort: true },
    { title: "Salary", sort: true },
    { title: "Status", sort: true },
    { title: "Action", sort: false },
  ];

  // Handle opening add modal
  const handleOpenAddModal = () => {
    setShowModal(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setShowModal(false);
    setNewComponent({ name: '', percentage: '' });
  };

  // Handle adding new salary component
  const handleAddComponent = async () => {
    if (newComponent.name && newComponent.percentage) {
      try {
        await createSalaryStructure({
          name: newComponent.name,
          percentage: parseInt(newComponent.percentage)
        }).unwrap();
        setNewComponent({ name: '', percentage: '' });
        setShowModal(false);
      } catch (error) {
        console.error('Failed to create salary structure:', error);
      }
    }
  };

  // Handle edit component
  const handleEditComponent = (component) => {
    setEditingComponent(component);
    setNewComponent({ name: component.name, percentage: component.percentage.toString() });
    setShowEditModal(true);
  };

  // Handle update component
  const handleUpdateComponent = async () => {
    if (newComponent.name && newComponent.percentage && editingComponent) {
      try {
        await updateSalaryStructure({
          id: editingComponent.id,
          name: newComponent.name,
          percentage: parseInt(newComponent.percentage)
        }).unwrap();
        setEditingComponent(null);
        setNewComponent({ name: '', percentage: '' });
        setShowEditModal(false);
      } catch (error) {
        console.error('Failed to update salary structure:', error);
      }
    }
  };

  // Handle delete component
  const handleDeleteComponent = async (component) => {
    try {
      await deleteSalaryStructure(component.id).unwrap();
    } catch (error) {
      console.error('Failed to delete salary structure:', error);
    }
  };

  // Handle close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingComponent(null);
    setNewComponent({ name: '', percentage: '' });
  };

  // Function to download table data as CSV
  const downloadPayslipData = () => {
    if (!payslipToShow) {
      setShowMissingSearchModal(true);
      return;
    }
    const payslipText =
      `Name: ${payslipToShow.name || payslipToShow.employeeName || ''}\n` +
      `Employee ID: ${payslipToShow.employee_id || payslipToShow.employeeId || ''}\n` +
      `Month & Year: ${payslipToShow.monthYear || payslipToShow.month_year || `${payslipToShow.month || ''} ${payslipToShow.year || ''}`}\n` +
      `Salary: ${payslipToShow.salary || payslipToShow.basicSalary || ''}\n` +
      `Adjustment Amount: ${payslipToShow.adjustment_amount || payslipToShow.adjustmentAmount || ''}\n` +
      `Adjustment Reason: ${payslipToShow.adjustment_reason || payslipToShow.adjustmentReason || ''}\n` +
      `After Adjustment Salary: ${payslipToShow.after_adjustment_salary || payslipToShow.afterAdjustmentSalary || ''}\n` +
      `Status: ${payslipToShow.status || ''}`;
    const textContent = "data:text/plain;charset=utf-8," + encodeURIComponent(payslipText);
    const link = document.createElement("a");
    link.setAttribute("href", textContent);
    link.setAttribute("download", "payslip.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle generating payslip - now downloads the table data

  // Handle showing payslip for selected employee
  const handleShowPayslip = () => {
    console.log('Show Payslip clicked');
    if (!employeeSearch.trim()) {
  setShowMissingSearchModal(true);
  return;
}
    
    // Find employee by name or ID
    const found = employeeSalaries.find(
      (record) => 
        record.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        record.employee_id.toLowerCase().includes(employeeSearch.toLowerCase())
    );
    
    if (found) {
      setPayslipToShow(found);
      setShowPayslipModal(true);
    } else {
  setShowMissingSearchModal(true);
}
  };

  // Handle closing generate payslip modal
  const handleCloseGeneratePayslipModal = () => {
    setShowGeneratePayslipModal(false);
    setPayslipForm({
      employeeName: '',
      employeeId: '',
      basicSalary: '',
      allowances: '',
      deductions: '',
      overtimeHours: '',
      overtimeRate: '',
      bonus: '',
      month: '',
      year: ''
    });
  };

  // Handle closing view payslip modal
  const handleCloseViewPayslipModal = () => {
    setShowViewPayslipModal(false);
    setSelectedPayslip(null);
  };

  // Handle payslip form input changes
  const handlePayslipFormChange = (e) => {
    const { name, value } = e.target;
    setPayslipForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle payslip form submission
  const handleSubmitPayslip = async (e) => {
    e.preventDefault();
    try {
      const basicSalary = parseFloat(payslipForm.basicSalary) || 0;
      const allowances = parseFloat(payslipForm.allowances) || 0;
      const deductions = parseFloat(payslipForm.deductions) || 0;
      const overtimeHours = parseFloat(payslipForm.overtimeHours) || 0;
      const overtimeRate = parseFloat(payslipForm.overtimeRate) || 0;
      const bonus = parseFloat(payslipForm.bonus) || 0;
      
      const overtimePay = overtimeHours * overtimeRate;
      const grossSalary = basicSalary + allowances + bonus + overtimePay;
      const netSalary = grossSalary - deductions;

      const newEmployeeSalary = {
        name: payslipForm.employeeName,
        employee_id: payslipForm.employeeId,
        salary: netSalary,
        adjustment_amount: bonus,
        adjustment_reason: 'Monthly Salary',
        after_adjustment_salary: netSalary,
        status: 'approved',
        month: payslipForm.month,
        year: payslipForm.year,
        basicSalary,
        allowances,
        deductions,
        overtimeHours,
        overtimeRate,
        overtimePay,
        grossSalary
      };
      
      await createEmployeeSalary(newEmployeeSalary).unwrap();
      alert('Payslip generated successfully!');
      handleCloseGeneratePayslipModal();
    } catch (error) {
      console.error('Error generating payslip:', error);
      alert('Error generating payslip. Please try again.');
    }
  };

  // Handle opening add salary modal
  const handleOpenSalaryModal = () => {
    setShowSalaryModal(true);
  };

  // Handle closing salary modal
  const handleCloseSalaryModal = () => {
    setShowSalaryModal(false);
    setNewSalary({
      name: '',
      employee_id: '',
      salary: '',
      monthYear: '',
      status: 'pending'
    });
  };

  // Handle adding new salary
  const handleAddSalary = async () => {
    if (newSalary.name && newSalary.employee_id && newSalary.salary && newSalary.monthYear) {
      try {
        await createEmployeeSalary({
          name: newSalary.name,
          employeeId: newSalary.employee_id,
          salary: parseFloat(newSalary.salary),
          monthYear: newSalary.monthYear,
          status: newSalary.status
        }).unwrap();
        handleCloseSalaryModal();
      } catch (error) {
        console.error('Failed to create employee salary:', error);
      }
    } else {
      alert('Please fill all required fields including Month & Year.');
    }
  };

  // Handle salary input changes
  const handleSalaryInputChange = (field, value) => {
    setNewSalary(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-populate salary from increment table when employee_id is selected
    if (field === 'employee_id' && value) {
      const incrementRecord = increments.find(inc => inc.employee_id === value);
      if (incrementRecord) {
        setNewSalary(prev => ({
          ...prev,
          [field]: value,
          salary: incrementRecord.salary.toString(), // Auto-populate from increment table
        }));
        return; // Early return to avoid double setting
      }
    }
  };

  // Handle edit payslip record
  const handleEditPayslip = (payslip) => {
    setEditingPayslip(payslip);
    setNewSalary({
      name: payslip.name,
      employee_id: payslip.employeeId,
      salary: payslip.salary.toString(),
      monthYear: payslip.monthYear || '',
      status: payslip.status
    });
    setShowEditPayslipModal(true);
  };

  // Handle update payslip record
  const handleUpdatePayslip = async () => {
    if (newSalary.name && newSalary.employee_id && newSalary.salary && newSalary.monthYear && editingPayslip) {
      try {
        await updateEmployeeSalary({
          id: editingPayslip.id,
          name: newSalary.name,
          employeeId: newSalary.employee_id,
          salary: parseFloat(newSalary.salary),
          monthYear: newSalary.monthYear,
          status: newSalary.status
        }).unwrap();
        setEditingPayslip(null);
        setNewSalary({
          name: '',
          employee_id: '',
          salary: '',
          monthYear: '',
          status: 'pending'
        });
        setShowEditPayslipModal(false);
      } catch (error) {
        console.error('Failed to update payslip record:', error);
      }
    } else {
      alert('Please fill all required fields including Month & Year.');
    }
  };

  // Handle delete payslip record
  const handleDeletePayslip = async (payslip) => {
    try {
      await deleteEmployeeSalary(payslip.id).unwrap();
    } catch (error) {
      console.error('Failed to delete payslip record:', error);
    }
  };

  // Handle close edit payslip modal
  const handleCloseEditPayslipModal = () => {
    setShowEditPayslipModal(false);
    setEditingPayslip(null);
    setNewSalary({
      name: '',
      employee_id: '',
      salary: '',
      status: 'pending'
    });
  };

  return (
    <section className="px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">
              Salary Management
            </h1>
            <p className="text-gray-600 mt-2">Manage salary settings, components, and payslip generation</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/payroll">
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Back to Payroll
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Salary Structure
          </button>
          <button
            onClick={() => setActiveTab('payslip')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'payslip'
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Salary List / Payslip
          </button>
        </div>
      </div>

      {/* Salary Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Add New Component Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Salary Component</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter component name"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Percentage *
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter percentage"
                  value={newComponent.percentage}
                  onChange={(e) => setNewComponent({...newComponent, percentage: e.target.value})}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleOpenAddModal}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add More
                </button>
              </div>
            </div>
          </div>

          {/* Salary Settings Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Salary Components</h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <span className="ml-3 text-gray-600">Loading salary components...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-2">Error loading salary components</div>
                  <div className="text-sm text-gray-500">
                    {error?.data?.message || error?.message || 'Something went wrong'}
                  </div>
                </div>
              ) : (
                <Table
                  tableLabels={salarySettingsLabels}
                  dataSet={salaryStructures.length}
                  itemsPerPage={10}
                  resetSelection={() => {}}
                >
                  {salaryStructures.map((setting) => (
                    <SalarySettingsRow
                      key={setting.id}
                      data={setting}
                      onEdit={handleEditComponent}
                      onDelete={handleDeleteComponent}
                    />
                  ))}
                </Table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Salary List / Payslip Tab */}
      {activeTab === 'payslip' && (
        <div className="space-y-6">
          {/* Employee Search Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Employee Payslip Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name or ID *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter employee name or ID"
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    if (displayPayslipRecords.length === 1) {
                      setPayslipToShow(displayPayslipRecords[0]);
                      setShowPayslipModal(true);
                    } else {
                      handleShowPayslip();
                    }
                  }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  View Payslip
                </button>
              </div>
              <div className="flex items-end">
                <button
                  onClick={downloadPayslipData}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Download Payslip
                </button>
              </div>
            </div>
          </div>

          {/* Payslip Records Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Payslip Records</h2>
              <button
                onClick={handleOpenSalaryModal}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Salary
              </button>
            </div>
            <div className="p-6">
              {isLoadingEmployeeSalaries || isLoadingIncrements ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500">Loading payslip records...</div>
                </div>
              ) : employeeSalariesError ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-red-500">Error loading payslip records. Please try again.</div>
                </div>
              ) : (
                <Table
                  tableLabels={payslipLabels}
                  dataSet={displayPayslipRecords.length}
                  itemsPerPage={10}
                  resetSelection={() => {}}
                >
                  {displayPayslipRecords.length > 0 ? (
                    displayPayslipRecords.map((record) => (
                      <SalaryListRow
                        key={record.id}
                        data={record}
                        onEdit={handleEditPayslip}
                        onDelete={handleDeletePayslip}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        No payslip records found. Click "Add Salary" to create your first record.
                      </td>
                    </tr>
                  )}
                </Table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Component Modal */}
      {showModal && (
        <Modal title="Add Salary Component" onClose={handleCloseModal}>
          <form onSubmit={(e) => { e.preventDefault(); handleAddComponent(); }} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="componentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Component Name
                </label>
                <input
                  id="componentName"
                  type="text"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter component name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="componentPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                  Percentage
                </label>
                <input
                  id="componentPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={newComponent.percentage}
                  onChange={(e) => setNewComponent({ ...newComponent, percentage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter percentage"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Add Component
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Component Modal */}
      {showEditModal && (
        <Modal title="Edit Salary Component" onClose={handleCloseEditModal}>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateComponent(); }} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="editComponentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Component Name
                </label>
                <input
                  id="editComponentName"
                  type="text"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter component name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="editComponentPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                  Percentage
                </label>
                <input
                  id="editComponentPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={newComponent.percentage}
                  onChange={(e) => setNewComponent({ ...newComponent, percentage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter percentage"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Update Component
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Salary Modal */}
      {showSalaryModal && (
        <Modal title="Add Employee Salary" onClose={handleCloseSalaryModal}>
          <form onSubmit={(e) => { e.preventDefault(); handleAddSalary(); }} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="salaryName" className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name
                </label>
                <input
                  id="salaryName"
                  type="text"
                  value={newSalary.name}
                  onChange={(e) => handleSalaryInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter employee name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="salaryEmployeeId" className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <input
                  id="salaryEmployeeId"
                  type="text"
                  value={newSalary.employee_id}
                  onChange={(e) => handleSalaryInputChange('employee_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter employee ID"
                  required
                />
              </div>

              <div>
                <label htmlFor="salaryAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Base Salary
                </label>
                <input
                  id="salaryAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newSalary.salary}
                  onChange={(e) => handleSalaryInputChange('salary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter base salary"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  💡 Salary will auto-populate from increment records when Employee ID is entered
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month & Year</label>
                <div className="flex space-x-2">
                  <select
                    value={newSalary.month || ''}
                    onChange={e => {
                      const month = e.target.value;
                      const year = newSalary.year || new Date().getFullYear();
                      handleSalaryInputChange('monthYear', `${month} ${year}`);
                      setNewSalary(prev => ({ ...prev, month, monthYear: `${month} ${year}` }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                  <select
                    value={newSalary.year || new Date().getFullYear()}
                    onChange={e => {
                      const year = e.target.value;
                      const month = newSalary.month || '';
                      handleSalaryInputChange('monthYear', `${month} ${year}`);
                      setNewSalary(prev => ({ ...prev, year, monthYear: `${month} ${year}` }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 5 }, (_, i) => {
                      const y = new Date().getFullYear() - 2 + i;
                      return <option key={y} value={y}>{y}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="salaryStatus" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="salaryStatus"
                  value={newSalary.status}
                  onChange={(e) => handleSalaryInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCloseSalaryModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Add Salary
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Payslip Record Modal */}
      {showEditPayslipModal && (
        <Modal title="Edit Payslip Record" onClose={handleCloseEditPayslipModal}>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdatePayslip(); }} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="editEmployeeName" className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name
                </label>
                <input
                  id="editEmployeeName"
                  type="text"
                  value={newSalary.name}
                  onChange={(e) => handleSalaryInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter employee name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="editEmployeeId" className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <input
                  id="editEmployeeId"
                  type="text"
                  value={newSalary.employee_id}
                  onChange={(e) => handleSalaryInputChange('employee_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter employee ID"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="editBaseSalary" className="block text-sm font-medium text-gray-700 mb-2">
                  Base Salary
                </label>
                <input
                  id="editBaseSalary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newSalary.salary}
                  onChange={(e) => handleSalaryInputChange('salary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter base salary"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  💡 Salary will auto-populate from increment records when Employee ID is entered
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month & Year</label>
                <div className="flex space-x-2">
                  <select
                    value={newSalary.month || (newSalary.monthYear ? newSalary.monthYear.split(' ')[0] : '')}
                    onChange={e => {
                      const month = e.target.value;
                      const year = newSalary.year || (newSalary.monthYear ? newSalary.monthYear.split(' ')[1] : new Date().getFullYear());
                      handleSalaryInputChange('monthYear', `${month} ${year}`);
                      setNewSalary(prev => ({ ...prev, month, monthYear: `${month} ${year}` }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                  <select
                    value={newSalary.year || (newSalary.monthYear ? newSalary.monthYear.split(' ')[1] : new Date().getFullYear())}
                    onChange={e => {
                      const year = e.target.value;
                      const month = newSalary.month || (newSalary.monthYear ? newSalary.monthYear.split(' ')[0] : '');
                      handleSalaryInputChange('monthYear', `${month} ${year}`);
                      setNewSalary(prev => ({ ...prev, year, monthYear: `${month} ${year}` }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 5 }, (_, i) => {
                      const y = new Date().getFullYear() - 2 + i;
                      return <option key={y} value={y}>{y}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="editStatus"
                  value={newSalary.status}
                  onChange={(e) => handleSalaryInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseEditPayslipModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Update Payslip
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Generate Payslip Modal */}
      {showGeneratePayslipModal && (
        <Modal 
          title="Generate Payslip" 
          onClose={handleCloseGeneratePayslipModal}
          size="large"
        >
          <form onSubmit={handleSubmitPayslip} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Name *
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={payslipForm.employeeName}
                  onChange={handlePayslipFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter employee name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID *
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={payslipForm.employeeId}
                  onChange={handlePayslipFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter employee ID"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Basic Salary *
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  value={payslipForm.basicSalary}
                  onChange={handlePayslipFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter basic salary"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowances
                </label>
                <input
                  type="number"
                  name="allowances"
                  value={payslipForm.allowances}
                  onChange={handlePayslipFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter allowances"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deductions
                </label>
                <input
                  type="number"
                  name="deductions"
                  value={payslipForm.deductions}
                  onChange={handlePayslipFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter deductions"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overtime Hours
                </label>
                <input
                  type="number"
                  name="overtimeHours"
                  value={payslipForm.overtimeHours}
                  onChange={handlePayslipFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter overtime hours"
                  min="0"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overtime Rate (per hour)
                </label>
                <input
                  type="number"
                  name="overtimeRate"
                  value={payslipForm.overtimeRate}
                  onChange={handlePayslipFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter overtime rate"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bonus
                </label>
                <input
                  type="number"
                  name="bonus"
                  value={payslipForm.bonus}
                  onChange={handlePayslipFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter bonus amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Salary Calculation Preview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Basic Salary:</span>
                  <span className="float-right font-medium">${payslipForm.basicSalary || '0.00'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Allowances:</span>
                  <span className="float-right font-medium">${payslipForm.allowances || '0.00'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Overtime Pay:</span>
                  <span className="float-right font-medium">
                    ${((parseFloat(payslipForm.overtimeHours) || 0) * (parseFloat(payslipForm.overtimeRate) || 0)).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Bonus:</span>
                  <span className="float-right font-medium">${payslipForm.bonus || '0.00'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Deductions:</span>
                  <span className="float-right font-medium text-red-600">-${payslipForm.deductions || '0.00'}</span>
                </div>
                <div className="border-t pt-2">
                  <span className="text-gray-900 font-semibold">Net Salary:</span>
                  <span className="float-right font-bold text-green-600">
                    ${(
                      (parseFloat(payslipForm.basicSalary) || 0) +
                      (parseFloat(payslipForm.allowances) || 0) +
                      (parseFloat(payslipForm.bonus) || 0) +
                      ((parseFloat(payslipForm.overtimeHours) || 0) * (parseFloat(payslipForm.overtimeRate) || 0)) -
                      (parseFloat(payslipForm.deductions) || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseGeneratePayslipModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                Generate Payslip
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Payslip Modal */}
      {showViewPayslipModal && selectedPayslip && (
        <Modal 
          title="View Payslip" 
          onClose={handleCloseViewPayslipModal}
          size="large"
        >
          <div className="space-y-6">
            {/* Payslip Header */}
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">PAYSLIP</h2>
              <p className="text-gray-600 mt-1">
                For the month of {selectedPayslip.monthYear || selectedPayslip.month_year || `${selectedPayslip.month || ''} ${selectedPayslip.year || ''}`}
              </p>
            </div>

            {/* Employee Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Employee Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee Name:</span>
                    <span className="font-medium">{selectedPayslip.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee ID:</span>
                    <span className="font-medium">{selectedPayslip.employee_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      selectedPayslip.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedPayslip.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Salary Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Basic Salary:</span>
                    <span className="font-medium">${selectedPayslip.basicSalary || selectedPayslip.salary}</span>
                  </div>
                  {selectedPayslip.allowances && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allowances:</span>
                      <span className="font-medium">${selectedPayslip.allowances}</span>
                    </div>
                  )}
                  {selectedPayslip.overtimePay && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overtime Pay:</span>
                      <span className="font-medium">${selectedPayslip.overtimePay}</span>
                    </div>
                  )}
                  {selectedPayslip.adjustment_amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adjustment:</span>
                      <span className="font-medium">${selectedPayslip.adjustment_amount}</span>
                    </div>
                  )}
                  {selectedPayslip.deductions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deductions:</span>
                      <span className="font-medium text-red-600">-${selectedPayslip.deductions}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Net Salary:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${selectedPayslip.after_adjustment_salary || selectedPayslip.salary}
                </span>
              </div>
            </div>

            {selectedPayslip.adjustment_reason && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Adjustment Reason:</h4>
                <p className="text-gray-600 bg-gray-50 p-2 rounded">{selectedPayslip.adjustment_reason}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleCloseViewPayslipModal}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Simple Payslip Modal */}
      {showPayslipModal && (
        <Modal title="Employee Payslip Details" onClose={() => setShowPayslipModal(false)}>
          <div className="p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Employee Payslip</h2>
            {payslipToShow ? (
              <div className="bg-gray-50 rounded-lg shadow p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b">
                    <span className="font-semibold text-gray-700">Name</span>
                    <span className="text-gray-900 mt-1 sm:mt-0">{payslipToShow.name || payslipToShow.employeeName || '-'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b">
                    <span className="font-semibold text-gray-700">Employee ID</span>
                    <span className="text-gray-900 mt-1 sm:mt-0">{payslipToShow.employee_id || payslipToShow.employeeId || '-'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b">
                    <span className="font-semibold text-gray-700">Month & Year</span>
                    <span className="text-gray-900 mt-1 sm:mt-0">{payslipToShow.monthYear || payslipToShow.month_year || `${payslipToShow.month || ''} ${payslipToShow.year || ''}`}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b">
                    <span className="font-semibold text-gray-700">Salary</span>
                    <span className="text-green-600 font-medium mt-1 sm:mt-0">${payslipToShow.salary || payslipToShow.basicSalary || '0.00'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b">
                    <span className="font-semibold text-gray-700">Adjustment Amount</span>
                    <span className={`font-medium mt-1 sm:mt-0 ${(Number(payslipToShow.adjustment_amount || payslipToShow.adjustmentAmount) >= 0 ? 'text-green-600' : 'text-red-600')}`}>
                      ${payslipToShow.adjustment_amount || payslipToShow.adjustmentAmount || '0.00'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b">
                    <span className="font-semibold text-gray-700">Adjustment Reason</span>
                    <span className="text-gray-900 mt-1 sm:mt-0">{payslipToShow.adjustment_reason || payslipToShow.adjustmentReason || '-'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b">
                    <span className="font-semibold text-gray-700">After Adjustment Salary</span>
                    <span className="text-2xl font-bold text-blue-600 mt-1 sm:mt-0">
                      ${payslipToShow.after_adjustment_salary || payslipToShow.afterAdjustmentSalary || payslipToShow.salary || '0.00'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                    <span className="font-semibold text-gray-700">Status</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium mt-1 sm:mt-0 ${
                      (payslipToShow.status || '').toLowerCase() === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : (payslipToShow.status || '').toLowerCase() === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payslipToShow.status || '-'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-red-500 p-8">
                No employee found with the provided name or ID.
              </div>
            )}
          </div>
        </Modal>
      )}
    {showMissingSearchModal && (
  <Modal title="Missing Employee Search" onClose={() => setShowMissingSearchModal(false)}>
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4 text-red-600">Missing Employee Information</h2>
      <p className="mb-6 text-gray-700">Please enter an employee name or ID to view or download a payslip.</p>
      <button
        onClick={() => setShowMissingSearchModal(false)}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
      >
        Close
      </button>
    </div>
  </Modal>
)}
    </section>
  );
}
