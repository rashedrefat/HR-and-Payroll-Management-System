import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../loading";

export default function PortalPageButton() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  return loading ? (
    <div className="w-full h-14 flex items-center justify-center">
      <Loading />
    </div>
  ) : (
    <>
      {user && (
        <div
          onClick={() => navigate("/admin-portal")}
          className="flex h-14 items-center gap-3 bg-red-700 hover:bg-red-800 rounded-lg cursor-pointer px-3 transition-colors duration-200 group"
        >
          {/* Admin Icon */}
          <div className="w-8 h-8 flex items-center justify-center">
            <img
              src="/icons/admin.svg"
              alt="admin-portal"
              className="w-6 h-6"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Fallback SVG icon */}
            <svg className="w-6 h-6 text-white hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          {/* Content */}
          <div className="flex-grow">
            <div className="text-white text-sm font-semibold leading-tight">
              Admin Portal
            </div>
            <div className="text-red-200 text-xs leading-tight">
              Workspace
            </div>
          </div>
          
          {/* Arrow */}
          <div className="w-4 h-4 flex items-center justify-center">
            <img
              src="/icons/next-arrow-icon.svg"
              alt="next-icon"
              className="w-4 h-4"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Fallback arrow */}
            <svg className="w-4 h-4 text-white group-hover:text-red-200 transition-colors hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}
