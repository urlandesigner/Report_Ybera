"use client";

import React, { useCallback, useRef, useState } from "react";

interface UiloraTiltCardProps {
  accentColor?: string;
  glareOpacity?: number;
  maxTilt?: number;
}

export const UiloraTiltCard = ({
  accentColor = "#6366f1",
  glareOpacity = 0.3,
  maxTilt = 20,
}: UiloraTiltCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const element = containerRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() =>
        setTilt({
          rx: (0.5 - y) * maxTilt * 2,
          ry: (x - 0.5) * maxTilt * 2,
          gx: x * 100,
          gy: y * 100,
        })
      );
    },
    [maxTilt]
  );

  const onLeave = () => {
    setHovered(false);
    cancelAnimationFrame(frameRef.current);
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  const bars = [35, 55, 42, 78, 50, 92, 65, 83, 57, 88, 70, 95];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050507]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${accentColor}0d, transparent)`,
        }}
      />

      <div
        ref={containerRef}
        className="relative cursor-pointer select-none"
        style={{ perspective: "1000px" }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
      >
        <div
          className="relative w-72 rounded-3xl"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovered ? 1.04 : 1})`,
            transition: hovered
              ? "transform 0.04s linear"
              : "transform 0.7s cubic-bezier(0.23,1,0.32,1)",
            boxShadow: hovered
              ? `0 50px 100px -10px rgba(0,0,0,0.8), 0 0 80px ${accentColor}20`
              : "0 8px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="overflow-hidden rounded-3xl p-6"
            style={{
              background:
                "linear-gradient(145deg, rgba(40,40,55,0.92), rgba(15,15,22,0.97))",
              border: `1px solid ${hovered ? accentColor + "30" : "rgba(255,255,255,0.06)"}`,
              transition: "border-color 0.6s",
            }}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="mb-0.5 text-xs text-zinc-500">Uilora Analytics</p>
                <p className="text-sm font-semibold text-white">Overview</p>
              </div>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: `${accentColor}15`,
                  border: `1px solid ${accentColor}30`,
                  transform: "translateZ(20px)",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
            </div>

            <div className="mb-5" style={{ transform: "translateZ(10px)" }}>
              <p className="text-4xl font-black tracking-tight text-white">2.4M</p>
              <p className="mt-0.5 text-xs font-medium" style={{ color: accentColor }}>
                ↑ 14.2% vs last month
              </p>
            </div>

            <div className="mb-5 space-y-2.5">
              {[
                { label: "Conversion", value: 86 },
                { label: "Retention", value: 71 },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs text-zinc-500">
                    <span>{label}</span>
                    <span className="text-zinc-300">{value}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${value}%`,
                        background: `linear-gradient(90deg, ${accentColor}, ${accentColor}50)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex h-12 items-end gap-1">
              {bars.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${height}%`,
                    background: index >= bars.length - 2 ? accentColor : `${accentColor}25`,
                  }}
                />
              ))}
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background: `radial-gradient(ellipse 80% 80% at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,${
                hovered ? glareOpacity : 0
              }), transparent 60%)`,
              transition: hovered ? "none" : "background 0.7s",
              mixBlendMode: "overlay",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              opacity: hovered ? 0.1 : 0,
              background: `linear-gradient(${120 + tilt.ry * 4}deg, #ff00ff, #00ffff, #00ff00, #ffff00, #ff00ff)`,
              transition: hovered ? "none" : "opacity 0.7s",
              mixBlendMode: "color",
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute -bottom-4 left-1/2 h-6 w-56 rounded-full blur-2xl"
          style={{
            background: accentColor,
            opacity: hovered ? 0.28 : 0.06,
            transform: "translateX(-50%)",
            transition: "opacity 0.6s",
          }}
        />
      </div>

      <p className="absolute bottom-8 text-xs tracking-wide text-zinc-700">Hover to tilt</p>
    </div>
  );
};
