import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        username: username,
        password: password,
      });
      console.log("Success! User logged in.");
      // Save to context for all protected routes

      // Navigate to following feed
      navigate("/feed");
    } catch (error) {
      console.error("Login Failed:", error.response?.data?.detail);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          Username:
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            value={username}
            id="username"
            name="username"
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
            id="password"
            name="password"
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
