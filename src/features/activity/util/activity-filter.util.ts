import type { ActivityDateRangePreset } from '../types/activity.type'

export function getDateRangeParams(preset: ActivityDateRangePreset): {
  from?: string
  to?: string
} {
  if (preset === 'all') return {}

  const now = new Date()
  const to = now.toISOString()

  if (preset === 'today') {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)

    return {
      from: start.toISOString(),
      to,
    }
  }

  if (preset === 'last_7_days') {
    const start = new Date(now)
    start.setDate(start.getDate() - 7)

    return {
      from: start.toISOString(),
      to,
    }
  }

  if (preset === 'last_30_days') {
    const start = new Date(now)
    start.setDate(start.getDate() - 30)

    return {
      from: start.toISOString(),
      to,
    }
  }

  return {}
}