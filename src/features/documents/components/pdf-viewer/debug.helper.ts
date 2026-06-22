const APRYSE_DEBUG_STORAGE_KEY = 'doc-hub:apryse-debug-log'

function getDebugKeys(value: unknown) {
  if (!value || typeof value !== 'object') return null

  try {
    const ownKeys = Reflect.ownKeys(value).map(String)
    const prototype = Object.getPrototypeOf(value)
    const prototypeKeys = prototype ? Reflect.ownKeys(prototype).map(String) : []

    return {
      ownKeys,
      prototypeKeys,
    }
  } catch {
    return null
  }
}

function readRectLikeForDebug(value: any) {
  if (!value) return null

  const rect = value.getRect?.() ??
    value.getBBox?.() ??
    value.getBoundingRect?.() ??
    value.rect ??
    value.Rect ??
    null

  return {
    keys: getDebugKeys(value),
    pageNumber: getFiniteNumber(
      value.PageNumber,
      value.pageNumber,
      value.getPageNumber?.(),
    ),
    pageIndex: getFiniteNumber(value.pageIndex, value.getPageIndex?.()),
    rect: rect
      ? {
        keys: getDebugKeys(rect),
        x1: getFiniteNumber(rect.x1, rect.getX1?.()),
        y1: getFiniteNumber(rect.y1, rect.getY1?.()),
        x2: getFiniteNumber(rect.x2, rect.getX2?.()),
        y2: getFiniteNumber(rect.y2, rect.getY2?.()),
        width: getFiniteNumber(rect.width, rect.getWidth?.()),
        height: getFiniteNumber(rect.height, rect.getHeight?.()),
      }
      : null,
    x: getFiniteNumber(value.X, value.x),
    y: getFiniteNumber(value.Y, value.y),
    width: getFiniteNumber(value.Width, value.width),
    height: getFiniteNumber(value.Height, value.height),
  }
}

function getPayloadDebugData(payload: any, rect: EditedRect | null) {
  return {
    payloadKeys: getDebugKeys(payload),
    extractedRect: rect,
    payload: readRectLikeForDebug(payload),
    editor: readRectLikeForDebug(payload?.editor),
    ra: readRectLikeForDebug(payload?.ra),
  }
}

function getAnnotationDebugData(annotation: AnyAnnotation) {
  return {
    id: annotation?.Id ?? null,
    subject: annotation?.Subject ?? null,
    pageNumber: annotation?.PageNumber ?? null,
    x: annotation?.X ?? null,
    y: annotation?.Y ?? null,
    width: annotation?.Width ?? null,
    height: annotation?.Height ?? null,
    isCommentAnchor: isCommentAnchor(annotation),
    isTemporaryCommentAnchor: isTemporaryCommentAnchor(annotation),
    threadId: getThreadIdFromAnnotation(annotation),
    docHubManaged: annotation?.getCustomData?.(DOC_HUB_MANAGED_KEY) ?? null,
    docHubKind: annotation?.getCustomData?.(DOC_HUB_KIND_KEY) ?? null,
  }
}

function getAnnotationManagerDebugData(instance: WebViewerInstance | null) {
  if (!instance) return []

  const annotations =
    instance.Core.annotationManager.getAnnotationsList?.() ?? []

  return annotations.map((annotation: AnyAnnotation) =>
    getAnnotationDebugData(annotation),
  )
}

function writeApryseDebugLog(label: string, data: unknown) {
  // debug only: Apryse clears the console during save, so persist compact logs.
  if (typeof window === 'undefined') return

  try {
    const existing = window.localStorage.getItem(APRYSE_DEBUG_STORAGE_KEY)
    const entries = existing ? JSON.parse(existing) : []
    const nextEntries = Array.isArray(entries) ? entries : []

    nextEntries.push({
      at: new Date().toISOString(),
      label,
      data,
    })

    window.localStorage.setItem(
      APRYSE_DEBUG_STORAGE_KEY,
      JSON.stringify(nextEntries.slice(-80)),
    )
  } catch (error) {
    console.warn('Failed to write Apryse debug log:', error)
  }
}