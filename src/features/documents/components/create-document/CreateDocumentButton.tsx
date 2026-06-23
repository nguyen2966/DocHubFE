import { useEffect, useRef, useState } from 'react'
import {
  FilePlus,
  UploadSimple,
  TextT,
} from '@phosphor-icons/react';

import { Button } from '../../../auth/components/ui/Button';

interface CreateDocumentButtonProps {
  onUploadPdf: () => void
  onCreateBlank: () => void
}

export function CreateDocumentButton({
  onUploadPdf,
  onCreateBlank,
}: CreateDocumentButtonProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
    >
      <Button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-semi-bold rounded-xl hover:bg-stone-700 transition-colors"
      >
        <FilePlus size={16} />
        Create document
      </Button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[200px] overflow-hidden rounded-[20px] border border-stone-200 bg-white shadow-xl">
          <button
            onClick={() => {
              setOpen(false)
              onUploadPdf()
            }}
            className="flex w-full items-center gap-3
                        px-4 py-3
                        text-sm
                        hover:bg-stone-50"
          >
            <UploadSimple size={18} />
            <span className="text-1xl font-normal">
              Upload PDF
            </span>
          </button>

          <button
            onClick={() => {
              setOpen(false)
              onCreateBlank()
            }}
            className="flex w-full items-center gap-3
                        px-4 py-3
                        text-sm
                        hover:bg-stone-50"
          >
            <TextT size={18} />
            <span className="text-1xl font-normal">
              New blank document
            </span>
          </button>
        </div>
      )}
    </div>
  )
}