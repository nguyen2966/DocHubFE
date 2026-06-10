import { useState } from 'react';
import { X } from '@phosphor-icons/react';

import { MarkdownEditor } from './MarkdownEditor';

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
              maxLength={255}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter a title..."
              className="
                w-full rounded-lg border border-stone-200
                px-3 py-2 outline-none
                focus:border-stone-400
              "
            />

            <div className="mt-1 text-right text-xs text-stone-400">
              {title.length}/255 characters
            </div>
          </div>

          <div>
            <MarkdownEditor
              value={content}
              onChange={setContent}
            />

            <div className="mt-1 text-right text-xs text-stone-400">
              {content.length}/50,000 characters
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
            onClick={() =>
              onCreate(title, content)
            }
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