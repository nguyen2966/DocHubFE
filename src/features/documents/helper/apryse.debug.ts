const APRYSE_DEBUG_STORAGE_KEY = 'debug';

export function writeApryseDebugLog(label: string, payload: unknown) {
  try {
    const previousRaw = localStorage.getItem(APRYSE_DEBUG_STORAGE_KEY)
    const previous = previousRaw ? JSON.parse(previousRaw) : []

    const next = [
      ...previous,
      {
        label,
        time: new Date().toISOString(),
        payload,
      },
    ]

    // avoid localStorage becoming too large
    const capped = next.slice(-300)

    localStorage.setItem(APRYSE_DEBUG_STORAGE_KEY, JSON.stringify(capped))
  } catch (error) {
    console.warn('Failed to write Apryse debug log:', error)
  }
}
