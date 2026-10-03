import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { selectUser } from '../redux/slices/authSlice';
import { useAppSelector } from '../redux/hooks';
import { uploadPdfSchema } from '../schemas/pdf/pdfSchemas';
import type { PdfFile } from '../types';

interface ToastMessage {
  id: number;
  text: string;
  type: 'error' | 'success';
}

export function HomePage() {
  const user = useAppSelector(selectUser);
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // Toast System State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Custom Delete Modal State
  const [deletingPdf, setDeletingPdf] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const addToast = (text: string, type: 'error' | 'success' = 'error') => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);
  };

  async function load() {
    try {
      const { data } = await api.get('/pdfs');
      setPdfs(data.pdfs);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        addToast(error.response?.data?.message || 'Could not load your PDFs');
      }
    }
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const result = uploadPdfSchema.safeParse({ file });
    if (!result.success) {
      addToast(result.error.issues[0]?.message || 'Invalid PDF file');
      return;
    }

    setUploading(true);
    const form = new FormData();
    form.append('file', file);

    try {
      await api.post('/pdfs', form);
      addToast('PDF uploaded successfully!', 'success');
      await load();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingPdf) return;
    setIsDeleting(true);

    try {
      await api.delete(`/pdfs/${deletingPdf.id}`);
      addToast(`"${deletingPdf.name}" deleted successfully`, 'success');
      setDeletingPdf(null);
      await load();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  }

  // Unauthenticated Hero State
  if (!user) {
    return (
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-20 text-center text-white shadow-2xl sm:px-12 lg:py-28">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-300 backdrop-blur-md">
            ✦ Smart PDF Workspace
          </span>
          <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-6xl sm:leading-tight">
            Extract & reorder <br className="hidden sm:inline" /> the exact pages you need.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Upload documents once, organize pages with intuitive drag-and-drop, and instantly generate crisp new PDF files.
          </p>
          <Link
            to="/login"
            className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-extrabold text-slate-950 shadow-2xl transition hover:bg-slate-100 active:scale-95"
          >
            Start for free →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pb-16">
      {/* Toast System */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-2xl transition-all duration-300 ${
              toast.type === 'error'
                ? 'bg-rose-600 text-white shadow-rose-600/20'
                : 'bg-emerald-600 text-white shadow-emerald-600/20'
            }`}
          >
            <span>{toast.type === 'error' ? '⚠️' : '✓'}</span>
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
            Workspace
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">My PDFs</h1>
          <p className="mt-1 text-slate-500">Store originals and generated PDF documents you choose to keep.</p>
        </div>

        <label
          className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold text-white shadow-lg transition active:scale-95 ${
            uploading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 shadow-indigo-600/25 hover:bg-indigo-500'
          }`}
        >
          {uploading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Uploading…</span>
            </>
          ) : (
            <>
              <span className="text-lg leading-none">+</span>
              <span>Upload PDF</span>
            </>
          )}
          <input
            type="file"
            accept="application/pdf"
            onChange={upload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* PDF Grid */}
      {pdfs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pdfs.map((pdf) => (
            <article
              key={pdf.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-xs font-black text-rose-600">
                    PDF
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {pdf.pageCount} {pdf.pageCount === 1 ? 'page' : 'pages'}
                  </span>
                </div>

                <h3 className="mt-5 truncate text-base font-extrabold text-slate-900" title={pdf.fileName}>
                  {pdf.fileName}
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  {(pdf.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div className="mt-6 flex gap-2.5">
                <Link
                  className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-center text-xs font-bold text-white transition hover:bg-indigo-600"
                  to={`/pdf/${pdf.id}`}
                >
                  Open & Edit
                </Link>
                <button
                  className="rounded-2xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-xs font-bold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700"
                  onClick={() => setDeletingPdf({ id: pdf.id, name: pdf.fileName })}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Empty Upload Drop Zone */
        <label className="mt-4 block cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-6 py-20 text-center transition hover:border-indigo-400 hover:bg-indigo-50/20">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-100 text-2xl text-indigo-600">
            📄
          </div>
          <h3 className="mt-5 text-lg font-black text-slate-900">No PDFs uploaded yet</h3>
          <p className="mt-1 text-sm text-slate-500">
            Click anywhere in this area to upload your first PDF document.
          </p>
          <span className="mt-6 inline-flex rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-indigo-600 shadow-sm border border-slate-200">
            Browse files
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={upload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPdf && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => !isDeleting && setDeletingPdf(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-2xl text-rose-600">
              🗑
            </div>
            <h2 className="mt-5 text-center text-xl font-black text-slate-900">Delete PDF File?</h2>
            <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
              Are you sure you want to delete <span className="font-bold text-slate-800">"{deletingPdf.name}"</span>? This action cannot be undone.
            </p>

            <div className="mt-8 space-y-3">
              <button
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="w-full rounded-2xl bg-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-500 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting…' : 'Yes, Delete PDF'}
              </button>
              <button
                disabled={isDeleting}
                onClick={() => setDeletingPdf(null)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}