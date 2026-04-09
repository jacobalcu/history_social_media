import { useState, useEffect } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Explore() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/feed/explore`, {
          params: {
            skip: skip,
            limit: limit,
          },
        });

        setArticles(response.data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, [skip, limit]);

  // if (isLoading) {
  //   return (
  //     <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-500">
  //       Loading your feed...
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif text-gray-900 mb-8 border-b border-gray-200 pb-4">
        <span>Explore Page</span>
        {isLoading && (
          <span className="text-sm text-gray-400 font-sans">Loading...</span>
        )}
      </h1>
      <div
        className={`space-y-6 transition-opacity duration-200 ${isLoading ? "opacity-50" : "opacity-100"}`}
      >
        {articles.length === 0 && !isLoading ? (
          <div className="text-center text-gray-500 py-8">
            No articles found.
          </div>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>
      <div className="mt-12 flex justify-between items-center border-t border-gray-200 pt-6">
        <button
          className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            setSkip((prev) => prev - limit);
          }}
          disabled={skip === 0 || isLoading}
        >
          Previous
        </button>

        <span className="text-sm text-gray-500 font-medium">
          Page {skip / limit + 1}
        </span>
        <button
          className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            setSkip((prev) => prev + limit);
          }}
          disabled={articles.length < limit || isLoading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
