import PropTypes from "prop-types";
import TableData from "../td/TableData";
import LeaveApplicationTd from "../td/LeaveApplicationTd";

export default function LeaveApplicationRow({ selectRow, selectedData, data }) {
  return (
    <tr className="hover:bg-gray-50">
      <TableData>
        <LeaveApplicationTd
          data={data.name}
          selectRow={selectRow}
          selectedData={selectedData}
        />
      </TableData>
      <TableData>
        <span className="text-gray-600">{data.email}</span>
      </TableData>
      <TableData>
        <span className="text-gray-600">{data.employeeId}</span>
      </TableData>
      <TableData>
        <span className="text-gray-600">{data.mobile}</span>
      </TableData>
      <TableData>
        <span className="text-gray-600">{data.department}</span>
      </TableData>
      <TableData>
        <span className="text-gray-600">{data.designation}</span>
      </TableData>
      <TableData>
        <span className="text-gray-600">{data.joiningDate}</span>
      </TableData>
      <TableData>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <img src="/icons/fi-sr-pencil.svg" alt="Edit" className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-red-50 rounded-full">
            <img
              src="/icons/fi-sr-trash.svg"
              alt="Delete"
              className="w-4 h-4"
            />
          </button>
        </div>
      </TableData>
    </tr>
  );
}

LeaveApplicationRow.propTypes = {
  data: PropTypes.object.isRequired,
  selectRow: PropTypes.func,
  selectedData: PropTypes.array,
};
