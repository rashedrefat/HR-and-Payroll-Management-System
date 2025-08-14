import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { defaultImage } from "../../../constants";

export default function LoggedInUserInfoButton({ user }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 1500,
    });
    // Close dropdown
    setShowDropdown(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="max-w-[160px] h-10 flex items-center gap-1">
          <img
            className="w-10 h-10 md:w-8 md:h-8 rounded-full m-0 md:m-1.5"
            src={user?.profilePicture || defaultImage}
            alt="Profile"
          />
          <div
            data-tooltip-id="first-name"
            className="text-text-theme-sec dark:text-[#5F6368] hidden md:inline-block text-sm font-semibold leading-snug w-[133px] truncate m-2"
          >
            Hello, {user?.firstName}
          </div>
          <Tooltip id="first-name">{user?.firstName}</Tooltip>
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setShowDropdown(false)}
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
