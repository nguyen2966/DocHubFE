import type { EditedRect } from "../../comments/types/comment.type";
import type { AnyQuad } from "../types/apryse.types";

export function getQuadBounds(quads: AnyQuad[]) {
  const xs: number[] = []
  const ys: number[] = []

  for (const quad of quads) {
    xs.push(quad.x1, quad.x2, quad.x3, quad.x4)
    ys.push(quad.y1, quad.y2, quad.y3, quad.y4)
  }

  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  }
}

export function getQuadCenterY(quad: AnyQuad) {
  return (quad.y1 + quad.y2 + quad.y3 + quad.y4) / 4
}

export function getQuadRightMiddle(quad: AnyQuad) {
  const rightX = Math.max(quad.x1, quad.x2, quad.x3, quad.x4)

  return {
    x: rightX,
    y: getQuadCenterY(quad),
  }
}

export function getTextAnchorFromQuads(quads: AnyQuad[]) {
  if (!quads.length) return null

  const lineThreshold = 4
  const lines: Array<{ centerY: number; quads: AnyQuad[] }> = []

  for (const quad of quads) {
    const centerY = getQuadCenterY(quad)
    const line = lines.find(
      (item) => Math.abs(item.centerY - centerY) <= lineThreshold,
    )

    if (line) {
      line.quads.push(quad)
      line.centerY =
        line.quads.reduce((sum, item) => sum + getQuadCenterY(item), 0) /
        line.quads.length
    } else {
      lines.push({ centerY, quads: [quad] })
    }
  }

  const lastVisualLine = lines.reduce((lastLine, line) =>
    line.centerY > lastLine.centerY ? line : lastLine,
  )
  const rightmostQuad = lastVisualLine.quads.reduce((rightmost, quad) =>
    getQuadRightMiddle(quad).x > getQuadRightMiddle(rightmost).x
      ? quad
      : rightmost,
  )

  return getQuadRightMiddle(rightmostQuad)
}

export function getFiniteNumber(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
  }

  return null
}

export function doRectsOverlap(a: EditedRect, b: EditedRect, padding = 4) {
  if (a.pageNumber !== b.pageNumber) return false

  const aX1 = Math.min(a.x1, a.x2) - padding
  const aX2 = Math.max(a.x1, a.x2) + padding
  const aY1 = Math.min(a.y1, a.y2) - padding
  const aY2 = Math.max(a.y1, a.y2) + padding

  const bX1 = Math.min(b.x1, b.x2) - padding
  const bX2 = Math.max(b.x1, b.x2) + padding
  const bY1 = Math.min(b.y1, b.y2) - padding
  const bY2 = Math.max(b.y1, b.y2) + padding

  return aX1 <= bX2 && aX2 >= bX1 && aY1 <= bY2 && aY2 >= bY1
}
