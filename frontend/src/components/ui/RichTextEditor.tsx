import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Quote, Link as LinkIcon, Heading2, Heading3, Minus,
} from 'lucide-react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all duration-150 ${
        active
          ? 'bg-nemo-orange text-white'
          : 'text-nemo-bg/60 hover:bg-white/8 hover:text-nemo-bg'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-nemo-orange underline' } }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose-editor focus:outline-none min-h-[220px] p-4',
        ...(placeholder ? { 'data-placeholder': placeholder } : {}),
      },
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes('link').href ?? '';
    const url = window.prompt('URL du lien :', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="rounded-xl border border-nemo-dark-border bg-nemo-dark-bg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-nemo-dark-border bg-nemo-dark-surface">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Gras">
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italique">
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Souligné">
          <UnderlineIcon size={14} />
        </ToolbarBtn>

        <div className="w-px h-5 bg-nemo-dark-border mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titre H2">
          <Heading2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titre H3">
          <Heading3 size={14} />
        </ToolbarBtn>

        <div className="w-px h-5 bg-nemo-dark-border mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Liste à puces">
          <List size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Liste numérotée">
          <ListOrdered size={14} />
        </ToolbarBtn>

        <div className="w-px h-5 bg-nemo-dark-border mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citation">
          <Quote size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={setLink} active={editor.isActive('link')} title="Insérer un lien">
          <LinkIcon size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Séparateur horizontal">
          <Minus size={14} />
        </ToolbarBtn>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  );
}
