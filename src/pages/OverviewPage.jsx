import AttendanceBarChart from "../components/charts/AttendanceBarChart";
import DepartmentPieChart from "../components/charts/DepartmentPieChart";
import DashboardStats from "../components/dashboard/DashboardStats";

export default function OverviewPage() {
  return (
    <section className="p-4 sm:p-6">
      <h1 className="sr-only">Overview section</h1>
      <div className="text-black text-3xl font-bold mb-6">Welcome, Rashedul!</div>
      
      <div className="space-y-6">
        <DashboardStats 
          totalEmployees={125}
          todayPresent={98}
          todayAbsent={27}
          monthlyPayroll={<><span className="font-black">৳</span>24,50,000</>}
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
    </section>
  );
}
