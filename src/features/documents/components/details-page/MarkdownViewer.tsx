interface MarkdownViewerProps {
  content: string
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="min-h-[600px] bg-stone-50 px-8 py-6">
      <div className="mx-auto min-h-[720px] max-w-[760px] bg-white px-10 py-8 shadow-sm">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-stone-900">
          {content || 'Empty document'}
        </pre>
      </div>
    </div>
  )
}