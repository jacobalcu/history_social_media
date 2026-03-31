import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [matchPassword, setMatchPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Early return if non matching passwords
    if (password !== matchPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        username: username,
        password: password,
      });

      console.log("Success! User signed up.");

      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.response?.data?.detail || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-sm w-full space-y-8">
        <h1 className="text-4xl font-serif text-gray-900 text-center">
          Join the Archives
        </h1>
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            className="block text-xs uppercase tracking-widest text-gray-500 mb-2"
            htmlFor="username"
          >
            Username:
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-transparent mt-2"
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              value={username}
              id="username"
              name="username"
            />
          </label>
          <label
            className="block text-xs uppercase tracking-widest text-gray-500 mb-2"
            htmlFor="password"
          >
            Password:
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-transparent mt-2"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
              id="password"
              name="password"
            />
          </label>
          <label
            className="block text-xs uppercase tracking-widest text-gray-500 mb-2"
            htmlFor="matchPassword"
          >
            Re-enter Password:
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-transparent mt-2"
              onChange={(e) => setMatchPassword(e.target.value)}
              type="password"
              value={matchPassword}
              id="matchPassword"
              name="matchPassword"
            />
          </label>
          <button
            className="w-full bg-gray-900 text-white py-4 text-sm uppercase tracking-widest hover:bg-black transition-colors mt-4"
            type="submit"
          >
            Create Account
          </button>
        </form>
        <div className="text-center mt-8">
          <Link
            to="/login"
            className="text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors border-b border-transparent hover:border-gray-900 pb-1"
          >
            Already have an account? Sign in.
          </Link>
        </div>
      </div>
    </div>
  );
}
