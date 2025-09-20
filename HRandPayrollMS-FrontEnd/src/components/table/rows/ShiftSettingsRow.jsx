import React from 'react';
import ShiftSettingsTd from "../td/ShiftSettingsTd";

export default function ShiftSettingsRow({ data, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
  <ShiftSettingsTd field="shiftName" value={data.shiftName} />
      <ShiftSettingsTd field="shiftType" value={data.shiftType} />
      <ShiftSettingsTd field="checkInTime" value={data.checkInTime} />
      <ShiftSettingsTd field="checkOutTime" value={data.checkOutTime} />
      <ShiftSettingsTd field="graceTime" value={data.graceTime} />
      <ShiftSettingsTd field="workingDays" value={data.workingDays} />
      <ShiftSettingsTd field="weekends" value={data.weekends} />
      <ShiftSettingsTd field="status" value={data.status} />
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <button
          className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg mr-2"
          title="Edit"
          onClick={onEdit}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
          title="Delete"
          onClick={onDelete}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
