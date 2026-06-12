import { ArrowLeft } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

interface DocumentBackButtonProps {
  workspaceId: string
}

export function DocumentBackButton({ workspaceId }: DocumentBackButtonProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(`/workspaces/${workspaceId}/documents`)}
      className="flex items-center gap-2 text-sm font-medium text-stone-800 hover:text-stone-950"
    >
      <ArrowLeft size={16} />
      Back to Documents
    </button>
  )
}