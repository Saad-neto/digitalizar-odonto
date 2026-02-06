import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';

interface PostContentProps {
  content: any; // JSON do Tiptap
  className?: string;
}

/**
 * Componente para renderizar conteúdo rico do blog (read-only)
 * Usa Tiptap em modo visualização (não-editável)
 */
export function PostContent({ content, className = '' }: PostContentProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'rounded-lg my-4 max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80 transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content,
    editable: false, // Somente leitura
    editorProps: {
      attributes: {
        class: `blog-post-content ${className}`,
      },
    },
  });

  if (!editor) {
    return <div className="animate-pulse">Carregando conteúdo...</div>;
  }

  return (
    <div className="blog-post-content">
      <EditorContent editor={editor} />
    </div>
  );
}
