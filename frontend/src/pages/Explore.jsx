import { useState, useEffect } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Explore() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/feed/explore`);

        setArticles(response.data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif text-gray-900 mb-8 border-b border-gray-200 pb-4">
        Explore Page
      </h1>
      <div className="space-y-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
