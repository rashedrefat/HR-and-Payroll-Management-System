import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Loading from "../loading";

export default function PortalPageButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const isActive = location.pathname === '/admin-portal';

  return loading ? (
    <div className="w-full h-14 flex items-center justify-center">
      <Loading />
    </div>
  ) : (
    <>
      {user && (
        <div
          onClick={() => navigate("/admin-portal")}
          className={`flex h-14 items-center gap-3 border border-gray-200 rounded-lg cursor-pointer px-3 transition-all duration-300 transform group ${
            isActive 
              ? 'bg-red-600 text-white shadow-lg scale-105' 
              : 'bg-gray-100 hover:bg-red-100 hover:scale-105 hover:shadow-lg hover:border-red-300'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Admin Icon */}
          <div className="w-8 h-8 flex items-center justify-center">
            <img
              src="/icons/admin.svg"
              alt="admin-portal"
              className="w-6 h-6 transition-all duration-200"
              style={{
                filter: isActive 
                  ? 'brightness(0) invert(1)' 
                  : isHovered 
                    ? 'brightness(0) saturate(100%) invert(27%) sepia(89%) saturate(3072%) hue-rotate(338deg) brightness(89%) contrast(82%)' 
                    : 'brightness(0)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Fallback SVG icon */}
            <svg className={`w-6 h-6 hidden transition-colors duration-200 ${
              isActive ? 'text-white' : isHovered ? 'text-red-700' : 'text-black'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          {/* Content */}
          <div className="flex-grow">
            <div className={`text-sm font-semibold leading-tight transition-colors ${
              isActive ? 'text-white' : isHovered ? 'text-red-700' : 'text-gray-900'
            }`}>
              Admin Portal
            </div>
            <div className={`text-xs leading-tight transition-colors ${
              isActive ? 'text-white' : isHovered ? 'text-red-600' : 'text-gray-600'
            }`}>
              Workspace
            </div>
          </div>
          
          {/* Arrow */}
          <div className="w-4 h-4 flex items-center justify-center">
            <img
              src="/icons/next-arrow-icon.svg"
              alt="next-icon"
              className="w-4 h-4 transition-all duration-200"
              style={{
                filter: isActive 
                  ? 'brightness(0) invert(1)' 
                  : isHovered 
                    ? 'brightness(0) saturate(100%) invert(27%) sepia(89%) saturate(3072%) hue-rotate(338deg) brightness(89%) contrast(82%)' 
                    : 'brightness(0)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Fallback arrow */}
            <svg className={`w-4 h-4 transition-colors hidden ${
              isActive ? 'text-white' : isHovered ? 'text-red-700' : 'text-black'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}
