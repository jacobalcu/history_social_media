import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();

  const { logout, token, currentUser } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link
          to="/feed"
          className="text-2xl font-serif font-bold text-gray-900 tracking-tighter"
        >
          History Times
        </Link>
        <Link
          className="text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
          to="/explore"
        >
          Explore
        </Link>
        {token && (
          <Link
            className="text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
            to={`/feed`}
          >
            My Feed
          </Link>
        )}
        {token && (
          <Link
            className="text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
            to={`/new/article`}
          >
            Write Article
          </Link>
        )}
        {token && (
          <Link
            className="text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
            to={`/profile/${currentUser?.username}`}
          >
            Profile
          </Link>
        )}

        {!token && (
          <Link
            className="text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
            to="/login"
          >
            Login/Signup
          </Link>
        )}
        {token && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
}
