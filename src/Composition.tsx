import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { Intro, MoE, Navigation, Release } from "./scenes/Sea";
import { Abacus, Circle, Hangzhou, QuYuan } from "./scenes/History";
import { Attention, Depth, Neural, Reasoning } from "./scenes/Intelligence";
import { Chat, Journey } from "./scenes/Journey";
import { C, EN, SERIF, ramp } from "./visual";
import { captions } from "./captions";
import { StablePaint } from "./StablePaint";

export const FPS = 27;
export const DURATION = 4709;
export const scenes = [
  {
    id: "DeepSea",
    name: "深海 · 求索",
    start: 0,
    end: 13.4444,
    component: Intro,
  },
  {
    id: "QuYuan",
    name: "屈原 · 天问",
    start: 13.4444,
    end: 26.7778,
    component: QuYuan,
  },
  {
    id: "Abacus",
    name: "九章算术",
    start: 26.7778,
    end: 37.1111,
    component: Abacus,
  },
  {
    id: "Circle",
    name: "刘徽 · 割圆",
    start: 37.1111,
    end: 49.4444,
    component: Circle,
  },
  {
    id: "Navigation",
    name: "航海 · 牵星",
    start: 49.4444,
    end: 61.3333,
    component: Navigation,
  },
  {
    id: "Neural",
    name: "神经网络 · 反向传播",
    start: 61.3333,
    end: 74.6667,
    component: Neural,
  },
  {
    id: "Depth",
    name: "深度学习",
    start: 74.6667,
    end: 84.3333,
    component: Depth,
  },
  {
    id: "Attention",
    name: "Transformer",
    start: 84.3333,
    end: 92.7778,
    component: Attention,
  },
  {
    id: "Hangzhou",
    name: "杭州 · 深度求索",
    start: 92.7778,
    end: 105.1111,
    component: Hangzhou,
  },
  {
    id: "MoE",
    name: "MoE · 鱼群与路由",
    start: 105.1111,
    end: 118.3333,
    component: MoE,
  },
  {
    id: "Reasoning",
    name: "R1 · 顿悟",
    start: 118.3333,
    end: 128.0,
    component: Reasoning,
  },
  {
    id: "Release",
    name: "R1 · 开放权重",
    start: 128.0,
    end: 132.7778,
    component: Release,
  },
  {
    id: "Journey",
    name: "航迹 · 版本长河",
    start: 132.7778,
    end: 152.1111,
    component: Journey,
  },
  {
    id: "Chat",
    name: "天 · 开始回答",
    start: 152.1111,
    end: 165.4444,
    component: Chat,
  },
  {
    id: "Outro",
    name: "深海 · 品牌落版",
    start: 165.4444,
    end: DURATION / FPS,
    component: (p: { t: number }) => <Intro {...p} outro />,
  },
];
const SceneLayer: React.FC<{ index: number; from: number }> = ({
  index,
  from,
}) => {
  const frame = useCurrentFrame(),
    s = scenes[index],
    globalT = (frame + from) / FPS,
    t = globalT - s.start;
  const enter = index === 0 ? 1 : ramp(globalT, s.start - 0.35, s.start + 0.35);
  const Component = s.component;
  return (
    <AbsoluteFill style={{ opacity: enter }}>
      <Component t={Math.max(0, t)} />
    </AbsoluteFill>
  );
};
const Captions: React.FC = () => {
  const time = useCurrentFrame() / FPS;
  const cue = captions.find((c) => time >= c.start && time < c.end);
  if (!cue) return null;
  const paper =
    (time >= 13.44 && time < 26.78) ||
    (time >= 37.11 && time < 49.44) ||
    (time >= 92.78 && time < 105.11) ||
    (time >= 132.78 && time < 152.11);
  const opacity =
    ramp(time, cue.start, cue.start + 0.22) *
    (1 - ramp(time, cue.end - 0.22, cue.end));
  const parts = cue.emphasis ? cue.zh.split(cue.emphasis) : [cue.zh];
  return (
    <div
      style={{
        position: "absolute",
        top: 438,
        left: 32,
        right: 32,
        textAlign: "center",
        opacity,
        color: paper ? "#46463b" : "#e2e1dc",
        fontFamily: SERIF,
        textShadow: paper ? "0 1px 3px #ede6d2" : "0 1px 4px #000",
        zIndex: 100,
      }}
    >
      <div style={{ fontSize: 19, letterSpacing: 0.8, lineHeight: "27px" }}>
        {parts.map((p, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <span style={{ color: paper && time < 50 ? C.red : C.blue }}>
                {cue.emphasis}
              </span>
            )}
            {p}
          </React.Fragment>
        ))}
      </div>
      <div
        style={{
          fontFamily: EN,
          fontStyle: "italic",
          fontSize: 9,
          lineHeight: "13px",
          marginTop: 9,
          opacity: 0.72,
          letterSpacing: 0.03,
        }}
      >
        {cue.en}
      </div>
    </div>
  );
};
// Short attribution windows keep the narrative and subtitles unobstructed.
export const creditWindows: [number, number][] = [
  [5.5, 12.4],
  [96.2, 103.8],
  [167.6, DURATION / FPS + 1],
];
export const Credit: React.FC = () => {
  const time = useCurrentFrame() / FPS;
  const window = creditWindows.find(
    ([start, end]) => time >= start && time < end,
  );
  if (!window) return null;
  const [start, end] = window;
  const paper = time >= 92.78 && time < 105.11;
  const opacity =
    0.76 *
    ramp(time, start, start + 0.65) *
    (end > DURATION / FPS ? 1 : 1 - ramp(time, end - 0.65, end));
  return (
    <div
      style={{
        position: "absolute",
        left: 54,
        bottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 9,
        opacity,
        zIndex: 110,
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        fontSize: 10.5,
        lineHeight: "14px",
        fontWeight: 400,
        letterSpacing: 0.7,
        color: paper ? "#596267" : "#bac6d9",
      }}
    >
      <span
        style={{
          width: 1,
          height: 10,
          background: paper ? "#7d88ab" : "#879bea",
        }}
      />
      <span>本视频由GPT-6.1 Sol制作&nbsp;&nbsp; @ 晓刚开物</span>
    </div>
  );
};

