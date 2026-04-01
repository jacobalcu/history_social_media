import { useState } from "react";
import FollowModal from "./FollowModal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProfileHeader({ profileData }) {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    endpoint: "",
  });

  // Set modal config
  const openFollowers = () => {
    setModalConfig({
      isOpen: true,
      title: "Followers",
      endpoint: `${BASE_URL}/users/${profileData.user.username}/followers`,
    });
  };

  const openFollowing = () => {
    setModalConfig({
      isOpen: true,
      title: "Following",
      endpoint: `${BASE_URL}/users/${profileData.user.username}/following`,
    });
  };

  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  return (
    <div className="flex flex-col items-center py-12 border-b border-gray-200">
      <h1 className="text-4xl font-serif text-gray-900 tracking-tight">
        {profileData.user.username}
      </h1>
      {profileData.user.bio && (
        <p className="text-lg text-gray-600 mt-4 max-w-xl text-center">
          {profileData.user.bio}
        </p>
      )}

      <div className="flex gap-6 mt-6">
        <button
          onClick={openFollowing}
          className="group flex items-baseline gap-1.5 hover:opacity-60 transition-opacity cursor-pointer"
        >
          <span className="text-lg font-medium text-gray-900 leading-none">
            {profileData.following}
          </span>
          <span className="text-xs uppercase tracking-widest text-gray-500 leading-none group-hover:text-gray-700 transition-colors">
            Following
          </span>
        </button>

        <button
          onClick={openFollowers}
          className="group flex items-baseline gap-1.5 hover:opacity-60 transition-opacity cursor-pointer"
        >
          <span className="text-lg font-medium text-gray-900 leading-none">
            {profileData.followers}
          </span>
          <span className="text-xs uppercase tracking-widest text-gray-500 leading-none group-hover:text-gray-700 transition-colors">
            Followers
          </span>
        </button>
      </div>

      {modalConfig.isOpen && (
        <FollowModal
          title={modalConfig.title}
          endpoint={modalConfig.endpoint}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
