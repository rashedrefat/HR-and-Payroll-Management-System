import PropTypes from 'prop-types';

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50 cursor-pointer">
    <div className="transition-all duration-300">
      <h3 className="text-gray-600 text-sm font-medium mb-1 group-hover:text-gray-700">{title}</h3>
      <p className="text-2xl font-semibold text-gray-800 group-hover:text-gray-900">{value}</p>
    </div>
    <div className="w-12 h-12 flex items-center justify-center transition-transform duration-300 hover:scale-110">
      {typeof icon === 'string' && icon.startsWith('/') ? (
        <img 
          src={icon} 
          alt={title} 
          className={`${icon.includes('moneybag') ? 'w-10 h-10' : 'w-8 h-8'} transition-transform duration-300`}
          style={{ objectFit: 'contain' }} 
        />
      ) : (
        <span className="text-2xl">{icon}</span>
      )}
    </div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const DashboardStats = ({ totalEmployees, todayPresent, todayAbsent, monthlyPayroll }) => {
  const stats = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      icon: "/icons/employees.svg",
    },
    {
      title: 'Today Present',
      value: todayPresent,
      icon: "/icons/present.svg",
    },
    {
      title: 'Today Absent',
      value: todayAbsent,
      icon: "/icons/cross.svg",
    },
    {
      title: 'Monthly Payroll',
      value: monthlyPayroll,
      icon: "/icons/moneybag.svg",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

DashboardStats.propTypes = {
  totalEmployees: PropTypes.number.isRequired,
  todayPresent: PropTypes.number.isRequired,
  todayAbsent: PropTypes.number.isRequired,
  monthlyPayroll: PropTypes.string.isRequired,
};

export default DashboardStats;
