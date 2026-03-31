import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  return (
    <Link
      to={`/article/${article.id}`}
      className="p-6 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group flex flex-col block"
    >
      <h2 className="text-2xl font-serif text-gray-900 mb-2">
        {article.title}
      </h2>
      <p className="text-gray-600 line-clamp-3 leading-relaxed">
        {article.content}
      </p>
      <p className="text-xs text-gray-400 mt-4">{article.period_label}</p>
    </Link>
  );
}
