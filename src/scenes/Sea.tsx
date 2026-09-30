import React from "react";
import {
  C,
  EN,
  Field,
  Header,
  Ocean,
  SERIF,
  Whale,
  BrandWhale,
  ramp,
  rand,
} from "../visual";

export const Intro: React.FC<{ t: number; outro?: boolean }> = ({
  t,
  outro = false,
}) => {
  const title = ramp(t, outro ? 4.7 : 9.4, outro ? 5.9 : 11.3);
  return (
    <>
      <Ocean t={t} />
      <Whale t={t} outro={outro} />
      {!outro && (
        <svg
          width="960"
          height="540"
          style={{ position: "absolute", inset: 0 }}
        >
          {[0, 1, 2].map((i) => {
            const p = (t - 5 + i * 0.75) / 3.5;
            return (
              <circle
                key={i}
                cx="463"
                cy="166"
                r={Math.max(0, p * 75)}
                fill="none"
                stroke="#7191c5"
                strokeWidth=".5"
                opacity={p > 0 && p < 1 ? 0.15 * (1 - p) : 0}
              />
            );
          })}
        </svg>
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: outro ? 277 : 271,
          textAlign: "center",
          opacity: title,
          filter: `blur(${(1 - title) * 5}px)`,
          color: C.white,
        }}
      >
        {outro ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 11,
              fontFamily: "Arial, sans-serif",
              fontSize: 40,
              fontWeight: 600,
            }}
          >
            <BrandWhale size={40} />
            deepseek
          </div>
        ) : (
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 58,
              letterSpacing: 22,
              paddingLeft: 22,
              textShadow: "0 0 13px rgba(156,182,255,.16)",
            }}
          >
            求索
          </div>
        )}
        <div
          style={{
            fontFamily: SERIF,
            fontSize: outro ? 12 : 9,
            letterSpacing: 4,
            marginTop: outro ? 21 : 22,
          }}
        >
          {outro ? "探索未至之境" : "一部关于追问的简史"}
        </div>
        <div
          style={{
            fontFamily: EN,
            fontSize: 6.2,
            letterSpacing: outro ? 0.6 : 1.7,
            marginTop: 8,
            opacity: 0.63,
          }}
        >
          {outro
            ? "Into the unknown, with curiosity."
            : "A BRIEF HISTORY OF SEEKING"}
        </div>
      </div>
    </>
  );
};

export const Navigation: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Ocean t={t} stars />
    <Header year="1405 — 1433" label="郑和 · 牵星过洋" />
    <div
      style={{
        position: "absolute",
        top: 365,
        left: 0,
        right: 0,
        height: 36,
        background:
          "radial-gradient(ellipse at 52% 100%,rgba(99,128,197,.27),transparent 75%)",
        filter: "blur(4px)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 401,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(#020a17,#01040b)",
      }}
    />
    <svg width="960" height="540" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="north-star">
          <stop stopColor="#d4dcff" stopOpacity=".8" />
          <stop offset=".15" stopColor="#8aa1f5" stopOpacity=".5" />
          <stop offset="1" stopColor="#788feb" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g opacity={ramp(t, 0.1, 1)}>
        <circle cx="652" cy="118" r="28" fill="url(#north-star)" />
        <circle cx="652" cy="118" r="2" fill="#e4e8ff" />
        <path
          d="M640 118H664M652 106V130"
          stroke="#c4cffe"
          strokeWidth=".5"
          opacity=".5"
        />
        <text x="675" y="133" fontFamily={SERIF} fontSize="11" fill="#e0dfdf">
          北辰
        </text>
      </g>
      <g fill="#030710" stroke="#263144" strokeWidth=".6">
        <path d="M165 409 L254 409 L244 423H178Z" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path
              d={`M${185 + i * 22} 407V${363 - (i % 2) * 26}`}
              strokeWidth="1"
            />
            <rect
              x={177 + i * 22}
              y={366 - (i % 2) * 26}
              width="16"
              height={38 + (i % 2) * 25}
            />
            {[0, 1, 2, 3, 4].map((j) => (
              <path
                key={j}
                d={`M${178 + i * 22} ${372 + j * 7 - (i % 2) * 26}H${191 + i * 22}`}
                stroke="#2b3548"
              />
            ))}
          </g>
        ))}
      </g>
      <g opacity={ramp(t, 3.2, 5)}>
        <path
          d="M209 372L652 118"
          stroke="#afb8db"
          strokeDasharray="2 3"
          strokeWidth=".6"
          opacity=".6"
        />
        <path
          d="M209 372H647"
          stroke="#5b7199"
          strokeDasharray="2 3"
          strokeWidth=".4"
          opacity=".3"
        />
        <path
          d="M290 372A81 81 0 0 0 279 331"
          fill="none"
          stroke="#c4b393"
          strokeWidth=".6"
        />
        <text x="295" y="345" fontFamily={SERIF} fontSize="9" fill="#d7c7a2">
          仰角
        </text>
      </g>
    </svg>
  </>
);

