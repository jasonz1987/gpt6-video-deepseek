import React from "react";
import {
  EN,
  Paper,
  Ocean,
  SERIF,
  Seal,
  Vertical,
  BrandWhale,
  clamp,
  ramp,
} from "../visual";

const nodes = [
  { name: "深度求索", date: "2023 · 07", x: 481, y: 212 },
  { name: "DeepSeek LLM · Coder", date: "2023 · 11", x: 355, y: 315 },
  { name: "DeepSeekMoE", date: "2024 · 01", x: 591, y: 425 },
  { name: "DeepSeekMath", date: "2024 · 02", x: 346, y: 543 },
  { name: "DeepSeek-V2", date: "2024 · 05", x: 576, y: 657 },
  { name: "DeepSeek-V2.5", date: "2024 · 09", x: 382, y: 775 },
  { name: "DeepSeek-V3", date: "2024 · 12", x: 608, y: 883 },
  { name: "DeepSeek-R1", date: "2025 · 01", x: 440, y: 1002 },
  { name: "DeepSeek-V3.1", date: "2025 · 08", x: 596, y: 1099 },
  { name: "DeepSeek-V3.2", date: "2025 · 12", x: 441, y: 1215 },
  { name: "DeepSeek-V4", date: "2026 · 04", x: 592, y: 1349 },
  { name: "DeepSeek-V4.1-Flash", date: "2026 · 09", x: 460, y: 1443 },
];
const river = nodes
  .map((p, i) =>
    i === 0
      ? `M${p.x} ${p.y}`
      : `C${nodes[i - 1].x} ${nodes[i - 1].y + 58},${p.x} ${p.y - 58},${p.x} ${p.y}`,
  )
  .join(" ");
