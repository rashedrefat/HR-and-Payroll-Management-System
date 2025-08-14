import React, { useState } from "react";

const Registration = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your registration logic here
    alert(`Registered as ${form.email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign Up</h2>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Name</label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Email</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
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
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Confirm Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none transition-all text-sm pr-12"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#FF0000] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#E60000] transition-colors duration-200"
        >
          Sign Up
        </button>

        <div className="text-center text-sm text-gray-600">
          <span>Already have an account? </span>
          <a href="/signin" className="font-semibold text-[#FF0000] hover:text-[#E60000]">
            Sign In
          </a>
        </div>
      </form>
    </div>
  );
};

export default Registration;
