import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Article() {
  const { article_id } = useParams();
  const { token, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [alreadyLiked, setAlreadyLiked] = useState(false);

  const isAuthor = currentUser?.id === article?.article?.author_id;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}/articles/${article_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/profile/${currentUser.username}`);
    } catch (error) {
      console.error("Failed to delete article:", error);
      alert("Something went wrong trying to delete this article.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(false);

      try {
        // Fetch public article data
        const articleResponse = await axios.get(
          `${BASE_URL}/articles/${article_id}`,
        );
        const articleData = articleResponse.data;
        setArticle(articleData);

        // Fetch author data
        if (articleData.article.author_id) {
          const authorResponse = await axios.get(
            `${BASE_URL}/users/id/${articleData.article.author_id}`,
          );
          setAuthor(authorResponse.data.user);
        }

        // If logged in, fetch user's like status
        if (token) {
          const likeResponse = await axios.get(
            `${BASE_URL}/articles/${article_id}/like-status`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setAlreadyLiked(likeResponse.data.is_liked);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [article_id, token]);

  const toggleLike = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      await axios.post(
        `${BASE_URL}/articles/${article_id}/toggle-like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const isNowLiked = !alreadyLiked;
      setAlreadyLiked(isNowLiked);

      // Math for total likes
      setArticle((prev) => ({
        ...prev,
        likes: isNowLiked ? prev.likes + 1 : prev.likes - 1,
      }));
    } catch (error) {
      console.error("Like Failed:", error);
    }
  };

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
        {article.article.period_label && (
          <span className="block text-xs uppercase tracking-widest text-gray-500 mb-6">
            {article.article.period_label}
          </span>
        )}

        <h1 className="text-5xl md:text-6xl font-serif text-gray-900 leading-tight mb-8">
          {article.article.title}
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

        {isAuthor && (
          <div className="flex gap-6 mt-8 pt-6 border-t border-gray-50">
            <Link
              to={`/edit/article/${article_id}`}
              className="text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors border-b border-transparent hover:border-gray-900 pb-0.5"
            >
              Edit Article
            </Link>
            <button
              onClick={handleDelete}
              className="text-xs uppercase tracking-widest text-red-300 hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600 pb-0.5"
            >
              Delete Article
            </button>
          </div>
        )}
      </header>

      {/* --- CONTENT SECTION --- */}
      {/* whitespace-pre-wrap keeping paragraphs intact */}
      <div className="text-lg md:text-xl text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
        {article.article.content}
      </div>

      {/* --- NEW LIKE BUTTON SECTION --- */}
      <div className="mt-16 pt-8 border-t border-gray-100 flex items-center">
        <button
          onClick={toggleLike}
          disabled={!token} // Disable if they aren't logged in
          className={`group flex items-center gap-3 px-6 py-3 border transition-colors ${
            alreadyLiked
              ? "bg-red-50 border-red-200 text-red-600"
              : "bg-white border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900"
          } ${!token && "opacity-50 cursor-not-allowed"}`}
        >
          {/* Heart Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={alreadyLiked ? "currentColor" : "none"}
            stroke="currentColor"
            className="w-5 h-5 transition-transform group-active:scale-90"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>

          <span className="font-medium text-sm">
            {article.likes} {article.likes === 1 ? "Like" : "Likes"}
          </span>
        </button>

        {!token && (
          <span className="ml-4 text-xs text-gray-400 uppercase tracking-widest">
            Log in to like this article
          </span>
        )}
      </div>
    </article>
  );
}
