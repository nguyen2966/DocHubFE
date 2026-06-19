export function formatSearchUpdatedTime(value: string): string {
  const date = new Date(value)
  const now = new Date()

  if (Number.isNaN(date.getTime())) return ''

  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  }).format(date)
}
