import React, { useState, useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { MdFilterList } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { TiDelete } from "react-icons/ti";
import Table from "../components/table/Table";
import AllEmployeeRow from "../components/table/rows/AllEmployeeRow";
import IconButton from "../components/buttons/IconButton";
import Modal from "../components/Modal/Modal";
import EmployeeStats from "../components/employee/EmployeeStats";
import toast from "react-hot-toast";
import {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
} from "../features/api/employeeApiSlice";

const tableLabels = [
  { title: "Name", sort: true },
  { title: "Email", sort: true },
  { title: "Employee ID", sort: true },
  { title: "Mobile", sort: true },
  { title: "Department", sort: true },
  { title: "Designation", sort: true },
  { title: "Status", sort: true },
  { title: "Joining Date", sort: true },
  { title: "Action", sort: false },
];

export default function AllEmployee() {
  // API queries
  const { data: employees = [], isLoading: employeesLoading, error: employeesError } = useGetEmployeesQuery();
  const { data: departments = [], isLoading: departmentsLoading } = useGetDepartmentsQuery();
  const { data: designations = [], isLoading: designationsLoading } = useGetDesignationsQuery();
  
  // API mutations
  const [createEmployee, { isLoading: creating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: updating }] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  // Local state
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    employee_id: '',
    mobile: '',
    department_id: '',
    designation_id: '',
    joining_date: '',
    status: true,
    image: ''
  });

  // Transform employees data for table
  const transformedEmployees = useMemo(() => {
    if (!employees || employees.length === 0) return [];
    
    return employees.map(employee => ({
      id: employee.id,
      name: {
        title: employee.name,
        image: employee.image || "/images/profile-photo.jpg",
        visibleCheckbox: true,
      },
      email: employee.email,
      employeeId: employee.employee_id,
      mobile: employee.mobile || "N/A",
      department: employee.department?.name || "N/A",
      designation: employee.designation?.title || "N/A",
      joiningDate: new Date(employee.joining_date).toLocaleDateString(),
      status: employee.status ? "Active" : "Inactive",
      rawData: employee // Keep original data for operations
    }));
  }, [employees]);

  // Filter employees based on search, status, and department
  const filteredEmployees = useMemo(() => {
    return transformedEmployees.filter((employee) => {
      const matchesSearch = employee.name.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || employee.status === statusFilter;
      
      const matchesDepartment = departmentFilter === "All" || employee.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [transformedEmployees, searchTerm, statusFilter, departmentFilter]);

  // Get unique departments for filter dropdown
  const uniqueDepartments = useMemo(() => {
    return [...new Set(transformedEmployees.map(emp => emp.department))].filter(d => d !== "N/A");
  }, [transformedEmployees]);

  // Event handlers
  const resetSelection = () => {
    setSelectedEmployees([]);
    setShowBulkActions(false);
  };

  const handleSelect = (item, e) => {
    if (e.target.checked) {
      const newSelection = [...selectedEmployees, item.id];
      setSelectedEmployees(newSelection);
      setShowBulkActions(newSelection.length > 0);
    } else {
      const newSelection = selectedEmployees.filter(id => id !== item.id);
      setSelectedEmployees(newSelection);
      setShowBulkActions(newSelection.length > 0);
    }
  };

  const selectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredEmployees.map(emp => emp.id);
      setSelectedEmployees(allIds);
      setShowBulkActions(true);
    } else {
      setSelectedEmployees([]);
      setShowBulkActions(false);
    }
  };

  // Function to update employee status
  const updateEmployeeStatus = async (id, newStatus) => {
    try {
      const employee = employees.find(emp => emp.id === id);
      if (!employee) return;

      const statusBoolean = newStatus === "Active";
      await updateEmployee({
        id,
        status: statusBoolean
      }).unwrap();
      
      toast.success(`Employee status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update employee status");
      console.error("Error updating employee status:", error);
    }
  };

  // Function to update multiple employee statuses
  const updateMultipleEmployeeStatuses = async (ids, newStatus) => {
    try {
      const statusBoolean = newStatus === "Active";
      const promises = ids.map(id => 
        updateEmployee({ id, status: statusBoolean }).unwrap()
      );
      
      await Promise.all(promises);
      toast.success(`${ids.length} employees updated to ${newStatus}`);
      resetSelection();
    } catch (error) {
      toast.error("Failed to update employee statuses");
      console.error("Error updating multiple employee statuses:", error);
    }
  };

  // Handler functions for edit and delete actions
  const handleEmployeeEdit = (employeeData) => {
    const employee = employeeData.rawData;
    setEditingEmployee(employee);
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      employee_id: employee.employee_id,
      mobile: employee.mobile || '',
      department_id: employee.department_id,
      designation_id: employee.designation_id,
      joining_date: employee.joining_date,
      status: employee.status,
      image: employee.image || ''
    });
    setShowAddModal(true);
  };

  const handleEmployeeDelete = async (employeeData) => {
    try {
      await deleteEmployee(employeeData.id).unwrap();
      toast.success("Employee deleted successfully");
    } catch (error) {
      toast.error("Failed to delete employee");
      console.error("Error deleting employee:", error);
    }
  };

  // Modal functions
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingEmployee(null);
    setNewEmployee({
      name: '',
      email: '',
      employee_id: '',
      mobile: '',
      department_id: '',
      designation_id: '',
      joining_date: '',
      status: true,
      image: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitEmployee = async (e) => {
    e.preventDefault();
    
    try {
      if (editingEmployee) {
        // Update employee
        await updateEmployee({
          id: editingEmployee.id,
          ...newEmployee
        }).unwrap();
        toast.success("Employee updated successfully");
      } else {
        // Create new employee
        await createEmployee(newEmployee).unwrap();
        toast.success("Employee created successfully");
      }
      handleCloseModal();
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to save employee";
      toast.error(errorMessage);
      console.error("Error saving employee:", error);
    }
  };

  // Bulk action handlers
  const handleBulkActivate = () => {
    updateMultipleEmployeeStatuses(selectedEmployees, "Active");
  };

  const handleBulkDeactivate = () => {
    updateMultipleEmployeeStatuses(selectedEmployees, "Inactive");
  };

  // Loading state
  if (employeesLoading || departmentsLoading || designationsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (employeesError) {
    return (
      <div className="text-center text-red-500 p-8">
        <h2 className="text-xl font-semibold mb-2">Error Loading Employees</h2>
        <p>{employeesError?.data?.message || "Failed to load employees"}</p>
      </div>
    );
  }

  return (
    <section className="px-6 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">All Employees</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all employee records</p>
        </div>
        <button onClick={() => setShowAddModal(true)}>
          <IconButton
            text="Add Employee"
            color="text-white"
            bg="bg-red-600"
            icon="/icons/plus-Icon.svg"
            className="hover:bg-red-700"
          />
        </button>
      </div>

      {/* Employee Stats Cards */}
      <EmployeeStats employees={employees} departments={departments} />

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {showBulkActions && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedEmployees.length} selected
              </span>
              <IconButton
                onClick={handleBulkActivate}
                className="bg-green-100 hover:bg-green-200 text-green-700"
                size="sm"
              >
                <TiTick className="w-4 h-4" />
              </IconButton>
              <IconButton
                onClick={handleBulkDeactivate}
                className="bg-red-100 hover:bg-red-200 text-red-700"
                size="sm"
              >
                <TiDelete className="w-4 h-4" />
              </IconButton>
              <button
                onClick={resetSelection}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table
          selectAll={selectAll}
          selectedData={selectedEmployees}
          dataSet={filteredEmployees.length}
          tableLabels={tableLabels}
          itemsPerPage={10}
          resetSelection={resetSelection}
        >
          {filteredEmployees.map((data) => (
            <AllEmployeeRow
              key={data.id}
              data={data}
              selectedData={selectedEmployees}
              selectRow={handleSelect}
              updateEmployeeStatus={updateEmployeeStatus}
              onEdit={handleEmployeeEdit}
              onDelete={handleEmployeeDelete}
            />
          ))}
        </Table>
      </div>

      {/* Add/Edit Employee Modal */}
      {showAddModal && (
        <Modal
          title={editingEmployee ? "Edit Employee" : "Add New Employee"}
          onClose={handleCloseModal}
        >
          <form onSubmit={handleSubmitEmployee} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID *
                </label>
                <input
                  type="text"
                  name="employee_id"
                  value={newEmployee.employee_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={newEmployee.mobile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  name="department_id"
                  value={newEmployee.department_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation *
                </label>
                <select
                  name="designation_id"
                  value={newEmployee.designation_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Designation</option>
                  {designations
                    .filter(des => !newEmployee.department_id || des.department_id == newEmployee.department_id)
                    .map(des => (
                    <option key={des.id} value={des.id}>{des.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joining Date *
                </label>
                <input
                  type="date"
                  name="joining_date"
                  value={newEmployee.joining_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={newEmployee.image}
                  onChange={handleInputChange}
                  placeholder="/images/profile-photo.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="status"
                checked={newEmployee.status}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Active Status
              </label>
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
                disabled={creating || updating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {creating || updating ? "Saving..." : editingEmployee ? "Update Employee" : "Create Employee"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
