import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { themeStatus, toggle } from "../../features/theme/themeSlice";
import { useAuth } from "../hooks/useAuth";
import Notification from "../notification/Notification";
import Overlay from "../overlay/Overlay";
import LoggedInUserInfoButton from "./LoggedInUserInfoButton";
import SearchBar from "./SearchBar";
import Toggler from "./Toggler";

export default function Navbar() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const currentTheme = useSelector(themeStatus);
  const [notificationPopup, setNotificationPopup] = useState(false);

  function handleThemeToggle() {
    dispatch(toggle());
  }

  function closeNotificationPopup() {
    setNotificationPopup(false);
  }

  return (
    <>
      <nav className="bg-default-theme dark:bg-dark-theme border-dark-theme dark:border-slate-700 ml-0 lg:ml-[250px] flex items-center sticky top-0 z-20 border-b border-[#DEDEDE]">
        <div className="flex-1 flex items-center gap-4 p-3">
          <div className="flex items-center">
            <div
              onClick={() => dispatch(toggle())}
              className="cursor-pointer w-12 h-12 flex items-center justify-center"
            >
              <img src="/icons/3Bar.svg" alt="menu" className="w-6 h-6" />
            </div>
          </div>
          <SearchBar className="h-10" />
        </div>
        <div className="flex items-center gap-2 xs:gap-5 p-3">
          <Toggler
            checked={Number(currentTheme) === 2}
            handleChange={handleThemeToggle}
            text="Light Mode"
          />

          <div className="w-8 h-8 flex items-center" title="Notification">
            <div
              className="cursor-pointer relative"
              onClick={() => setNotificationPopup(true)}
            >
              <div className="absolute right-0.5">
                <span className="relative flex h-[9px] w-[9px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-[9px] w-[9px] bg-red-600 z-10"></span>
                </span>
              </div>
              <img src="/icons/Notification.svg" alt="Notification" />
            </div>
          </div>

          {user ? (
            <LoggedInUserInfoButton user={user} />
          ) : (
            <a
              href="/signin"
              className="inline-flex items-center px-4 py-2 h-10 bg-[#FF0000] text-white rounded-lg font-medium hover:bg-[#E60000] transition"
            >
              Sign In
            </a>
          )}
        </div>
      </nav>

      {notificationPopup && (
        <Overlay>
          <Notification closeNotificationPopup={closeNotificationPopup} />
        </Overlay>
      )}
    </>
  );
}
