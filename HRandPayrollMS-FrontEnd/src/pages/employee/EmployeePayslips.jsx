import React, { useState } from "react";
import { useCurrentEmployee } from "../../components/hooks/useCurrentEmployee";
import { useGetEmployeeSalariesQuery } from "../../features/api/employeeSalariesApiSlice";


export default function EmployeePayslips() {
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  // Get current employee info at top-level
  const { employeeId } = useCurrentEmployee();
  // Fetch all employee salaries
  const { data: allSalaries = [], isLoading } = useGetEmployeeSalariesQuery();
  // Filter to only current employee
  const payslips = allSalaries.filter(s => s.employeeId === employeeId);

  const handleViewPayslip = (payslip) => {
    setSelectedPayslip(payslip);
    setShowViewModal(true);
  };

 const handleDownloadPayslip = (payslip) => {
  // Create a proper formatted payslip using correct backend property names
  const payslipContent = [
    '=======================================',
    '      PAYSLIP STATEMENT',
    '=======================================',
    '',
    `Employee: ${payslip.name}`,
    `Employee ID: ${payslip.employeeId}`,
    `Pay Period: ${payslip.monthYear}`,
    `Generated Date: ${new Date().toLocaleDateString()}`,
    '',
    'EARNINGS:',
    `Salary                        ৳${payslip.salary.toLocaleString()}`,
    `Total Earnings                ৳${payslip.salary.toLocaleString()}`,
    '',
    'DEDUCTIONS:',
    `Total Deductions              ৳${(payslip.salary - payslip.afterAdjustmentSalary).toLocaleString()}`,
    '',
    '=======================================',
    `AFTER ADJUSTMENT SALARY       ৳${payslip.afterAdjustmentSalary.toLocaleString()}`,
    '=======================================',
    '',
    `Status: ${payslip.status}`,
    '',
    'Note: This is a computer-generated payslip.',
    'No signature is required.',
    '',
    `Generated on: ${new Date().toLocaleString()}`
  ].join('\n');
  // Create and download file
  const blob = new Blob([payslipContent], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Payslip_' + String(payslip.monthYear).replace(/\s+/g, '_') + '.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

  const closeModal = () => {
    setShowViewModal(false);
    setSelectedPayslip(null);
  };

  return (
    <section className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">My Payslips</h1>
        <p className="text-gray-600 mt-1">View and download your salary statements</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month & Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">After Adjustment Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
              ) : payslips.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8">No payslips found for your account.</td></tr>
              ) : payslips.map((payslip) => (
                <tr key={payslip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payslip.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payslip.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payslip.monthYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ৳{payslip.salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ৳{payslip.afterAdjustmentSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {payslip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewPayslip(payslip)}
                      className="text-blue-600 hover:text-blue-700 mr-3 p-1 rounded hover:bg-blue-50"
                      title="View Payslip"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDownloadPayslip(payslip)}
                      className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50"
                      title="Download Payslip"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Payslip View Modal */}
      {showViewModal && selectedPayslip && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Payslip Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Name:</span>
                  <span>{selectedPayslip.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Employee ID:</span>
                  <span>{selectedPayslip.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Month & Year:</span>
                  <span>{selectedPayslip.monthYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Salary:</span>
                  <span>৳{selectedPayslip.salary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">After Adjustment Salary:</span>
                  <span>৳{selectedPayslip.afterAdjustmentSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span>{selectedPayslip.status}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadPayslip(selectedPayslip)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
      )}
    
