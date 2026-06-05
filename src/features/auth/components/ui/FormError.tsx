import { CircleAlert } from 'lucide-react';

interface FormErrorProps {
  message?: string | null
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null
  return (
    <div className="flex items-start gap-1.5 px-1.5 py-1.5 ">
      <CircleAlert size={20} color='red'/>
      <p className="text-sm text-rose-700">{message}</p>
    </div>
  )
}