import React, { useLayoutEffect, useRef } from "react";
import { C, EN, Header, Ocean, SERIF, ramp, rand, clamp } from "../visual";

export const Neural: React.FC<{ t: number }> = ({ t }) => {
  const single = t < 3.8;
  const warm = t > 8.0;
  const color = warm ? "#af6048" : "#849aef";
  const cols = [4, 6, 6, 6, 4];
  const nodes = cols.flatMap((n, j) =>
    Array.from({ length: n }, (_, i) => ({
      x: 300 + j * 85,
      y: 261 + (i - (n - 1) / 2) * 47,
      j,
      i,
    })),
  );
  return (
    <>
      <Ocean t={t} dark />
      <Header
        year={warm ? "1986" : "1943"}
        label={warm ? "反向传播 · Backpropagation" : "神经元 · 数学的形式化"}
      />
      <svg width="960" height="540" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="neuron-fill">
            <stop offset="0" stopColor="#10162a" />
            <stop offset=".34" stopColor={color} />
            <stop offset=".7" stopColor={color} stopOpacity=".7" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        {single ? (
          <g opacity={ramp(t, 0.05, 0.8)}>
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${368} ${217 + i * 38}L${453} 262`}
                fill="none"
                stroke={color}
                opacity=".4"
                strokeWidth=".6"
                strokeDasharray="150"
                strokeDashoffset={
                  150 * (1 - ramp(t, 0.3 + i * 0.2, 1.6 + i * 0.2))
                }
              />
            ))}
            <circle cx="480" cy="262" r="17" fill="url(#neuron-fill)" />
            <circle cx="480" cy="262" r="4" fill="#0b1020" />
            <path
              d="M495 262H589"
              stroke={color}
              strokeWidth=".6"
              opacity={ramp(t, 1.7, 2.5)}
            />
            <text
              x="480"
              y="303"
              textAnchor="middle"
              fontFamily={EN}
              fontSize="15"
              fill="#c4c6d6"
              opacity={ramp(t, 1.8, 3)}
            >
              <tspan fontStyle="italic">y = θ(Σ wᵢxᵢ)</tspan>
            </text>
          </g>
        ) : (
          <g opacity={ramp(t, 3.65, 4.2)}>
            {nodes
              .filter((n) => n.j < 4)
              .flatMap((a) =>
                nodes
                  .filter((b) => b.j === a.j + 1)
                  .map((b) => {
                    const k = a.j * 31 + a.i * 7 + b.i;
                    const p = (t * 0.42 + rand(k, 7)) % 1;
                    return (
                      <g key={`${a.j}-${a.i}-${b.i}`}>
                        <path
                          d={`M${a.x} ${a.y}L${b.x} ${b.y}`}
                          stroke={color}
                          strokeWidth=".65"
                          opacity={0.28 * ramp(t, 4.2, 5.5)}
                        />
                        {t > 5 && (
                          <circle
                            cx={
                              warm
                                ? b.x + (a.x - b.x) * p
                                : a.x + (b.x - a.x) * p
                            }
                            cy={
                              warm
                                ? b.y + (a.y - b.y) * p
                                : a.y + (b.y - a.y) * p
                            }
                            r="1.2"
                            fill={color}
                            opacity=".8"
                          />
                        )}
                      </g>
                    );
                  }),
              )}
            {nodes.map((n, k) => (
              <g key={k} opacity={ramp(t, 3.8 + k * 0.016, 4.5 + k * 0.016)}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="13"
                  fill="url(#neuron-fill)"
                  opacity=".26"
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="6.6"
                  stroke={color}
                  strokeWidth=".6"
                  fill="none"
                  opacity=".26"
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="2.5"
                  stroke={color}
                  strokeWidth=".8"
                  fill="#0b1020"
                />
              </g>
            ))}
          </g>
        )}
        <text
          x="773"
          y="396"
          fontFamily={EN}
          fontSize="9"
          fontStyle="italic"
          fill={C.red}
          opacity={ramp(t, 8.4, 9.2)}
        >
          ∂L / ∂w ←
        </text>
      </svg>
    </>
  );
};

export const Depth: React.FC<{ t: number }> = ({ t }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, 960, 540);
    for (let layer = 7; layer >= 0; layer--) {
      const pos = ((layer * 178 - t * 36 + 1424) % 1424) - 210;
      const width = 560 + layer * 21,
        back = width * 0.63,
        rows = 12,
        cols = 24;
      const top = pos,
        depth = 145;
      ctx.strokeStyle = "rgba(98,117,163,.18)";
      ctx.lineWidth = 0.45;
      ctx.beginPath();
      ctx.moveTo(480 - back / 2, top);
      ctx.lineTo(480 + back / 2, top);
      ctx.lineTo(480 + width / 2, top + depth);
      ctx.lineTo(480 - width / 2, top + depth);
      ctx.closePath();
      ctx.stroke();
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const y = top + (r / rows) * depth;
          const wid = back + ((width - back) * r) / rows;
          const val = rand(layer * 1000 + r * cols + c, 5);
          if (val < 0.6) continue;
          const x = 480 - wid / 2 + (c / cols) * wid;
          const w = (wid / cols) * 0.54;
          const a =
            (0.12 + val * 0.55) *
            (0.77 + 0.23 * Math.sin(t * 0.8 + layer * 9 + r + c));
          const colorMix = ramp(t, 0.8, 1.5);
          const red = 142 + (65 - 142) * colorMix;
          const green = 158 + (68 + Math.floor(val * 23) - 158) * colorMix;
          const blue = 215 + (145 + Math.floor(val * 80) - 215) * colorMix;
          ctx.fillStyle = `rgba(${red},${green},${blue},${a})`;
          ctx.fillRect(x, y, w, (depth / rows) * 0.73);
        }
    }
  }, [t]);
  return (
    <>
      <Ocean t={t} dark />
      <Header year="2012" label="ImageNet · AlexNet" />
      <canvas
        ref={ref}
        width="1920"
        height="1080"
        style={{
          position: "absolute",
          inset: 0,
          width: 960,
          height: 540,
          opacity: ramp(t, 0, 0.9),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 873,
          top: 103,
          height: 291,
          borderLeft: "1px solid #67729a40",
          color: "#b6bfd8",
          fontFamily: EN,
          fontSize: 6,
          letterSpacing: 0.8,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: i * 39,
              left: -7,
              width: 14,
              borderTop: "1px solid #7583a84a",
            }}
          />
        ))}
        <div style={{ position: "absolute", top: -18, left: -42 }}>
          LAYER {Math.min(8, 1 + Math.floor(t * 0.75))} / 8
        </div>
        <div
          style={{
            position: "absolute",
            left: -2,
            top: clamp(t / 10) * 273,
            width: 4,
            height: 4,
            background: "#7d8cf0",
            borderRadius: 4,
            boxShadow: "0 0 7px #6479e9",
          }}
        />
      </div>
    </>
  );
};

export const Attention: React.FC<{ t: number }> = ({ t }) => {
  const chars = [..."吾将上下而求索"];
  const focus = t < 4 ? 0 : Math.floor(t * 0.8) % 7;
  return (
    <>
      <Ocean t={t} dark />
      <Header year="2017" label="Attention Is All You Need" />
      <svg width="960" height="540" style={{ position: "absolute", inset: 0 }}>
        {chars.flatMap((_, i) =>
          chars.slice(i + 1).map((__, j) => {
            const k = i + j + 1,
              x1 = 178 + i * 99,
              x2 = 178 + k * 99,
              dist = x2 - x1;
            const on = i === focus || k === focus;
            return (
              <path
                key={`${i}-${k}`}
                d={`M${x1} 285 Q${(x1 + x2) / 2} ${285 - dist * 0.72} ${x2} 285`}
                fill="none"
                stroke={on ? "#9da9ee" : "#6275a0"}
                strokeWidth={on ? 1.1 : 0.55}
                opacity={
                  (on ? 0.74 : 0.075) * ramp(t, 0.3 + i * 0.04, 1.5 + i * 0.04)
                }
              />
            );
          }),
        )}
        <g fill="#d4d6df" fontFamily={SERIF} fontSize="35">
          {chars.map((s, i) => (
            <text
              key={i}
              x={178 + i * 99}
              y="308"
              textAnchor="middle"
              opacity={ramp(t, 0, 0.6)}
            >
              {s}
            </text>
          ))}
        </g>
      </svg>
    </>
  );
};

const reasoning = [
  "Question: If a > 1, then the sum of the real solutions of √(a − √(a + x)) = x is equal to",
  "<think>",
  "To solve the equation √(a − √(a + x)) = x, let’s start by squaring both sides.",
  "x² = a − √(a + x)  →  √(a + x) = a − x²",
  "Rearrange to isolate the inner square root term:",
  "(a − x²)² = a + x  →  x⁴ − 2ax² − x + a² − a = 0",
  "",
  "Wait, wait, wait. That’s an aha moment I can flag here.",
  "Let’s reevaluate this step-by-step to identify if the correct sum can be",
  "obtained without solving the quartic equation directly.",
  "First, let’s square both sides: x² = a − √(a + x).",
  "Then consider the restrictions on the real roots.",
  "</think>",
];
export const Reasoning: React.FC<{ t: number }> = ({ t }) => {
  const progress = Math.floor(Math.max(0, t - 0.4) * 64);
  let count = 0;
  return (
    <>
      <Ocean t={t} dark />
      <Header year="2025 · 01 · 20" label="DeepSeek-R1-Zero · R1" />
      <div
        style={{
          position: "absolute",
          left: 61,
          right: 61,
          top: 87,
          fontFamily: '"Courier New",monospace',
          fontSize: 11,
          lineHeight: "24px",
          letterSpacing: 0.02,
        }}
      >
        {reasoning.map((text, i) => {
          const begin = count;
          count += text.length;
          const shown = text.slice(0, Math.max(0, progress - begin));
          const highlight = i === 7;
          return (
            <div
              key={i}
              style={{
                minHeight: 24,
                whiteSpace: "pre-wrap",
                color: highlight ? "#e4e4ff" : "#b0b7cc",
                opacity: highlight ? 1 : t > 4.6 ? 0.25 : 0.65,
                textShadow: highlight ? "0 0 7px #8796e4" : undefined,
              }}
            >
              {shown}
              {shown.length > 0 && progress < count && (
                <span style={{ color: C.blue }}>▍</span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
