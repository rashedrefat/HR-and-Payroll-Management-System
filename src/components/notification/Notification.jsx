import PropTypes from "prop-types";
import OutsideClickHandler from "react-outside-click-handler";
import SingleNotification from "./SingleNotification";

export default function Notification({ closeNotificationPopup }) {
  return (
    <OutsideClickHandler onOutsideClick={closeNotificationPopup}>
      <div className="fixed top-16 right-3 sm:right-20 w-[330px] sm:w-[440px] h-[506px] bg-default-theme rounded-2xl shadow-lg z-30">
        <div className="flex justify-between items-center p-5">
          <div className="text-white text-xl font-medium leading-normal">
            Notification
          </div>
          <div className="w-6 h-6 flex-col justify-center items-center inline-flex">
            <div className="cursor-pointer" onClick={closeNotificationPopup}>
              <img src="/icons/close2.svg" alt="close" />
            </div>
          </div>
        </div>

        <div className="h-[390px] overflow-y-auto">
          <SingleNotification />
          <SingleNotification unread={true} />
          <SingleNotification unread={true} />
          <SingleNotification />
          <SingleNotification />
        </div>
        <div className="flex items-center gap-2 px-6 py-3">
          <input
            className="accent-white cursor-pointer"
            type="checkbox"
            name="mark-all"
            id="mark-all"
          />
          <label
            htmlFor="mark-all"
            className="text-text-theme-sec select-none text-sm cursor-pointer font-semibold leading-[18px]"
          >
            Mark all as read
          </label>
        </div>
      </div>
    </OutsideClickHandler>
  );
}

Notification.propTypes = {
  closeNotificationPopup: PropTypes.func,
};