export const PreviewScene: React.FC<{ index: number }> = ({ index }) => {
  const t = useCurrentFrame() / FPS;
  const Comp = scenes[index].component;
  return (
    <>
      <StablePaint />
      <Comp t={t} />
    </>
  );
};
export const Film: React.FC<{ soundtrack?: boolean }> = ({
  soundtrack = true,
}) => {
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#01040b" }}>
      <StablePaint />
      {soundtrack && <Audio src={staticFile("reference-audio.m4a")} />}
      <div
        style={{
          position: "absolute",
          width: 960,
          height: 540,
          left: 0,
          top: 0,
          scale: width / 960,
          transformOrigin: "top left",
          overflow: "hidden",
        }}
      >
        {scenes.map((s, index) => {
          const from = Math.max(0, Math.round(s.start * FPS) - 12);
          const duration = Math.min(
            DURATION - from,
            Math.round((s.end - s.start) * FPS) + 24,
          );
          return (
            <Sequence
              key={s.id}
              from={from}
              durationInFrames={duration}
              name={s.name}
            >
              <SceneLayer index={index} from={from} />
            </Sequence>
          );
        })}
        <Captions />
        <Credit />
      </div>
    </AbsoluteFill>
  );
};

export const CreditOverlay: React.FC = () => {
  const { width } = useVideoConfig();
  return (
    <>
      <StablePaint />
      <style>{`html,body{background:transparent!important}`}</style>
      <div
        style={{
          position: "absolute",
          width: 960,
          height: 540,
          left: 0,
          top: 0,
          scale: width / 960,
          transformOrigin: "top left",
        }}
      >
        <Credit />
      </div>
    </>
  );
};
