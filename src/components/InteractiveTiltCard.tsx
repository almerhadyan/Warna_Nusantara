import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface InteractiveTiltCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  intensity?: number;
  disabled?: boolean;
}

export const InteractiveTiltCard: React.FC<InteractiveTiltCardProps> = ({
  children,
  className = '',
  index = 0,
  intensity = 4,
  disabled = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = x / rect.width;
    const pctY = y / rect.height;

    const rotateY = (pctX - 0.5) * intensity * 2;
    const rotateX = (0.5 - pctY) * intensity * 2;

    setTilt({
      rotateX,
      rotateY,
      glareX: pctX * 100,
      glareY: pctY * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt((prev) => ({
      ...prev,
      rotateX: 0,
      rotateY: 0,
      isHovered: false,
    }));
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.36),
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformPerspective: 1100,
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
      className={`relative transition-shadow duration-200 ${
        tilt.isHovered ? 'shadow-lg shadow-stone-900/5 dark:shadow-black/30' : ''
      } ${className}`}
    >
      {/* Interactive Warm Spotlight Glare */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-200"
        style={{
          opacity: tilt.isHovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(154, 52, 18, 0.07), transparent 70%)`,
        }}
      />
      {children}
    </motion.div>
  );
};
