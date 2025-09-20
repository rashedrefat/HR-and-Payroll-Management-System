import React, { useState } from 'react';
import Modal from "../components/Modal/Modal";
import toast from "react-hot-toast";
import { useAddDepartmentMutation, useUpdateDepartmentMutation, useDeleteDepartmentMutation } from "../features/api/departmentApi";
import { useGetDepartmentsQuery } from "../features/api/departmentApi";
import { Link } from "react-router-dom";
import Table from "../components/table/Table";
import DepartmentRow from "../components/table/rows/DepartmentRow";
import RoleRow from "../components/table/rows/RoleRow";
import { useGetDesignationsQuery, useAddDesignationMutation, useUpdateDesignationMutation, useDeleteDesignationMutation } from "../features/api/designationApi";

export default function EmployeeSettings() {
  // Add department modal submit handler
  const handleDeptFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept && editingDept.id) {
        await updateDepartment({ id: editingDept.id, ...deptForm }).unwrap();
        toast.success("Department updated successfully");
      } else {
        await addDepartment(deptForm).unwrap();
        toast.success("Department created successfully");
      }
      handleDeptModalClose();
    } catch {
      toast.error("Failed to save department");
    }
  };
  // Modal and department state
  // Department modal state
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm, setDeptForm] = useState({ name: "", description: "", status: true });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDept, setDeletingDept] = useState(null);

  // Designation modal state
  const [showDesigModal, setShowDesigModal] = useState(false);
  const [editingDesig, setEditingDesig] = useState(null);
  const [desigForm, setDesigForm] = useState({ title: "", description: "", status: true, department_id: "" });
  const [showDeleteDesigModal, setShowDeleteDesigModal] = useState(false);
  const [deletingDesig, setDeletingDesig] = useState(null);

  // Designation mutations
  const [addDesignation, { isLoading: addingDesig }] = useAddDesignationMutation();
  const [updateDesignation, { isLoading: updatingDesig }] = useUpdateDesignationMutation();
  const [deleteDesignation] = useDeleteDesignationMutation();
  // Designation modal handlers
  const handleDesigEdit = (desig) => {
    setEditingDesig(desig);
    setDesigForm({
      title: desig.title,
      description: desig.level !== "N/A" ? desig.level : "",
      status: desig.status === "Active" ? true : false,
      department_id: desig.department_id || "",
    });
    setShowDesigModal(true);
  };

  const handleDesigDelete = (desig) => {
    setDeletingDesig(desig);
    setShowDeleteDesigModal(true);
  };

  const handleDeleteDesigModalClose = () => {
    setShowDeleteDesigModal(false);
    setDeletingDesig(null);
  };

  const handleDeleteDesigConfirm = async () => {
    if (!deletingDesig) return;
    try {
      await deleteDesignation(deletingDesig.id).unwrap();
      toast.success("Designation deleted successfully");
      handleDeleteDesigModalClose();
    } catch {
      toast.error("Failed to delete designation");
    }
  };

  const handleDesigModalClose = () => {
    setShowDesigModal(false);
    setEditingDesig(null);
    setDesigForm({ title: "", description: "", status: true, department_id: "" });
  };

  const handleDesigInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDesigForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDesigFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDesig && editingDesig.id) {
        await updateDesignation({ id: editingDesig.id, ...desigForm }).unwrap();
        toast.success("Designation updated successfully");
      } else {
        await addDesignation(desigForm).unwrap();
        toast.success("Designation created successfully");
      }
      handleDesigModalClose();
    } catch {
      toast.error("Failed to save designation");
    }
  };

  // Mutations
  const [addDepartment, { isLoading: addingDept }] = useAddDepartmentMutation();
  const [updateDepartment, { isLoading: updatingDept }] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();
  const [activeTab, setActiveTab] = useState('departments');

  // Fetch departments from backend
  const {
    data: departments = [],
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  // error: departmentsError,
  } = useGetDepartmentsQuery();

  // Fetch designations from backend
  const {
    data: designations = [],
    isLoading: isDesignationsLoading,
    isError: isDesignationsError,
  // error: designationsError,
  } = useGetDesignationsQuery();

  // Table headers for departments
  const departmentLabels = [
  { title: "Name", sort: true },
  { title: "Description", sort: true },
  { title: "Status", sort: true },
  { title: "Action", sort: false },
  ];

  // Table headers for roles
  const roleLabels = [
  { title: "Title", sort: true },
  { title: "Department", sort: true },
  { title: "Description", sort: true },
  { title: "Status", sort: true },
  { title: "Action", sort: false },
  ];

  // Department modal handlers
  const handleDeptEdit = (dept) => {
    setEditingDept(dept);
    setDeptForm({
      name: dept.name,
      description: dept.description,
      status: dept.status === "Active" ? true : false,
    });
    setShowDeptModal(true);
  };

  const handleDeptDelete = (dept) => {
    setDeletingDept(dept);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setDeletingDept(null);
  };

  const handleDeleteDeptConfirm = async () => {
    if (!deletingDept) return;
    try {
      await deleteDepartment(deletingDept.id).unwrap();
      toast.success("Department deleted successfully");
      handleDeleteModalClose();
    } catch {
      toast.error("Failed to delete department");
    }
  };

  const handleDeptModalClose = () => {
    setShowDeptModal(false);
    setEditingDept(null);
    setDeptForm({ name: "", description: "", status: true });
  };

  const handleDeptInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDeptForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const renderContent = () => (
    <section className="px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">
              Employee Settings
            </h1>
            <p className="text-gray-600 mt-2">Manage departments, roles, and employee organizational structure</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/settings">
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Back to Settings
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('departments')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'departments'
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Departments
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'roles'
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Designations
          </button>
        </div>
      </div>

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          {/* Add Department Button */}
          <div className="flex justify-end mb-4">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              onClick={() => {
                setEditingDept(null);
                setDeptForm({ name: "", description: "", status: true });
                setShowDeptModal(true);
              }}
            >
              Add Department
            </button>
          </div>
          {/* Departments Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {isDepartmentsLoading ? (
              <div className="p-6 text-center text-gray-500">Loading departments...</div>
            ) : isDepartmentsError ? (
              <div className="p-6 text-center text-red-500">Failed to load departments.</div>
            ) : (
              <Table 
                tableLabels={departmentLabels}
                dataSet={departments.length}
                itemsPerPage={10}
              >
                {departments.map((dept, index) => (
                  <DepartmentRow
                    key={dept.id}
                    data={{
                      id: dept.id,
                      name: dept.name,
                      description: dept.description,
                      status: dept.status === 1 || dept.status === true ? "Active" : "Inactive",
                    }}
                    index={index}
                    onEdit={() => handleDeptEdit({
                      id: dept.id,
                      name: dept.name,
                      description: dept.description,
                      status: dept.status === 1 || dept.status === true ? "Active" : "Inactive",
                    })}
                    onDelete={() => handleDeptDelete({
                      id: dept.id,
                      name: dept.name,
                    })}
                  />
                ))}
              </Table>
            )}
          </div>
        </div>
      )}

      {/* Department Modal */}
      {showDeptModal && (
        <Modal title={editingDept ? "Edit Department" : "Add Department"} onClose={handleDeptModalClose}>
          <form onSubmit={handleDeptFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
              <input
                type="text"
                name="name"
                value={deptForm.name}
                onChange={handleDeptInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={deptForm.description}
                onChange={handleDeptInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="status"
                checked={deptForm.status}
                onChange={handleDeptInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Active Status</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleDeptModalClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addingDept || updatingDept}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
              >
                {addingDept || updatingDept ? "Saving..." : editingDept ? "Update Department" : "Create Department"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Department Modal */}
      {showDeleteModal && (
        <Modal title="Delete Department" onClose={handleDeleteModalClose}>
          <div className="space-y-4">
            <p className="text-gray-700">Are you sure you want to delete the department <span className="font-semibold">{deletingDept?.name}</span>?</p>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleDeleteModalClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteDeptConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          {/* Add Designation Button */}
          <div className="flex justify-end mb-4">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              onClick={() => {
                setEditingDesig(null);
                setDesigForm({ title: "", description: "", status: true, department_id: "" });
                setShowDesigModal(true);
              }}
            >
              Add Designation
            </button>
          </div>
          {/* Designations Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {isDesignationsLoading ? (
              <div className="p-6 text-center text-gray-500">Loading designations...</div>
            ) : isDesignationsError ? (
              <div className="p-6 text-center text-red-500">Failed to load designations.</div>
            ) : (
              <Table 
                tableLabels={roleLabels}
                dataSet={designations.length}
                itemsPerPage={10}
              >
                {designations.map((designation, index) => (
                  <RoleRow
                    key={designation.id}
                    data={{
                      id: designation.id,
                      title: designation.title,
                      department: designation.department?.name || "N/A",
                      department_id: designation.department_id,
                      level: designation.description || "N/A",
                      status: designation.status === 1 || designation.status === true ? "Active" : "Inactive",
                    }}
                    index={index}
                    onEdit={() => handleDesigEdit({
                      id: designation.id,
                      title: designation.title,
                      department: designation.department?.name || "N/A",
                      department_id: designation.department_id,
                      level: designation.description || "N/A",
                      status: designation.status === 1 || designation.status === true ? "Active" : "Inactive",
                    })}
                    onDelete={() => handleDesigDelete({
                      id: designation.id,
                      title: designation.title,
                    })}
                  />
                ))}
              </Table>
            )}
          </div>
          {/* Designation Modal */}
          {showDesigModal && (
            <Modal title={editingDesig ? "Edit Designation" : "Add Designation"} onClose={handleDesigModalClose}>
              <form onSubmit={handleDesigFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={desigForm.title}
                    onChange={handleDesigInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={desigForm.description}
                    onChange={handleDesigInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select
                    name="department_id"
                    value={desigForm.department_id}
                    onChange={handleDesigInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    checked={desigForm.status}
                    onChange={handleDesigInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Active Status</label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleDesigModalClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingDesig || updatingDesig}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                  >
                    {addingDesig || updatingDesig ? "Saving..." : editingDesig ? "Update Designation" : "Create Designation"}
                  </button>
                </div>
              </form>
            </Modal>
          )}
          {/* Delete Designation Modal */}
          {showDeleteDesigModal && (
            <Modal title="Delete Designation" onClose={handleDeleteDesigModalClose}>
              <div className="space-y-4">
                <p className="text-gray-700">Are you sure you want to delete the designation <span className="font-semibold">{deletingDesig?.title}</span>?</p>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleDeleteDesigModalClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteDesigConfirm}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}
  </section>
  );

  return renderContent();
}
