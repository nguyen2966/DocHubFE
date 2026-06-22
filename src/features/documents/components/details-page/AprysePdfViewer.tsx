import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';

import type { WebViewerInstance } from '@pdftron/webviewer';

import type { EditedRect } from '../../../comments/types/comment.type';
import type { CommentThread } from '../../../comments/utils/comment-tree.util';
import {
  CommentAnnotationOverlayLayer,
  type CommentMarkerOverlay,
} from '../../../comments/components/CommentAnnotationOverlayLayer';
import { PdfPageControls } from './ControlProps';
import WebViewerModule from '@pdftron/webviewer';

import type {
  AnyAnnotation,
  AnyContentBoxEditor,
  AnyQuad,
  AprysePdfViewerProps,
  AprysePdfViewerRef,
  PageBoundAvatarMarker,
  PagePoint,
  ProjectedAvatarMarker,
  TextSelection,
} from '../../types/apryse.types';
import {
  APRYSE_ZOOM_UI_ELEMENTS, COMMENT_MARKER_OVERLAY_GAP, COMMENT_MARKER_SIZE,
  LOCKED_PDF_ZOOM, SELECTION_ACTION_OVERLAY_GAP, ZOOM_LOCK_ENABLED, DOC_HUB_KIND_KEY,
  DOC_HUB_MANAGED_KEY, COMMENT_ANCHOR_TYPE_KEY, COMMENT_ANCHOR_TYPE
} from '../../constants/apryse.constants';
import {
  clickInsideApryseShadowRoot,
  findApryseScrollContainer,
  wait,
  waitFrame,
} from '../../utils/apryse.dom.util';
import {
  collectContentEditAnnotationRects,
  collectDegradedCommentAnnotationIds,
  dedupeEditedRects,
  endContentEditMode,
  extractEditedRectFromPayload,
  getContentEditManager,
  stopAllContentBoxEditing,
} from '../../utils/apryse.content-edit.util';
import {
  getQuadBounds,
  getTextAnchorFromQuads,
} from '../../utils/apryse.geometry.util';
import {
  getThreadIdFromAnnotation,
  isCommentAnchor,
  isDocHubAvatarMarker,
  setCommentAnchorData,
  setCommentAnchorStyle,
  setHiddenPointAnchorStyle,
} from '../../utils/apryse.comment-annotation.util';

const WebViewer = (WebViewerModule as any).default ?? WebViewerModule;

export type {
  AprysePdfViewerProps,
  AprysePdfViewerRef,
  EditedPdfExport,
} from '../../types/apryse.types';

export const AprysePdfViewer = forwardRef<
  AprysePdfViewerRef,
  AprysePdfViewerProps
