export default function SearchBar({
  placeholder = "Search orders, tasks, team, etc...",
  className = "",
  inputClassName = "",
  iconSrc = "/icons/search-icon.svg",
  onChange,
  value,
  hidden = false,
  showOnAllScreens = false,
}) {
  if (hidden) return null;

  return (
    <form
      className={`w-[390px] min-w-[160px] border border-gray-300 bg-white rounded-lg shadow-md ${
        showOnAllScreens ? "flex" : "lg:flex hidden"
      } ${className}`}
    >
      <img src={iconSrc} alt="search" className="p-2.5" />
      <input
        className={`w-full text-black placeholder:text-gray-500 bg-transparent px-3 py-2 focus:outline-none ${inputClassName}`}
        type="search"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </form>
  );
}
