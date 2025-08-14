import PropTypes from "prop-types";
import { useState } from "react";
import { NavLink as NavigationLink } from "react-router-dom";
import ChildNavLink from "./ChildNavLink";

export default function NavLink({ routeInfo }) {
  const [open, setOpen] = useState(true);

  const handleExpand = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="h-12 mb-[12px] main-menu">
        <NavigationLink
          to={routeInfo.link}
          className="flex h-12 items-center gap-4 p-[12px]"
          onClick={handleExpand}
        >
          {/* Left section with icon */}
          <div className="w-6 flex-shrink-0">
            <img
              src={routeInfo.icon}
              alt={routeInfo.title}
              className="w-6 h-6"
            />
          </div>

          {/* Title section */}
          <div className="flex-grow">
            <span className="text-[#FFFFFF] text-base select-none leading-tight whitespace-nowrap">
              {routeInfo.title}
            </span>
          </div>

          {/* Show `extend` icon if available */}
          {/* {routeInfo.extend && routeInfo.extend.length > 0 && (
            <span className="inline-block">
              <img
                src={routeInfo.extend[0].icon} // First extend icon
                alt={routeInfo.extend[0].title}
                className="w-5 h-5"
              />
            </span>
          )} */}
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
