import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import ArticleCard from "../components/ArticleCard";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  // Gets username right out of browser's URL bar
  const { username } = useParams();

  // Use to check if they are viewing own profile or other persons
  // const isOwnProfile = (currentUser.username === username);
  // If true, can show "Edit Profile", "Drafts", hide "Follow"
  // If false, show "Follow", hide stting and edit

  const [profileData, setProfileData] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        // Stop loading if succeed or fail
        setIsLoading(false);
      }
    };

    fetchAllProfileData();
  }, [username]); // Update any time new user being viewed

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
      <div className="mt-12 space-y-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
