import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

export default function ChildNavLink({ routeInfo }) {
  return (
    <div className="mb-[12px] w-[190px] ml-auto relative  sub-menu">
      <NavLink
        to={routeInfo.link}
        className="flex h-[36px] mt-[3px] items-center gap-[12px] p-[12px]"
      >
        <span className="text-[#FFFFFF] text-base leading-tight whitespace-nowrap px-[2px]">
          {routeInfo.title}
        </span>
      </NavLink>
    </div>
  );
}

ChildNavLink.propTypes = {
  routeInfo: PropTypes.object.isRequired,
};
