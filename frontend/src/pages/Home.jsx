import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const { token } = useContext(AuthContext);

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/feed/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setArticles(response.data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchArticles();
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-500">
        Loading your feed...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif text-gray-900 mb-8 border-b border-gray-200 pb-4">
        Your Reading List
      </h1>

      {/* 3. Friendly empty state if they don't follow anyone yet */}
      {articles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border border-gray-200">
          <p className="text-gray-600 mb-4">
            Your feed is pretty quiet right now.
          </p>
          <p className="text-sm text-gray-500">
            Head over to the Explore page to find some historians to follow!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
