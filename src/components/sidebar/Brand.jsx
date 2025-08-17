import { Link } from "react-router-dom";

export default function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <img
        className="w-10 h-10 object-contain"
        src="/images/smarthrlogo2.png"
        alt="brand-logo"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      {/* Fallback logo */}
      <div className="w-10 h-10 bg-white rounded-lg hidden items-center justify-center">
        <span className="text-red-600 font-bold text-sm">HR</span>
      </div>
      <div>
        <h2 className="text-xl font-bold text-white group-hover:text-red-100 transition-colors">
          SmartHR
        </h2>
        <p className="text-xs text-red-200">Payroll System</p>
      </div>
    </Link>
  );
}
