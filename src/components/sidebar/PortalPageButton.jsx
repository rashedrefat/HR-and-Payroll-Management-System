import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../loading";

export default function PortalPageButton() {
  const location = useLocation();
  const { user, loading } = useAuth();
  
  // Determine current portal based on location
  const getCurrentPortal = () => {
    if (location.pathname.startsWith('/employee/')) {
      return 'employee';
    } else {
      return 'admin';
    }
  };

  const currentPortal = getCurrentPortal();

  const portals = {
    admin: {
      name: 'Admin Portal',
      description: 'Full system access',
      icon: '/icons/settings.svg',
      color: 'red'
    },
    employee: {
      name: 'Employee Portal',
      description: 'Employee workspace',
      icon: '/icons/employee.svg',
      color: 'red'
    }
  };

  const activePortal = portals[currentPortal];

  return loading ? (
    <div className="w-full h-14 flex items-center justify-center">
      <Loading />
    </div>
  ) : (
    <>
      {user && (
        <div className="relative">
          {/* Non-functional Portal Display */}
          <div className="flex h-14 items-center gap-3 border rounded-lg px-3 bg-red-600 border-red-600 text-white shadow-lg">
            {/* Portal Icon */}
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                src={activePortal.icon}
                alt={activePortal.name}
                className="w-6 h-6"
                style={{ filter: 'brightness(0) invert(1)' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <svg className="w-6 h-6 hidden text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            
            {/* Content */}
            <div className="flex-grow">
              <div className="text-sm font-semibold leading-tight text-white">
                {activePortal.name}
              </div>
              <div className="text-xs leading-tight text-white opacity-90">
                {activePortal.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
