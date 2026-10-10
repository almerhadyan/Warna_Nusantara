import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ExternalLink, BookOpen } from 'lucide-react';
import { NewsArticle } from '../data/newsData';

interface SavedArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onRemoveBookmark: (article: NewsArticle) => void;
  onClearAll: () => void;
}

export const SavedArticlesDrawer: React.FC<SavedArticlesDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex justify-end bg-stone-950/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Daftar berita tersimpan"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md h-full bg-[#FBF9F5] dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-l border-stone-300 dark:border-stone-800 flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-xl font-semibold text-stone-900 dark:text-stone-100">
                  Koleksi Bacaan Tersimpan
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 tabular-nums">
                  {savedArticles.length} artikel dalam daftar baca pribadi Anda
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup daftar simpanan"
                className="p-2 rounded-md text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-200 dark:divide-stone-800">
              {savedArticles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-16 text-center"
                >
                  <p className="font-editorial text-lg text-stone-700 dark:text-stone-300">
                    Belum ada berita yang disimpan
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 max-w-xs mx-auto leading-relaxed">
                    Tekan tombol Simpan pada berita mana pun untuk menyusun daftar bacaan pilihan Anda.
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {savedArticles.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.22 }}
                      className="py-4 first:pt-2 last:pb-2"
                    >
                      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono tabular-nums">0{idx + 1}.</span>
                          <span className="uppercase tracking-wider text-[#9A3412] dark:text-amber-500 font-medium">
                            {item.categoryLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{item.readTimeMinutes} mnt baca</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveBookmark(item)}
                          aria-label="Hapus dari simpanan"
                          className="text-stone-400 hover:text-red-700 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3
                        onClick={() => {
                          onClose();
                          onSelectArticle(item);
                        }}
                        className="mt-1.5 font-editorial text-base font-medium text-stone-900 dark:text-stone-100 hover:text-[#9A3412] dark:hover:text-amber-500 cursor-pointer transition-colors leading-snug"
                      >
                        {item.title}
                      </h3>

                      <div className="mt-3 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectArticle(item);
                          }}
                          className="text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-[#9A3412] inline-flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Baca Ringkasan</span>
                        </button>
                        <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">
                          ·
                        </span>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-[#9A3412] dark:text-amber-500 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <span>Lihat Sumber</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {savedArticles.length > 0 && (
              <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-[#F3EFE6]/60 dark:bg-stone-950/50">
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-red-700 transition-colors whitespace-nowrap"
                >
                  Kosongkan Semua
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-md hover:bg-stone-800 transition-colors whitespace-nowrap"
                >
                  Selesai
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
