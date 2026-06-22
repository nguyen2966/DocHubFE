import type { ApryseWebComponentElement } from "../types/apryse.types"

export const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export const waitFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })

export function getApryseWebComponent(viewerElement: HTMLDivElement) {
  return viewerElement.querySelector(
    'apryse-webviewer',
  ) as ApryseWebComponentElement | null
}

export function getApryseShadowRoot(viewerElement: HTMLDivElement) {
  const webComponent = getApryseWebComponent(viewerElement)

  return webComponent?.shadowRoot ?? null
}

export function dispatchMouseLikeEvent(
  target: Element,
  type: string,
  clientX: number,
  clientY: number,
) {
  const win = target.ownerDocument?.defaultView ?? window

  const EventConstructor =
    type.startsWith('pointer') && 'PointerEvent' in win
      ? win.PointerEvent
      : win.MouseEvent

  const event = new EventConstructor(type, {
    bubbles: true,
    cancelable: true,
    composed: true,
    view: win,
    clientX,
    clientY,
    button: 0,
    buttons: type === 'mouseup' || type === 'pointerup' ? 0 : 1,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
  } as MouseEventInit & PointerEventInit)

  target.dispatchEvent(event)
}

export function findPageAreaInShadowRoot(shadowRoot: ShadowRoot) {
  const selectors = [
    '[data-element="documentContainer"]',
    '[data-element="pageContainer"]',
    '.DocumentContainer',
    '.documentContainer',
    '.document-container',
    '.PageContainer',
    '.pageContainer',
    '.page-container',
    '.pageSection',
    '.page',
    '#app',
  ]

  for (const selector of selectors) {
    const element = shadowRoot.querySelector(selector)

    if (element) {
      return element
    }
  }

  return shadowRoot.querySelector('#app')
}

export function findApryseScrollContainer(viewerElement: HTMLDivElement) {
  const shadowRoot = getApryseShadowRoot(viewerElement)

  if (!shadowRoot) return null

  const selectors = [
    '[data-element="documentContainer"]',
    '.DocumentContainer',
    '.documentContainer',
    '.document-container',
    '#DocumentViewer',
    '#app',
  ]

  for (const selector of selectors) {
    const element = shadowRoot.querySelector(selector) as HTMLElement | null

    if (
      element &&
      (element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth)
    ) {
      return element
    }
  }

  return null
}

export async function clickInsideApryseShadowRoot(
  viewerElement: HTMLDivElement,
) {
  const shadowRoot = getApryseShadowRoot(viewerElement)

  if (!shadowRoot) {
    console.warn('Apryse shadowRoot not found')
    return false
  }

  const pageArea = findPageAreaInShadowRoot(shadowRoot)

  if (!pageArea) {
    console.warn('Apryse page area not found inside shadowRoot')
    return false
  }

  const rect = pageArea.getBoundingClientRect()

  const x = rect.left + 12
  const y = rect.top + 12

  const realTarget = (shadowRoot as any).elementFromPoint?.(x, y) ?? pageArea

  dispatchMouseLikeEvent(realTarget, 'pointerdown', x, y)
  dispatchMouseLikeEvent(realTarget, 'mousedown', x, y)
  dispatchMouseLikeEvent(realTarget, 'pointerup', x, y)
  dispatchMouseLikeEvent(realTarget, 'mouseup', x, y)
  dispatchMouseLikeEvent(realTarget, 'click', x, y)

  await waitFrame()
  await waitFrame()
  await wait(300)

  return true
}
