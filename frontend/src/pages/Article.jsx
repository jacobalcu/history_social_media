import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Article() {
  const { article_id } = useParams();

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const articleResponse = await axios.get(
          `${BASE_URL}/articles/${article_id}`,
        );
        const articleData = articleResponse.data;
        setArticle(articleData);

        if (articleData.author_id) {
          const authorResponse = await axios.get(
            `${BASE_URL}/users/id/${articleData.author_id}`,
          );
          setAuthor(authorResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [article_id]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-400 tracking-widest uppercase text-sm animate-pulse">
          Retrieving Archives...
        </p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <p className="text-gray-900 font-serif text-3xl">Record Not Found</p>
        <Link
          to="/explore"
          className="text-xs uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors border-b border-transparent hover:border-gray-900 pb-1"
        >
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-16 md:py-24">
      <header className="mb-12 border-b border-gray-200 pb-10">
        {article.period_label && (
          <span className="block text-xs uppercase tracking-widest text-gray-500 mb-6">
            {article.period_label}
          </span>
        )}

        <h1 className="text-5xl md:text-6xl font-serif text-gray-900 leading-tight mb-8">
          {article.title}
        </h1>

        {/* author data here*/}
        {author && (
          <div className="flex items-center gap-4 mt-8">
            <div>
              <Link
                to={`/profile/${author.username}`}
                className="text-lg font-serif text-gray-900 hover:underline"
              >
                {author.username}
              </Link>
              {author.bio && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                  {author.bio}
                </p>
              )}
            </div>
          </div>
        )}
      </header>

      {/* --- CONTENT SECTION --- */}
      {/* whitespace-pre-wrap keeping paragraphs intact */}
      <div className="text-lg md:text-xl text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
        {article.content}
      </div>
    </article>
  );
}
