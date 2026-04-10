import { useState, useEffect } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SearchArticle() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);

  // Track current input box
  const [searchInput, setSearchInput] = useState("");
  // Track actual submitted query
  const [submittedQuery, setSubmittedQuery] = useState("");

  useEffect(() => {
    // Prevent empty submission on initial load
    if (!submittedQuery || submittedQuery.length < 2) {
      setArticles([]);
      return;
    }
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/articles/search`, {
          params: {
            q: submittedQuery,
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
  }, [skip, limit, submittedQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update query (runs useEffect again) and go back to first page
    if (searchInput.length >= 2) {
      setSubmittedQuery(searchInput);
      setSkip(0);
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-500">
  //       Loading your feed...
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-serif text-gray-900">Search History</h1>
          {/* {isLoading && (
            <span className="text-sm text-gray-400 font-sans">
              Searching...
            </span>
          )} */}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            value={searchInput}
            placeholder="Search for articles, tags, or topics..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            type="submit"
            disabled={searchInput.length < 2}
            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </form>
      </div>

      <div
        className={`space-y-6 transition-opacity duration-200 ${isLoading ? "opacity-50" : "opacity-100"}`}
      >
        {articles.length === 0 && submittedQuery ? (
          <div className="text-center text-gray-500 py-8">
            No historical records found for "{submittedQuery}".
          </div>
        ) : !submittedQuery ? (
          <div className="text-center text-gray-400 py-8 italic">
            Enter a search term to begin exploring.
          </div>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>

      {submittedQuery && articles.length > 0 && (
        <div className="mt-12 flex justify-between items-center border-t border-gray-200 pt-6">
          <button
            className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setSkip((prev) => prev - limit)}
            disabled={skip === 0 || isLoading}
          >
            Previous
          </button>

          <span className="text-sm text-gray-500 font-medium">
            Page {skip / limit + 1}
          </span>

          <button
            className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setSkip((prev) => prev + limit)}
            disabled={articles.length < limit || isLoading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
