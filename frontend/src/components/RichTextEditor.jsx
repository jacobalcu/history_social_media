import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// 1. The Toolbar Component
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  // A tiny helper to style active buttons vs inactive buttons
  const activeClass = "bg-gray-900 text-white";
  const inactiveClass = "bg-gray-100 text-gray-600 hover:bg-gray-200";
  const btnClass =
    "px-3 py-1.5 text-xs font-medium rounded-sm transition-colors";

  return (
    <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 pb-4">
      <button
        type="button" // CRUCIAL: Prevents clicking this from submitting your form!
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btnClass} ${editor.isActive("bold") ? activeClass : inactiveClass}`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btnClass} ${editor.isActive("italic") ? activeClass : inactiveClass}`}
      >
        Italic
      </button>

      {/* A tiny divider */}
      <div className="w-px bg-gray-300 mx-2"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${btnClass} ${editor.isActive("heading", { level: 2 }) ? activeClass : inactiveClass}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${btnClass} ${editor.isActive("heading", { level: 3 }) ? activeClass : inactiveClass}`}
      >
        H3
      </button>

      <div className="w-px bg-gray-300 mx-2"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btnClass} ${editor.isActive("bulletList") ? activeClass : inactiveClass}`}
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${btnClass} ${editor.isActive("blockquote") ? activeClass : inactiveClass}`}
      >
        Quote
      </button>
    </div>
  );
};

// 2. The Main Editor Component
export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        // Here we use Tailwind's 'prose' class to automatically make the HTML look beautiful!
        class:
          "prose prose-lg prose-gray max-w-none focus:outline-none min-h-[400px]",
      },
    },
    // Every time the user types, pass the raw HTML string back to the parent component
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full border border-gray-200 p-4 bg-white/50">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