>(function AprysePdfViewer(
  {
    fileUrl,
    isPdfEditing,
    commentThreads = [],
    selectedCommentAnnotationId,
    hiddenCommentAvatarMarkerId,
    commentsDisabled,
    showCommentAvatarMarkers = true,
    onCommentAnnotationClick,
    onCommentMarkerHover,
    onCommentMarkerLeave,
    onPendingCommentAnchorCreated,
  },
  ref,
) {
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const instanceRef = useRef<WebViewerInstance | null>(null)
  const activeContentEditorRef = useRef<AnyContentBoxEditor | null>(null)
  const editedRectsRef = useRef<EditedRect[]>([])

  const commentThreadsRef = useRef<CommentThread[]>(commentThreads)
  const selectedCommentAnnotationIdRef = useRef<string | null>(
    selectedCommentAnnotationId ?? null,
  )
  const commentsDisabledRef = useRef(Boolean(commentsDisabled))
  const showCommentAvatarMarkersRef = useRef(showCommentAvatarMarkers !== false)
  const isPdfEditingRef = useRef(isPdfEditing)
  const onCommentAnnotationClickRef = useRef(onCommentAnnotationClick)
  const onCommentMarkerHoverRef = useRef(onCommentMarkerHover)
  const onCommentMarkerLeaveRef = useRef(onCommentMarkerLeave)
  const onPendingCommentAnchorCreatedRef = useRef(
    onPendingCommentAnchorCreated,
  )
  const latestSelectionRef = useRef<TextSelection | null>(null)
  const temporaryAnchorIdRef = useRef<string | null>(null)
  const originalTextPopupItemsRef = useRef<object[] | null>(null)
  const originalAnnotationPopupItemsRef = useRef<object[] | null>(null)
  const renderSequenceRef = useRef(0)
  const skipNextEditExitCommentRestoreRef = useRef(false)
  const lastDegradedAnnotationIdsRef = useRef<string[]>([])
  const documentLoadedRef = useRef(false)
  const pendingRenderThreadsRef = useRef<CommentThread[] | null>(null)
  const markerElementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const lastHoveredThreadIdRef = useRef<string | null>(null)
  const markerHoverTimeoutRef = useRef<number | null>(null)
  const isEnforcingZoomRef = useRef(false)
  const zoomEnforcementTimeoutsRef = useRef<number[]>([])
  const zoomInputCleanupRef = useRef<(() => void) | null>(null)
  const overlayFrameRef = useRef<number | null>(null)
  const overlayPositionCleanupRef = useRef<(() => void) | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [selectionActionPosition, setSelectionActionPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [commentMarkerOverlays, setCommentMarkerOverlays] = useState<
    CommentMarkerOverlay[]
  >([]);

  async function removeEmbeddedDocHubCommentAnnotationsBeforeRender(
    threads: CommentThread[],
  ) {
    const instance = instanceRef.current
    if (!instance) return

    const { annotationManager, documentViewer } = instance.Core

    const threadIds = new Set(
      threads.map((thread) => thread.annotation._id),
    )

    const apryseAnnotationIds = new Set(
      threads
        .map((thread) => thread.annotation.apryseAnnotationId)
        .filter((id): id is string => Boolean(id)),
    )

    const isEmbeddedDocHubCommentAnnotation = (annotation: AnyAnnotation) => {
      const threadId = getThreadIdFromAnnotation(annotation)

      const kind = annotation.getCustomData?.(DOC_HUB_KIND_KEY)
      const managed = annotation.getCustomData?.(DOC_HUB_MANAGED_KEY)
      const anchorType = annotation.getCustomData?.(COMMENT_ANCHOR_TYPE_KEY)

      if (threadId && threadIds.has(threadId)) return true
      if (apryseAnnotationIds.has(annotation.Id)) return true

      if (managed === 'true') return true
      if (anchorType === COMMENT_ANCHOR_TYPE) return true

      if (
        typeof kind === 'string' &&
        kind.toLowerCase().includes('comment')
      ) {
        return true
      }

      // Do not rely on Subject alone unless you really need a last fallback.
      // Subject === "Comment" is too broad and can delete unrelated comments.
      return false
    }

    for (let pass = 0; pass < 3; pass += 1) {
      const embeddedAnnotations = annotationManager
        .getAnnotationsList()
        .filter((annotation: AnyAnnotation) =>
          isEmbeddedDocHubCommentAnnotation(annotation),
        )

      if (embeddedAnnotations.length === 0) return

      annotationManager.deselectAllAnnotations?.()

      await Promise.resolve(
        annotationManager.deleteAnnotations(embeddedAnnotations, {
          imported: true,
          force: true,
        } as any),
      )

      documentViewer.refreshAll?.()
      documentViewer.updateView?.()

      await waitFrame()
      await waitFrame()
      await wait(100)
    }
  }

  function isCommentOverlayHidden() {
    return Boolean(commentsDisabledRef.current || isPdfEditingRef.current)
  }

  function configureLockedZoomUi(instance: WebViewerInstance) {
    if (!ZOOM_LOCK_ENABLED) return

    const { UI } = instance

    try {
      UI.disableElements?.(APRYSE_ZOOM_UI_ELEMENTS)
      UI.hideElements?.(APRYSE_ZOOM_UI_ELEMENTS)
    } catch (error) {
      console.warn('Failed to hide Apryse zoom UI:', error)
    }
  }

  function clearScheduledZoomEnforcement() {
    for (const timeoutId of zoomEnforcementTimeoutsRef.current) {
      window.clearTimeout(timeoutId)
    }

    zoomEnforcementTimeoutsRef.current = []
  }

  function enforceLockedZoom(reason: string) {
    if (!ZOOM_LOCK_ENABLED || isEnforcingZoomRef.current) return

    const instance = instanceRef.current
    const documentViewer = instance?.Core.documentViewer

    if (!instance || !documentViewer) return

    const currentZoom = documentViewer.getZoomLevel?.()

    if (
      typeof currentZoom === 'number' &&
      Math.abs(currentZoom - LOCKED_PDF_ZOOM) < 0.001
    ) {
      return
    }

    isEnforcingZoomRef.current = true

    try {
      if (typeof instance.UI.setZoomLevel === 'function') {
        instance.UI.setZoomLevel(LOCKED_PDF_ZOOM)
      }

      if (typeof documentViewer.zoomTo === 'function') {
        documentViewer.zoomTo(LOCKED_PDF_ZOOM)
      } else if (typeof instance.UI.setZoomLevel !== 'function') {
        console.warn('Apryse zoom API is not available for zoom lock')
      }

    } finally {
      requestAnimationFrame(() => {
        isEnforcingZoomRef.current = false
        scheduleCommentOverlayRefresh()

        const nextZoom = documentViewer.getZoomLevel?.()

        if (
          typeof nextZoom === 'number' &&
          Math.abs(nextZoom - LOCKED_PDF_ZOOM) >= 0.001
        ) {
          enforceLockedZoom(`${reason}-verify`)
        }
      })
    }
  }

  function scheduleLockedZoomEnforcement(reason: string) {
    if (!ZOOM_LOCK_ENABLED) return

    clearScheduledZoomEnforcement()
    enforceLockedZoom(`${reason}-immediate`)

    for (const delay of [0, 50, 150, 350, 750]) {
      const timeoutId = window.setTimeout(() => {
        zoomEnforcementTimeoutsRef.current =
          zoomEnforcementTimeoutsRef.current.filter((id) => id !== timeoutId)
        enforceLockedZoom(`${reason}-delayed-${delay}`)
      }, delay)

      zoomEnforcementTimeoutsRef.current.push(timeoutId)
    }
  }

  function isZoomShortcut(event: KeyboardEvent) {
    if (!event.ctrlKey && !event.metaKey) return false

    const key = event.key.toLowerCase()

    return key === '+' || key === '-' || key === '=' || key === '0'
  }

  function isEventInsideViewer(event: Event, viewerElement: HTMLElement) {
    const composedPath = event.composedPath?.() ?? []

    if (composedPath.includes(viewerElement)) return true

    const target = event.target

    if (target instanceof Node && viewerElement.contains(target)) {
      return true
    }

    const activeElement = document.activeElement

    return Boolean(activeElement && viewerElement.contains(activeElement))
  }

  function bindZoomInputBlockers(viewerElement: HTMLElement) {
    zoomInputCleanupRef.current?.()
    zoomInputCleanupRef.current = null

    if (!ZOOM_LOCK_ENABLED) return

    const preventZoomEvent = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return

      preventZoomEvent(event)
      enforceLockedZoom('blocked-ctrl-wheel')
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isZoomShortcut(event)) return
      if (!isEventInsideViewer(event, viewerElement)) return

      preventZoomEvent(event)
      enforceLockedZoom('blocked-keyboard-shortcut')
    }

    const handleGesture = (event: Event) => {
      if (!isEventInsideViewer(event, viewerElement)) return

      preventZoomEvent(event)
      enforceLockedZoom('blocked-gesture-zoom')
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length < 2) return

      preventZoomEvent(event)
      enforceLockedZoom('blocked-touch-pinch')
    }

    viewerElement.addEventListener('wheel', handleWheel, {
      capture: true,
      passive: false,
    })
    viewerElement.addEventListener('touchmove', handleTouchMove, {
      capture: true,
      passive: false,
    })
    window.addEventListener('keydown', handleKeyDown, { capture: true })
    window.addEventListener('gesturestart', handleGesture, {
      capture: true,
      passive: false,
    } as AddEventListenerOptions)
    window.addEventListener('gesturechange', handleGesture, {
      capture: true,
      passive: false,
    } as AddEventListenerOptions)
    window.addEventListener('gestureend', handleGesture, {
      capture: true,
      passive: false,
    } as AddEventListenerOptions)

    zoomInputCleanupRef.current = () => {
      viewerElement.removeEventListener('wheel', handleWheel, {
        capture: true,
      })
      viewerElement.removeEventListener('touchmove', handleTouchMove, {
        capture: true,
      })
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      window.removeEventListener('gesturestart', handleGesture, {
        capture: true,
      } as EventListenerOptions)
      window.removeEventListener('gesturechange', handleGesture, {
        capture: true,
      } as EventListenerOptions)
      window.removeEventListener('gestureend', handleGesture, {
        capture: true,
      } as EventListenerOptions)
    }
  }

  function getAnnotationClientPosition(annotation: AnyAnnotation) {
    const pagePoint = getAnnotationRightMiddlePagePoint(annotation)
    const clientPoint = pagePoint
      ? pagePointToClientPoint(pagePoint.pageNumber, pagePoint)
      : null

    if (clientPoint) return clientPoint

    const rect = viewerRef.current?.getBoundingClientRect()

    return {
      x: (rect?.left ?? 0) + 24,
      y: (rect?.top ?? 0) + 140,
    }
  }

  function getMarkerClientPosition(markerElement: HTMLElement) {
    const rect = markerElement.getBoundingClientRect()

    return {
      x: rect.right,
      y: rect.top + rect.height / 2,
    }
  }

  function overlayPointToClientPoint(point: { x: number; y: number }) {
    const overlayElement = overlayRef.current

    if (!overlayElement) return null

    const overlayRect = overlayElement.getBoundingClientRect()

    return {
      x: overlayRect.left + point.x,
      y: overlayRect.top + point.y,
    }
  }

  function getPageSize(pageNumber: number) {
    const instance = instanceRef.current
    const documentViewer = instance?.Core.documentViewer

    if (!documentViewer) return null

    try {
      const width = documentViewer.getPageWidth?.(pageNumber)
      const height = documentViewer.getPageHeight?.(pageNumber)

      if (
        typeof width === 'number' &&
        Number.isFinite(width) &&
        typeof height === 'number' &&
        Number.isFinite(height)
      ) {
        return { width, height }
      }
    } catch {
      return null
    }

    return null
  }

  function isValidPageBoundAvatarMarker(marker: PageBoundAvatarMarker) {
    const instance = instanceRef.current
    const pageCount = instance?.Core.documentViewer.getPageCount?.() ?? null
    const { pageNumber, anchor } = marker
    const values = [pageNumber, anchor.x, anchor.y]
    const pageSize = getPageSize(pageNumber)

    if (!values.every((value) => Number.isFinite(value))) {
      return false
    }

    if (pageNumber < 1 || (typeof pageCount === 'number' && pageNumber > pageCount)) {
      return false
    }

    if (!pageSize) return true

    const margin = 100
    const outOfPageRange =
      anchor.x < -margin ||
      anchor.y < -margin ||
      anchor.x > pageSize.width + margin ||
      anchor.y > pageSize.height + margin

    if (outOfPageRange) {
      return false
    }

    return true
  }

  function pagePointToOverlayPoint(
    pageNumber: number,
    pagePoint: { x: number; y: number },
  ) {
    const instance = instanceRef.current
    const viewerElement = viewerRef.current

    if (!instance || !viewerElement) return null

    try {
      const displayMode = instance.Core.documentViewer
        .getDisplayModeManager()
        .getDisplayMode()
      const scrollContainer = findApryseScrollContainer(viewerElement)
      const point = displayMode.pageToWindow(pagePoint, pageNumber)

      return {
        x: point.x - (scrollContainer?.scrollLeft ?? 0),
        y: point.y - (scrollContainer?.scrollTop ?? 0),
      }
    } catch {
      return null
    }
  }

  function pagePointToClientPoint(
    pageNumber: number,
    pagePoint: { x: number; y: number },
  ) {
    const overlayPoint = pagePointToOverlayPoint(pageNumber, pagePoint)
    const overlayElement = overlayRef.current

    if (!overlayPoint || !overlayElement) return null

    const overlayBounds = overlayElement.getBoundingClientRect()

    return {
      x: overlayBounds.left + overlayPoint.x,
      y: overlayBounds.top + overlayPoint.y,
    }
  }

  function getThreadVisualState(thread: CommentThread) {
    const { annotation } = thread

    return annotation.visualState ?? (annotation.xfdf ? 'highlight' : 'point')
  }

  function getThreadPageBoundAvatarMarker(
    thread: CommentThread,
  ): PageBoundAvatarMarker | null {
    const { annotation } = thread;
    const visualState = getThreadVisualState(thread);
    const importedHighlight = findCommentAnnotation(annotation._id);
    const highlightAnchor = importedHighlight
      ? getAnnotationRightMiddlePagePoint(importedHighlight)
      : null;
    if (visualState === 'highlight') {
      if (highlightAnchor) {
        return {
          annotationId: annotation._id,
          thread,
          pageNumber: highlightAnchor.pageNumber,
          anchor: { x: highlightAnchor.x, y: highlightAnchor.y },
          source: 'imported-highlight',
        }
      }
    }

    if (
      typeof annotation.pageNumber !== 'number' ||
      !annotation.position ||
      typeof annotation.position.x !== 'number' ||
      typeof annotation.position.y !== 'number'
    ) {
      return null
    }

    return {
      annotationId: annotation._id,
      thread,
      pageNumber: annotation.pageNumber,
      anchor: { x: highlightAnchor?.x, y: highlightAnchor?.y },
      source: 'imported-highlight',
    }
  }

  function getThreadMarkerOverlay(thread: CommentThread): ProjectedAvatarMarker | null {
    const pageBoundMarker = getThreadPageBoundAvatarMarker(thread)

    if (!pageBoundMarker) return null
    if (!isValidPageBoundAvatarMarker(pageBoundMarker)) return null

    const overlayPoint = pagePointToOverlayPoint(
      pageBoundMarker.pageNumber,
      pageBoundMarker.anchor,
    )

    if (!overlayPoint) return null

    const overlayRect = {
      left: overlayPoint.x + COMMENT_MARKER_OVERLAY_GAP,
      top: overlayPoint.y - COMMENT_MARKER_SIZE / 2,
      width: COMMENT_MARKER_SIZE,
      height: COMMENT_MARKER_SIZE,
    }

    return {
      ...pageBoundMarker,
      overlayRect,
    }
  }

  function getThreadMarkerClientPosition(thread: CommentThread) {
    const markerElement = markerElementsRef.current.get(thread.annotation._id)

    if (markerElement) {
      return getMarkerClientPosition(markerElement)
    }

    const markerOverlay = getThreadMarkerOverlay(thread)
    const clientPosition = markerOverlay
      ? overlayPointToClientPoint({
        x: markerOverlay.overlayRect.left + markerOverlay.overlayRect.width,
        y: markerOverlay.overlayRect.top + markerOverlay.overlayRect.height / 2,
      })
      : null

    if (!clientPosition) return null

    return clientPosition
  }

  function getAnnotationRightMiddlePagePoint(annotation: AnyAnnotation): PagePoint | null {
    if (
      typeof annotation?.PageNumber !== 'number' ||
      typeof annotation?.X !== 'number' ||
      typeof annotation?.Y !== 'number' ||
      typeof annotation?.Width !== 'number' ||
      typeof annotation?.Height !== 'number'
    ) {
      return null
    }

    return {
      pageNumber: annotation.PageNumber,
      x: annotation.X + annotation.Width,
      y: annotation.Y + annotation.Height / 2,
    }
  }

  function refreshCommentOverlayPositions() {
    if (isCommentOverlayHidden()) {
      setSelectionActionPosition(null)
      setCommentMarkerOverlays([])
      return
    }

    const selection = latestSelectionRef.current

    setSelectionActionPosition(
      selection
        ? (() => {
          const overlayPoint = pagePointToOverlayPoint(
            selection.pageNumber,
            selection.position,
          )

          return overlayPoint
            ? {
              x: overlayPoint.x + SELECTION_ACTION_OVERLAY_GAP,
              y: overlayPoint.y - SELECTION_ACTION_OVERLAY_GAP,
            }
            : null
        })()
        : null,
    )

    if (!showCommentAvatarMarkersRef.current) {
      setCommentMarkerOverlays([])
      return
    }

    setCommentMarkerOverlays(
      commentThreadsRef.current
        .filter((thread) => thread.annotation.status !== 'deleted')
        .map((thread) => {
          const marker = getThreadMarkerOverlay(thread)

          return marker
        })
        .filter((marker): marker is CommentMarkerOverlay => Boolean(marker)),
    )
  }

  function scheduleCommentOverlayRefresh() {
    if (overlayFrameRef.current !== null) return

    overlayFrameRef.current = requestAnimationFrame(() => {
      overlayFrameRef.current = null
      refreshCommentOverlayPositions()
    })
  }

  function bindCommentOverlayPositionListeners() {
    overlayPositionCleanupRef.current?.()
    overlayPositionCleanupRef.current = null

    const viewerElement = viewerRef.current
    const scrollContainer = viewerElement
      ? findApryseScrollContainer(viewerElement)
      : null
    const handlePositionChange = () => scheduleCommentOverlayRefresh()
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && viewerElement
        ? new ResizeObserver(handlePositionChange)
        : null

    scrollContainer?.addEventListener('scroll', handlePositionChange, {
      passive: true,
    })
    resizeObserver?.observe(viewerElement)
    window.addEventListener('resize', handlePositionChange)

    overlayPositionCleanupRef.current = () => {
      scrollContainer?.removeEventListener('scroll', handlePositionChange)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', handlePositionChange)
    }
  }

  function getThreadsWithOptimisticPointMarkers(annotationIds: string[]) {
    if (!annotationIds.length) return commentThreadsRef.current

    const degradedIds = new Set(annotationIds)

    return commentThreadsRef.current.map((thread) =>
      degradedIds.has(thread.annotation._id)
        ? {
          ...thread,
          annotation: {
            ...thread.annotation,
            visualState: 'point' as const,
          },
        }
        : thread,
    )
  }

  function findCommentAnnotation(annotationId: string) {
    const instance = instanceRef.current

    if (!instance) return null

    const annotations =
      instance.Core.annotationManager.getAnnotationsList?.() ?? []

    return (
      annotations.find((annotation: AnyAnnotation) => {
        if (isDocHubAvatarMarker(annotation)) return false

        if (getThreadIdFromAnnotation(annotation) === annotationId) {
          return true
        }

        return annotation.Id === annotationId
      }) ?? null
    )
  }

  function findCommentThread(annotationId: string) {
    return (
      commentThreadsRef.current.find(
        (thread) => thread.annotation._id === annotationId,
      ) ?? null
    )
  }

  function isRenderedCommentAnnotation(annotation: AnyAnnotation) {
    if (isCommentAnchor(annotation)) return true

    const threadId = getThreadIdFromAnnotation(annotation)
    if (threadId) return true

    const threadIds = new Set(
      commentThreadsRef.current.map((thread) => thread.annotation._id),
    )
    const apryseAnnotationIds = new Set(
      commentThreadsRef.current
        .map((thread) => thread.annotation.apryseAnnotationId)
        .filter((id): id is string => Boolean(id)),
    )

    if (threadIds.has(annotation.Id)) return true
    if (apryseAnnotationIds.has(annotation.Id)) return true

    return false
  }

  async function removeTemporaryCommentAnchor() {
    const instance = instanceRef.current
    const temporaryAnchorId = temporaryAnchorIdRef.current

    if (!instance || !temporaryAnchorId) return

    const { annotationManager } = instance.Core
    const temporaryAnnotation =
      annotationManager
        .getAnnotationsList()
        .find((annotation: AnyAnnotation) => annotation.Id === temporaryAnchorId) ??
      null

    if (temporaryAnnotation) {
      annotationManager.deleteAnnotation(temporaryAnnotation, {
        imported: true,
        force: true,
      })
    }

    temporaryAnchorIdRef.current = null
  }

  function removeRenderedCommentAnchors() {
    const instance = instanceRef.current;

    if (!instance) return [];

    const { annotationManager } = instance.Core;
    const commentAnchors = annotationManager
      .getAnnotationsList()
      .filter((annotation: AnyAnnotation) =>
        isRenderedCommentAnnotation(annotation),
      );

    if (commentAnchors.length > 0) {
      annotationManager.deleteAnnotations(commentAnchors, {
        imported: true,
        force: true,
      });
    }

    return commentAnchors;
  }

  function removeRenderedAvatarMarkers() {
    const instance = instanceRef.current

    if (!instance) return []

    const { annotationManager } = instance.Core
    const avatarMarkers = annotationManager
      .getAnnotationsList()
      .filter((annotation: AnyAnnotation) => isDocHubAvatarMarker(annotation))

    if (avatarMarkers.length > 0) {
      annotationManager.deleteAnnotations(avatarMarkers, {
        imported: true,
        force: true,
      })
    }

    return avatarMarkers
  }

  function getSelectionClientPosition(
    pageNumber: number,
    position: { x: number; y: number },
  ) {
    const clientPoint = pagePointToClientPoint(pageNumber, position)

    if (clientPoint) return clientPoint

    const rect = viewerRef.current?.getBoundingClientRect()

    return {
      x: (rect?.left ?? 0) + 24,
      y: (rect?.top ?? 0) + 140,
    }
  }

  function cacheTextSelection(
    quads: AnyQuad[] | null | undefined,
    text: string | null | undefined,
    pageNumber: number,
  ) {
    const safeQuads = Array.isArray(quads) ? quads : []
    const safeText = typeof text === 'string' ? text : ''

    if (!safeQuads.length || !safeText.trim()) {
      latestSelectionRef.current = null
      setSelectionActionPosition(null)
      return
    }

    const bounds = getQuadBounds(safeQuads)
    const position = getTextAnchorFromQuads(safeQuads) ?? {
      x: bounds.maxX,
      y: bounds.minY,
    }

    latestSelectionRef.current = {
      quads: safeQuads,
      text: safeText,
      pageNumber,
      position,
    }

    scheduleCommentOverlayRefresh()
  }

  async function createPendingCommentAnchor() {
    const instance = instanceRef.current

    if (!instance || commentsDisabledRef.current || isPdfEditingRef.current) {
      return
    }

    const { documentViewer, annotationManager, Annotations } = instance.Core

    let selection = latestSelectionRef.current

    if (!selection) {
      const pageNumber = documentViewer.getCurrentPage()
      const text = documentViewer.getSelectedText?.(pageNumber) ?? ''
      const quads =
        (documentViewer.getSelectedTextQuads?.(pageNumber) as AnyQuad[]) ?? []

      cacheTextSelection(quads, text, pageNumber)
      selection = latestSelectionRef.current
    }

    if (!selection) return

    await removeTemporaryCommentAnchor()
    setSelectionActionPosition(null)

    const bounds = getQuadBounds(selection.quads)
    const highlight = new Annotations.TextHighlightAnnotation()

    highlight.PageNumber = selection.pageNumber
    highlight.X = bounds.minX
    highlight.Y = bounds.minY
    highlight.Width = bounds.maxX - bounds.minX
    highlight.Height = bounds.maxY - bounds.minY
    highlight.Quads = selection.quads
    highlight.setQuads?.(selection.quads)
    highlight.Subject = 'Comment'
    highlight.Contents = selection.text

    setCommentAnchorStyle(instance, highlight)
    setCommentAnchorData(highlight, null, true)

    annotationManager.addAnnotation(highlight, {
      imported: true,
    })
    annotationManager.redrawAnnotation(highlight)
    annotationManager.selectAnnotation(highlight)

    temporaryAnchorIdRef.current = highlight.Id

    const xfdf = await annotationManager.exportAnnotations({
      annotationList: [highlight],
      links: false,
      widgets: false,
    } as any)

    onPendingCommentAnchorCreatedRef.current?.(
      {
        pageNumber: selection.pageNumber,
        position: selection.position,
        xfdf,
        apryseAnnotationId: highlight.Id,
        visualState: 'highlight',
        temporaryAnchorId: highlight.Id,
      },
      getSelectionClientPosition(selection.pageNumber, selection.position),
    )
  }

  function configureCommentUi() {
    const instance = instanceRef.current

    if (!instance) return

    const { UI } = instance

    if (!originalTextPopupItemsRef.current) {
      originalTextPopupItemsRef.current = UI.textPopup?.getItems?.() ?? []
    }

    if (!originalAnnotationPopupItemsRef.current) {
      originalAnnotationPopupItemsRef.current =
        UI.annotationPopup?.getItems?.() ?? []
    }

    if (commentsDisabledRef.current || isPdfEditingRef.current) {
      latestSelectionRef.current = null
      setSelectionActionPosition(null)
      UI.textPopup?.update?.(originalTextPopupItemsRef.current)
      UI.annotationPopup?.update?.(originalAnnotationPopupItemsRef.current)
      return
    }

    UI.textPopup?.update?.([])
    UI.annotationPopup?.update?.([])
  }

  async function renderCommentThreads(threads: CommentThread[]) {
    const instance = instanceRef.current

    if (!instance) return

    if (!documentLoadedRef.current) {
      pendingRenderThreadsRef.current = threads;
      setCommentMarkerOverlays([]);

      return;
    }

    const sequence = renderSequenceRef.current + 1
    renderSequenceRef.current = sequence

    if (isPdfEditingRef.current) {
      removeRenderedCommentAnchors()
      setCommentMarkerOverlays([])
      return
    }

    const { annotationManager } = instance.Core

    const existingCommentAnchors = annotationManager
      .getAnnotationsList()
      .filter(
        (annotation: AnyAnnotation) => isRenderedCommentAnnotation(annotation),
      );

    if (existingCommentAnchors.length > 0) {
      annotationManager.deleteAnnotations(existingCommentAnchors, {
        imported: true,
        force: true,
      })
    }
    markerElementsRef.current.clear();
    setCommentMarkerOverlays([]);

    for (const thread of threads) {
      if (renderSequenceRef.current !== sequence) return;

      const { annotation } = thread;

      if (annotation.status === 'deleted') continue;

      const visualState = getThreadVisualState(thread);

      if (visualState === 'highlight' && annotation.xfdf) {
        try {
          const importedAnnotations =
            ((await annotationManager.importAnnotations(annotation.xfdf)) as
              | AnyAnnotation[]
              | undefined) ?? []

          if (renderSequenceRef.current !== sequence) return

          for (const importedAnnotation of importedAnnotations) {
            if (renderSequenceRef.current !== sequence) return

            if (
              annotation.apryseAnnotationId &&
              importedAnnotation.Id !== annotation.apryseAnnotationId
            ) {
              annotationManager.updateAnnotationId?.(
                importedAnnotation,
                annotation.apryseAnnotationId,
              )
            }

            setCommentAnchorStyle(instance, importedAnnotation)
            setCommentAnchorData(importedAnnotation, annotation._id)
            annotationManager.redrawAnnotation(importedAnnotation)

          }
        } catch (error) {
          console.warn(
            'Failed to import comment annotation:',
            annotation._id,
            error,
          )
        }
      } else if (visualState === 'point' && annotation.xfdf) {
        const importedAnnotations = ((await annotationManager.importAnnotations(annotation.xfdf)) as | AnyAnnotation[] | undefined) ?? [];

        if (renderSequenceRef.current !== sequence) return;

        for (const importedAnnotation of importedAnnotations) {
          if (renderSequenceRef.current !== sequence) return;

          if (annotation.apryseAnnotationId && importedAnnotation.Id !== annotation.apryseAnnotationId) {
            annotationManager.updateAnnotationId?.(importedAnnotation, annotation.apryseAnnotationId);
          }

          setHiddenPointAnchorStyle(instance, importedAnnotation);
          setCommentAnchorData(importedAnnotation, annotation._id);

          importedAnnotation.setCustomData?.('docHubVisualState', 'point');
          importedAnnotation.setCustomData?.('docHubAnchorMode', 'hidden-xfdf-anchor');

          annotationManager.redrawAnnotation(importedAnnotation);
        }
      }

      const selectedId = selectedCommentAnnotationIdRef.current

      if (selectedId) {
        highlightCommentAnnotation(selectedId)
      }

      scheduleCommentOverlayRefresh()
    }
  }

  async function scrollToCommentAnnotation(annotationId: string) {
    const instance = instanceRef.current
    const annotation = findCommentAnnotation(annotationId)

    if (!instance) return

    if (annotation) {
      instance.Core.annotationManager.jumpToAnnotation(annotation)
    } else {
      const thread = findCommentThread(annotationId)
      const pageNumber = thread?.annotation.pageNumber
      const position = thread?.annotation.position

      if (typeof pageNumber === 'number' && position) {
        const { documentViewer } = instance.Core
        const viewerElement = viewerRef.current

        documentViewer.setCurrentPage(pageNumber)

        await waitFrame()
        await waitFrame()

        try {
          const displayMode = documentViewer
            .getDisplayModeManager()
            .getDisplayMode()
          const point = displayMode.pageToWindow(position, pageNumber)
          const scrollContainer = viewerElement
            ? findApryseScrollContainer(viewerElement)
            : null

          scrollContainer?.scrollTo({
            left: Math.max(0, point.x - scrollContainer.clientWidth / 2),
            top: Math.max(0, point.y - scrollContainer.clientHeight / 3),
            behavior: 'smooth',
          })
        } catch {
          // Ignore coordinate fallback failures; setting the page still moves close.
        }
      }
    }

    await waitFrame()
    await waitFrame()
    scheduleCommentOverlayRefresh()
  }

  function highlightCommentAnnotation(annotationId: string) {
    const instance = instanceRef.current
    const annotation = findCommentAnnotation(annotationId)

    if (!instance || !annotation) return

    const { annotationManager } = instance.Core

    annotationManager.deselectAllAnnotations()
    annotationManager.selectAnnotation(annotation)
    annotationManager.redrawAnnotation(annotation)
  }

  function handleOverlayMarkerClick(
    thread: CommentThread,
    markerElement: HTMLElement,
  ) {
    const annotationId = thread.annotation._id

    onCommentMarkerHoverRef.current?.(
      annotationId,
      getMarkerClientPosition(markerElement),
    )
  }

  function handleOverlayMarkerHover(
    thread: CommentThread,
    markerElement: HTMLElement,
  ) {
    const annotationId = thread.annotation._id

    if (lastHoveredThreadIdRef.current === annotationId) return

    lastHoveredThreadIdRef.current = annotationId

    if (markerHoverTimeoutRef.current !== null) {
      window.clearTimeout(markerHoverTimeoutRef.current)
    }

    markerHoverTimeoutRef.current = window.setTimeout(() => {
      markerHoverTimeoutRef.current = null
      onCommentMarkerHoverRef.current?.(
        annotationId,
        getMarkerClientPosition(markerElement),
      )

      window.setTimeout(() => {
        if (lastHoveredThreadIdRef.current === annotationId) {
          lastHoveredThreadIdRef.current = null
        }
      }, 250)
    }, 100)
  }

  function handleOverlayMarkerHoverEnd(thread: CommentThread) {
    if (markerHoverTimeoutRef.current !== null) {
      window.clearTimeout(markerHoverTimeoutRef.current)
      markerHoverTimeoutRef.current = null
    }

    if (lastHoveredThreadIdRef.current === thread.annotation._id) {
      lastHoveredThreadIdRef.current = null
    }

    onCommentMarkerLeaveRef.current?.(thread.annotation._id)
  }

  function handleMarkerElementChange(
    thread: CommentThread,
    markerElement: HTMLElement | null,
  ) {
    const annotationId = thread.annotation._id

    if (markerElement) {
      markerElementsRef.current.set(annotationId, markerElement)
      return
    }

    if (lastHoveredThreadIdRef.current === annotationId) {
      lastHoveredThreadIdRef.current = null

      if (markerHoverTimeoutRef.current !== null) {
        window.clearTimeout(markerHoverTimeoutRef.current)
        markerHoverTimeoutRef.current = null
      }
    }

    if (markerElementsRef.current.get(annotationId)) {
      markerElementsRef.current.delete(annotationId)
    }
  }

  useEffect(() => {
    commentThreadsRef.current = commentThreads

    renderCommentThreads(commentThreads).catch((error) => {
      console.warn('Failed to render comment threads:', error)
    })

    scheduleCommentOverlayRefresh()
  }, [commentThreads])

  useEffect(() => {
    selectedCommentAnnotationIdRef.current = selectedCommentAnnotationId ?? null

    if (selectedCommentAnnotationId) {
      highlightCommentAnnotation(selectedCommentAnnotationId)
    }

    scheduleCommentOverlayRefresh()
  }, [selectedCommentAnnotationId])

  useEffect(() => {
    commentsDisabledRef.current = Boolean(commentsDisabled)
    configureCommentUi()
    scheduleCommentOverlayRefresh()
  }, [commentsDisabled])

  useEffect(() => {
    const shouldShowAvatarMarkers = showCommentAvatarMarkers !== false
    showCommentAvatarMarkersRef.current = shouldShowAvatarMarkers

    if (!shouldShowAvatarMarkers) {
      setCommentMarkerOverlays([])
      markerElementsRef.current.clear()
      lastHoveredThreadIdRef.current = null

      if (markerHoverTimeoutRef.current !== null) {
        window.clearTimeout(markerHoverTimeoutRef.current)
        markerHoverTimeoutRef.current = null
      }

      removeRenderedAvatarMarkers()
      requestAnimationFrame(() => {
        removeRenderedAvatarMarkers()
      })
      return
    }

    scheduleCommentOverlayRefresh()
  }, [showCommentAvatarMarkers])

  useEffect(() => {
    isPdfEditingRef.current = isPdfEditing
    configureCommentUi()
    scheduleCommentOverlayRefresh()
  }, [isPdfEditing])

  useEffect(() => {
    onCommentAnnotationClickRef.current = onCommentAnnotationClick
  }, [onCommentAnnotationClick])

  useEffect(() => {
    onCommentMarkerHoverRef.current = onCommentMarkerHover
  }, [onCommentMarkerHover])

  useEffect(() => {
    onCommentMarkerLeaveRef.current = onCommentMarkerLeave
  }, [onCommentMarkerLeave])

  useEffect(() => {
    onPendingCommentAnchorCreatedRef.current = onPendingCommentAnchorCreated
  }, [onPendingCommentAnchorCreated])

  useEffect(() => {
    if (!viewerRef.current) return

    let disposed = false

      ; (WebViewer as any)(
        {
          path: '/webviewer/lib',
          licenseKey: import.meta.env.VITE_APRYSE_LICENSE_KEY,
          initialDoc: fileUrl,
          fullAPI: true,
        },
        viewerRef.current,
      ).then((instance: WebViewerInstance) => {
        if (disposed) return

        instanceRef.current = instance

        const { UI, Core } = instance
        const { documentViewer, annotationManager } = Core

        UI.getModularHeader('default-top-header')?.setItems([])
        UI.getModularHeader('tools-header')?.setItems([])

        UI.disableElements([
          'page-nav-floating-header',
          'notesPanel',
          'notesPanelButton',
        ])
        configureLockedZoomUi(instance)

        if (viewerRef.current) {
          bindZoomInputBlockers(viewerRef.current)
        }

        configureCommentUi()

        const contentEditManager = getContentEditManager(instance)

        const handleContentBoxEditStarted = (...args: any[]) => {
          const payload = args[0]
          const rect = extractEditedRectFromPayload(payload)

          activeContentEditorRef.current = payload?.editor ?? payload ?? null

          if (rect) {
            editedRectsRef.current = dedupeEditedRects([
              ...editedRectsRef.current,
              rect,
            ])
          }
        }

        const handleContentBoxEditEnded = () => {
          activeContentEditorRef.current = null;
        }

        contentEditManager?.addEventListener?.(
          'contentBoxEditStarted',
          handleContentBoxEditStarted,
        )
        contentEditManager?.addEventListener?.(
          'contentBoxEditEnded',
          handleContentBoxEditEnded,
        )

        documentViewer.addEventListener('documentLoaded', async () => {
          documentLoadedRef.current = true;
          setCurrentPage(documentViewer.getCurrentPage());
          setPageCount(documentViewer.getPageCount());

          configureLockedZoomUi(instance);
          scheduleLockedZoomEnforcement('documentLoaded');

           // Let Apryse populate embedded annotations from the PDF first.
          await waitFrame();
          await waitFrame();
          await wait(500);

          if(disposed) return;

          const threadsToRender = pendingRenderThreadsRef.current ?? commentThreadsRef.current;
          pendingRenderThreadsRef.current = null;

          await removeEmbeddedDocHubCommentAnnotationsBeforeRender(threadsToRender);


          await renderCommentThreads(threadsToRender);
          bindCommentOverlayPositionListeners();
          scheduleCommentOverlayRefresh();
        })

        documentViewer.addEventListener(
          'pageNumberUpdated',
          (pageNumber) => {
            setCurrentPage(pageNumber)
            scheduleCommentOverlayRefresh()
          },
        )

        documentViewer.addEventListener('zoomUpdated', () => {
          scheduleLockedZoomEnforcement('zoomUpdated')
          scheduleCommentOverlayRefresh()
        })

        documentViewer.addEventListener('fitModeUpdated', () => {
          scheduleLockedZoomEnforcement('fitModeUpdated')
          scheduleCommentOverlayRefresh()
        })

        documentViewer.addEventListener(
          'textSelected',
          (quads: AnyQuad[], text: string, pageNumber: number) => {
            cacheTextSelection(quads, text, pageNumber)
          },
        )

        annotationManager.addEventListener(
          'annotationSelected',
          (annotations: AnyAnnotation[], action: string) => {
            if (action !== 'selected') return

            const avatarMarker = annotations.find((item) => {
              const threadId = getThreadIdFromAnnotation(item)

              return Boolean(threadId) && isDocHubAvatarMarker(item)
            })

            if (avatarMarker) {
              const threadId = getThreadIdFromAnnotation(avatarMarker)

              if (!threadId) return

              onCommentMarkerHoverRef.current?.(
                threadId,
                getAnnotationClientPosition(avatarMarker),
              )
              return
            }

            const annotation = annotations.find((item) => {
              const threadId = getThreadIdFromAnnotation(item)

              return Boolean(threadId) && isCommentAnchor(item)
            })

            if (!annotation) return

            const threadId = getThreadIdFromAnnotation(annotation)

            if (!threadId) return

            const thread = findCommentThread(threadId)
            const markerClientPosition = thread
              ? getThreadMarkerClientPosition(thread)
              : null

            onCommentAnnotationClickRef.current?.(
              threadId,
              markerClientPosition ?? getAnnotationClientPosition(annotation),
              'annotation',
            )
          },
        )

        bindCommentOverlayPositionListeners()
      })

    return () => {
      disposed = true

      instanceRef.current?.UI.dispose?.()
      instanceRef.current = null
      activeContentEditorRef.current = null
      editedRectsRef.current = []
      temporaryAnchorIdRef.current = null
      documentLoadedRef.current = false
      pendingRenderThreadsRef.current = null
      markerElementsRef.current.clear()
      lastHoveredThreadIdRef.current = null
      overlayPositionCleanupRef.current?.()
      overlayPositionCleanupRef.current = null
      zoomInputCleanupRef.current?.()
      zoomInputCleanupRef.current = null
      clearScheduledZoomEnforcement()
      isEnforcingZoomRef.current = false

      if (markerHoverTimeoutRef.current !== null) {
        window.clearTimeout(markerHoverTimeoutRef.current)
        markerHoverTimeoutRef.current = null
      }

      if (overlayFrameRef.current !== null) {
        cancelAnimationFrame(overlayFrameRef.current)
        overlayFrameRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const instance = instanceRef.current

    if (!instance || !fileUrl) return;

    editedRectsRef.current = [];
    documentLoadedRef.current = false;
    pendingRenderThreadsRef.current = commentThreadsRef.current;
    latestSelectionRef.current = null;
    markerElementsRef.current.clear();
    setSelectionActionPosition(null);
    setCommentMarkerOverlays([]);

    instance.UI.loadDocument(fileUrl, {
      filename: fileUrl.split('/').pop() ?? 'document.pdf',
    });
    scheduleLockedZoomEnforcement('loadDocument');
  }, [fileUrl])

  useEffect(() => {
    const instance = instanceRef.current

    if (!instance) return

    const { UI, Core } = instance

    const contentEditManager = getContentEditManager(instance)

    async function toggleContentEditMode() {
      if (isPdfEditing) {
        editedRectsRef.current = []

        await removeTemporaryCommentAnchor()
        removeRenderedCommentAnchors()

        UI.enableFeatures([UI.Feature.ContentEdit])

        await (Core as any).ContentEdit?.preloadWorker?.(contentEditManager)

        const editTextToolbarGroup =
          (UI.ToolbarGroup as any).EDIT_TEXT ?? (UI.ToolbarGroup as any).EDIT

        UI.setToolbarGroup(editTextToolbarGroup)

        await contentEditManager?.startContentEditMode?.()

        await waitFrame()
        await waitFrame()
        await wait(300)

      } else {
        activeContentEditorRef.current = null

        await endContentEditMode(instance)

        const skippedStaleCommentRestore =
          skipNextEditExitCommentRestoreRef.current

        if (skippedStaleCommentRestore) {
          removeRenderedCommentAnchors();
          await renderCommentThreads(
            getThreadsWithOptimisticPointMarkers(
              lastDegradedAnnotationIdsRef.current,
            ),
          )
          lastDegradedAnnotationIdsRef.current = [];
          skipNextEditExitCommentRestoreRef.current = false;
        } else {
          await renderCommentThreads(commentThreadsRef.current);
        }
      }
    }

    toggleContentEditMode().catch((error) => {
      console.error('Toggle content edit mode failed:', error)
    })
  }, [isPdfEditing])

  const goToPage = (page: number) => {
    const instance = instanceRef.current

    if (!instance) return

    const safePage = Math.min(Math.max(page, 1), pageCount)

    instance.Core.documentViewer.setCurrentPage(safePage)
    setCurrentPage(safePage)
  }

  useImperativeHandle(ref, () => ({
    async exportEditedPdf() {
      const instance = instanceRef.current;
      const viewerElement = viewerRef.current;

      if (!instance || !viewerElement) return null;

      const { documentViewer } = instance.Core;

      try {
        await activeContentEditorRef.current?.blur?.();
      } catch (error) {
        console.warn('Failed to blur active content editor:', error);
      }

      await waitFrame();
      await waitFrame();
      await wait(150);

      await stopAllContentBoxEditing(instance);

      await clickInsideApryseShadowRoot(viewerElement);

      await stopAllContentBoxEditing(instance);

      const liveContentEditRects = collectContentEditAnnotationRects(instance)
      const finalEditedRects = dedupeEditedRects([
        ...editedRectsRef.current,
        ...liveContentEditRects,
      ]);
      const degradedAnnotationIds = collectDegradedCommentAnnotationIds(
        instance,
        finalEditedRects,
      );

      editedRectsRef.current = finalEditedRects;
      skipNextEditExitCommentRestoreRef.current = true;
      lastDegradedAnnotationIdsRef.current = degradedAnnotationIds;

      await endContentEditMode(instance);

      documentViewer.refreshAll?.()
      documentViewer.updateView?.()

      await waitFrame()
      await waitFrame()
      await wait(300)

      const doc = documentViewer.getDocument()

      if (!doc) return null

      removeRenderedCommentAnchors();

      let fileData: ArrayBuffer;

      try {
        fileData = await doc.getFileData({
          downloadType: 'pdf',
        })
      } finally {
        if (!isPdfEditingRef.current) {
          await renderCommentThreads(commentThreadsRef.current)
        }
      }

      const file = new Blob([new Uint8Array(fileData)], {
        type: 'application/pdf',
      });

      return {
        file,
        editedRects: finalEditedRects,
        degradedAnnotationIds,
      }
    },

    reloadOriginalPdf() {
      const instance = instanceRef.current

      if (!instance || !fileUrl) return

      activeContentEditorRef.current = null
      editedRectsRef.current = []

      instance.UI.loadDocument(fileUrl, {
        filename: fileUrl.split('/').pop() ?? 'document.pdf',
      })
    },

    renderCommentThreads,
    scrollToCommentAnnotation,
    highlightCommentAnnotation,
    removeTemporaryCommentAnchor,
  }))

  return (
    <div className="flex h-[calc(100vh-230px)] min-h-[70px] flex-col bg-stone-100">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div ref={viewerRef} className="h-full w-full" />

        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
        >
          <CommentAnnotationOverlayLayer
            hidden={isCommentOverlayHidden()}
            selectionActionPosition={selectionActionPosition}
            markers={commentMarkerOverlays}
            activeAnnotationId={selectedCommentAnnotationId}
            hiddenAnnotationId={hiddenCommentAvatarMarkerId}
            onAddComment={createPendingCommentAnchor}
            onMarkerClick={handleOverlayMarkerClick}
            onMarkerHover={handleOverlayMarkerHover}
            onMarkerHoverEnd={handleOverlayMarkerHoverEnd}
            onMarkerElementChange={handleMarkerElementChange}
          />
        </div>
      </div>

      <PdfPageControls
        currentPage={currentPage}
        pageCount={pageCount}
        onGoToPage={goToPage}
      />
    </div>
  )
})
