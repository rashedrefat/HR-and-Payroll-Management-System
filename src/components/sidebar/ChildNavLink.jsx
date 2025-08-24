import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";

export default function ChildNavLink({ routeInfo }) {
  const location = useLocation();
  const isActive = location.pathname === `/${routeInfo.link}`;

  return (
    <div className="ml-6 mb-2 relative sub-menu">
      <NavLink
        to={routeInfo.link}
        className={`
            flex h-10 items-center gap-3 px-6 py-2 rounded-lg transition-all duration-300 transform group border border-transparent
            ${isActive 
              ? 'bg-red-600 text-white shadow-lg scale-105' 
              : 'text-black hover:bg-red-100 hover:text-red-700 hover:scale-105 hover:shadow-lg hover:border-red-300'
            }
          `}
      >
        {/* Bullet point - Enhanced visibility */}
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mr-2 ${
          isActive ? 'bg-white' : 'bg-gray-700'
        }`}></div>
        <span className="text-sm leading-tight whitespace-nowrap">{routeInfo.title}</span>
      </NavLink>
    </div>
  );
}

ChildNavLink.propTypes = {
  routeInfo: PropTypes.object.isRequired,
};
