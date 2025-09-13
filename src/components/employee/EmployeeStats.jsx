import PropTypes from 'prop-types';

const StatCard = ({ icon, title, value, color = 'blue' }) => {
  const colorSchemes = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex justify-between items-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
      <div className="flex-1">
        <h3 className="text-gray-600 text-sm font-medium mb-2 group-hover:text-gray-700 transition-colors">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${colorSchemes[color]} flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
};

const EmployeeStats = ({ employees = [], departments = [] }) => {
  // Calculate stats from employee data
  const totalEmployees = employees.length;
  // Check for boolean true, integer 1, or string "Active"
  const activeEmployees = employees.filter(emp => 
    emp.status === true || emp.status === 1 || emp.status === "Active"
  ).length;
  const inactiveEmployees = employees.filter(emp => 
    emp.status === false || emp.status === 0 || emp.status === "Inactive"
  ).length;
  const totalDepartments = departments.length;

  const stats = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      color: 'blue',
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-1c0-1.1.9-2 2-2s2 .9 2 2v1h2v-1c0-2.2-1.8-4-4-4s-4 1.8-4 4v1h2zm8-10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 1c-2.2 0-4 1.8-4 4v4h2v-4c0-1.1.9-2 2-2s2 .9 2 2v4h2v-4c0-2.2-1.8-4-4-4zm6 2c-1.1 0-2 .9-2 2v4h2v-4c0-.55.45-1 1-1s1 1 .45 1 1v4h2v-4c0-1.1-.9-2-2-2z"/>
        </svg>
      ),
    },
    {
      title: 'Active Employees',
      value: activeEmployees,
      color: 'green',
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      ),
    },
    {
      title: 'Inactive Employees',
      value: inactiveEmployees,
      color: 'red',
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      ),
    },
    {
      title: 'Departments',
      value: totalDepartments,
      color: 'purple',
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

EmployeeStats.propTypes = {
  employees: PropTypes.array,
  departments: PropTypes.array,
};

export default EmployeeStats;
