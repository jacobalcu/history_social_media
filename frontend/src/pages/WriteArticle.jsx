import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function WriteArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { token, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/articles/`,
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
      console.error("Failed to create article:", error);
    }
  };
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
        Publish
      </button>
    </form>
  );
}
