import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Brand() {
  const { user } = useAuth();

  return (
    <Link to={user ? "/dashboard" : "/"}>
      <img
        className="w-[230px] h-auto object-contain -ml-5"
        src="/images/smarthrlogo2.png"
        alt="brand-logo"
      />
    </Link>
  );
}
