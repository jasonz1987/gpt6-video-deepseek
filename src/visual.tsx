import React, { useLayoutEffect, useRef } from "react";
import { Img, staticFile } from "remotion";

export const C = {
  navy: "#030b17",
  blue: "#8b9ff2",
  paper: "#e5dcc2",
  ink: "#383a36",
  red: "#a84d3a",
  white: "#e8e5df",
};
export const SERIF = '"Songti SC", "STSong", "Times New Roman", serif';
export const EN = 'Georgia, "Times New Roman", serif';
export const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => {
  const p = clamp(x);
  return p * p * (3 - 2 * p);
};
export const ramp = (t: number, a: number, b: number) =>
  smooth((t - a) / (b - a));
export const rand = (i: number, s = 0) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const linePath = (pts: [number, number][]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");

export const Full: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>
);
export const Header: React.FC<{
  year: string;
  label: string;
  paper?: boolean;
}> = ({ year, label, paper = false }) => (
  <div
    style={{
      position: "absolute",
      left: 54,
      top: 41,
      color: paper ? "#6f7065" : "#b8bfd0",
      fontFamily: EN,
      opacity: 0.7,
    }}
  >
    <div style={{ fontSize: 14, letterSpacing: 2.1 }}>{year}</div>
    <div style={{ fontSize: 8, letterSpacing: 0.7, marginTop: 5 }}>
      — {label}
    </div>
  </div>
);
export const Seal: React.FC<{
  x: number;
  y: number;
  blue?: boolean;
  text?: string;
}> = ({ x, y, blue = false, text = "天问" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: blue ? 20 : 32,
      minHeight: 34,
      background: blue ? "transparent" : "#b85741",
      border: blue ? "1px solid #8992c8" : undefined,
      color: blue ? "#838dd0" : "#f4e6cf",
      fontFamily: SERIF,
      fontSize: blue ? 8 : 12,
      lineHeight: "14px",
      textAlign: "center",
      padding: "3px 2px",
      writingMode: "vertical-rl",
      letterSpacing: 1,
    }}
  >
    {text}
  </div>
);
export const Vertical: React.FC<{
  text: string;
  x: number;
  y: number;
  t: number;
  delay?: number;
  size?: number;
  color?: string;
  speed?: number;
}> = ({ text, x, y, t, delay = 0, size = 18, color = C.ink, speed = 0.15 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      fontFamily: SERIF,
      fontWeight: 300,
      fontSize: size,
      color,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      lineHeight: 1.35,
    }}
  >
    {[...text].map((char, i) => {
      const p = ramp(t, delay + i * speed, delay + i * speed + 0.7);
      return (
        <span
          key={i}
          style={{
            opacity: p,
            filter: `blur(${(1 - p) * 3}px)`,
            translate: `0 ${(1 - p) * 4}px`,
          }}
        >
          {char}
        </span>
      );
    })}
  </div>
);

export const Paper: React.FC<{
  t: number;
  cool?: boolean;
  mountains?: boolean;
}> = ({ t, cool = false, mountains = true }) => (
  <Full style={{ background: cool ? "#d4dcdb" : C.paper }}>
    <Img
      src={staticFile(`textures/${cool ? "mist" : "paper"}.jpg`)}
      style={{ width: 960, height: 540 }}
    />
    {mountains &&
      [0, 1, 2].map((i) => (
        <Img
          key={i}
          src={staticFile(`textures/ink-${i}.png`)}
          style={{
            position: "absolute",
            inset: 0,
            width: 984,
            height: 550,
            opacity: 0.8 + i * 0.07,
            translate: `${Math.sin(t * 0.035 + i) * 3 - 12}px ${Math.sin(t * 0.025 + i) * 2}px`,
          }}
        />
      ))}
    <Full
      style={{
        background:
          "radial-gradient(ellipse at 50% 34%,transparent 35%,rgba(30,30,28,.27) 100%)",
      }}
    />
  </Full>
);

