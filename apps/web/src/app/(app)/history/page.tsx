'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { ImageRecord } from '@/types';

const PAGE_SIZE = 20;

async function downloadImage(url: string, filename: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function HistoryPage() {
  const [items, setItems] = useState<ImageRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getImages(p);
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  async function handleDownload(url: string, record: ImageRecord, index: number) {
    const key = `${record.id}-${index}`;
    setDownloading(key);
    try {
      await downloadImage(url, `${toSlug(record.category)}-${record.market.toLowerCase()}-option-${index + 1}.png`);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1160px] mx-auto px-6 py-10">

        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">History</h1>
            <p className="text-sm text-neutral-400 mt-1">
              {loading ? 'Loading…' : `${total} image${total !== 1 ? 's' : ''} generated`}
            </p>
          </div>
          <a href="/generate" className="btn-secondary text-sm">
            New generation
          </a>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card !p-3 flex flex-col gap-3">
                <div className="skeleton aspect-square w-full" />
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-neutral-400 text-sm">No images yet.</p>
            <a href="/generate" className="btn-primary text-sm">Generate your first image</a>
          </div>
        )}

        {/* Grid */}
        {!loading && items.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((record) => (
                <div key={record.id} className="card !p-3 flex flex-col gap-3">
                  {/* Two thumbnails side by side */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {[record.url_1, record.url_2].map((url, i) => (
                      <div key={i} className="rounded-md overflow-hidden bg-neutral-100 aspect-square">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`${record.category} option ${i + 1}`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800 truncate">{record.category}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {record.market} · {record.angle} · {formatDate(record.created_at)}
                    </p>
                  </div>

                  {/* Download buttons */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {[record.url_1, record.url_2].map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        className="btn-secondary !text-xs !py-1.5 !px-2 w-full"
                        disabled={downloading === `${record.id}-${i}`}
                        onClick={() => handleDownload(url, record, i)}
                      >
                        {downloading === `${record.id}-${i}` ? '…' : `Option ${i + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  type="button"
                  className="btn-secondary text-sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </button>
                <span className="text-sm text-neutral-400 px-2">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  className="btn-secondary text-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
