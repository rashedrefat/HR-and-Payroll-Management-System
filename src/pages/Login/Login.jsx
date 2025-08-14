import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    alert(`Login with ${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign In</h2>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none transition-all text-sm pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#FF0000] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#E60000] transition-colors duration-200"
        >
          Sign In
        </button>

        <div className="text-center text-sm text-gray-600">
          <span>Don't have an account? </span>
          <a href="/signup" className="font-semibold text-[#FF0000] hover:text-[#E60000]">
            Sign Up
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
