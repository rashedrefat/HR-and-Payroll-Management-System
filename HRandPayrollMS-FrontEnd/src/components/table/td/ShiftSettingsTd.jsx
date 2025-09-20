
export default function ShiftSettingsTd({ field, value }) {
  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    if (status === 'Active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getShiftTypeBadge = (type) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    if (type === 'Day') {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else {
      return `${baseClasses} bg-purple-100 text-purple-800`;
    }
  };

  // Helper to format time to 12-hour format with AM/PM
  const formatTime12Hour = (timeStr) => {
    if (!timeStr) return '';
    const [hourStr, minuteStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const renderField = () => {
    switch (field) {
      case 'shiftName':
        return (
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <div className="text-sm font-medium text-gray-900">{value}</div>
          </td>
        );
      case 'shiftType':
        return (
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <span className={getShiftTypeBadge(value)}>{value}</span>
          </td>
        );
      case 'checkInTime':
      case 'checkOutTime':
        return (
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">{formatTime12Hour(value)}</span>
            </div>
          </td>
        );
      case 'graceTime':
        return (
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{value}</span>
          </td>
        );
      case 'workingDays':
        return (
          <td className="px-6 py-4 text-center">
            <span className="text-sm text-gray-900">{value}</span>
          </td>
        );
      case 'weekends':
        return (
          <td className="px-6 py-4 text-center">
            <span className="text-sm text-gray-600">{value}</span>
          </td>
        );
      case 'status':
        return (
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <span className={getStatusBadge(value)}>{value}</span>
          </td>
        );
      case 'action':
        return (
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <div className="flex items-center justify-center space-x-2">
              <button className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        );
      default:
        return (
          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
            {value}
          </td>
        );
    }
  };
  return renderField();
}
