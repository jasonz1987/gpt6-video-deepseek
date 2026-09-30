import React from "react";
import { Composition, Folder } from "remotion";
import "./index.css";
import {
  DURATION,
  Film,
  FPS,
  scenes,
  PreviewScene,
  CreditOverlay,
} from "./Composition";
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Seeking"
      component={Film}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ soundtrack: true }}
    />
    <Composition
      id="CreditOverlay"
      component={CreditOverlay}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Folder name="Scenes">
      {scenes.map((s, index) => (
        <Composition
          key={s.id}
          id={s.id}
          component={PreviewScene}
          durationInFrames={Math.round((s.end - s.start) * FPS)}
          fps={FPS}
          width={960}
          height={540}
          defaultProps={{ index }}
        />
      ))}
    </Folder>
  </>
);
