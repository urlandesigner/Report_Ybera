"use client";
import React, { useRef, useState, useCallback } from "react";

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
        (e: React.MouseEvent<HTMLDivElement>) => {
            const el = containerRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            cancelAnimationFrame(frameRef.current);
            frameRef.current = requestAnimationFrame(() =>
                setTilt({ rx: (0.5 - y) * maxTilt * 2, ry: (x - 0.5) * maxTilt * 2, gx: x * 100, gy: y * 100 })
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
        <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Subtle grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                    backgroundSize: "48px 48px",
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${accentColor}0d, transparent)` }}
            />

            {/* The card */}
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
                        transition: hovered ? "transform 0.04s linear" : "transform 0.7s cubic-bezier(0.23,1,0.32,1)",
                        boxShadow: hovered
                            ? `0 50px 100px -10px rgba(0,0,0,0.8), 0 0 80px ${accentColor}20`
                            : `0 8px 30px rgba(0,0,0,0.5)`,
                    }}
                >
                    {/* Card body */}
                    <div
                        className="rounded-3xl p-6 overflow-hidden"
                        style={{
                            background: "linear-gradient(145deg, rgba(40,40,55,0.92), rgba(15,15,22,0.97))",
                            border: `1px solid ${hovered ? accentColor + "30" : "rgba(255,255,255,0.06)"}`,
                            transition: "border-color 0.6s",
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <p className="text-zinc-500 text-xs mb-0.5">Uilora Analytics</p>
                                <p className="text-white font-semibold text-sm">Overview</p>
                            </div>
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{
                                    background: `${accentColor}15`,
                                    border: `1px solid ${accentColor}30`,
                                    transform: "translateZ(20px)",
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </div>
                        </div>

                        {/* Metric */}
                        <div className="mb-5" style={{ transform: "translateZ(10px)" }}>
                            <p className="text-4xl font-black text-white tracking-tight">2.4M</p>
                            <p className="text-xs font-medium mt-0.5" style={{ color: accentColor }}>↑ 14.2% vs last month</p>
                        </div>

                        {/* Progress bars */}
                        <div className="space-y-2.5 mb-5">
                            {[{ label: "Conversion", value: 86 }, { label: "Retention", value: 71 }].map(({ label, value }) => (
                                <div key={label}>
                                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                        <span>{label}</span>
                                        <span className="text-zinc-300">{value}%</span>
                                    </div>
                                    <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}50)` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bar chart */}
                        <div className="flex items-end gap-1 h-12">
                            {bars.map((h, i) => (
                                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i >= bars.length - 2 ? accentColor : `${accentColor}25` }} />
                            ))}
                        </div>
                    </div>

                    {/* Glare */}
                    <div
                        className="absolute inset-0 rounded-3xl pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse 80% 80% at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,${hovered ? glareOpacity : 0}), transparent 60%)`,
                            transition: hovered ? "none" : "background 0.7s",
                            mixBlendMode: "overlay",
                        }}
                    />
                    {/* Spectrum sheen */}
                    <div
                        className="absolute inset-0 rounded-3xl pointer-events-none"
                        style={{
                            opacity: hovered ? 0.1 : 0,
                            background: `linear-gradient(${120 + tilt.ry * 4}deg, #ff00ff, #00ffff, #00ff00, #ffff00, #ff00ff)`,
                            transition: hovered ? "none" : "opacity 0.7s",
                            mixBlendMode: "color",
                        }}
                    />
                </div>

                {/* Drop shadow */}
                <div
                    className="absolute -bottom-4 left-1/2 w-56 h-6 rounded-full blur-2xl pointer-events-none"
                    style={{
                        background: accentColor,
                        opacity: hovered ? 0.28 : 0.06,
                        transform: "translateX(-50%)",
                        transition: "opacity 0.6s",
                    }}
                />
            </div>

            <p className="absolute bottom-8 text-zinc-700 text-xs tracking-wide">Hover to tilt</p>
        </div>
    );
};
