export function formatActivityTimestamp(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function formatShortDate(value: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(value)
}

export function formatDateRangeLabel(from?: string, to?: string): string {
  if (!from || !to) return 'Date range'

  const fromDate = new Date(from)
  const toExclusive = new Date(to)
  const toInclusive = new Date(toExclusive)
  toInclusive.setDate(toInclusive.getDate() - 1)

  if (
    Number.isNaN(fromDate.getTime()) ||
    Number.isNaN(toInclusive.getTime())
  ) {
    return 'Date range'
  }

  return `${formatShortDate(fromDate)} - ${formatShortDate(toInclusive)}`
}

export function toStartOfDayIso(date: Date): string {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result.toISOString()
}

export function toNextDayStartIso(date: Date): string {
  const result = new Date(date)
  result.setDate(result.getDate() + 1)
  result.setHours(0, 0, 0, 0)
  return result.toISOString()
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isDateBetween(date: Date, start?: Date, end?: Date): boolean {
  if (!start || !end) return false

  const time = date.getTime()
  return time >= start.getTime() && time <= end.getTime()
}