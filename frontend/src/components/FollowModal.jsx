import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function FollowModal({ title, endpoint, onClose }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lock background scrolling when modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Fetch data only when modal renders
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(endpoint);
        setUsers(response.data);
      } catch (error) {
        console.error(`Failed to fetch ${title}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [endpoint, title]);

  return (
    // Backdrop
    // fixed inset-0 covers whole screen
    // onClick={onClose} ensures clicking dim area closes the modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      onClick={onClose}
    >
      {/* e.stopPropagation() stops click on modal from "bubbling up" to backdrop (closing the modal) */}
      <div
        className="bg-white w-full max-w-sm max-h-[70vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-serif text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 text-3xl leading-none"
          >
            {/* HTML entity (x) */}
            &times;
          </button>
        </div>

        {/* User List (Scrollable) */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {isLoading ? (
            <p className="text-gray-500 text-sm text-center animate-pulse">
              Loading...
            </p>
          ) : users.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No users found.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <Link
                  to={`/profile/${user.username}`}
                  onClick={onClose}
                  className="text-lg font-serif text-gray-900 hover:underline"
                >
                  {user.username}
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
