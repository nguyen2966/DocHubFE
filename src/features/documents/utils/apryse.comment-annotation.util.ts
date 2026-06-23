import type { WebViewerInstance } from '@pdftron/webviewer';

import {
  COMMENT_ANCHOR_TYPE,
  COMMENT_ANCHOR_TYPE_KEY,
  COMMENT_THREAD_ID_KEY,
  DOC_HUB_ANNOTATION_ID_KEY,
  DOC_HUB_KIND_AVATAR_MARKER,
  DOC_HUB_KIND_COMMENT_HIGHLIGHT,
  DOC_HUB_KIND_KEY,
  DOC_HUB_KIND_PENDING_COMMENT_HIGHLIGHT,
  DOC_HUB_MANAGED_KEY,
  DOC_HUB_ROLE_KEY,
  TEMPORARY_ANCHOR_KEY,
} from '../constants/apryse.constants';
import type { AnyAnnotation } from '../types/apryse.types';

export function isCommentAnchor(annotation: AnyAnnotation) {
  return (
    annotation?.getCustomData?.(COMMENT_ANCHOR_TYPE_KEY) ===
      COMMENT_ANCHOR_TYPE ||
    annotation?.getCustomData?.(DOC_HUB_MANAGED_KEY) === 'true'
  )
}

export function isTemporaryCommentAnchor(annotation: AnyAnnotation) {
  return (
    annotation?.getCustomData?.(TEMPORARY_ANCHOR_KEY) === 'true' ||
    annotation?.getCustomData?.(DOC_HUB_KIND_KEY) ===
      DOC_HUB_KIND_PENDING_COMMENT_HIGHLIGHT
  )
}

export function getThreadIdFromAnnotation(annotation: AnyAnnotation) {
  const id =
    annotation?.getCustomData?.(DOC_HUB_ANNOTATION_ID_KEY) ??
    annotation?.getCustomData?.(COMMENT_THREAD_ID_KEY)

  return typeof id === 'string' && id.length > 0 ? id : null
}

export function getDocHubKind(annotation: AnyAnnotation) {
  const kind = annotation?.getCustomData?.(DOC_HUB_KIND_KEY)

  return typeof kind === 'string' ? kind : null
}

export function isDocHubAvatarMarker(annotation: AnyAnnotation) {
  return getDocHubKind(annotation) === DOC_HUB_KIND_AVATAR_MARKER
}

export function setDocHubManagedData(
  annotation: AnyAnnotation,
  kind: string,
  threadId: string | null,
) {
  annotation.setCustomData?.(DOC_HUB_MANAGED_KEY, 'true')
  annotation.setCustomData?.(DOC_HUB_KIND_KEY, kind)
  annotation.setCustomData?.(DOC_HUB_ROLE_KEY, kind)

  if (threadId) {
    annotation.setCustomData?.(DOC_HUB_ANNOTATION_ID_KEY, threadId)
  }
}

export function setCommentAnchorData(
  annotation: AnyAnnotation,
  threadId: string | null,
  temporary = false,
) {
  annotation.setCustomData?.(COMMENT_ANCHOR_TYPE_KEY, COMMENT_ANCHOR_TYPE)
  setDocHubManagedData(
    annotation,
    temporary
      ? DOC_HUB_KIND_PENDING_COMMENT_HIGHLIGHT
      : DOC_HUB_KIND_COMMENT_HIGHLIGHT,
    threadId,
  )

  if (threadId) {
    annotation.setCustomData?.(COMMENT_THREAD_ID_KEY, threadId)
  }

  if (temporary) {
    annotation.setCustomData?.(TEMPORARY_ANCHOR_KEY, 'true')
  } else {
    annotation.setCustomData?.(TEMPORARY_ANCHOR_KEY, 'false')
  }
}

export function setCommentAnchorStyle(
  instance: WebViewerInstance,
  annotation: AnyAnnotation,
) {
  const { Annotations } = instance.Core

  annotation.StrokeColor = new Annotations.Color(246, 194, 64)
  annotation.FillColor = new Annotations.Color(255, 232, 128)
  annotation.Opacity = 0.45
  annotation.NoMove = true
  annotation.NoResize = true
  annotation.NoDelete = true
}

export function setHiddenPointAnchorStyle(
  instance: WebViewerInstance,
  annotation: AnyAnnotation,
) {
  const { Annotations } = instance.Core

  const transparentColor = new Annotations.Color(255, 255, 255, 0)

  annotation.Opacity = 0
  annotation.StrokeThickness = 0
  annotation.StrokeColor = transparentColor
  annotation.FillColor = transparentColor
  annotation.TextColor = transparentColor

  annotation.NoMove = true
  annotation.NoResize = true
  annotation.NoDelete = true
  annotation.Locked = true
  annotation.ReadOnly = true
  annotation.Printable = false

  // Extra Apryse flags, if supported by this annotation type
  annotation.Hidden = true
  annotation.NoView = true
  annotation.Invisible = true
  annotation.Listable = false

  annotation.setCustomData?.('docHubCommentAnchor', 'true')
  annotation.setCustomData?.('docHubHiddenAnchor', 'true')
  annotation.setCustomData?.('docHubVisualState', 'point')
}
