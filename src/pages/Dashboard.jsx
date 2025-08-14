import DashboardStats from "../components/dashboard/DashboardStats";
import AttendanceBarChart from "../components/charts/AttendanceBarChart";
import DepartmentPieChart from "../components/charts/DepartmentPieChart";

export default function Dashboard() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <DashboardStats 
        totalEmployees={125} 
        todayPresent={98} 
        todayAbsent={27} 
        monthlyPayroll="$245,000" 
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceBarChart />
        </div>
        <div className="lg:col-span-1">
          <DepartmentPieChart />
        </div>
      </div>
    </div>
  );
}
