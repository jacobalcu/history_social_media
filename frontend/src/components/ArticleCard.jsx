import { Link } from "react-router-dom"; // Removed unused useNavigate

export default function ArticleCard({ article }) {
  return (
    <Link
      to={`/article/${article.id}`}
      // Removed 'block', kept 'flex flex-col' for alignment
      className="p-6 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group flex flex-col h-full"
    >
      <h2 className="text-2xl font-serif text-gray-900 mb-2">
        {article.title}
      </h2>

      <div
        className="prose prose-sm prose-gray max-w-none font-sans text-gray-600 line-clamp-3 prose-p:my-0 mb-6"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Added mt-auto to push this to the absolute bottom of the card */}
      <p className="text-xs text-gray-400 mt-auto uppercase tracking-widest font-semibold">
        {article.period_label}
      </p>
    </Link>
  );
}
