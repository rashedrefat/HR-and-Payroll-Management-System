import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

export default function ChildNavLink({ routeInfo }) {
  return (
    <div className="ml-6 mb-2 relative sub-menu">
      <NavLink
        to={routeInfo.link}
                  className={({ isActive }) => `
            flex h-10 items-center gap-3 px-6 py-2 rounded-lg transition-colors duration-200 group
            ${isActive 
              ? 'bg-red-800 text-white shadow-lg' 
              : 'text-red-100 hover:bg-red-700 hover:text-white'
            }
          `}
      >
        {/* Bullet point */}
        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
        <span className="text-sm leading-tight whitespace-nowrap">
          {routeInfo.title}
        </span>
      </NavLink>
    </div>
  );
}

ChildNavLink.propTypes = {
  routeInfo: PropTypes.object.isRequired,
};
