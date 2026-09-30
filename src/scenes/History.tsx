import React from "react";
import { Img, staticFile } from "remotion";
import {
  C,
  EN,
  Full,
  Header,
  Paper,
  Seal,
  Vertical,
  linePath,
  ramp,
  rand,
} from "../visual";

export const QuYuan: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Paper t={t} />
    <Header year="c. 300 BCE" label="屈原 ·《天问》《离骚》" paper />
    {[
      "日遂古之初谁传道之",
      "上下未形何由考之",
      "冥昭瞢暗谁能极之",
      "冯翼惟像何以识之",
    ].map((s, i) => (
      <Vertical
        key={s}
        text={s}
        x={766 - i * 56}
        y={72}
        t={t}
        delay={0.9 + i * 1.05}
        size={26}
        speed={0.1}
      />
    ))}
    <div style={{ opacity: ramp(t, 5, 6) }}>
      <Seal x={574} y={370} />
    </div>
    <Vertical
      text="吾将上下而求索"
      x={264}
      y={55}
      t={t}
      delay={9.4}
      size={41}
      speed={0.42}
    />
  </>
);

const Rod: React.FC<{
  x: number;
  y: number;
  digit: number;
  t: number;
  delay: number;
  horizontal?: boolean;
}> = ({ x, y, digit, t, delay, horizontal = false }) => {
  const opacity = ramp(t, delay, delay + 0.65);
  const n = digit === 9 ? 4 : digit === 6 ? 1 : digit;
  if (horizontal)
    return (
      <g opacity={opacity} transform={`translate(${x},${y})`}>
        {Array.from({ length: digit === 6 ? 2 : 3 }, (_, i) => (
          <line
            key={i}
            x1={-24}
            x2={-5}
            y1={(i - (digit === 6 ? 0.5 : 1)) * 6}
            y2={(i - (digit === 6 ? 0.5 : 1)) * 6}
            strokeWidth={2.2}
          />
        ))}
        {Array.from({ length: digit === 6 ? 1 : 4 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={8 + i * 5}
            x2={8 + i * 5}
            y1={-10}
            y2={10}
            strokeWidth={2.2}
          />
        ))}
        {digit === 6 && (
          <line x1={1} x2={15} y1={-10} y2={-10} strokeWidth={2.2} />
        )}
      </g>
    );
  return (
    <g opacity={opacity} transform={`translate(${x},${y})`}>
      {digit >= 6 && (
        <line x1={-10} x2={10} y1={-12} y2={-12} strokeWidth={2.5} />
      )}
      <g transform={horizontal ? "rotate(90)" : ""}>
        {Array.from({ length: n }, (_, i) => (
          <line
            key={i}
            x1={(i - (n - 1) / 2) * 5}
            x2={(i - (n - 1) / 2) * 5}
            y1={-10}
            y2={10}
            strokeWidth={2.2}
          />
        ))}
      </g>
    </g>
  );
};
export const Abacus: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Full style={{ background: "#342014" }}>
      <Img
        src={staticFile("textures/bamboo.jpg")}
        style={{ width: 960, height: 540 }}
      />
      <Full
        style={{
          background:
            "radial-gradient(ellipse at center,transparent 10%,rgba(0,0,0,.46))",
        }}
      />
    </Full>
    <Header year="c. 1st CENTURY" label="汉 ·《九章算术 · 方程》" />
    <svg width="960" height="540" style={{ position: "absolute", inset: 0 }}>
      <g stroke="#ece3c7" strokeLinecap="round">
        {[
          [1, 2, 3],
          [2, 3, 2],
          [3, 1, 1],
          [6, 9, 9],
        ].map((row, j) =>
          row.map((n, i) => (
            <Rod
              key={`${i}-${j}`}
              x={365 + i * 150}
              y={122 + j * 67}
              digit={n}
              t={t}
              delay={0.45 + j * 0.35 + i * 0.55}
              horizontal={j === 3}
            />
          )),
        )}
        <line
          x1="280"
          x2="750"
          y1="300"
          y2="300"
          opacity=".24"
          strokeWidth=".7"
        />
      </g>
      <g fill="#d7c7a6" fontSize="14" fontFamily="Songti SC">
        {["上禾", "中禾", "下禾", "实"].map((s, i) => (
          <text
            key={s}
            x="230"
            y={126 + i * 67}
            opacity={ramp(t, 0.4 + i * 0.3, 1 + i * 0.3)}
          >
            {s}
          </text>
        ))}
      </g>
    </svg>
    <Vertical
      text="术曰"
      x={786}
      y={95}
      t={t}
      delay={1.1}
      size={36}
      color={C.red}
      speed={0.4}
    />
  </>
);

