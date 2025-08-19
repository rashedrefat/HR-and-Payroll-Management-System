import { Link } from "react-router-dom";
import Table from "../components/table/Table";
import { useState } from "react";
import AllEmployeeRow from "../components/table/rows/AllEmployeeRow";
import IconButton from "../components/buttons/IconButton";

const tableLabels = [
  { title: "Name", sort: true },
  { title: "Email", sort: true },
  { title: "Employee ID", sort: true },
  { title: "Mobile", sort: true },
  { title: "Department", sort: true },
  { title: "Designation", sort: true },
  { title: "Joining Date", sort: true },
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
    email: "rashed@gmail.com",
    employeeId: "EMP-82382",
    mobile: "01934478672",
    department: "Web Development",
    designation: "Web Developer",
    joiningDate: "22-06-2025",
    status: "Active",
  },
  {
    id: 2,
    name: {
      title: "Rifat Bandhan",
      image: "/images/profile-photo.jpg",
      visibleCheckbox: true,
    },
    email: "bandhan@gmail.com",
    employeeId: "EMP-33923",
    mobile: "01798674289",
    department: "Web Development",
    designation: "Web Developer",
    joiningDate: "22-06-2025",
    status: "Active",
  },
  {
    id: 3,
    name: {
      title: "Sadia Afrin",
      image: "/images/profile-photo.jpg",
      visibleCheckbox: true,
    },
    email: "sadia@gmail.com",
    employeeId: "EMP-13445",
    mobile: "01843272377",
    department: "Human Resource",
    designation: "HR Head",
    joiningDate: "22-06-2025",
    status: "Active",
  },
  {
    id: 4,
    name: {
      title: "Mazaharul Auntu",
      image: "/images/profile-photo.jpg",
      visibleCheckbox: true,
    },
    email: "auntu@gmail.com",
    employeeId: "EMP-24422",
    mobile: "01307842696",
    department: "Web Development",
    designation: "Web Developer",
    joiningDate: "22-06-2025",
    status: "Active",
  },
  {
    id: 5,
    name: {
      title: "Shahariar Islam",
      image: "/images/profile-photo.jpg",
      visibleCheckbox: true,
    },
    email: "shahriar@gmail.com",
    employeeId: "EMP-42452",
    mobile: "01432344525",
    department: "Sales",
    designation: "Salesman",
    joiningDate: "20-06-2025",
    status: "Active",
  },
  {
    id: 6,
    name: {
      title: "Lina Rahman",
      image: "/images/profile-photo.jpg",
      visibleCheckbox: true,
    },
    email: "lina@gmail.com",
    employeeId: "EMP-42332",
    mobile: "0134949490",
    department: "Customer Support",
    designation: "Supporter",
    joiningDate: "20-06-2025",
    status: "Active",
  },
];

export default function AllEmployee() {
  const [select, setSelect] = useState([]);

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
      setSelect(tableData.map((data) => data.id));
    } else {
      resetSelection();
    }
  };

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">All Employees</h2>
        <Link to="/employee/add">
          <IconButton
            text="Add Employee"
            color="text-white"
            bg="bg-red-600"
            icon="/icons/plus-Icon.svg"
            className="hover:bg-red-700"
          />
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          selectAll={selectAll}
          selectRow={handleSelect}
          selectedData={select}
          dataSet={tableData.length}
          tableLabels={tableLabels}
          itemsPerPage={10}
          resetSelection={resetSelection}
        >
          {tableData.map((data) => (
            <AllEmployeeRow
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
