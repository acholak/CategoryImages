'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type { CameraAngle, GenerateRequest, GenerateResult } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const MARKETS = [
  'UK', 'France', 'UAE', 'Kuwait', 'Qatar',
  'Italy', 'Belgium', 'Hong Kong', 'Singapore',
];

const ANGLES: { value: CameraAngle; label: string; hint: string }[] = [
  { value: '45-degree', label: '45°',      hint: 'Most dishes'        },
  { value: 'top-down',  label: 'Top down', hint: 'Spreads, overviews' },
  { value: 'side-on',   label: 'Side on',  hint: 'Burgers, drinks'    },
  { value: 'POV',       label: 'POV',      hint: 'Handheld food'      },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  category: string;
  market: string;
  angle: CameraAngle | '';
  grocery: boolean;
  notes: string;
};

const EMPTY: FormState = {
  category: '',
  market: '',
  angle: '',
  grocery: false,
  notes: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GeneratePage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.angle) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const body: GenerateRequest = {
      category:  form.category.trim(),
      market:    form.market,
      angle:     form.angle,
      isGrocery: form.grocery,
      ...(form.notes.trim() && { notes: form.notes.trim() }),
    };

    try {
      const data = await api.generate(body);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(url: string, index: number) {
    setDownloading(index);
    try {
      await downloadImage(
        url,
        `${toSlug(result?.category ?? 'image')}-${result?.market?.toLowerCase() ?? ''}-option-${index + 1}.png`,
      );
    } finally {
      setDownloading(null);
    }
  }

  const canSubmit = form.category.trim() !== '' && form.market !== '' && form.angle !== '';

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-[1160px] mx-auto px-6 py-10">
        <div className="flex gap-12 items-start">

          {/* ── Left: Form ─────────────────────────────────────────────────── */}
          <div className="w-full max-w-[480px] shrink-0">

            <div className="mb-8">
              <h1 className="text-xl font-semibold text-neutral-900">Generate category image</h1>
              <p className="text-sm text-neutral-400 mt-1">
                Describe what you need — two options will be generated for you to pick from.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>

              {/* Category name */}
              <div>
                <label className="label" htmlFor="category">Category name</label>
                <input
                  id="category"
                  type="text"
                  className="input"
                  placeholder="e.g. Fresh Fruit &amp; Veg"
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  maxLength={100}
                  required
                  autoComplete="off"
                />
              </div>

              {/* Market */}
              <div>
                <label className="label" htmlFor="market">Market</label>
                <select
                  id="market"
                  className="input"
                  value={form.market}
                  onChange={e => set('market', e.target.value)}
                  required
                >
                  <option value="" disabled>Select a market…</option>
                  {MARKETS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Camera angle */}
              <fieldset>
                <legend className="label">Camera angle</legend>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {ANGLES.map(({ value, label, hint }) => {
                    const selected = form.angle === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => set('angle', value)}
                        className={[
                          'flex flex-col items-start px-4 py-3 rounded-lg border text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CCBC] focus-visible:ring-offset-2',
                          selected
                            ? 'border-[#00CCBC] bg-[#E6FAF9]'
                            : 'border-neutral-200 bg-white hover:border-neutral-300',
                        ].join(' ')}
                      >
                        <span className={`text-sm font-medium ${selected ? 'text-neutral-900' : 'text-neutral-700'}`}>
                          {label}
                        </span>
                        <span className="text-xs text-neutral-400 mt-0.5">{hint}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Grocery toggle */}
              <div className="flex items-start justify-between gap-6 py-4 border-t border-b border-neutral-100">
                <div>
                  <p className="text-sm font-medium text-neutral-700">Grocery composition</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Show 2–3 related items instead of a single hero
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.grocery}
                  aria-label="Grocery composition"
                  onClick={() => set('grocery', !form.grocery)}
                  className={[
                    'relative shrink-0 w-10 h-6 rounded-full transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CCBC] focus-visible:ring-offset-2',
                    form.grocery ? 'bg-[#00CCBC]' : 'bg-neutral-200',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                      form.grocery ? 'translate-x-4' : 'translate-x-0',
                    ].join(' ')}
                  />
                </button>
              </div>

              {/* Notes */}
              <div>
                <label className="label" htmlFor="notes">
                  Notes{' '}
                  <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  className="input resize-none"
                  rows={3}
                  placeholder="e.g. Include a sauce drip. Focus on the crispy coating."
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  maxLength={500}
                />
                <p className="help-text text-right">{form.notes.length}/500</p>
              </div>

              {/* Error */}
              {error && (
                <div role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={!canSubmit || loading}
              >
                {loading ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    />
                    Generating…
                  </>
                ) : (
                  'Generate'
                )}
              </button>

            </form>
          </div>

          {/* ── Right: Preview ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 pt-[72px]">

            {/* Loading skeletons */}
            {loading && (
              <div aria-live="polite" aria-busy="true">
                <p className="text-sm text-neutral-400 mb-4">Generating two options…</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="skeleton aspect-square w-full" />
                  <div className="skeleton aspect-square w-full" />
                </div>
              </div>
            )}

            {/* Results */}
            {!loading && result && (
              <div aria-live="polite">
                <p className="text-sm text-neutral-400 mb-4">
                  <span className="text-neutral-700 font-medium">{result.category}</span>
                  {' · '}{result.market} · pick your favourite
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {result.images.map((img, i) => (
                    <div key={img.id} className="card !p-4 flex flex-col gap-3">
                      <div className="rounded-lg overflow-hidden bg-neutral-100 aspect-square">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={`Generated option ${i + 1} for ${result.category}`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn-secondary w-full text-xs py-2"
                        disabled={downloading === i}
                        onClick={() => handleDownload(img.url, i)}
                      >
                        {downloading === i ? (
                          <>
                            <span
                              aria-hidden="true"
                              className="w-3 h-3 rounded-full border-2 border-neutral-300 border-t-neutral-600 animate-spin"
                            />
                            Downloading…
                          </>
                        ) : (
                          'Download PNG'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && !result && (
              <div
                aria-hidden="true"
                className="flex items-center justify-center h-72 rounded-xl border-2 border-dashed border-neutral-200"
              >
                <p className="text-sm text-neutral-300">Your images will appear here</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
