import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { PdfPageControls } from './ControlProps';

interface AprysePdfViewerProps {
  fileUrl: string,
  isPdfEditing: boolean
}

export interface AprysePdfViewerRef {
  exportEditedPdf: () => Promise<Blob | null>
}

import WebViewerModule from '@pdftron/webviewer';
import type { WebViewerInstance } from '@pdftron/webviewer';

const WebViewer = (WebViewerModule as any).default ?? WebViewerModule;

export const AprysePdfViewer = forwardRef<AprysePdfViewerRef, AprysePdfViewerProps>(
  function AprysePdfViewer({ fileUrl, isPdfEditing }, ref) {
    const viewerRef = useRef<HTMLDivElement | null>(null)
    const instanceRef = useRef<WebViewerInstance | null>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)

    useEffect(() => {
      if (!viewerRef.current) return;

      let disposed = false;

      WebViewer(
        {
          path: '/webviewer/lib',
          licenseKey: import.meta.env.VITE_APRYSE_LICENSE_KEY,
          initialDoc: fileUrl,
          fullAPI: true,
        },
        viewerRef.current,
      ).then((instance) => {
        if (disposed) return;

        instanceRef.current = instance;
        console.log(instance.UI);
        const { UI } = instance;

        // Cách mạnh nhất với Modular UI: clear header
        UI.getModularHeader('default-top-header')?.setItems([]);
        UI.getModularHeader('tools-header')?.setItems([]);

        UI.disableElements([
          'page-nav-floating-header',
        ]);

        const { documentViewer } = instance.Core;

        documentViewer.addEventListener('documentLoaded', () => {
          setCurrentPage(documentViewer.getCurrentPage());
          setPageCount(documentViewer.getPageCount());

          instance.UI.setFitMode(instance.UI.FitMode.FitWidth);
        })

        documentViewer.addEventListener('pageNumberUpdated', (pageNumber) => {
          setCurrentPage(pageNumber);
        })
      })

      return () => {
        disposed = true
        instanceRef.current?.UI.dispose?.()
        instanceRef.current = null
      }
    }, [])

    useEffect(() => {
      if (!instanceRef.current) return

      instanceRef.current.UI.loadDocument(fileUrl, {
        filename: fileUrl.split('/').pop() ?? 'document.pdf',
      })
    }, [fileUrl])

    const goToPage = (page: number) => {
      const instance = instanceRef.current
      if (!instance) return

      const safePage = Math.min(Math.max(page, 1), pageCount)
      instance.Core.documentViewer.setCurrentPage(safePage)
      setCurrentPage(safePage)
    }

    useEffect(() => {
      const instance = instanceRef.current
      if (!instance) return

      const { UI, Core } = instance
      const { documentViewer } = Core

      const contentEditManager =
        documentViewer.getContentEditManager?.()

      if (isPdfEditing) {
        console.log('On edit mode')

        UI.enableFeatures([UI.Feature.ContentEdit])

        // Đúng theo docs Apryse
        UI.setToolbarGroup(UI.ToolbarGroup.EDIT_TEXT)

        // Quan trọng: ép viewer vào content edit mode
        contentEditManager?.startContentEditMode?.()
      } else {
        console.log('Off edit mode')

        contentEditManager?.endContentEditMode?.()
      }
    }, [isPdfEditing])

    useImperativeHandle(ref, () => ({
      async exportEditedPdf() {
        const instance = instanceRef.current;
        if (!instance) return null;

        await instance.Core.contentEditManager?.endContentEditMode?.();

        const doc = instance.Core.documentViewer.getDocument();

        const fileData = await doc.getFileData({
          downloadType: 'pdf',
        })

        return new Blob([new Uint8Array(fileData)], {
          type: 'application/pdf',
        })
      },
    }))

    return (
      <div className="flex h-[calc(100vh-230px)] min-h-[70px] flex-col bg-stone-100">
        <div className="min-h-0 flex-1 overflow-hidden">
          <div ref={viewerRef} className="h-full w-full" />
        </div>

        <PdfPageControls
          currentPage={currentPage}
          pageCount={pageCount}
          onGoToPage={goToPage}
        />
      </div>
    )
  }
)