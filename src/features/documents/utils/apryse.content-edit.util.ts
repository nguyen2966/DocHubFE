import type { WebViewerInstance } from '@pdftron/webviewer'

import type { EditedRect } from '../../comments/types/comment.type'
import { wait, waitFrame } from './apryse.dom.util'
import {
  doRectsOverlap,
  getFiniteNumber,
} from './apryse.geometry.util'
import {
  getThreadIdFromAnnotation,
  isCommentAnchor,
  isDocHubAvatarMarker,
} from './apryse.comment-annotation.util'
import type {
  AnyAnnotation,
  AnyContentEditManager,
  RectLike,
} from '../types/apryse.types';

export function getContentEditManager(instance: WebViewerInstance) {
  return instance.Core.documentViewer.getContentEditManager?.() as
    | AnyContentEditManager
    | undefined
}

export function isContentEditPlaceholderAnnotation(annotation: AnyAnnotation) {
  return Boolean(
    annotation?.isContentEditPlaceholder?.() ||
      annotation?.isContentEditPlaceHolder?.(),
  )
}

export function getContentEditBoxId(annotation: AnyAnnotation) {
  const contentBoxId = annotation?.getCustomData?.('contentEditBoxId') ?? null

  if (!contentBoxId || typeof contentBoxId !== 'string') {
    return null
  }

  return contentBoxId
}

export function getSelectedContentEditPlaceholderAnnotation(
  instance: WebViewerInstance,
) {
  const { annotationManager } = instance.Core

  const selectedAnnotations =
    annotationManager.getSelectedAnnotations?.() ?? []

  return (
    selectedAnnotations.find((annotation: AnyAnnotation) =>
      isContentEditPlaceholderAnnotation(annotation),
    ) ?? null
  )
}

export function getAllContentEditPlaceholderAnnotations(
  instance: WebViewerInstance,
) {
  const { annotationManager } = instance.Core

  const annotations = annotationManager.getAnnotationsList?.() ?? []

  return annotations.filter((annotation: AnyAnnotation) =>
    isContentEditPlaceholderAnnotation(annotation),
  )
}

export function collectContentEditBoxIds(instance: WebViewerInstance) {
  const ids = new Set<string>()

  const selectedPlaceholder =
    getSelectedContentEditPlaceholderAnnotation(instance)

  const selectedBoxId = getContentEditBoxId(selectedPlaceholder)

  if (selectedBoxId) {
    ids.add(selectedBoxId)
  }

  const placeholders = getAllContentEditPlaceholderAnnotations(instance)

  for (const annotation of placeholders) {
    const contentBoxId = getContentEditBoxId(annotation)

    if (contentBoxId) {
      ids.add(contentBoxId)
    }
  }

  return Array.from(ids)
}

export async function stopAllContentBoxEditing(instance: WebViewerInstance) {
  const contentEditManager = getContentEditManager(instance)

  if (!contentEditManager) {
    console.warn('ContentEditManager is not available')
    return
  }

  const contentBoxIds = collectContentEditBoxIds(instance)

  if (contentBoxIds.length === 0) {
    return
  }

  for (const contentBoxId of contentBoxIds) {
    try {
      const box = contentEditManager.getContentBoxById?.(contentBoxId)

      if (!box) {
        continue
      }

      await box.stopContentEditing?.()
    } catch (error) {
      console.warn(
        'Failed to stop content editing for box:',
        contentBoxId,
        error,
      )
    }
  }

  await waitFrame()
  await waitFrame()
  await wait(300)
}

export async function endContentEditMode(instance: WebViewerInstance) {
  const contentEditManager = getContentEditManager(instance)

  if (!contentEditManager) return

  try {
    await contentEditManager.endContentEditMode?.()
  } catch (error) {
    console.warn('Failed to end content edit mode:', error)
  }

  await waitFrame()
  await waitFrame()
  await wait(300)
}

