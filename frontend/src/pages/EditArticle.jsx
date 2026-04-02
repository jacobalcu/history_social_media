import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditArticle() {
  const { article_id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { token, currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/articles/${article_id}`);
        setTitle(response.data.article.title);
        setContent(response.data.article.content);

        // Security check: Kick them out if they aren't the author
        if (response.data.article.author_id !== currentUser?.id) {
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchArticle();
    }
  }, [article_id, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `${BASE_URL}/articles/${article_id}`,
        {
          title: title,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response) {
        navigate(`/profile/${currentUser?.username}`);
      }
    } catch (error) {
      console.error("Failed to edit article:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-20 text-gray-500 uppercase tracking-widest text-sm animate-pulse">
        Loading Draft...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto px-4 py-12 space-y-8"
    >
      <input
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        value={title}
        id="title"
        name="title"
        placeholder="Article Title..."
        className="w-full text-5xl font-serif text-gray-900 placeholder-gray-300 focus:outline-none bg-transparent"
        required
      />
      <RichTextEditor content={content} onChange={setContent} />
      <button
        className="w-full bg-gray-900 text-white py-4 text-sm uppercase tracking-widest hover:bg-black transition-colors mt-4"
        type="submit"
      >
        Revise History
      </button>
    </form>
  );
}
