import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../components/table/Table";
import LeaveTypeRow from "../components/table/rows/LeaveTypeRow";
import Modal from "../components/Modal/Modal";
import {
  useGetLeaveTypesQuery,
  useAddLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,
} from "../features/api/leaveTypeApi";

export default function LeaveSettings() {
  // API hooks
  const { data: leaveTypesData = [], isLoading, isError } = useGetLeaveTypesQuery();
  const [addLeaveType] = useAddLeaveTypeMutation();
  const [updateLeaveType] = useUpdateLeaveTypeMutation();
  const [deleteLeaveType] = useDeleteLeaveTypeMutation();

  // Table headers
  const typesTableLabels = [
    { title: "Leave Type", sort: true },
    { title: "Days", sort: true },
    { title: "Action", sort: false },
  ];

  // Modal state for edit/delete
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState(null);
  const [deletingLeaveType, setDeletingLeaveType] = useState(null);
  const [editDays, setEditDays] = useState(0);
  const [editLeaveTypeName, setEditLeaveTypeName] = useState("");
  const [newLeaveTypeName, setNewLeaveTypeName] = useState("");
  const [newLeaveTypeDays, setNewLeaveTypeDays] = useState(1);
  // Add modal handlers
  const handleAddModalOpen = () => {
    setNewLeaveTypeName("");
    setNewLeaveTypeDays(1);
    setShowAddModal(true);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
  };

  const handleAddLeaveTypeNameChange = (e) => {
    setNewLeaveTypeName(e.target.value);
  };

  const handleAddLeaveTypeDaysChange = (e) => {
    setNewLeaveTypeDays(e.target.value);
  };

  const handleAddLeaveTypeSave = async (e) => {
    e.preventDefault();
    await addLeaveType({ leave_type: newLeaveTypeName, days: Number(newLeaveTypeDays) });
    setShowAddModal(false);
  };

  // Update record functions
  const updateLeaveTypeRecord = async (id, field, value) => {
    const leaveType = leaveTypesData.find((item) => item.id === id);
    if (!leaveType) return;
    let payload = {};
    if (field === "days") {
      payload = { leave_type: leaveType.leave_type, days: value };
    } else if (field === "leave_type") {
      payload = { leave_type: value, days: leaveType.days };
    }
    await updateLeaveType({ id, ...payload });
  };

  // Edit modal handlers
  const handleEditLeaveType = (leaveType) => {
    setEditingLeaveType(leaveType);
    setEditDays(leaveType.days);
    setEditLeaveTypeName(leaveType.leaveType.name);
    setShowEditModal(true);
  };

  const handleEditDaysChange = (e) => {
    setEditDays(e.target.value);
  };

  const handleEditLeaveTypeNameChange = (e) => {
    setEditLeaveTypeName(e.target.value);
  };

  const handleEditDaysSave = async (e) => {
    e.preventDefault();
    await updateLeaveType({
      id: editingLeaveType.id,
      leave_type: editLeaveTypeName,
      days: Number(editDays),
    });
    setShowEditModal(false);
    setEditingLeaveType(null);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingLeaveType(null);
  };

  // Delete modal handlers
  const handleDeleteLeaveType = (leaveType) => {
    setDeletingLeaveType(leaveType);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    await deleteLeaveType(deletingLeaveType.id);
    setShowDeleteModal(false);
    setDeletingLeaveType(null);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setDeletingLeaveType(null);
  };

  return (
    <section className="px-6 py-8">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Settings</h1>
          <p className="text-gray-600 mt-2">Manage leave types</p>
        </div>
        <Link to="/settings">
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Back to Settings
          </button>
        </Link>
      </div>

      {/* Leave Types */}
      <div>
        <div className="flex justify-end mb-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            onClick={handleAddModalOpen}
          >
            Add Leave Type
          </button>
        </div>
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading leave types...</div>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">Failed to load leave types.</div>
        ) : (
          <Table
            tableLabels={typesTableLabels}
            dataSet={leaveTypesData.length}
            selectedData={[]}
            resetSelection={() => {}}
          >
            {leaveTypesData.map((leaveType) => (
              <LeaveTypeRow
                key={leaveType.id}
                data={{
                  id: leaveType.id,
                  leaveType: { name: leaveType.leave_type },
                  days: leaveType.days,
                }}
                updateRecord={updateLeaveTypeRecord}
                onEdit={() => handleEditLeaveType({
                  id: leaveType.id,
                  leaveType: { name: leaveType.leave_type },
                  days: leaveType.days,
                })}
                onDelete={() => handleDeleteLeaveType({
                  id: leaveType.id,
                  leaveType: { name: leaveType.leave_type },
                  days: leaveType.days,
                })}
              />
            ))}
          </Table>
        )}
      </div>
      {/* Add Leave Type Modal */}
      {showAddModal && (
        <Modal title="Add Leave Type" onClose={handleAddModalClose}>
          <form onSubmit={handleAddLeaveTypeSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <input
                type="text"
                value={newLeaveTypeName}
                onChange={handleAddLeaveTypeNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
              <input
                type="number"
                value={newLeaveTypeDays}
                onChange={handleAddLeaveTypeDaysChange}
                min={1}
                max={365}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleAddModalClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        </Modal>
      )}
      {/* Edit Leave Type Modal */}
      {showEditModal && editingLeaveType && (
        <Modal title={`Edit Leave Type`} onClose={handleEditModalClose}>
          <form onSubmit={handleEditDaysSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <input
                type="text"
                value={editLeaveTypeName}
                onChange={handleEditLeaveTypeNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
              <input
                type="number"
                value={editDays}
                onChange={handleEditDaysChange}
                min={0}
                max={365}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleEditModalClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Leave Type Modal */}
      {showDeleteModal && deletingLeaveType && (
        <Modal title={`Delete ${deletingLeaveType.leaveType.name}`} onClose={handleDeleteModalClose}>
          <div className="space-y-4">
            <p className="text-gray-700">Are you sure you want to delete this leave type?</p>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleDeleteModalClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
