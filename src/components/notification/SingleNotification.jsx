import PropTypes from "prop-types";

export default function SingleNotification({ unread }) {
  return (
    <div
      className={`flex gap-4 items-center bg-dark-theme-primary select-none cursor-pointer justify-between px-5 py-4`}
    >
      <div className="relative">
        <img
          className="min-w-[32px] h-[32px] rounded-full"
          src="https://mui.com/static/images/avatar/1.jpg"
          alt="profile-picture"
        />
        {unread && (
          <div className="h-2.5 w-2.5 bg-green-500 rounded-full absolute top-0 right-0 border-2 border-white"></div>
        )}
      </div>
      <div>
        <span className="text-white text-sm font-medium leading-tight">
          Ecludx - Coupon added&nbsp;
        </span>
        <span className="text-white text-sm font-normal leading-tight">
          No bill charges found for this subscription.
        </span>
      </div>
      <div>
        <div className="text-gray-200 text-sm font-medium whitespace-nowrap leading-none">
          5 min
        </div>
      </div>
    </div>
  );
}

SingleNotification.propTypes = {
  unread: PropTypes.bool,
};
