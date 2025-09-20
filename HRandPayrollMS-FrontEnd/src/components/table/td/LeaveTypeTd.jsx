import PropTypes from "prop-types";
import { useState } from "react";

export default function LeaveTypeTd({ isEditing, setIsEditing, value, onChange }) {
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    // Ensure numeric value is passed
    onChange(Number(tempValue));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <td className="border-b border-red-50 p-2 xs:p-3 border-r text-center">
        <div className="flex items-center justify-center space-x-1">
          <input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
            min="0"
            max="365"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-800"
            title="Save"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button
            onClick={handleCancel}
            className="text-red-600 hover:text-red-800"
            title="Cancel"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </td>
    );
  }

  return (
    <td className="border-b border-red-50 p-2 xs:p-3 border-r text-center">
      <span className="font-medium text-gray-900">{value} days</span>
    </td>
  );
}

LeaveTypeTd.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
};