export function getPageNumberFromContentBox(box: any) {
  const pageNumber = getFiniteNumber(
    box?.PageNumber,
    box?.pageNumber,
    box?.getPageNumber?.(),
  )

  if (pageNumber !== null) return pageNumber

  const pageIndex = getFiniteNumber(box?.pageIndex, box?.getPageIndex?.())

  return pageIndex === null ? null : pageIndex + 1
}

export function extractEditedRectFromPayload(payload: any): EditedRect | null {
  const box = payload?.ra ?? payload?.editor ?? payload

  if (!box) return null

  const rect = (box.getRect?.() ??
    box.getBBox?.() ??
    box.getBoundingRect?.() ??
    box.rect ??
    box.Rect ??
    {}) as RectLike

  const pageNumber = getPageNumberFromContentBox(box)
  const x1 = getFiniteNumber(rect.x1, rect.getX1?.(), box.X, box.x)
  const y1 = getFiniteNumber(rect.y1, rect.getY1?.(), box.Y, box.y)
  const width = getFiniteNumber(
    rect.width,
    rect.getWidth?.(),
    box.Width,
    box.width,
  )
  const height = getFiniteNumber(
    rect.height,
    rect.getHeight?.(),
    box.Height,
    box.height,
  )
  const x2 = getFiniteNumber(
    rect.x2,
    rect.getX2?.(),
    x1 !== null && width !== null ? x1 + width : null,
  )
  const y2 = getFiniteNumber(
    rect.y2,
    rect.getY2?.(),
    y1 !== null && height !== null ? y1 + height : null,
  )

  if (
    pageNumber === null ||
    x1 === null ||
    y1 === null ||
    x2 === null ||
    y2 === null
  ) {
    return null
  }

  return { pageNumber, x1, y1, x2, y2 }
}

export function dedupeEditedRects(rects: EditedRect[]) {
  const seen = new Set<string>()
  const result: EditedRect[] = []

  for (const rect of rects) {
    const key = [
      rect.pageNumber,
      rect.x1.toFixed(2),
      rect.y1.toFixed(2),
      rect.x2.toFixed(2),
      rect.y2.toFixed(2),
    ].join(':')

    if (seen.has(key)) continue

    seen.add(key)
    result.push(rect)
  }

  return result
}

export function isLikelyContentEditAnnotation(annotation: AnyAnnotation) {
  if (isCommentAnchor(annotation)) return false

  return (
    isContentEditPlaceholderAnnotation(annotation) ||
    annotation?.Subject === 'Rectangle' ||
    annotation?.ToolName === 'ContentEdit'
  )
}

export function collectContentEditAnnotationRects(
  instance: WebViewerInstance,
) {
  const annotations =
    instance.Core.annotationManager.getAnnotationsList?.() ?? []

  return annotations
    .filter((annotation: AnyAnnotation) =>
      isLikelyContentEditAnnotation(annotation),
    )
    .map((annotation: AnyAnnotation) => extractEditedRectFromPayload(annotation))
    .filter((rect: EditedRect | null): rect is EditedRect => Boolean(rect))
}

export function collectDegradedCommentAnnotationIds(
  instance: WebViewerInstance,
  editedRects: EditedRect[],
) {
  const annotations =
    instance.Core.annotationManager.getAnnotationsList?.() ?? []

  return Array.from(
    new Set(
      annotations
        .filter((annotation: AnyAnnotation) => isCommentAnchor(annotation))
        .filter((annotation: AnyAnnotation) => !isDocHubAvatarMarker(annotation))
        .filter((annotation: AnyAnnotation) => {
          const annotationRect = extractEditedRectFromPayload(annotation)

          return annotationRect
            ? editedRects.some((rect) => doRectsOverlap(annotationRect, rect))
            : false
        })
        .map((annotation: AnyAnnotation) => getThreadIdFromAnnotation(annotation))
        .filter((id: string | null): id is string => Boolean(id)),
    ),
  )
}
