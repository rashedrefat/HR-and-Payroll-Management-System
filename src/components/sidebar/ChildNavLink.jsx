import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

export default function ChildNavLink({ routeInfo }) {
  return (
    <div className="ml-6 mb-2 relative sub-menu">
      <NavLink
        to={routeInfo.link}
        className={({ isActive }) => `
            flex h-10 items-center gap-3 px-6 py-2 rounded-lg transition-all duration-300 transform group border border-transparent
            ${isActive 
              ? 'bg-red-600 text-white shadow-lg scale-105' 
              : 'text-black hover:bg-red-100 hover:text-red-700 hover:scale-105 hover:shadow-lg hover:border-red-300'
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
