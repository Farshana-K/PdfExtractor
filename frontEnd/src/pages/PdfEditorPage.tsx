import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { api } from '../lib/api';
import { PageThumbnail } from '../components/PageThumbnail';
import { SortablePage } from '../components/SortablePage';
import { extractPdfSchema } from '../schemas/pdf/pdfSchemas';
import type { PdfFile, GeneratedPdf } from '../types';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface ToastMessage {
  id: number;
  text: string;
  type: 'error' | 'success';
}

export function PdfEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pdfInfo, setPdfInfo] = useState<PdfFile | null>(null);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [generated, setGenerated] = useState<GeneratedPdf | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // States for Page Preview Modal & Toast System
  const [previewPage, setPreviewPage] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'error' | 'success' = 'error') => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);
  };

  useEffect(() => {
    async function load() {
      if (!id) return;
      const { data } = await api.get('/pdfs');
      const info = data.pdfs.find((pdf: PdfFile) => pdf.id === id);
      if (!info) return navigate('/');
      setPdfInfo(info);
      const response = await api.get(`/pdfs/${id}`, { responseType: 'arraybuffer' });
      const document = await pdfjsLib.getDocument({ data: response.data }).promise;
      setPdfDocument(document);
    }
    load().catch((err: any) => {
      addToast(err.response?.data?.message || 'Could not load PDF document.');
    });
  }, [id, navigate]);

  function toggle(page: number) {
    setSelected((current) =>
      current.includes(page) ? current.filter((v) => v !== page) : [...current, page]
    );
  }

  function dragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSelected((current) =>
      arrayMove(current, current.indexOf(Number(active.id)), current.indexOf(Number(over.id)))
    );
  }

  async function createPdf() {
    if (!id) return;
    const result = extractPdfSchema.safeParse({ pages: selected, save: false });
    if (!result.success) {
      addToast(result.error.issues[0]?.message || 'Select at least one page.');
      return;
    }
    setCreating(true);
    try {
      const { data } = await api.post(`/pdfs/${id}/extract`, { pages: selected });
      setGenerated(data);
      addToast('PDF preview generated successfully!', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Could not create PDF.');
    } finally {
      setCreating(false);
    }
  }

  async function saveGenerated() {
    if (!generated) return;
    setSaving(true);
    try {
      await api.post(`/generated/${generated.generatedId}/save`);
      setGenerated(null);
      addToast('Saved to your PDFs library!', 'success');
      navigate('/');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Could not save PDF.');
    } finally {
      setSaving(false);
    }
  }

  async function discardGenerated() {
    if (!generated) return;
    try {
      await api.delete(`/generated/${generated.generatedId}`);
    } finally {
      setGenerated(null);
    }
  }

  async function downloadGenerated() {
    if (!generated) return;
    try {
      const response = await api.get(`/generated/${generated.generatedId}/download`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = generated.fileName;
      anchor.click();
      URL.revokeObjectURL(url);
      addToast('Download started!', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Download failed.');
    }
  }

  if (!pdfInfo || !pdfDocument) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <p className="font-semibold text-slate-600">Loading document...</p>
      </div>
    );
  }

  return (
    <section className="relative pb-24">
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-xl transition-all duration-300 ${
              toast.type === 'error'
                ? 'bg-rose-600 text-white shadow-rose-600/20'
                : 'bg-emerald-600 text-white shadow-emerald-600/20'
            }`}
          >
            <span>{toast.type === 'error' ? '⚠️️' : '✓'}</span>
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
            PDF Editor
          </span>
          <h1 className="mt-2 max-w-2xl truncate text-3xl font-black tracking-tight text-slate-900">
            {pdfInfo.fileName}
          </h1>
          <p className="mt-1 text-slate-500">
            {pdfInfo.pageCount} pages available · Select checkboxes below to include pages and reorder them.
          </p>
        </div>
        <button
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          onClick={() => navigate('/')}
        >
          Back to library
        </button>
      </div>

      {/* Expanded Grid Layout: Fewer columns per row (max 3) so each page thumbnail is substantially wider */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: pdfInfo.pageCount }, (_, index) => index + 1).map((page) => {
          const isSelected = selected.includes(page);
          return (
            <div
              key={page}
              className={`group relative flex flex-col rounded-3xl border bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                isSelected
                  ? 'border-indigo-600 shadow-lg shadow-indigo-600/10 ring-2 ring-indigo-600/20'
                  : 'border-slate-200/80 shadow-sm hover:border-slate-300'
              }`}
            >
              {/* Click Thumbnail Frame for Full Preview */}
              <div
                className="relative flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-100 p-2 cursor-pointer"
                onClick={() => setPreviewPage(page)}
              >
                <div className="pointer-events-none w-full flex justify-center transition-transform duration-300 group-hover:scale-[1.02]">
                  <PageThumbnail
                    pdf={pdfDocument}
                    pageNumber={page}
                    selected={isSelected}
                    onToggle={() => {}}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-all duration-200 group-hover:bg-slate-900/20">
                  <span className="rounded-full bg-slate-900/80 px-4 py-2 text-xs font-bold text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                    Preview Page
                  </span>
                </div>
              </div>

              {/* Page Selection Bar */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-bold text-slate-500">Page {page}</span>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-1.5 hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(page)}
                    className="h-5 w-5 rounded-md border-slate-300 text-indigo-600 transition focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-800">Select Page</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Sticky Reorder Panel */}
      <div className="sticky bottom-6 mt-12 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-black text-slate-900">Final Page Order</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {selected.length
                ? `${selected.length} pages selected: ${selected.join(' → ')}`
                : 'No pages selected yet'}
            </p>
          </div>
          <button
            disabled={!selected.length || creating}
            onClick={createPdf}
            className="rounded-2xl bg-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:shadow-none"
          >
            {creating ? 'Creating PDF…' : 'Create new PDF'}
          </button>
        </div>

        {selected.length > 0 && (
          <div className="mt-5 overflow-x-auto border-t border-slate-100 pt-4">
            <DndContext collisionDetection={closestCenter} onDragEnd={dragEnd}>
              <SortableContext items={selected} strategy={horizontalListSortingStrategy}>
                <div className="flex min-w-max gap-3 pb-2">
                  {selected.map((page) => (
                    <SortablePage key={page} page={page} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      {/* Page Preview Modal */}
      {previewPage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
          onClick={() => setPreviewPage(null)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col items-center rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex w-full items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Page {previewPage} Preview
              </h3>
              <button
                onClick={() => setPreviewPage(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="flex max-h-[70vh] w-full justify-center overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <PageThumbnail
                pdf={pdfDocument}
                pageNumber={previewPage}
                selected={selected.includes(previewPage)}
                onToggle={() => {}}
              />
            </div>
            <div className="mt-4 flex w-full items-center justify-between pt-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(previewPage)}
                  onChange={() => toggle(previewPage)}
                  className="h-5 w-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-bold text-slate-700">Include in exported PDF</span>
              </label>
              <button
                onClick={() => setPreviewPage(null)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated PDF Ready Dialog Modal */}
      {generated && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-xl text-emerald-600">
              ✓
            </div>
            <h2 className="mt-5 text-center text-2xl font-black text-slate-900">Your PDF is ready</h2>
            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              {generated.pageCount} pages in this order:{' '}
              <span className="font-bold text-slate-700">{generated.pages.join(', ')}</span>
            </p>
            <div className="mt-6 space-y-3">
              <button
                onClick={downloadGenerated}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
              >
                Download PDF
              </button>
              <button
                disabled={saving}
                onClick={saveGenerated}
                className="w-full rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3.5 font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save to My PDFs'}
              </button>
              <button
                onClick={discardGenerated}
                className="w-full rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100"
              >
                Don't save
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-slate-400">
              The generated PDF is only added to your library when you choose “Save to My PDFs”.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}