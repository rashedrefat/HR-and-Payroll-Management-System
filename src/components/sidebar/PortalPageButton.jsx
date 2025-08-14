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
          className="flex h-14 items-center gap-4 bg-dark-border-layer-1 rounded-lg cursor-pointer"
        >
          <img
            className="pl-[12px] scale-125"
            src="/icons/admin.svg"
            alt="admin-portal"
          />
          <div className="flex w-full items-center justify-between">
            <div>
              <div className="text-white text-[15px] leading-tight">
                Admin Portal
              </div>
              <div className="text-gray-300 text-[11px] font-medium leading-[18px]">
                Workspace
              </div>
            </div>
            <div className="pr-[14px]">
              <img
                src="/icons/next-arrow-icon.svg"
                alt="next-icon"
                className="scale-150"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
