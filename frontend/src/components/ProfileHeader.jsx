export default function ProfileHeader({ profileData }) {
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
      <div className="flex gap-8 mt-6 text-sm uppercase tracking-widest text-gray-500">
        <p>{profileData.following} Following</p>
        <p>{profileData.followers} Followers</p>
      </div>
    </div>
  );
}
