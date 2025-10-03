// Time format utility functions

/**
 * Convert 24-hour format to 12-hour format with AM/PM
 * @param {string} time24 - Time in 24-hour format (e.g., "14:30")
 * @returns {string} Time in 12-hour format (e.g., "2:30 PM")
 */
export function convertTo12Hour(time24) {
  if (!time24 || time24 === '--') return '--';
  
  try {
    // Handle both H:i and H:i:s formats
    const timeParts = time24.split(':');
    let hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours = hours - 12;
    }
    
    return `${hours}:${minutes} ${period}`;
  } catch (error) {
    console.error('Error converting time to 12-hour format:', error);
    return time24;
  }
}

/**
 * Convert 12-hour format to 24-hour format
 * @param {string} time12 - Time in 12-hour format (e.g., "2:30 PM")
 * @returns {string} Time in 24-hour format (e.g., "14:30")
 */
export function convertTo24Hour(time12) {
  if (!time12 || time12 === '--') return '';
  
  try {
    const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i;
    const match = time12.match(timeRegex);
    
    if (!match) {
      // If it's already in 24-hour format, return as is
      if (/^\d{1,2}:\d{2}$/.test(time12)) {
        return time12;
      }
      throw new Error('Invalid time format');
    }
    
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const period = match[3].toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'AM' && hours === 12) {
      hours = 0;
    } else if (period === 'PM' && hours !== 12) {
      hours = hours + 12;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  } catch (error) {
    console.error('Error converting time to 24-hour format:', error);
    return time12;
  }
}

/**
 * Format time for input fields (converts from display format to input format)
 * @param {string} displayTime - Time in display format
 * @returns {string} Time formatted for time input (24-hour format for HTML5 time input)
 */
export function formatTimeForInput(displayTime) {
  if (!displayTime || displayTime === '--') return '';
  
  // If it's in 12-hour format, convert to 24-hour for HTML5 time input
  if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(displayTime)) {
    return convertTo24Hour(displayTime);
  }
  
  // If it's already in 24-hour format, return as is
  if (/^\d{1,2}:\d{2}$/.test(displayTime)) {
    return displayTime;
  }
  
  return displayTime;
}

/**
 * Convert HTML5 time input value (24-hour) to 12-hour format for API
 * @param {string} timeValue - Time from HTML5 time input (HH:MM format)
 * @returns {string} Time in 12-hour format for API
 */
export function convertTimeInputToAPI(timeValue) {
  if (!timeValue) return '';
  
  // timeValue from HTML5 input is in HH:MM format, convert to 12-hour
  return convertTo12Hour(timeValue);
}

/**
 * Validate 12-hour format time
 * @param {string} time - Time string to validate
 * @returns {boolean} True if valid 12-hour format
 */
export function isValid12HourFormat(time) {
  if (!time) return true; // Empty is valid for optional fields
  return /^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(time);
}

/**
 * Format time for display in tables and components
 * @param {string} time - Raw time from API
 * @returns {string} Formatted time for display
 */
export function formatTimeForDisplay(time) {
  if (!time || time === '--') return '--';
  
  // If already in 12-hour format, return as is
  if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(time)) {
    return time;
  }
  
  // Convert from 24-hour to 12-hour format
  return convertTo12Hour(time);
}