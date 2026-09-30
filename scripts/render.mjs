import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const runFile = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(
  path.join(root, "node_modules/@remotion/cli/remotion-cli.js"),
);
const { bundle } = require("@remotion/bundler");
const {
  selectComposition,
  renderStill,
  renderMedia,
  openBrowser,
  ensureBrowser,
} = require("@remotion/renderer");
const scratch =
  process.env.RECREATION_SCRATCH || path.join(root, ".render-cache");
await fs.mkdir(scratch, { recursive: true });
const mode = process.argv[2] || "stills";
const executable = process.env.REMOTION_BROWSER_EXECUTABLE;
const chromiumOptions = { gl: process.env.REMOTION_GL || "angle" };
console.log("Bundling composition");
const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  outDir: path.join(scratch, "bundle"),
  rspack: true,
});
// Disable GPU tile rasterization, while retaining hardware compositing.
// This avoids incomplete / duplicated screenshot tiles on the local Mac.
let browserExecutable = executable;
if (process.platform !== "win32") {
  const status = await ensureBrowser({
    browserExecutable: executable,
    chromeMode: "headless-shell",
  });
  if (!("path" in status))
    throw new Error("Matching browser was not available");
  const quote = (value) => "'" + value.replaceAll("'", "'\\''") + "'";
  const shim = path.join(scratch, "chrome-stable.sh");
  await fs.writeFile(
    shim,
    "#!/bin/sh\nexec " +
      quote(status.path) +
      ' --disable-gpu-rasterization --disable-accelerated-2d-canvas "$@"\n',
    { mode: 0o700 },
  );
  browserExecutable = shim;
}
const browser = await openBrowser("chrome", {
  browserExecutable,
  chromiumOptions,
  chromeMode: "headless-shell",
});
try {
  const composition = await selectComposition({
    serveUrl,
    id: "Seeking",
    puppeteerInstance: browser,
    inputProps: { soundtrack: false },
  });
  if (mode === "credit-assets") {
    const creditComposition = await selectComposition({
      serveUrl,
      id: "CreditOverlay",
      puppeteerInstance: browser,
    });
    for (const [time, name] of [
      [7, "dark"],
      [99, "paper"],
    ]) {
      await renderStill({
        serveUrl,
        composition: creditComposition,
        puppeteerInstance: browser,
        frame: time * 27,
        imageFormat: "png",
        chromiumOptions,
        output: path.join(scratch, `credit-${name}.png`),
      });
      console.log(`Saved ${name} attribution`);
    }
  } else if (mode === "stills") {
    const times = [
      11, 24, 33, 46, 57, 71, 77, 87, 103, 112, 125, 130, 137, 147, 160, 171,
    ];
    await fs.mkdir(path.join(scratch, "stills"), { recursive: true });
    for (let i = 0; i < times.length; i += 3) {
      await Promise.all(
        times.slice(i, i + 3).map(async (time) => {
          await renderStill({
            serveUrl,
            composition,
            frame: time * 27,
            scale: 0.5,
            puppeteerInstance: browser,
            imageFormat: "png",
            inputProps: { soundtrack: false },
            output: path.join(scratch, "stills", `frame-${time}.png`),
          });
          console.log(`Checked ${time}s`);
        }),
      );
    }
  } else if (mode === "fast-assets") {
    for (const [start, end, name] of [
      [1656, 2015, "neural"],
      [2016, 2276, "depth"],
    ]) {
      console.log(`Rendering corrected ${name} segment`);
      await renderMedia({
        serveUrl,
        composition,
        puppeteerInstance: browser,
        codec: "h264",
        crf: 18,
        x264Preset: "fast",
        concurrency: 4,
        chromiumOptions,
        imageFormat: "png",
        inputProps: { soundtrack: false },
        frameRange: [start, end],
        outputLocation: path.join(scratch, `${name}.mp4`),
      });
      console.log(`Saved corrected ${name}`);
    }
    const creditComposition = await selectComposition({
      serveUrl,
      id: "CreditOverlay",
      puppeteerInstance: browser,
    });
    for (const [time, name] of [
      [7, "dark"],
      [99, "paper"],
    ]) {
      await renderStill({
        serveUrl,
        composition: creditComposition,
        puppeteerInstance: browser,
        frame: time * 27,
        imageFormat: "png",
        chromiumOptions,
        output: path.join(scratch, `credit-${name}.png`),
      });
      console.log(`Saved ${name} attribution`);
    }
  } else if (mode === "qa") {
    const ranges = [
      [392, 480],
      [1115, 1160],
      [1768, 1840],
      [2700, 2750],
    ];
    for (const range of ranges) {
      console.log(`Checking interval ${range[0]}-${range[1]}`);
      let lastProgress = -1;
      await renderMedia({
        onProgress: (p) => {
          const progress = Math.floor(p.progress * 10);
          if (progress !== lastProgress) {
            lastProgress = progress;
            console.log(`QA ${Math.min(100, progress * 10)}%`);
          }
        },
        serveUrl,
        composition,
        puppeteerInstance: browser,
        codec: "h264",
        crf: 18,
        x264Preset: "fast",
        concurrency: 4,
        imageFormat: "png",
        chromiumOptions,
        scale: 1,
        inputProps: { soundtrack: false },
        frameRange: range,
        outputLocation: path.join(scratch, `qa-${range[0]}.mp4`),
      });
      console.log(`Verified interval ${range[0]}-${range[1]}`);
    }
    for (const time of [7, 99, 172]) {
      await renderStill({
        serveUrl,
        composition,
        puppeteerInstance: browser,
        frame: time * 27,
        imageFormat: "png",
        chromiumOptions,
        inputProps: { soundtrack: false },
        scale: 0.5,
        output: path.join(scratch, `credit-${time}.png`),
      });
      console.log(`Checked attribution at ${time}s`);
    }
  } else {
    const output = path.join(
      root,
      process.env.RECREATION_OUTPUT ||
        (mode === "sample" ? "sample-v2.mp4" : "deepseek-recreated-v2.mp4"),
    );
    const requestedRange =
      process.env.RECREATION_FRAME_RANGE?.split(",").map(Number);
    let last = -1;
    await renderMedia({
      serveUrl,
      composition,
      puppeteerInstance: browser,
      codec: "h264",
      outputLocation: path.join(scratch, "silent-video.mp4"),
      inputProps: { soundtrack: false },
      crf: 18,
      x264Preset: "fast",
      concurrency: 4,
      chromiumOptions,
      imageFormat: "png",
      scale: mode === "sample" ? 0.5 : 1,
      frameRange:
        requestedRange || (mode === "sample" ? [2835, 3185] : undefined),
      onProgress: (p) => {
        const n = Math.floor(p.progress * 100);
        if (n !== last) {
          last = n;
          console.log(`Render ${n}% · ${p.renderedFrames} frames`);
        }
      },
    });
    const usedRange =
      requestedRange || (mode === "sample" ? [2835, 3185] : [0, 4708]);
    await runFile("ffmpeg", [
      "-v",
      "error",
      "-y",
      "-i",
      path.join(scratch, "silent-video.mp4"),
      "-ss",
      String(usedRange[0] / 27),
      "-i",
      path.join(root, "public/reference-audio.m4a"),
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-c",
      "copy",
      "-t",
      String((usedRange[1] - usedRange[0] + 1) / 27),
      "-movflags",
      "+faststart",
      output,
    ]);
    console.log(`Saved ${output}`);
  }
} finally {
  await browser.close({ silent: true });
}
