/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  RefreshCw,
  Bookmark,
  ExternalLink,
  BookOpen,
  LayoutGrid,
  List,
  Newspaper,
  Sun,
  Moon,
  X,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import {
  RUBRIC_OPTIONS,
  RubricKey,
  NewsArticle,
  fetchCnnIndonesiaNews,
} from './data/newsData';
import { EditorialImage } from './components/EditorialImage';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { SavedArticlesDrawer } from './components/SavedArticlesDrawer';
import { InteractiveTiltCard } from './components/InteractiveTiltCard';

type ViewLayout = 'editorial' | 'grid' | 'compact';
type SortOption = 'latest' | 'shortest' | 'title';

const BOOKMARK_STORAGE_KEY = 'warta_nusantara_saved_v1';

const PRELOADER_STEPS = [
  'Menghubungkan ke server berita CNN Indonesia...',
  'Mengambil laporan utama dan sorotan redaksi...',
  'Menyusun tipografi dan tata letak halaman...',
  'Edisi hari ini siap disajikan.',
];

export default function App() {
  const [activeRubric, setActiveRubric] = useState<RubricKey>('semua');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [preloaderProgress, setPreloaderProgress] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshCycleCount, setRefreshCycleCount] = useState<number>(0);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(() =>
    new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date())
  );
  const [isLiveApi, setIsLiveApi] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewLayout, setViewLayout] = useState<ViewLayout>('editorial');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>(() => {
    try {
      const raw = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(savedArticles));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedArticles]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Opening Preloader Progress Animation
  useEffect(() => {
    if (!isInitialLoading) return;
    setPreloaderProgress(8);
    const interval = setInterval(() => {
      setPreloaderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev < 60 ? 14 : prev < 88 ? 8 : 4;
        return Math.min(100, prev + increment);
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isInitialLoading]);

  const loadNews = useCallback(
    async (rubric: RubricKey, mode: 'initial' | 'refresh' | 'rubric' = 'refresh') => {
      if (mode === 'initial') {
        setIsInitialLoading(true);
        setPreloaderProgress(10);
      } else {
        setIsRefreshing(true);
      }

      const startTime = Date.now();
      const result = await fetchCnnIndonesiaNews(rubric);
      const elapsed = Date.now() - startTime;

      // Ensure smooth visual completion for opening or refresh animation
      const minWait = mode === 'initial' ? 1150 : 520;
      if (elapsed < minWait) {
        await new Promise((resolve) => setTimeout(resolve, minWait - elapsed));
      }

      setArticles(result.articles);
      setIsLiveApi(result.isLive);
      setVisibleCount(9);
      setRefreshCycleCount((c) => c + 1);
      setLastUpdatedTime(
        new Intl.DateTimeFormat('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date())
      );

      if (mode === 'initial') {
        setPreloaderProgress(100);
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 220);
      } else {
        setIsRefreshing(false);
        if (mode === 'refresh') {
          const rubricLabel =
            RUBRIC_OPTIONS.find((r) => r.id === rubric)?.label || 'Utama';
          showToast(`Edisi ${rubricLabel} berhasil diperbarui (${result.articles.length} berita)`);
        }
      }
    },
    [showToast]
  );

  useEffect(() => {
    loadNews(activeRubric, isInitialLoading ? 'initial' : 'rubric');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRubric]);

  const handleToggleBookmark = useCallback(
    (article: NewsArticle) => {
      setSavedArticles((prev) => {
        const exists = prev.some(
          (item) => item.id === article.id || item.title === article.title
        );
        if (exists) {
          showToast('Dihapus dari koleksi bacaan tersimpan');
          return prev.filter(
            (item) => item.id !== article.id && item.title !== article.title
          );
        }
        showToast('Disimpan ke koleksi bacaan pribadi');
        return [article, ...prev];
      });
    },
    [showToast]
  );

  const isArticleBookmarked = useCallback(
    (article: NewsArticle) =>
      savedArticles.some(
        (item) => item.id === article.id || item.title === article.title
      ),
    [savedArticles]
  );

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = articles.filter((item) => {
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.contentSnippet.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    });

    const sorted = [...list];
    if (sortBy === 'shortest') {
      sorted.sort((a, b) => a.readTimeMinutes - b.readTimeMinutes);
    } else if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'id'));
    }
    return sorted;
  }, [articles, searchQuery, sortBy]);

  const activeRubricMeta = useMemo(
    () => RUBRIC_OPTIONS.find((r) => r.id === activeRubric) || RUBRIC_OPTIONS[0],
    [activeRubric]
  );

  const leadStory = filteredArticles[0] || null;
  const secondaryStories = filteredArticles.slice(1, 4);
  const archiveStories =
    viewLayout === 'editorial' && !searchQuery.trim()
      ? filteredArticles.slice(4, 4 + visibleCount)
      : filteredArticles.slice(0, visibleCount);

  const totalRemaining =
    viewLayout === 'editorial' && !searchQuery.trim()
      ? Math.max(0, filteredArticles.length - 4 - visibleCount)
      : Math.max(0, filteredArticles.length - visibleCount);

  const topNavRubrics = RUBRIC_OPTIONS.slice(0, 5);

  const editionDateString = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  const currentPreloaderStep = useMemo(() => {
    if (preloaderProgress < 32) return PRELOADER_STEPS[0];
    if (preloaderProgress < 68) return PRELOADER_STEPS[1];
    if (preloaderProgress < 95) return PRELOADER_STEPS[2];
    return PRELOADER_STEPS[3];
  }, [preloaderProgress]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#121110] text-[#1C1917] dark:text-stone-100 transition-colors duration-200">
        {/* Animated Opening Preloader Curtain (#preloader) */}
        <AnimatePresence>
          {isInitialLoading && (
            <motion.div
              id="preloader"
              key="editorial-preloader"
              initial={{ opacity: 1, y: 0 }}
              exit={{
                y: '-100%',
                opacity: 0.98,
                transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
              }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#FBF9F5] dark:bg-[#121110] px-6 py-10 text-center border-b-2 border-[#9A3412]"
            >
              {/* Top Edition Stamp */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400"
              >
                <span>Warta Nusantara</span>
                <span className="mx-2" aria-hidden="true">
                  ·
                </span>
                <span>Edisi {editionDateString}</span>
              </motion.div>

              {/* Center Rotary Loader & Dynamic Editorial Status */}
              <div className="max-w-md w-full flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex items-center justify-center mb-7"
                >
                  <div className="loader-editorial" />
                  <div className="loader-editorial-inner absolute" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="text-xs uppercase tracking-widest text-[#9A3412] dark:text-amber-500 font-medium"
                >
                   ruang cetak digital
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 }}
                  className="mt-2 font-editorial text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-50"
                >
                  Memuat berita...
                </motion.h2>

                <motion.p
                  key={currentPreloaderStep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-2.5 text-xs text-stone-600 dark:text-stone-400 h-5"
                >
                  {currentPreloaderStep}
                </motion.p>

                {/* Animated Progress Rail */}
                <div className="w-full max-w-xs mt-6">
                  <div className="h-[3px] w-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#9A3412] origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: preloaderProgress / 100 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono tabular-nums text-stone-500 dark:text-stone-400">
                    <span>SINKRONISASI REDAKSI</span>
                    <span>{preloaderProgress}%</span>
                  </div>
                </div>
              </div>

              {/* Skip / Immediate Enter Action */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                type="button"
                onClick={() => setIsInitialLoading(false)}
                className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 underline underline-offset-4 transition-colors whitespace-nowrap"
              >
                Lewati Animasi Pembuka
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Strict 3-Zone Top Bar Contract */}
        <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 dark:bg-[#121110]/95 backdrop-blur-xs border-b border-stone-200 dark:border-stone-800">
          {/* Top Sweep Progress Line when Refreshing */}
          <AnimatePresence>
            {isRefreshing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 left-0 right-0 h-[2px] bg-stone-200 dark:bg-stone-800 overflow-hidden"
              >
                <div className="w-1/2 h-full bg-[#9A3412] animate-paper-shimmer" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between gap-6">
            {/* Zone 1: Single text element wordmark */}
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                setActiveRubric('semua');
                setSearchQuery('');
              }}
              className="font-editorial text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
            >
              Warta Nusantara
            </a>

            {/* Zone 2: 5 clean text navigation links with animated active underline */}
            <nav
              aria-label="Navigasi Rubrik Utama"
              className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-400"
            >
              {topNavRubrics.map((item) => {
                const isActive = activeRubric === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveRubric(item.id);
                    }}
                    className={`relative py-1 transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-stone-900 dark:text-stone-50 font-semibold'
                        : 'hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="top-nav-underline"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#9A3412]"
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Zone 3: 2 primary actions with interactive spring tap */}
            <div className="flex items-center gap-2.5 shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => setIsSavedDrawerOpen(true)}
                className="px-3.5 py-2 text-xs font-medium text-stone-800 dark:text-stone-200 bg-[#EBE6DF] dark:bg-stone-800 hover:bg-stone-300/70 dark:hover:bg-stone-700 rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap tabular-nums"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#9A3412] dark:text-amber-500" />
                <span>Simpanan ({savedArticles.length})</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => loadNews(activeRubric, 'refresh')}
                disabled={isRefreshing}
                className="px-4 py-2 text-xs font-medium text-white bg-[#9A3412] hover:bg-[#7C2D12] disabled:opacity-70 rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Menyegarkan...' : 'Segarkan'}</span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Interactive Refresh Status Banner (Animates open during refresh) */}
        <AnimatePresence>
          {isRefreshing && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F3EFE6] dark:bg-stone-900 border-b border-stone-300 dark:border-stone-800"
            >
              <div className="max-w-[1280px] mx-auto px-6 py-2.5 flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#9A3412] animate-spin" />
                  <span>
                    Menyinkronkan berita terbaru untuk rubrik <strong>{activeRubricMeta.label}</strong>...
                  </span>
                </div>
                <span className="font-mono tabular-nums text-stone-500">
                  CNN INDONESIA LIVE FEED
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Broadsheet Container */}
        <main id="top" className="max-w-[1280px] mx-auto px-6 pb-20">
          {/* Operational Editorial Utility Ribbon */}
          <section
            aria-label="Informasi Edisi dan Kontrol Pencarian"
            className="py-5 border-b border-stone-200 dark:border-stone-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
              <span className="uppercase tracking-widest font-semibold text-stone-900 dark:text-stone-200">
                Edisi {editionDateString}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Sumber: {isLiveApi ? 'Umpan Langsung CNN Indonesia' : 'Edisi Kurasi Redaksi'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">Diperbarui {lastUpdatedTime}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{filteredArticles.length} Laporan</span>
            </div>

            {/* Search & Utility Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Box */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari topik, tokoh, atau kata kunci..."
                  aria-label="Cari berita"
                  className="w-full pl-8 pr-8 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#9A3412] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Hapus pencarian"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Layout Mode Segmented Control with Animated Sliding Indicator */}
              <div
                className="flex items-center p-0.5 bg-[#EBE6DF] dark:bg-stone-800 rounded-md"
                role="group"
                aria-label="Pilih tata letak tampilan"
              >
                {(
                  [
                    { id: 'editorial', label: 'Editorial', icon: Newspaper },
                    { id: 'grid', label: 'Grid 3-Kolom', icon: LayoutGrid },
                    { id: 'compact', label: 'Indeks', icon: List },
                  ] as const
                ).map((mode) => {
                  const Icon = mode.icon;
                  const active = viewLayout === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setViewLayout(mode.id)}
                      className={`relative px-2.5 py-1 text-xs font-medium rounded transition-colors inline-flex items-center gap-1 whitespace-nowrap ${
                        active
                          ? 'text-stone-900 dark:text-stone-100'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="view-mode-bg"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          className="absolute inset-0 bg-white dark:bg-stone-900 rounded shadow-xs"
                        />
                      )}
                      <Icon className="w-3.5 h-3.5 relative z-10" />
                      <span className="relative z-10">{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Replay Opening Preloader Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => loadNews(activeRubric, 'initial')}
                title="Putar ulang animasi pembuka halaman"
                className="px-2.5 py-1.5 text-xs font-medium border border-stone-300 dark:border-stone-700 rounded-md text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#9A3412] dark:text-amber-500" />
                <span>Animasi Pembuka</span>
              </motion.button>

              {/* Paper / Night Mode Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setDarkMode((prev) => !prev)}
                aria-label="Ganti tema warna layar"
                className="px-2.5 py-1.5 text-xs font-medium border border-stone-300 dark:border-stone-700 rounded-md text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kertas Terang</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-stone-600" />
                    <span>Mode Malam</span>
                  </>
                )}
              </motion.button>
            </div>
          </section>

          {/* Interactive Rubric Filter Bar & Sorting Selector */}
          <section className="py-5 border-b border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {RUBRIC_OPTIONS.map((rubric) => {
                const active = activeRubric === rubric.id;
                return (
                  <button
                    key={rubric.id}
                    type="button"
                    onClick={() => setActiveRubric(rubric.id)}
                    className={`relative px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'text-white dark:text-stone-900'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-[#EBE6DF] dark:hover:bg-stone-800 hover:text-stone-900'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="rubric-pill-bg"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-0 bg-stone-900 dark:bg-stone-100 rounded-md"
                      />
                    )}
                    <span className="relative z-10">{rubric.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <label
                htmlFor="sort-select"
                className="text-xs text-stone-500 dark:text-stone-400 whitespace-nowrap"
              >
                Urutkan:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#9A3412]"
              >
                <option value="latest">Terbaru Diterbitkan</option>
                <option value="shortest">Durasi Baca Tercepat</option>
                <option value="title">Indeks Judul (A–Z)</option>
              </select>
            </div>
          </section>

          {/* Animated Content Area Keyed by Rubric & Refresh Cycle */}
          <motion.div
            key={`${activeRubric}-${viewLayout}-${refreshCycleCount}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{
              opacity: isRefreshing ? 0.55 : 1,
              y: 0,
              scale: isRefreshing ? 0.995 : 1,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Empty Search State */}
            {filteredArticles.length === 0 && !isInitialLoading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-20 text-center border-b border-stone-200 dark:border-stone-800"
              >
                <p className="font-editorial text-2xl text-stone-800 dark:text-stone-200">
                  Tidak ditemukan berita untuk kata kunci “{searchQuery}”
                </p>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                  Coba gunakan kata kunci yang lebih umum atau tampilkan kembali seluruh laporan pada rubrik {activeRubricMeta.label}.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-5 px-4 py-2 text-xs font-medium bg-[#9A3412] text-white rounded-md hover:bg-[#7C2D12] transition-colors whitespace-nowrap"
                >
                  Reset Pencarian
                </button>
              </motion.div>
            )}

            {/* TIER 1 & TIER 2: Editorial Front-Page Salience */}
            {viewLayout === 'editorial' && !searchQuery.trim() && leadStory && (
              <>
                {/* Tier 1: Lead Story (Laporan Utama) */}
                <section
                  aria-label="Laporan Utama Hari Ini"
                  className="py-10 border-b border-stone-300 dark:border-stone-800"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    {/* Lead Story Text Column (5 cols) */}
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="lg:col-span-5 flex flex-col justify-between space-y-5"
                    >
                      <div>
                        {/* Clean Unboxed Metadata */}
                        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                          <span className="uppercase tracking-widest font-semibold text-[#9A3412] dark:text-amber-500">
                            Laporan Utama · {leadStory.categoryLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{leadStory.relativeTime}</span>
                        </div>

                        <h1
                          onClick={() => setSelectedArticle(leadStory)}
                          className="mt-3 font-editorial text-3xl sm:text-4xl lg:text-[40px] font-semibold leading-[1.15] text-stone-900 dark:text-stone-50 hover:text-[#9A3412] dark:hover:text-amber-500 cursor-pointer transition-colors"
                        >
                          {leadStory.title}
                        </h1>

                        <p className="mt-4 text-[15px] sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                          {leadStory.contentSnippet}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-4">
                        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                          <span>Oleh {leadStory.author}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{leadStory.formattedDate}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{leadStory.readTimeMinutes} mnt baca</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            type="button"
                            onClick={() => setSelectedArticle(leadStory)}
                            className="px-4 py-2 text-xs font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Baca Laporan Lengkap</span>
                          </motion.button>

                          <motion.a
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            href={leadStory.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-xs font-medium bg-[#9A3412] hover:bg-[#7C2D12] text-white rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <span>Klik untuk Lihat Sumber</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </motion.a>

                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            type="button"
                            onClick={() => handleToggleBookmark(leadStory)}
                            aria-label="Simpan berita utama"
                            className={`px-3 py-2 text-xs font-medium rounded-md border transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                              isArticleBookmarked(leadStory)
                                ? 'border-[#9A3412] text-[#9A3412] dark:text-amber-400 bg-[#9A3412]/10'
                                : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>{isArticleBookmarked(leadStory) ? 'Tersimpan' : 'Simpan'}</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Lead Story Interactive Visual Frame (7 cols) */}
                    <div className="lg:col-span-7">
                      <InteractiveTiltCard index={1} intensity={2.5}>
                        <figure
                          onClick={() => setSelectedArticle(leadStory)}
                          className="group cursor-pointer"
                        >
                          <EditorialImage
                            src={leadStory.imageLarge}
                            fallbackSrc={leadStory.fallbackImage}
                            alt={leadStory.title}
                            aspectClass="aspect-[16/9]"
                            className="border border-stone-200 dark:border-stone-800"
                          />
                          <figcaption className="mt-2.5 text-xs font-editorial italic text-stone-500 dark:text-stone-400 flex items-center justify-between gap-4">
                            <span>{leadStory.figureCaption}</span>
                            <span className="not-italic font-sans text-[11px] uppercase tracking-wider text-stone-400 shrink-0">
                              Dokumentasi Redaksi
                            </span>
                          </figcaption>
                        </figure>
                      </InteractiveTiltCard>
                    </div>
                  </div>
                </section>

                {/* Tier 2: Secondary Features (Sorotan Redaksi - 3 Columns with Hairline Dividers) */}
                {secondaryStories.length > 0 && (
                  <section
                    aria-label="Sorotan Redaksi"
                    className="py-10 border-b border-stone-300 dark:border-stone-800"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-editorial text-xl font-semibold text-stone-900 dark:text-stone-100">
                        01. Sorotan Meja Redaksi
                      </h2>
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        Pilihan kuratorial rubrik {activeRubricMeta.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x md:divide-stone-200 dark:md:divide-stone-800">
                      {secondaryStories.map((story, idx) => (
                        <motion.article
                          key={story.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.42,
                            delay: 0.1 + idx * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className={`group flex flex-col justify-between ${
                            idx > 0 ? 'md:pl-8' : ''
                          }`}
                        >
                          <div>
                            <div
                              onClick={() => setSelectedArticle(story)}
                              className="cursor-pointer mb-4"
                            >
                              <EditorialImage
                                src={story.imageSmall}
                                fallbackSrc={story.fallbackImage}
                                alt={story.title}
                                aspectClass="aspect-[4/3]"
                                className="border border-stone-200 dark:border-stone-800"
                              />
                            </div>

                            {/* Unboxed Metadata */}
                            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                              <span className="uppercase tracking-wider font-medium text-[#9A3412] dark:text-amber-500">
                                {story.categoryLabel}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{story.relativeTime}</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{story.readTimeMinutes} mnt</span>
                            </div>

                            <h3
                              onClick={() => setSelectedArticle(story)}
                              className="mt-2 font-editorial text-xl font-semibold leading-snug text-stone-900 dark:text-stone-100 group-hover:text-[#9A3412] dark:group-hover:text-amber-500 cursor-pointer transition-colors"
                            >
                              {story.title}
                            </h3>

                            <p className="mt-2.5 text-sm text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                              {story.contentSnippet}
                            </p>
                          </div>

                          <div className="mt-5 pt-3 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setSelectedArticle(story)}
                                className="text-xs font-medium text-stone-800 dark:text-stone-200 hover:text-[#9A3412] transition-colors whitespace-nowrap"
                              >
                                Baca Ringkasan
                              </button>
                              <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">
                                ·
                              </span>
                              <a
                                href={story.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-[#9A3412] dark:text-amber-500 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                              >
                                <span>Lihat Sumber</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              type="button"
                              onClick={() => handleToggleBookmark(story)}
                              aria-label="Simpan berita"
                              className={`p-1.5 rounded transition-colors ${
                                isArticleBookmarked(story)
                                  ? 'text-[#9A3412] dark:text-amber-400'
                                  : 'text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                              }`}
                            >
                              <Bookmark className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* TIER 3: Katalog Berita Utama (#berita) */}
            {archiveStories.length > 0 && (
              <section aria-label="Katalog Berita Terkini" className="pt-10">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
                  <div>
                    <h2 className="font-editorial text-2xl font-semibold text-stone-900 dark:text-stone-100">
                      {viewLayout === 'editorial' && !searchQuery.trim()
                        ? '02. Katalog Berita & Arsip Terkini'
                        : `Katalog Berita: ${activeRubricMeta.label}`}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {activeRubricMeta.description}
                    </p>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-stone-500 dark:text-stone-400">
                    Menampilkan {archiveStories.length} dari {filteredArticles.length} berita
                  </span>
                </div>

                {/* Compact Index View */}
                {viewLayout === 'compact' ? (
                  <div
                    id="berita"
                    className="divide-y divide-stone-200 dark:divide-stone-800 border-t border-b border-stone-200 dark:border-stone-800"
                  >
                    {archiveStories.map((item, idx) => (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: Math.min(idx * 0.04, 0.3),
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-[#F3EFE6]/50 dark:hover:bg-stone-900/50 px-3 -mx-3 transition-colors"
                      >
                        <div className="space-y-1.5 max-w-3xl">
                          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                            <span className="font-mono tabular-nums text-stone-400">
                              {String(idx + 1).padStart(2, '0')}.
                            </span>
                            <span className="uppercase tracking-wider font-medium text-[#9A3412] dark:text-amber-500">
                              {item.categoryLabel}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{item.formattedDate}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{item.readTimeMinutes} menit baca</span>
                          </div>

                          <h3
                            onClick={() => setSelectedArticle(item)}
                            className="font-editorial text-lg font-semibold text-stone-900 dark:text-stone-100 group-hover:text-[#9A3412] dark:group-hover:text-amber-500 cursor-pointer transition-colors"
                          >
                            {item.title}
                          </h3>

                          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1">
                            {item.contentSnippet}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedArticle(item)}
                            className="px-3 py-1.5 text-xs font-medium border border-stone-300 dark:border-stone-700 rounded-md text-stone-800 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors whitespace-nowrap"
                          >
                            Baca Ringkasan
                          </button>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 text-xs font-medium bg-[#9A3412] hover:bg-[#7C2D12] text-white rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <span>Klik untuk Lihat Sumber</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                ) : (
                  /* 3-Column Editorial Grid (#berita) with Interactive 3D Hover Tilt & Stagger */
                  <div
                    id="berita"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
                  >
                    {archiveStories.map((item, idx) => {
                      const bookmarked = isArticleBookmarked(item);
                      return (
                        <InteractiveTiltCard key={item.id} index={idx} intensity={3.5}>
                          <article className="h-full group bg-[#F3EFE6]/55 dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800 flex flex-col justify-between transition-colors hover:border-stone-300 dark:hover:border-stone-700">
                            <div>
                              <div
                                onClick={() => setSelectedArticle(item)}
                                className="cursor-pointer"
                              >
                                <EditorialImage
                                  src={item.imageSmall}
                                  fallbackSrc={item.fallbackImage}
                                  alt={item.title}
                                  aspectClass="aspect-[16/10]"
                                />
                              </div>

                              <div className="p-6">
                                {/* Clean Unboxed Metadata */}
                                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                                  <span className="uppercase tracking-wider font-medium text-[#9A3412] dark:text-amber-500">
                                    {item.categoryLabel}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span className="tabular-nums">{item.relativeTime}</span>
                                  <span aria-hidden="true">·</span>
                                  <span className="tabular-nums">{item.readTimeMinutes} mnt baca</span>
                                </div>

                                <h2
                                  onClick={() => setSelectedArticle(item)}
                                  className="mt-2.5 font-editorial text-xl font-semibold leading-[1.32] text-stone-900 dark:text-stone-100 group-hover:text-[#9A3412] dark:group-hover:text-amber-500 cursor-pointer transition-colors"
                                >
                                  {item.title}
                                </h2>

                                <p className="mt-2.5 text-sm text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                                  {item.contentSnippet}
                                </p>
                              </div>
                            </div>

                            <div className="px-6 pb-5 pt-3 border-t border-stone-200/70 dark:border-stone-800/80 flex items-center justify-between gap-2 relative z-20">
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileTap={{ scale: 0.94 }}
                                  type="button"
                                  onClick={() => setSelectedArticle(item)}
                                  className="px-3 py-1.5 text-xs font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md hover:border-stone-400 transition-colors whitespace-nowrap"
                                >
                                  Ruang Baca
                                </motion.button>

                                <motion.a
                                  whileTap={{ scale: 0.94 }}
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 text-xs font-medium bg-[#9A3412] hover:bg-[#7C2D12] text-white rounded-md transition-colors inline-flex items-center gap-1 whitespace-nowrap"
                                >
                                  <span>Klik untuk Lihat Sumber</span>
                                  <ExternalLink className="w-3 h-3" />
                                </motion.a>
                              </div>

                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                type="button"
                                onClick={() => handleToggleBookmark(item)}
                                aria-label={bookmarked ? 'Hapus dari simpanan' : 'Simpan berita'}
                                className={`p-1.5 rounded transition-colors ${
                                  bookmarked
                                    ? 'text-[#9A3412] dark:text-amber-400'
                                    : 'text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                                }`}
                              >
                                <Bookmark className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </article>
                        </InteractiveTiltCard>
                      );
                    })}
                  </div>
                )}

                {/* Load More Button */}
                {totalRemaining > 0 && (
                  <div className="mt-10 text-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="px-6 py-2.5 text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-900 hover:bg-[#EBE6DF] dark:hover:bg-stone-800 rounded-md transition-colors whitespace-nowrap tabular-nums"
                    >
                      Tampilkan Lebih Banyak Berita ({totalRemaining} tersisa)
                    </motion.button>
                  </div>
                )}
              </section>
            )}
          </motion.div>
        </main>

        {/* Quiet Editorial Footer */}
        <footer className="border-t border-stone-200 dark:border-stone-800 bg-[#F3EFE6]/60 dark:bg-stone-950/60 py-10">
          <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
            <div>
              <span className="font-editorial font-semibold text-sm text-stone-900 dark:text-stone-200">
                Warta Nusantara
              </span>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <span>Agregasi Berita & Ruang Baca Editorial Berbasis API CNN Indonesia</span>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              {RUBRIC_OPTIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setActiveRubric(r.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors whitespace-nowrap"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </footer>

        {/* Interactive Floating Notification Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-medium rounded-md shadow-xl border border-stone-700 dark:border-stone-300"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400 dark:text-[#9A3412] shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive In-App Editorial Reader Drawer */}
        <ArticleReaderModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          isBookmarked={selectedArticle ? isArticleBookmarked(selectedArticle) : false}
          onToggleBookmark={handleToggleBookmark}
          relatedArticles={articles.filter((a) => a.id !== selectedArticle?.id)}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />

        {/* Saved Articles / Bookmarks Drawer */}
        <SavedArticlesDrawer
          isOpen={isSavedDrawerOpen}
          onClose={() => setIsSavedDrawerOpen(false)}
          savedArticles={savedArticles}
          onSelectArticle={(art) => setSelectedArticle(art)}
          onRemoveBookmark={handleToggleBookmark}
          onClearAll={() => {
            setSavedArticles([]);
            showToast('Seluruh daftar simpanan telah dikosongkan');
          }}
        />
      </div>
    </div>
  );
}
