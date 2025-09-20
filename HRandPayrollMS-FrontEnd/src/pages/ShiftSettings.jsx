// import React from 'react';
// import { useGetShiftsQuery } from "../features/api/shiftApi";
// import { Link } from "react-router-dom";
import React from 'react';
import { useGetShiftsQuery } from "../features/api/shiftApi";
import { Link } from "react-router-dom";
import Table from "../components/table/Table";
import ShiftSettingsRow from "../components/table/rows/ShiftSettingsRow";
import Modal from "../components/Modal/Modal";
import { useAddShiftMutation, useUpdateShiftMutation, useDeleteShiftMutation } from "../features/api/shiftApi";
import toast from "react-hot-toast";


export default function ShiftSettings() {
  // Modal state
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [editingShift, setEditingShift] = React.useState(null);
  const [deletingShift, setDeletingShift] = React.useState(null);
  const [newShift, setNewShift] = React.useState({
    shift_name: '',
    type: '',
    check_in: '',
    check_out: '',
    grace_time: 0,
    working_days: [],
    weekends: [],
    status: true
  });

  const [addShift, { isLoading: adding }] = useAddShiftMutation();
  const [updateShift, { isLoading: updating }] = useUpdateShiftMutation();
  const [deleteShift] = useDeleteShiftMutation();

  const handleAddShiftClick = () => {
    setShowAddModal(true);
    setNewShift({
      shift_name: '',
      type: '',
      check_in: '',
      check_out: '',
      grace_time: 0,
      working_days: [],
      weekends: [],
      status: true
    });
  };

  const handleEditShift = (shift) => {
    setEditingShift(shift);
    setNewShift({
      shift_name: shift.shift_name,
      type: shift.type || '',
      check_in: shift.check_in,
      check_out: shift.check_out,
      grace_time: shift.grace_time,
      working_days: Array.isArray(shift.working_days) ? shift.working_days : [],
      weekends: Array.isArray(shift.weekends) ? shift.weekends : [],
      status: shift.status
    });
    setShowEditModal(true);
  };

  const handleDeleteShift = (shift) => {
    setDeletingShift(shift);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setEditingShift(null);
    setDeletingShift(null);
    setNewShift({
      shift_name: '',
      type: '',
      check_in: '',
      check_out: '',
      grace_time: 0,
      working_days: [],
      weekends: [],
      status: true
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewShift(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInputChange = (e, field) => {
    const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setNewShift(prev => ({ ...prev, [field]: arr }));
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      await addShift(newShift).unwrap();
      toast.success("Shift added successfully");
      handleCloseModal();
    } catch {
      toast.error("Failed to add shift");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    console.log('Edit Modal Save Clicked');
    // Exclude 'id' from the update payload, only pass it as a separate param
    const { id, ...updateFields } = { id: editingShift?.id, ...newShift };
    // Format check_in and check_out to HH:mm
    const formatTime = (t) => t ? t.slice(0,5) : '';
    updateFields.check_in = formatTime(updateFields.check_in);
    updateFields.check_out = formatTime(updateFields.check_out);
    console.log('Payload (without id in body):', updateFields, 'id:', id);
    try {
      const result = await updateShift({ id, ...updateFields });
      console.log('Mutation result:', result);
      if (result?.error) {
        // Show backend error details if available
        const backendError = result.error.data?.message || JSON.stringify(result.error.data) || result.error.message || 'Unknown error';
        toast.error(`Failed to update shift: ${backendError}`);
        console.error('Backend error:', backendError);
      } else {
        toast.success("Shift updated successfully");
        handleCloseModal();
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error(`Failed to update shift: ${err?.data?.message || err?.message || 'Unknown error'}`);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteShift(deletingShift.id).unwrap();
      toast.success("Shift deleted successfully");
      handleCloseModal();
    } catch {
      toast.error("Failed to delete shift");
    }
  };

  const { data: shifts = [], isLoading, isError } = useGetShiftsQuery();
  const shiftTableLabels = [
    { title: "Shift Name", sort: true },
    { title: "Type", sort: true },
    { title: "Check In", sort: true },
    { title: "Check Out", sort: true },
    { title: "Grace Time", sort: false },
    { title: "Working Days", sort: false },
    { title: "Weekends", sort: false },
    { title: "Status", sort: true },
    { title: "Action", sort: false }
  ];

  return (
    <React.Fragment>
      <section className="px-6 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shift Settings</h1>
            <p className="text-gray-600 mt-2">Configure shift schedules for your organization</p>
          </div>
          <Link to="/settings">
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Back to Settings
            </button>
          </Link>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-blue-800 font-medium">Time Zone Information</p>
              <p className="text-blue-700 text-sm">
                All times are displayed in <span className="font-semibold">GMT+6 (Bangladesh Standard Time)</span> using <span className="font-semibold"> 12-hour format</span> (AM/PM)
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              onClick={handleAddShiftClick}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Shift
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">Loading shifts...</div>
            ) : isError ? (
              <div className="p-6 text-center text-red-500">Failed to load shifts.</div>
            ) : (
              <Table
                dataSet={shifts.length}
                tableLabels={shiftTableLabels}
                itemsPerPage={10}
              >
                {shifts.map((shift) => (
                  <ShiftSettingsRow
                    key={shift.id}
                    data={{
                      id: shift.id,
                      shiftName: shift.shift_name,
                      shiftType: shift.type || "",
                      checkInTime: shift.check_in,
                      checkOutTime: shift.check_out,
                      graceTime: `${shift.grace_time} minutes`,
                      workingDays: Array.isArray(shift.working_days) ? shift.working_days.join(", ") : shift.working_days,
                      weekends: Array.isArray(shift.weekends) ? shift.weekends.join(", ") : shift.weekends,
                      status: shift.status ? "Active" : "Inactive",
                      rawData: shift
                    }}
                    onEdit={() => handleEditShift(shift)}
                    onDelete={() => handleDeleteShift(shift)}
                  />
                ))}
              </Table>
            )}
          </div>
        </div>
      </section>

      {/* Add Shift Modal */}
      {showAddModal && (
        <Modal title="Add Shift" onClose={handleCloseModal}>
          <form onSubmit={handleSubmitAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift Name *</label>
                <input
                  type="text"
                  name="shift_name"
                  value={newShift.shift_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  name="type"
                  value={newShift.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Day, Night, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check In *</label>
                <input
                  type="time"
                  name="check_in"
                  value={newShift.check_in}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Out *</label>
                <input
                  type="time"
                  name="check_out"
                  value={newShift.check_out}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grace Time (minutes)</label>
                <input
                  type="number"
                  name="grace_time"
                  value={newShift.grace_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Days (comma separated)</label>
                <input
                  type="text"
                  name="working_days"
                  value={newShift.working_days.join(', ')}
                  onChange={e => handleArrayInputChange(e, 'working_days')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Mon, Tue, Wed, ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weekends (comma separated)</label>
                <input
                  type="text"
                  name="weekends"
                  value={newShift.weekends.join(', ')}
                  onChange={e => handleArrayInputChange(e, 'weekends')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Sat, Sun, ..."
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="status"
                checked={newShift.status}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Active Status</label>
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
                disabled={adding}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {adding ? "Saving..." : "Add Shift"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Shift Modal */}
      {showEditModal && (
        <Modal title="Edit Shift" onClose={handleCloseModal}>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift Name *</label>
                <input
                  type="text"
                  name="shift_name"
                  value={newShift.shift_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  name="type"
                  value={newShift.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Day, Night, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check In *</label>
                <input
                  type="time"
                  name="check_in"
                  value={newShift.check_in}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Out *</label>
                <input
                  type="time"
                  name="check_out"
                  value={newShift.check_out}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grace Time (minutes)</label>
                <input
                  type="number"
                  name="grace_time"
                  value={newShift.grace_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Days (comma separated)</label>
                <input
                  type="text"
                  name="working_days"
                  value={newShift.working_days.join(', ')}
                  onChange={e => handleArrayInputChange(e, 'working_days')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Mon, Tue, Wed, ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weekends (comma separated)</label>
                <input
                  type="text"
                  name="weekends"
                  value={newShift.weekends.join(', ')}
                  onChange={e => handleArrayInputChange(e, 'weekends')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Sat, Sun, ..."
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="status"
                checked={newShift.status}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Active Status</label>
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
                {updating ? "Saving..." : "Update Shift"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Shift Modal */}
      {showDeleteModal && (
        <Modal title="Delete Shift" onClose={handleCloseModal}>
          <div className="space-y-4">
            <p className="text-gray-700">Are you sure you want to delete this shift?</p>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCloseModal}
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
    </React.Fragment>
  );
}