export const Circle: React.FC<{ t: number }> = ({ t }) => {
  const phase = Math.max(
    0,
    t < 8 ? Math.floor((t - 0.7) / 1.42) : 5 + Math.floor((t - 8) / 0.6),
  );
  const sides = Math.min(3072, 6 * Math.pow(2, phase));
  const pi = [
    3, 3, 3.105829, 3.132629, 3.13935, 3.141032, 3.141452, 3.141558, 3.141585,
    3.14159,
  ][Math.min(phase, 9)];
  const count = Math.min(sides, 384);
  const pts = Array.from(
    { length: count + 1 },
    (_, i) =>
      [
        310 + 139 * Math.cos((i / count) * Math.PI * 2 - Math.PI / 2),
        255 + 139 * Math.sin((i / count) * Math.PI * 2 - Math.PI / 2),
      ] as [number, number],
  );
  const shown = ramp(t, 0.05, 1.4);
  const losses = Array.from(
    { length: 8 },
    (_, i) =>
      [570 + i * 32, 332 + i * 5 + (i === 7 ? 27 : 0)] as [number, number],
  );
  return (
    <>
      <Paper t={t} mountains={false} />
      <Header year="263 CE" label="刘徽 · 割圆术" paper />
      <svg width="960" height="540" style={{ position: "absolute", inset: 0 }}>
        <circle
          cx="310"
          cy="255"
          r="139"
          fill="none"
          stroke="#51483c"
          strokeWidth="1"
          strokeDasharray="873.4"
          strokeDashoffset={873.4 * (1 - shown)}
          transform="rotate(-90 310 255)"
        />
        <circle cx="310" cy="255" r="1.5" fill="#393632" />
        {t > 1.6 && (
          <path
            d={linePath(pts)}
            fill="none"
            stroke={C.red}
            strokeWidth=".7"
            opacity=".7"
          />
        )}
        <g opacity={ramp(t, 3, 4)}>
          <path
            d="M570 320V419H818"
            stroke="#847d6b"
            fill="none"
            strokeWidth=".5"
            opacity=".4"
          />
          <path
            d={linePath(losses.slice(0, Math.max(2, phase + 1)))}
            fill="none"
            stroke={C.red}
            strokeWidth=".9"
          />
          {losses.slice(0, phase + 1).map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="1.7" fill={C.red} />
          ))}
          <text
            x="780"
            y="321"
            fill={C.red}
            fontSize="8"
            fontFamily="Songti SC"
          >
            所失 · loss
          </text>
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 580,
          top: 196,
          color: C.ink,
          opacity: ramp(t, 1.4, 2.3),
          fontFamily: EN,
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: 1.2, color: "#8f8775" }}>
          圆内接 <span style={{ color: C.red }}>{sides}</span> 边形
        </div>
        <div style={{ fontSize: 29, marginTop: 12 }}>
          <i>π</i> ≈ {pi.toFixed(6)}
        </div>
      </div>
    </>
  );
};

export const Hangzhou: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Paper t={t} cool />
    <Header year="2023 · 07" label="杭州" paper />
    <svg width="960" height="540" style={{ position: "absolute", inset: 0 }}>
      <g
        fill="#34404b"
        transform="translate(-42 -20) scale(1.27)"
        opacity={0.9 * ramp(t, 0, 0.8)}
      >
        <path d="M30 290 Q162 251 296 290Z" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = 275 - i * 22,
            w = 61 - i * 6;
          return (
            <g key={i}>
              <path
                d={`M${164 - w / 2} ${y} Q164 ${y - 6} ${164 + w / 2} ${y} L${164 + w / 2 + 14} ${y + 5}H${164 - w / 2 - 14}Z`}
              />
              <rect x={164 - w / 2 + 6} y={y + 5} width={w - 12} height={17} />
            </g>
          );
        })}
        <path d="M152 140 Q164 132 176 140 L189 143H139Z" />
        <path d="M164 130V148" stroke="#34404b" strokeWidth="1" />
      </g>
      <g stroke="#596b70" strokeWidth=".4" opacity=".15">
        {Array.from({ length: 110 }, (_, i) => {
          const x = rand(i, 3) * 1000 - 20,
            y = ((rand(i, 8) * 600 + t * (30 + rand(i, 7) * 20)) % 600) - 30;
          return <line key={i} x1={x} x2={x - 8} y1={y} y2={y + 27} />;
        })}
      </g>
    </svg>
    <Vertical
      text="深度求索"
      x={828}
      y={74}
      t={t}
      delay={9.5}
      size={30}
      speed={0.4}
    />
    <div style={{ opacity: ramp(t, 10.8, 11.5) }}>
      <Seal x={866} y={190} blue text="DEEP SEEK" />
    </div>
  </>
);
