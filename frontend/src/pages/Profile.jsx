import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import ArticleCard from "../components/ArticleCard";
import { AuthContext } from "../context/AuthContext";
import WebSocketTest from "../components/WebSocketTest";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  // Gets username right out of browser's URL bar
  const { username } = useParams();
  const { currentUser, token } = useContext(AuthContext);

  const isOwnProfile = currentUser?.username === username;

  // Use to check if they are viewing own profile or other persons
  // If true, can show "Edit Profile", "Drafts", hide "Follow"
  // If false, show "Follow", hide stting and edit

  const [profileData, setProfileData] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const fetchAllProfileData = async () => {
      // Reset just in case
      setIsLoading(true);
      try {
        // Sends requests concurrently
        const [profileResponse, articlesResponse] = await Promise.all([
          axios.get(`${BASE_URL}/users/${username}`),
          axios.get(`${BASE_URL}/users/${username}/articles`),
        ]);

        // Once both return, save to React state
        setProfileData(profileResponse.data);
        setArticles(articlesResponse.data);

        // We only run this if they are logged in AND it's not their own profile
        if (token && currentUser?.username !== username) {
          const followResponse = await axios.get(
            `${BASE_URL}/users/${username}/follow-status`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          setFollowing(followResponse.data.is_following);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        // Stop loading if succeed or fail
        setIsLoading(false);
      }
    };

    fetchAllProfileData();
  }, [username, token, currentUser]); // Update any time new user being viewed

  const toggleFollow = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${BASE_URL}/users/${username}/follow`,
        {}, // Empty body so it doesn't think the header is the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const isNowFollowing = !following;
      // Doesn't matter what backend sends as long as it was successful
      setFollowing(isNowFollowing);

      // Manually update the follower count in the profile object
      setProfileData((prevData) => ({
        ...prevData, // Keep all the other profile info (bio, username) exactly the same
        followers: isNowFollowing
          ? prevData.followers + 1 // If they just followed, add 1
          : prevData.followers - 1, // If they just unfollowed, subtract 1
      }));
    } catch (error) {
      console.error("Follow Failed:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Not loading but no user found
  if (!profileData) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <ProfileHeader profileData={profileData} />
      {!isOwnProfile && token && (
        <div className="mt-6 mb-12">
          <button
            onClick={toggleFollow}
            className={`px-8 py-2 text-xs uppercase tracking-widest transition-colors border ${
              following
                ? "bg-white text-gray-900 border-gray-900 hover:bg-gray-50"
                : "bg-gray-900 text-white border-gray-900 hover:bg-black"
            }`}
          >
            {following ? "Unfollow" : "Follow"}
          </button>
        </div>
      )}
      <div className="mt-12 space-y-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
