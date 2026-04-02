import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditProfile() {
  const { currentUser, token, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Safeguard: If context is still booting up
  if (!currentUser) {
    return (
      <div className="text-center mt-20 text-gray-500 uppercase tracking-widest text-sm animate-pulse">
        Loading Profile...
      </div>
    );
  }

  // You immediately use the globally trusted currentUser data to fill the form!
  const [username, setUsername] = useState(currentUser.username || "");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState(currentUser.bio || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { username: username, bio: bio };
    if (password.trim() !== "") {
      payload.password = password;
    }

    try {
      const response = await axios.patch(`${BASE_URL}/users/edit`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setCurrentUser(response.data);
        navigate(`/profile/${username}`);
      }
    } catch (error) {
      console.error("Failed to edit profile:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto px-4 py-12 space-y-8"
    >
      <label
        className="block text-xs uppercase tracking-widest text-gray-500 mb-2"
        htmlFor="username"
      >
        New Username:
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
        htmlFor="bio"
      >
        New Bio:
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-transparent mt-2"
          onChange={(e) => setBio(e.target.value)}
          type="text"
          value={bio}
          id="bio"
          name="bio"
        />
      </label>

      <label
        className="block text-xs uppercase tracking-widest text-gray-500 mb-2"
        htmlFor="password"
      >
        New Password{" "}
        <span className="text-gray-400 lowercase">
          (leave blank to keep current)
        </span>
        :
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-transparent mt-2"
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
        Update Account
      </button>
    </form>
  );
}
