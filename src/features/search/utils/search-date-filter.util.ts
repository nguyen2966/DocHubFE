import type { UpdatedPreset } from '../types/document-search.type'

export const UPDATED_DATE_OPTIONS: Array<{
  value: UpdatedPreset
  label: string
}> = [
  { value: 'any', label: 'Any time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'past_7_days', label: 'Past 7 days' },
  { value: 'past_30_days', label: 'Past 30 days' },
  { value: 'past_year', label: 'Past year' },
]

export function getUpdatedPresetLabel(preset: UpdatedPreset): string {
  return (
    UPDATED_DATE_OPTIONS.find((option) => option.value === preset)?.label ??
    'Any time'
  )
}

function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

export function getUpdatedDateRange(preset: UpdatedPreset): {
  updatedFrom?: string
  updatedTo?: string
} {
  const now = new Date()

  if (preset === 'any') return {}

  if (preset === 'today') {
    return {
      updatedFrom: startOfDay(now).toISOString(),
      updatedTo: now.toISOString(),
    }
  }

  if (preset === 'yesterday') {
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    return {
      updatedFrom: startOfDay(yesterday).toISOString(),
      updatedTo: endOfDay(yesterday).toISOString(),
    }
  }

  const from = new Date(now)

  if (preset === 'past_7_days') from.setDate(from.getDate() - 7)
  if (preset === 'past_30_days') from.setDate(from.getDate() - 30)
  if (preset === 'past_year') from.setFullYear(from.getFullYear() - 1)

  return {
    updatedFrom: from.toISOString(),
    updatedTo: now.toISOString(),
  }
}