export const MoE: React.FC<{ t: number }> = ({ t }) => {
  const words = ["海", "π", "why", "梦"];
  const phase = Math.max(0, Math.floor((t - 2.5) / 2.35));
  const q = words[phase % words.length];
  const active = ramp(t, 1.9, 3.1);
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + t * 0.04;
    return { x: 480 + Math.cos(a) * 285, y: 261 + Math.sin(a) * 94 };
  });
  return (
    <>
      <Ocean t={t} />
      <Header year="2024 · 12" label="DeepSeek-V3 · 稀疏专家 MoE" />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 960,
          height: 540,
          opacity: ramp(t, 0, 1),
        }}
      >
        <Field t={t} kind="fish" />
      </div>
      <div
        style={{
          position: "absolute",
          right: 54,
          top: 37,
          color: "#c0c4cf",
          textAlign: "right",
          fontFamily: EN,
        }}
      >
        <div style={{ fontSize: 20 }}>671B</div>
        <div style={{ fontSize: 5.5, letterSpacing: 1.3, opacity: 0.65 }}>
          TOTAL PARAMETERS
        </div>
        <div style={{ opacity: ramp(t, 2.4, 3.4), marginTop: 12 }}>
          <div style={{ fontSize: 16, color: "#b6b6c1" }}>37B</div>
          <div style={{ fontSize: 5.5, letterSpacing: 1, opacity: 0.65 }}>
            ACTIVATED PER TOKEN
          </div>
          <div style={{ fontSize: 5.7, opacity: 0.5, marginTop: 6 }}>
            EXPERTS 8 / 256 · 1 shared
          </div>
        </div>
      </div>
      <svg width="960" height="540" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="node-glow">
            <stop stopColor="#d8dfff" stopOpacity="1" />
            <stop offset=".12" stopColor="#9caaf8" stopOpacity=".8" />
            <stop offset="1" stopColor="#8898e8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g opacity={active}>
          {nodes.map((n, i) => (
            <g key={i}>
              <path
                d={`M480 265L${n.x} ${n.y}`}
                fill="none"
                stroke="#adbeef"
                opacity={0.4 + rand(i, 7) * 0.2}
                strokeWidth=".6"
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={10 + rand(i, 2) * 5}
                fill="url(#node-glow)"
              />
              <ellipse
                cx={n.x}
                cy={n.y}
                rx="4"
                ry="1.5"
                fill="#d9deff"
                transform={`rotate(${i * 37} ${n.x} ${n.y})`}
              />
            </g>
          ))}
          <text
            x="480"
            y="271"
            textAnchor="middle"
            fill="#f0f0ff"
            fontFamily={q === "π" ? EN : SERIF}
            fontSize="25"
            style={{ filter: "drop-shadow(0 0 6px #8497ef)" }}
          >
            {q}
          </text>
        </g>
      </svg>
    </>
  );
};

export const Release: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Ocean t={t} />
    <Header year="2025 · 01 · 20" label="DeepSeek-R1-Zero · R1" />
    <Field t={t} kind="release" />
    <svg width="960" height="540" style={{ position: "absolute", inset: 0 }}>
      <circle
        cx="480"
        cy="263"
        r={144 + t * 29}
        stroke="#93a5ca"
        strokeWidth=".5"
        opacity={0.3 * (1 - ramp(t, 1.5, 3.8))}
        fill="none"
      />
    </svg>
    <div
      style={{
        position: "absolute",
        top: 258,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: ramp(t, 0, 0.6),
        color: "#e2e5f6",
        textShadow: "0 0 12px #657fc880",
        fontFamily: EN,
      }}
    >
      <div style={{ fontSize: 31, fontWeight: 600 }}>DeepSeek-R1</div>
      <div style={{ fontSize: 7, letterSpacing: 2.4, marginTop: 13 }}>
        OPEN WEIGHTS · MIT LICENSE
      </div>
    </div>
  </>
);
