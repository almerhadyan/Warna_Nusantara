import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Bookmark, Share2, Check } from 'lucide-react';
import { NewsArticle } from '../data/newsData';
import { EditorialImage } from './EditorialImage';

interface ArticleReaderModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  relatedArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  relatedArticles,
  onSelectArticle,
}) => {
  const [fontScale, setFontScale] = useState<'normal' | 'large'>('normal');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (article) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setScrollProgress(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [article, onClose]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScroll = target.scrollHeight - target.clientHeight;
    if (maxScroll <= 0) {
      setScrollProgress(100);
      return;
    }
    const pct = Math.min(100, Math.max(0, (target.scrollTop / maxScroll) * 100));
    setScrollProgress(pct);
  };

  const handleCopyLink = async () => {
    if (!article) return;
    try {
      await navigator.clipboard.writeText(article.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {article && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reader-article-title"
          onClick={onClose}
        >
          <motion.div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl h-full overflow-y-auto bg-[#FBF9F5] dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-l border-stone-300 dark:border-stone-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Sticky Reader Bar + Interactive Reading Depth Progress Rail */}
            <div className="sticky top-0 z-20 bg-[#FBF9F5]/95 dark:bg-stone-900/95 backdrop-blur-xs border-b border-stone-200 dark:border-stone-800">
              {/* Thin Horizontal Reading Progress Bar */}
              <div className="w-full h-[2px] bg-stone-200/70 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-[#9A3412] transition-transform duration-75 origin-left"
                  style={{ transform: `scaleX(${scrollProgress / 100})` }}
                />
              </div>

              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span className="uppercase tracking-widest font-medium text-[#9A3412] dark:text-amber-500">
                    {article.categoryLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{article.formattedDate}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{article.readTimeMinutes} menit baca</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Typographic Size Switcher */}
                  <div className="flex items-center p-0.5 bg-stone-200/70 dark:bg-stone-800 rounded-md">
                    <button
                      type="button"
                      onClick={() => setFontScale('normal')}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                        fontScale === 'normal'
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      Teks Standar
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontScale('large')}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                        fontScale === 'large'
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      Teks Besar
                    </button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={() => onToggleBookmark(article)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      isBookmarked
                        ? 'border-[#9A3412] bg-[#9A3412] text-white'
                        : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin Tautan'}</span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup ruang baca"
                    className="p-2 rounded-md text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Editorial Article Content */}
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="px-6 sm:px-12 py-10 max-w-4xl mx-auto"
            >
              {/* Header Composition */}
              <header className="pb-8 border-b border-stone-300 dark:border-stone-800">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-3">
                  <span>Arsip Redaksi</span>
                  <span aria-hidden="true">·</span>
                  <span>Oleh {article.author}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{article.relativeTime}</span>
                </div>

                <h1
                  id="reader-article-title"
                  className="font-editorial text-3xl sm:text-4xl lg:text-[40px] font-semibold leading-[1.18] text-stone-900 dark:text-stone-50"
                >
                  {article.title}
                </h1>

                <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
                  {article.contentSnippet}
                </p>
              </header>

              {/* Primary Artwork / Photo Frame with Figure Caption */}
              <figure className="my-8 group">
                <EditorialImage
                  src={article.imageLarge}
                  fallbackSrc={article.fallbackImage}
                  alt={article.title}
                  aspectClass="aspect-[16/9]"
                  className="rounded-none border border-stone-200 dark:border-stone-800"
                />
                <figcaption className="text-xs font-editorial italic text-stone-500 dark:text-stone-400 mt-2.5">
                  {article.figureCaption}
                </figcaption>
              </figure>

              {/* Asymmetric Two-Column Reading Canvas (70% Body / 30% Margin Notes) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
                <div
                  className={`lg:col-span-8 space-y-6 text-stone-800 dark:text-stone-200 ${
                    fontScale === 'large' ? 'text-lg leading-[1.85]' : 'text-[16px] leading-[1.78]'
                  } max-w-prose`}
                >
                  {article.fullBodyParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className={
                        index === 0
                          ? 'first-letter:text-5xl first-letter:font-editorial first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#9A3412] dark:first-letter:text-amber-500'
                          : ''
                      }
                    >
                      {paragraph}
                    </p>
                  ))}

                  {/* Editorial Pull Quote */}
                  <blockquote className="my-8 pl-6 border-l-2 border-[#9A3412] py-2">
                    <p className="font-editorial italic text-xl sm:text-2xl text-stone-900 dark:text-stone-100 leading-snug">
                      “{article.pullQuote}”
                    </p>
                    <footer className="mt-2 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">
                      — Catatan Redaksi · {article.categoryLabel}
                    </footer>
                  </blockquote>

                  {/* Original Source Action Box */}
                  <div className="pt-6 mt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">
                        Referensi & Sumber Primer
                      </p>
                      <p className="text-sm text-stone-700 dark:text-stone-300 mt-0.5">
                        Baca artikel lengkap langsung di situs resmi CNN Indonesia.
                      </p>
                    </div>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 text-xs font-medium bg-[#9A3412] hover:bg-[#7C2D12] text-white rounded-md transition-colors inline-flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
                    >
                      <span>Klik untuk Lihat Sumber</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 30% Margin Sidebar: Metadata & Related Archive */}
                <aside className="lg:col-span-4 lg:border-l lg:border-stone-200 dark:lg:border-stone-800 lg:pl-7 space-y-8">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 pb-2 border-b border-stone-200 dark:border-stone-800">
                      Katalog Metadata
                    </h3>
                    <dl className="mt-3 space-y-2.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-800">
                        <dt className="text-stone-500">Rubrik</dt>
                        <dd className="font-medium text-stone-900 dark:text-stone-100">{article.categoryLabel}</dd>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-800">
                        <dt className="text-stone-500">Tanggal Terbit</dt>
                        <dd className="font-mono tabular-nums text-stone-800 dark:text-stone-200">{article.formattedDate}</dd>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60 dark:border-stone-800">
                        <dt className="text-stone-500">Estimasi Baca</dt>
                        <dd className="font-mono tabular-nums text-stone-800 dark:text-stone-200">{article.readTimeMinutes} Menit</dd>
                      </div>
                      <div className="flex justify-between py-1">
                        <dt className="text-stone-500">Progres Baca</dt>
                        <dd className="font-mono tabular-nums text-[#9A3412] dark:text-amber-500">
                          {Math.round(scrollProgress)}%
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {relatedArticles.length > 0 && (
                    <div>
                      <h3 className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 pb-2 border-b border-stone-200 dark:border-stone-800">
                        Bacaan Terkait
                      </h3>
                      <div className="mt-4 space-y-4">
                        {relatedArticles.slice(0, 3).map((rel, idx) => (
                          <div
                            key={rel.id}
                            className="group cursor-pointer pb-4 border-b border-stone-200/70 dark:border-stone-800 last:border-b-0"
                            onClick={() => onSelectArticle(rel)}
                          >
                            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                              <span className="font-mono tabular-nums">0{idx + 1}.</span>
                              <span>{rel.categoryLabel}</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{rel.readTimeMinutes} mnt</span>
                            </div>
                            <h4 className="mt-1 font-editorial text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-[#9A3412] dark:group-hover:text-amber-500 transition-colors leading-snug">
                              {rel.title}
                            </h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            </motion.article>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
