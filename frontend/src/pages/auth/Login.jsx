import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Login() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        username: username,
        password: password,
      });
      console.log("Success! User logged in.");
      // Save to context for all protected routes
      login(response.data["access_token"]);
      // Navigate to user profile
      navigate(`/profile/${username}`);
    } catch (error) {
      console.error("Login Failed:", error.response?.data?.detail);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-sm w-full space-y-8">
        <h1 className="text-4xl font-serif text-gray-900 text-center">
          Login Page
        </h1>
        <form onSubmit={handleSubmit}>
          <label
            className="block text-xs uppercase tracking-widest text-gray-500 mb-2"
            htmlFor="username"
          >
            Username:
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-transparent"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
              id="password"
              name="password"
            />
          </label>
          <button
            className="w-full bg-gray-900 text-white py-4 text-sm uppercase tracking-widest hover:bg-black transition-colors mt-4"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
