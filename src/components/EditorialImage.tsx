import React, { useState, useEffect } from 'react';

interface EditorialImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  aspectClass?: string;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  aspectClass = 'aspect-[16/9]',
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);
  const [hasFailedAll, setHasFailedAll] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setHasFailedAll(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasFailedAll(true);
    }
  };

  if (hasFailedAll) {
    return (
      <div
        className={`relative overflow-hidden bg-stone-200 dark:bg-stone-800 flex flex-col justify-end p-5 ${aspectClass} ${className}`}
      >
        <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">
          Arsip Visual Warta Nusantara
        </p>
        <p className="mt-1 font-editorial text-sm text-stone-700 dark:text-stone-200 line-clamp-2">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-stone-200 dark:bg-stone-800 ${aspectClass} ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={handleError}
        className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
      />
    </div>
  );
};
