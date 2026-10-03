
import { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';

type Props = {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  selected: boolean;
  onToggle: () => void;
};

export function PageThumbnail({
  pdf,
  pageNumber,
  selected,
  onToggle,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 0.8 });

      const canvas = canvasRef.current;

      if (!canvas || cancelled) return;

      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvas,
        canvasContext: context,
        viewport,
      }).promise;
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [pdf, pageNumber]);

  return (
    <button
      className={`page-card ${selected ? 'selected' : ''}`}
      onClick={onToggle}
    >
      <canvas ref={canvasRef} />
      <span>Page {pageNumber}</span>
      <span className="check">{selected ? '✓' : ''}</span>
    </button>
  );
}

