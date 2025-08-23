import { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../components/table/Table";
import OfficeNoticeRow from "../components/table/rows/OfficeNoticeRow";
import IconButton from "../components/buttons/IconButton";

const tableLabels = [
  { title: "Notice", sort: true },
  { title: "Priority", sort: true },
  { title: "Date", sort: true },
  { title: "Status", sort: true },
  { title: "Attachment", sort: false },
  { title: "Action", sort: false },
];

const initialTableData = [
  {
    id: 1,
    serial: "01",
    title: "Post-Eid Office Dress Code",
    noticeDescription: `Dear Colleagues,
Greetings!!!
We all know that after Eid vacation, from tomorrow we are going to resume our office.
As we want to create a festive ambience tomorrow, everyone is requested to wear attire to comply with the festivity.
Please follow mentioned dress code below:
*Male- Panjabi
*Female- Sharee/ Salwar Kameez.`,
    attachment: {
      image: "/images/eidmubarak.jpeg",
      filename: "Eid_Mubarak_Notice.jpg",
    },
    date: "2025-08-20",
    priority: "High",
    status: "Active",
    category: "General",
  },
  {
    id: 2,
    serial: "02",
    title: "National Holiday Notice",
    noticeDescription: `Dear Team,
Please be informed that the office will remain closed on Friday, 25th August 2025 due to a national holiday.
Normal office operations will resume on Saturday, 26th August 2025.
Thank you for your attention.`,
    attachment: {
      image: "/images/smarthrlogo.png",
      filename: "Holiday_Notice.pdf",
    },
    date: "2025-08-22",
    priority: "Medium",
    status: "Active",
    category: "Holiday",
  },
  {
    id: 3,
    serial: "03",
    title: "Monthly Team Meeting",
    noticeDescription: `All Staff,
Monthly team meeting is scheduled for Monday, 28th August 2025 at 10:00 AM in the conference room.
Attendance is mandatory for all department heads.
Agenda will be shared via email.`,
    attachment: {
      image: "/images/blob-bg.png",
      filename: "Meeting_Agenda.pdf",
    },
    date: "2025-08-23",
    priority: "High",
    status: "Active",
    category: "Meeting",
  },
  {
    id: 4,
    serial: "04",
    title: "Annual Company Picnic",
    noticeDescription: `Dear Employees,
The annual company picnic has been scheduled for September 15, 2025.
Registration is now open. Please submit your names to HR department by September 5th.
Transportation and meals will be provided.`,
    attachment: {
      image: "/images/smarthrlogo2.png",
      filename: "Picnic_Details.pdf",
    },
    date: "2025-08-21",
    priority: "Low",
    status: "Active",
    category: "Event",
  },
  {
    id: 5,
    serial: "05",
    title: "Security Protocol Update",
    noticeDescription: `Important Security Notice:
New security protocols will be implemented from September 1st, 2025.
All employees must carry their ID cards at all times within office premises.
Visitor management system will be updated accordingly.`,
    attachment: {
      image: "/images/profile-photo.jpg",
      filename: "Security_Guidelines.pdf",
    },
    date: "2025-08-19",
    priority: "High",
    status: "Archived",
    category: "Security",
  },
];

export default function OfficeNotice() {
  const [tableData, setTableData] = useState(initialTableData);
  const [select, setSelect] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filter table data based on search term, priority, status, and category
  const filteredData = tableData.filter((notice) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Text search filter
    const matchesSearch = !searchTerm || (
      notice.serial.toLowerCase().includes(searchLower) ||
      notice.title.toLowerCase().includes(searchLower) ||
      notice.noticeDescription.toLowerCase().includes(searchLower) ||
      notice.attachment.filename.toLowerCase().includes(searchLower)
    );

    // Priority filter
    const matchesPriority = priorityFilter === "All" || notice.priority === priorityFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "All" || notice.status === statusFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === "All" || notice.category === categoryFilter;

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  const resetSelection = () => {
    setSelect([]);
    setShowBulkActions(false);
  };

  // Function to update notice status
  const updateNoticeStatus = (id, newStatus) => {
    setTableData(prevData => 
      prevData.map(notice => 
        notice.id === id ? { ...notice, status: newStatus } : notice
      )
    );
  };

  // Function to update multiple notice statuses
  const updateMultipleNoticeStatuses = (ids, newStatus) => {
    setTableData(prevData => 
      prevData.map(notice => 
        ids.includes(notice.id) ? { ...notice, status: newStatus } : notice
      )
    );
  };

  const handleSelect = (item, e) => {
    if (e.target.checked) {
      const newSelection = [...select, item];
      setSelect(newSelection);
      setShowBulkActions(newSelection.length > 0);
    } else {
      const newSelection = select.filter((data) => item !== data);
      setSelect(newSelection);
      setShowBulkActions(newSelection.length > 0);
    }
  };

  const selectAll = (e) => {
    if (e.target.checked) {
      const newSelection = filteredData.map((data) => data.id);
      setSelect(newSelection);
      setShowBulkActions(newSelection.length > 0);
    } else {
      resetSelection();
    }
  };

  // Bulk action handlers
  const handleBulkArchive = () => {
    updateMultipleNoticeStatuses(select, "Archived");
    alert(`${select.length} notices archived!`);
    resetSelection();
  };

  const handleBulkActivate = () => {
    updateMultipleNoticeStatuses(select, "Active");
    alert(`${select.length} notices activated!`);
    resetSelection();
  };

  // Calculate statistics
  const stats = {
    total: tableData.length,
    active: tableData.filter(notice => notice.status === "Active").length,
    archived: tableData.filter(notice => notice.status === "Archived").length,
    high: tableData.filter(notice => notice.priority === "High").length,
    categories: [...new Set(tableData.map(notice => notice.category))].length,
  };

  // Get unique values for filter dropdowns
  const uniqueCategories = [...new Set(tableData.map(notice => notice.category))];

  return (
    <section className="px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-inter">Office Notice</h1>
          <p className="text-gray-600 mt-1">Manage and organize company announcements</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none w-64"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img 
                src="/icons/search-icon.svg" 
                alt="Search" 
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
          <Link to="/notice/add">
            <IconButton
              text="Add Notice"
              color="text-white"
              bg="bg-red-600"
              icon="/icons/plus-Icon.svg"
              className="hover:bg-red-700"
            />
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9.5 16H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2h-3" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Notices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg shadow p-4 border-l-4 border-green-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg shadow p-4 border-l-4 border-red-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{stats.high}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg shadow p-4 border-l-4 border-gray-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Archived</p>
              <p className="text-2xl font-bold text-gray-900">{stats.archived}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg shadow p-4 border-l-4 border-purple-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              <option value="All">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredData.length} of {stats.total} notices
          </div>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="text-blue-800 font-medium">{select.length} notice(s) selected</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBulkActivate}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                Activate
              </button>
              <button
                onClick={handleBulkArchive}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Archive
              </button>
              <button
                onClick={resetSelection}
                className="px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
            <OfficeNoticeRow
              key={data.id}
              data={data}
              selectedData={select}
              selectRow={handleSelect}
              updateNoticeStatus={updateNoticeStatus}
            />
          ))}
        </Table>
      </div>
    </section>
  );
}