export const Field: React.FC<{
  t: number;
  kind?: "sea" | "stars" | "bokeh" | "fish" | "release";
  amount?: number;
}> = ({ t, kind = "sea", amount }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, 960, 540);
    if (kind === "fish") {
      const pts = Array.from({ length: amount ?? 520 }, (_, i) => {
        const angle = rand(i, 1) * Math.PI * 2 + t * (0.2 + rand(i, 3) * 0.12),
          r = 0.55 + rand(i, 4) * 0.47;
        const z = Math.sin(angle) * r;
        return {
          i,
          z,
          x: 480 + Math.cos(angle) * r * 333,
          y: 250 + Math.sin(angle) * r * 128 + Math.sin(t * 0.3 + i) * 12,
          angle,
        };
      }).sort((a, b) => a.z - b.z);
      for (const p of pts) {
        const sz = 1.1 + (p.z + 1) * 1.35;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.atan2(Math.cos(p.angle) * 0.31, -Math.sin(p.angle)));
        ctx.scale(0.66, 0.66);
        ctx.globalAlpha = 0.14 + (p.z + 1) * 0.16;
        ctx.fillStyle = "#bbc7df";
        ctx.beginPath();
        ctx.ellipse(0, 0, sz * 1.9, sz * 0.47, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-sz * 1.4, 0);
        ctx.lineTo(-sz * 2.5, -sz * 0.8);
        ctx.lineTo(-sz * 2.4, sz * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    } else {
      const count =
        amount ??
        (kind === "stars"
          ? 2100
          : kind === "bokeh"
            ? 65
            : kind === "release"
              ? 700
              : 440);
      for (let i = 0; i < count; i++) {
        let x = rand(i, 11) * 960,
          y = rand(i, 22) * 540;
        const z = rand(i, 31);
        if (kind === "bokeh") {
          x += Math.sin(t * 0.08 + i) * 10;
          y += Math.cos(t * 0.09 + i) * 7;
          const r = 4 + z * 20;
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(
            0,
            `rgba(${i % 3 === 0 ? "188,148,101" : "105,126,198"},${0.07 + z * 0.08})`,
          );
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
          continue;
        }
        if (kind === "release") {
          const a = rand(i, 12) * Math.PI * 2;
          const radius = Math.sqrt(rand(i, 10)) * (130 + ramp(t, 0, 3) * 330);
          x = 480 + Math.cos(a + t * 0.04) * radius;
          y = 265 + Math.sin(a + t * 0.04) * radius * 0.82;
        } else {
          x = (x + t * (0.2 + z * 0.8)) % 960;
          y = (y - t * (0.6 + z * 1.6) + 5400) % 540;
        }
        const alpha =
          (0.12 + z * 0.45) *
          (kind === "sea" ? 0.58 : 1) *
          (0.8 + 0.2 * Math.sin(t * 0.7 + i));
        ctx.fillStyle = `rgba(177,191,219,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.2 + z * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [t, kind, amount]);
  return (
    <canvas
      ref={ref}
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, width: 960, height: 540 }}
    />
  );
};

export const Ocean: React.FC<{
  t: number;
  stars?: boolean;
  bokeh?: boolean;
  dark?: boolean;
}> = ({ t, stars = false, bokeh = false, dark = false }) => (
  <Full
    style={{
      background: stars
        ? "radial-gradient(ellipse at 52% 42%,#101a35 0%,#050d1c 52%,#01040b 100%)"
        : dark
          ? "radial-gradient(ellipse at 50% 42%,#0e152c 0%,#050b18 55%,#01040b 100%)"
          : "radial-gradient(ellipse at 45% 0%,#0d2239 0%,#051325 44%,#01040b 100%)",
    }}
  >
    {!bokeh &&
      !dark &&
      [0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 80 + i * 240,
            top: -150,
            width: 100 + i * 13,
            height: 480,
            opacity: 0.045,
            background: "linear-gradient(180deg,#accfff,transparent)",
            filter: "blur(14px)",
            rotate: `${-20 + i * 11}deg`,
            transformOrigin: "top",
            translate: `${Math.sin(t * 0.08 + i) * 7}px 0`,
          }}
        />
      ))}
    <Field
      t={t}
      kind={bokeh ? "bokeh" : stars ? "stars" : "sea"}
      amount={dark ? 100 : undefined}
    />
    <Full
      style={{
        background: "linear-gradient(0deg,rgba(0,0,0,.72),transparent 45%)",
      }}
    />
  </Full>
);

export const Whale: React.FC<{ t: number; outro?: boolean }> = ({
  t,
  outro = false,
}) => {
  const x = outro ? 950 - t * 92 : -310 + t * 75;
  return (
    <svg
      width="350"
      height="120"
      viewBox="0 0 350 120"
      style={{
        position: "absolute",
        left: x,
        top: 137 + Math.sin(t * 0.5) * 4,
        scale: outro ? "-1 1" : "1",
        filter: "drop-shadow(0 0 4px rgba(98,141,207,.3))",
        opacity: 0.83,
      }}
    >
      <defs>
        <linearGradient id="whale-skin" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#13243b" />
          <stop offset=".22" stopColor="#020714" />
          <stop offset=".8" stopColor="#030915" />
          <stop offset="1" stopColor="#18273d" />
        </linearGradient>
      </defs>
      <path
        d="M56 55 C105 49 138 28 186 27 C211 16 242 28 265 28 C313 28 334 44 328 54 C311 73 254 77 212 69 C156 77 111 65 66 64 Z"
        fill="url(#whale-skin)"
        stroke="#263c5e"
        strokeWidth=".7"
      />
      <g
        style={{
          transformOrigin: "64px 59px",
          rotate: `${Math.sin(t * 1.3) * 7}deg`,
        }}
      >
        <path
          d="M71 58 C35 58 23 52 7 38 C15 52 18 62 0 77 C26 77 36 66 70 64Z"
          fill="#020814"
          stroke="#172944"
          strokeWidth=".6"
        />
      </g>
      <path
        d={`M209 67 Q${193 + Math.sin(t) * 4} ${100 + Math.sin(t) * 3} 179 104 Q198 83 195 69`}
        fill="#040c1b"
        stroke="#182b46"
        strokeWidth=".6"
      />
      <path d="M214 30 Q229 17 245 26" fill="#030915" />
      <circle cx="309" cy="49" r=".8" fill="#567094" opacity=".5" />
    </svg>
  );
};

export const BrandWhale: React.FC<{ size?: number }> = ({ size = 30 }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 70 35">
    <path
      d="M14 17 C26 9 46 8 58 16 L68 10 L66 21 Q41 33 15 24 L3 29 L10 21 L0 13Z"
      fill="#7f94fa"
    />
    <path d="M39 22 L33 34 L47 25Z" fill="#7f94fa" />
  </svg>
);
