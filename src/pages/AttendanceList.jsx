import { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../components/table/Table";
import AttendanceListRow from "../components/table/rows/AttendanceListRow";
import IconButton from "../components/buttons/IconButton";

const tableLabels = [
  { title: "Name", sort: true },
  { title: "Employee ID", sort: true },
  { title: "Check In Time", sort: true },
  { title: "Check Out Time", sort: true },
  { title: "Reason For Late", sort: false },
  { title: "Date", sort: true },
  { title: "Early Out Reason", sort: false },
  { title: "Action", sort: false },
];

const tableData = [
  {
    id: 1,
    name: {
      title: "Rashedul Islam",
      image: "/images/profile-photo.jpg",
      visibleCheckbox: true,
    },
    employeeId: "EMP-82382",
    checkInTime: "10:00 AM",
    checkOutTime: "5:00 PM",
    reasonForLate: "None",
    date: "2025-08-23",
    earlyOutReason: "None",
  },
  {
    id: 2,
    name: {
      title: "Rifat Bandhan",
      image: "/images/bandhan-pic.jpg",
      visibleCheckbox: true,
    },
    employeeId: "EMP-33923",
    checkInTime: "11:00 AM",
    checkOutTime: "5:00 PM",
    reasonForLate: "Gone To Hospital",
    date: "2025-08-23",
    earlyOutReason: "None",
  },
  {
    id: 3,
    name: {
      title: "Sadia Afrin",
      image: "/images/sadia-pic.jpg",
      visibleCheckbox: true,
    },
    employeeId: "EMP-13445",
    checkInTime: "9:30 AM",
    checkOutTime: "5:00 PM",
    reasonForLate: "None",
    date: "2025-08-22",
    earlyOutReason: "None",
  },
  {
    id: 4,
    name: {
      title: "Mazaharul Auntu",
      image: "/images/auntu-pic.jpg",
      visibleCheckbox: true,
    },
    employeeId: "EMP-24422",
    checkInTime: "10:15 AM",
    checkOutTime: "4:30 PM",
    reasonForLate: "Traffic Jam",
    date: "2025-08-22",
    earlyOutReason: "Family Emergency",
  },
  {
    id: 5,
    name: {
      title: "Shahariar Islam",
      image: "/images/shahriar-pic.jpg",
      visibleCheckbox: true,
    },
    employeeId: "EMP-42452",
    checkInTime: "9:45 AM",
    checkOutTime: "5:00 PM",
    reasonForLate: "None",
    date: "2025-08-21",
    earlyOutReason: "None",
  },
  {
    id: 6,
    name: {
      title: "Lina Rahman",
      image: "/images/lina-pic.jpg",
      visibleCheckbox: true,
    },
    employeeId: "EMP-42332",
    checkInTime: "10:30 AM",
    checkOutTime: "5:00 PM",
    reasonForLate: "Medical Appointment",
    date: "2025-08-21",
    earlyOutReason: "None",
  },
];

export default function AttendanceList() {
  const [select, setSelect] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter table data based on search term and date range
  const filteredData = tableData.filter((attendance) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Text search filter
    const matchesSearch = !searchTerm || (
      attendance.name.title.toLowerCase().includes(searchLower) ||
      attendance.employeeId.toLowerCase().includes(searchLower) ||
      attendance.reasonForLate.toLowerCase().includes(searchLower) ||
      attendance.earlyOutReason.toLowerCase().includes(searchLower)
    );

    // Date range filter
    const attendanceDate = new Date(attendance.date);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    
    const matchesDateRange = (!fromDate || attendanceDate >= fromDate) &&
                            (!toDate || attendanceDate <= toDate);

    // Single date search (if someone selects the same date in both from and to)
    const matchesSpecificDate = (dateFrom && dateTo && dateFrom === dateTo) ? 
      attendance.date === dateFrom : true;

    return matchesSearch && matchesDateRange && matchesSpecificDate;
  });

  const resetSelection = () => setSelect([]);

  const handleSelect = (item, e) => {
    if (e.target.checked) {
      setSelect([...select, item]);
    } else {
      setSelect(select.filter((data) => item !== data));
    }
  };

  const selectAll = (e) => {
    if (e.target.checked) {
      setSelect(filteredData.map((data) => data.id));
    } else {
      resetSelection();
    }
  };

  const handleSearch = () => {
    // The filtering is already applied automatically through the filteredData useMemo
    // This function can be used for additional search actions if needed
    console.log("Searching with date range:", dateFrom, "to", dateTo);
    console.log("Search term:", searchTerm);
    console.log("Filtered results:", filteredData.length, "records found");
  };

  const handleExportToExcel = () => {
    // Handle Excel export functionality here
    console.log("Exporting to Excel...");
  };

  return (
    <section className="px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">Attendance List</h1>
          <p className="text-gray-600 mt-1">Track and monitor employee attendance records</p>
        </div>
        <Link to="/attendance/add">
          <IconButton
            text="Add Attendance"
            color="text-white"
            bg="bg-red-600"
            icon="/icons/plus-Icon.svg"
            className="hover:bg-red-700"
          />
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, employee ID, reasons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img 
                  src="/icons/search-icon.svg" 
                  alt="Search" 
                  className="h-5 w-5 text-gray-400"
                />
              </div>
            </div>
          </div>
          <div>
            <IconButton
              text="Search"
              color="text-white"
              bg="bg-red-600"
              icon="/icons/search2-icon.svg"
              onClick={handleSearch}
              className="hover:bg-red-700"
            />
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <IconButton
          text="Export to Excel"
          color="text-white"
          bg="bg-green-600"
          icon="/icons/export.svg"
          onClick={handleExportToExcel}
          className="hover:bg-green-700"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          selectAll={selectAll}
          selectRow={handleSelect}
          selectedData={select}
          dataSet={filteredData.length}
          tableLabels={tableLabels}
          itemsPerPage={10}
          resetSelection={resetSelection}
        >
          {filteredData.map((data) => (
            <AttendanceListRow
              key={data.id}
              data={data}
              selectedData={select}
              selectRow={handleSelect}
            />
          ))}
        </Table>
      </div>
    </section>
  );
}
