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
        class: `prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-foreground
          prose-h1:text-4xl prose-h1:mb-6
          prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
          prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
          prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground prose-strong:font-semibold
          prose-em:text-foreground/90
          prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
          prose-li:text-foreground/90 prose-li:mb-2
          prose-blockquote:border-l-4 prose-blockquote:border-primary/50
          prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground/80
          prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-code:text-sm prose-code:text-foreground
          prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
          prose-img:rounded-lg prose-img:shadow-md
          ${className}`,
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
