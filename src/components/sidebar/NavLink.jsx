import PropTypes from "prop-types";
import { useState } from "react";
import { NavLink as NavigationLink } from "react-router-dom";
import ChildNavLink from "./ChildNavLink";

export default function NavLink({ routeInfo }) {
  const [open, setOpen] = useState(true);

  const handleClick = (e) => {
    // Only prevent default and handle expand if it has children AND user clicked the expand arrow
    if (routeInfo.extend?.length > 0 && e.target.closest(".expand-arrow")) {
      e.preventDefault();
      setOpen(!open);
    }
    // Otherwise let the navigation happen naturally
  };

  return (
    <>
      <div className="h-12 mb-3 main-menu">
        <NavigationLink
          to={routeInfo.link}
          className={({ isActive }) => `
            flex h-12 items-center gap-4 px-3 py-2 rounded-lg transition-colors duration-200 group
            ${
              isActive
                ? "bg-red-800 text-white shadow-lg"
                : "text-white hover:bg-red-700"
            }
          `}
          onClick={handleClick}
        >
          {/* Left section with icon */}
          <div className="w-6 flex-shrink-0">
            <img
              src={routeInfo.icon}
              alt={routeInfo.title}
              className="w-6 h-6"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            {/* Fallback SVG icon */}
            <svg
              className="w-6 h-6 text-gray-600 hidden"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Title section */}
          <div className="flex-grow">
            <span className="text-base select-none leading-tight whitespace-nowrap">
              {routeInfo.title}
            </span>
          </div>

          {/* Expand/Collapse arrow for items with children */}
          {routeInfo.extend && routeInfo.extend.length > 0 && (
            <div
              className={`expand-arrow transition-transform duration-200 ${
                open ? "rotate-90" : ""
              }`}
            >
              <svg
                className="w-4 h-4 text-gray-500 group-hover:text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </NavigationLink>
      </div>
      <div className="relative">
        {routeInfo.extend &&
          open &&
          routeInfo.extend.map((childRouteInfo) => (
            <ChildNavLink
              key={childRouteInfo.title}
              routeInfo={childRouteInfo}
            />
          ))}
      </div>
    </>
  );
}

NavLink.propTypes = {
  routeInfo: PropTypes.object.isRequired,
};
