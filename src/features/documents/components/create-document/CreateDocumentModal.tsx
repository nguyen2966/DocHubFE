import { useState } from 'react';
import { X } from '@phosphor-icons/react';

import { MarkdownEditor } from './MarkdownEditor';
import { createMarkdownDocumentSchema } from '../../schema/document.schema';

interface Props {
  open: boolean
  onClose: () => void
  onCreate: (
    title: string,
    content: string,
  ) => void
}

export function CreateDocumentModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<{
    title?: string
    markdownContent?: string
  }>({})

  const validate = (nextTitle: string, nextContent: string) => {
    const result = createMarkdownDocumentSchema.safeParse({
      title: nextTitle,
      markdownContent: nextContent,
    })

    if (result.success) {
      setErrors({})
      return true
    }

    const fieldErrors = result.error.flatten().fieldErrors
    setErrors({
      title: fieldErrors.title?.[0],
      markdownContent: fieldErrors.markdownContent?.[0],
    })
    return false
  }

  const handleTitleChange = (nextTitle: string) => {
    setTitle(nextTitle)
    validate(nextTitle, content)
  }

  const handleContentChange = (nextContent: string) => {
    setContent(nextContent)
    validate(title, nextContent)
  }

  const handleCreate = () => {
    if (!validate(title, content)) return
    onCreate(title.trim(), content)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-[840px] max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-5">
          <h2 className="text-xl font-semibold">
            New document
          </h2>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-150px)] space-y-5 overflow-y-auto px-5 py-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Title
            </label>

            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter a title..."
              aria-invalid={Boolean(errors.title)}
              className={`
                w-full rounded-lg border px-3 py-2 outline-none
                ${
                  errors.title
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-stone-200 focus:border-stone-400'
                }
              `}
            />

            <div className="mt-1 flex items-start justify-between gap-3 text-xs">
              <p className="min-h-4 text-red-500">{errors.title}</p>
              <span
                className={
                  title.length > 255 ? 'text-red-500' : 'text-stone-400'
                }
              >
                {title.length}/255 characters
              </span>
            </div>
          </div>

          <div>
            <MarkdownEditor
              value={content}
              onChange={handleContentChange}
              error={Boolean(errors.markdownContent)}
            />

            <div className="mt-1 flex items-start justify-between gap-3 text-xs">
              <p className="min-h-4 text-red-500">
                {errors.markdownContent}
              </p>
              <span
                className={
                  content.length > 50000 ? 'text-red-500' : 'text-stone-400'
                }
              >
                {content.length}/50,000 characters
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-stone-200 p-4">
          <button
            onClick={onClose}
            className="
              rounded-lg border border-stone-200
              px-4 py-2 text-sm
            "
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="
              rounded-lg bg-stone-900
              px-4 py-2 text-sm text-white
            "
          >
            Create document
          </button>
        </div>
      </div>
    </div>
  )
}
