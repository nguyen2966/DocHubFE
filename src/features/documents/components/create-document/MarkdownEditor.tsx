import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Markdown } from 'tiptap-markdown';

import {
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  ListBullets,
  ListNumbers,
} from '@phosphor-icons/react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export function MarkdownEditor({ value, onChange, error }: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'min-h-[260px] p-4 outline-none text-sm text-stone-900',
      },
    },
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown()
      onChange(markdown)
    },
  })

  if (!editor) return null

  return (
    <div
      className={`overflow-hidden rounded-xl border ${
        error ? 'border-red-500' : 'border-stone-200'
      }`}
    >
      <div className="flex items-center gap-1 border-b border-stone-200 p-2">
        <ToolbarButton
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <TextB size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <TextItalic size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <TextUnderline size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <TextStrikethrough size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-stone-200" />

        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListBullets size={16} />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListNumbers size={16} />
        </ToolbarButton>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

interface ToolbarButtonProps {
  children: React.ReactNode
  active?: boolean
  onClick: () => void
}

function ToolbarButton({ children, active, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex h-8 w-8 items-center justify-center
        rounded-md border
        transition-colors
        ${active
          ? 'border-stone-300 bg-stone-100'
          : 'border-transparent hover:bg-stone-100'
        }
      `}
    >
      {children}
    </button>
  )
}
