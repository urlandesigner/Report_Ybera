"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  intensity?: number;
  /** Vertical float amplitude in px (wrapper oscillation, separate from scroll parallax). */
  floatAmplitude?: number;
  floatDuration?: number;
  ariaHidden?: boolean;
}

export function ParallaxImage({
  src,
  alt,
  className,
  containerClassName,
  intensity = 24,
  floatAmplitude = 0,
  floatDuration = 5.5,
  ariaHidden,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-intensity, intensity]);
  const enableFloat = !reduceMotion && floatAmplitude > 0;

  return (
    <motion.div
      ref={containerRef}
      className={containerClassName}
      animate={enableFloat ? { y: [0, -floatAmplitude, 0] } : undefined}
      transition={
        enableFloat
          ? { duration: floatDuration, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    >
      <motion.img
        src={src}
        alt={alt}
        className={className}
        aria-hidden={ariaHidden}
        style={reduceMotion ? undefined : { y }}
      />
    </motion.div>
  );
}