export const Journey: React.FC<{ t: number }> = ({ t }) => {
  const camera = clamp((t - 5.0) / 13.6) * 1126;
  const reveal = ramp(t, 3.7, 17.8);
  const tributaries = [
    "天问",
    "算筹",
    "割圆",
    "牵星",
    "神经元",
    "反向传播",
    "深度",
    "注意力",
  ];
  const dates = [
    "c.300 BCE",
    "c.1st C.",
    "263",
    "1405",
    "1943",
    "1986",
    "2012",
    "2017",
  ];
  return (
    <>
      <Paper t={t} mountains={false} />
      <svg width="960" height="540" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(0 ${-camera})`}>
          <g opacity=".6">
            {tributaries.map((s, i) => {
              const x = 91 + i * 103;
              return (
                <g key={s}>
                  <text
                    x={x}
                    y="67"
                    fill="#37382f"
                    textAnchor="middle"
                    fontFamily={SERIF}
                    fontSize="14"
                    opacity={ramp(t, 0.05 + i * 0.1, 0.75 + i * 0.1)}
                  >
                    {s}
                  </text>
                  <text
                    x={x}
                    y="83"
                    fill="#888472"
                    textAnchor="middle"
                    fontFamily={EN}
                    fontSize="6"
                    opacity={ramp(t, 0.3 + i * 0.1, 1 + i * 0.1)}
                  >
                    {dates[i]}
                  </text>
                  <path
                    d={`M${x} 92 C${x} 148,480 139,481 212`}
                    stroke="#77715e"
                    strokeWidth=".65"
                    fill="none"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset={
                      1 - ramp(t, 0.4 + i * 0.18, 2.8 + i * 0.18)
                    }
                  />
                </g>
              );
            })}
          </g>
          <path
            d={river}
            stroke="#747fce"
            strokeWidth="1.2"
            fill="none"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - reveal}
          />
          {nodes.map((p, i) => {
            const a =
              ramp(t, 3 + i * 1.21, 4 + i * 1.21) *
              (1 - ramp(p.y - camera, 414, 434));
            const left = i % 2 === 1;
            const x = left ? p.x - 12 : p.x + 12;
            return (
              <g key={p.name} opacity={a}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={i === 0 ? 4 : 1.8}
                  fill="#7a85d0"
                />
                <text
                  x={x}
                  y={p.y - 3}
                  textAnchor={left ? "end" : "start"}
                  fill={i === 11 ? "#6874c7" : "#373a35"}
                  fontFamily={EN}
                  fontSize={i === 11 ? 17 : 12.5}
                >
                  {p.name}
                </text>
                <text
                  x={x}
                  y={p.y + 11}
                  textAnchor={left ? "end" : "start"}
                  fill="#8c897a"
                  fontFamily={EN}
                  fontSize="7"
                  letterSpacing=".6"
                >
                  {p.date} · {i === 0 ? "起航" : "模型演进"}
                </text>
                {i === 11 && (
                  <g opacity={ramp(t, 16.8, 18)}>
                    {Array.from({ length: 16 }, (_, k) => {
                      const a = (k / 16) * Math.PI * 2;
                      return (
                        <line
                          key={k}
                          x1={p.x + Math.cos(a) * 6}
                          y1={p.y + Math.sin(a) * 6}
                          x2={p.x + Math.cos(a) * 24}
                          y2={p.y + Math.sin(a) * 24}
                          stroke="#7a86d0"
                          strokeWidth=".6"
                        />
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })}
        </g>
        <g opacity=".09" stroke="#676758" fill="none" strokeWidth=".5">
          <circle cx="800" cy="266" r="55" />
          <circle cx="800" cy="266" r="43" />
          <circle cx="800" cy="266" r="25" />
          <path d="M730 266H870M800 196V336M763 229L837 303M837 229L763 303" />
        </g>
        <g opacity=".24" fill="#767365" fontFamily={EN} fontSize="6">
          <path d="M71 171V417" stroke="#8e8977" strokeWidth=".4" />
          {["0 m", "500 m", "1000 m", "2000 m"].map((s, i) => (
            <g key={s}>
              <path
                d={`M68 ${173 + i * 80}H74`}
                stroke="#8e8977"
                strokeWidth=".5"
              />
              <text x="82" y={175 + i * 80}>
                {s}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <Vertical text="航迹" x={878} y={41} t={t} size={26} speed={0.15} />
      <div style={{ opacity: ramp(t, 0.5, 1.1) }}>
        <Seal x={889} y={109} blue text="DEEP SEEK" />
      </div>
    </>
  );
};

const answer =
  "这是屈原《天问》的第一问：远古的开端，是谁把它传下来的？\n\n两千多年来，人们用神话、哲学与观测，一次次尝试回答。今天我们知道，宇宙大约起源于138亿年前。而最初的“传述者”，是至今仍充满整个天空的宇宙微波背景辐射——";
export const Chat: React.FC<{ t: number }> = ({ t }) => {
  const enter = ramp(t, 0, 1.1),
    text = answer.slice(0, Math.floor(Math.max(0, t - 3.4) * 32));
  const scale = 0.96 + enter * 0.04 + Math.sin(t * 0.13) * 0.008;
  return (
    <>
      <Ocean t={t} bokeh />
      <div
        style={{
          position: "absolute",
          left: 204 + Math.sin(t * 0.16) * 5,
          top: 54,
          width: 552,
          height: 331,
          scale,
          rotate: `${Math.sin(t * 0.12) * 0.3}deg`,
          background: "#fdfdff",
          borderRadius: 7,
          boxShadow: "0 0 28px #788ce344,0 15px 60px #01030ba0",
          opacity: enter,
          color: "#363c45",
          fontFamily: 'Arial, "Songti SC",serif',
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 28,
            borderBottom: "1px solid #edf0f7",
            display: "flex",
            alignItems: "center",
            gap: 5,
            paddingLeft: 14,
            fontSize: 8,
          }}
        >
          <BrandWhale size={15} />
          <span style={{ fontWeight: 600 }}>deepseek</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 49,
            right: 21,
            background: "#f0f3f8",
            padding: "8px 12px",
            borderRadius: 5,
            fontSize: 10,
            opacity: ramp(t, 0.6, 1.7),
          }}
        >
          遂古之初，谁传道之？
        </div>
        <div
          style={{
            position: "absolute",
            top: 133,
            left: 23,
            right: 23,
            fontSize: 13,
            lineHeight: 1.9,
            opacity: ramp(t, 2.4, 3.2),
          }}
        >
          <div style={{ fontSize: 11, color: "#9296a0", marginBottom: 13 }}>
            已深度思考（用时 8 秒）
            <br />
            <span style={{ opacity: 0.7 }}>
              先辨明《天问》的语境，再从现代宇宙学中寻找可以回应的线索……
            </span>
          </div>
          <div style={{ whiteSpace: "pre-wrap" }}>
            {text}
            {t < 10.7 && <span style={{ color: "#687fdf" }}>▍</span>}
          </div>
        </div>
      </div>
    </>
  );
};
