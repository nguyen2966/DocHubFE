interface FormErrorProps {
  message?: string | null
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null
  return (
    <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-rose-50 border border-rose-200">
      <span className="text-rose-500 mt-0.5 flex-shrink-0 text-xs">✕</span>
      <p className="text-sm text-rose-700">{message}</p>
    </div>
  )
}