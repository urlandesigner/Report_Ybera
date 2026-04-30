"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  intensity?: number;
  ariaHidden?: boolean;
}

export function ParallaxImage({
  src,
  alt,
  className,
  containerClassName,
  intensity = 24,
  ariaHidden,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-intensity, intensity]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <motion.img
        src={src}
        alt={alt}
        className={className}
        aria-hidden={ariaHidden}
        style={reduceMotion ? undefined : { y }}
      />
    </div>
  );
}
