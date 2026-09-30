# DeepSeek「求索」视频复刻

当前成片：`deepseek-recreated-v2-final.mp4`（第二版）。1920 × 1080，27 fps，4709 帧，约 2 分 54 秒。

## 这份工程包含什么

根据用户提供的参考视频，重建 15 段动画。画面由 React、SVG 和 Canvas 生成，包含水墨山景、竖排书法、算筹、割圆、航海测角、神经网络、深度层面、注意力连线、杭州塔影、MoE 鱼群、推理终端、R1 粒子、版本长河、对话窗口和鲸鱼落版。没有把参考视频画面当作成片背景播放。

**声音沿用原片混合音轨**：`public/reference-audio.m4a` 是从用户提供的视频中提取的旁白与配乐，未重新创作。中文旁白字幕按参考片重录；英文字幕为人工近似转录。镜头切点和字幕时间依据参考帧估计。

这是第二版视觉复刻。鲸鱼轮廓、鱼群运动、塔影、水墨纹理和品牌图形是近似重建，并非原作者素材或像素级还原。参考片中出现的年份与版本标注按画面复现，不代表事实核验。

## 使用

建议 Node.js 22。在工程根目录运行：

```sh
npm ci
npm run dev
```

Remotion Studio 中 `Seeking` 是完整影片；`Scenes` 文件夹中可以单独预览每个段落。

导出完整影片：

```sh
npm run render
```

默认输出 `deepseek-recreated-v2.mp4`。Remotion 在首次渲染时可能需要下载浏览器。也可以用 `REMOTION_BROWSER_EXECUTABLE` 指定本机 Chrome Headless Shell，并运行 `node scripts/render.mjs full`。脚本还支持 `stills` 和 `sample`，检查文件保存在 `.render-cache/` 中。

本机使用 macOS 的 **Songti SC / STSong** 字体。其他系统会使用衬线字体后备，排版可能不同；若希望字形一致，请使用可合法使用的同款字体。字体文件未附带。

## 修改位置

- `src/Composition.tsx`：15 段的起止时间、转场、字幕位置与完整时间线。
- `src/captions.ts`：中英文字幕和时间。
- `src/visual.tsx`：配色、纹理、粒子场、鲸鱼和公用视觉元素。
- `src/scenes/History.tsx`：屈原、算筹、割圆、杭州。
- `src/scenes/Sea.tsx`：深海、航海、MoE、R1 开放权重。
- `src/scenes/Intelligence.tsx`：网络、深度层、注意力、推理。
- `src/scenes/Journey.tsx`：版本长河与对话。
- `public/textures/`：由程序生成的纸张、竹简和山景纹理。

`npm run typecheck` 检查 TypeScript。纹理生成脚本是 `scripts/make-textures.py`，需要 Python、NumPy 和 Pillow；纹理已随工程提供，普通预览与导出无需 Python。

参考片及其音轨的权利归原权利人所有。工程用于用户要求的本地分析和复刻。

## 第二版修正

署名采用左下角小字：**本视频由GPT-6.1 Sol制作  @ 晓刚开物**，分别在 5.5–12.4 秒、96.2–103.8 秒、167.6 秒至片尾出现。编辑 `src/Composition.tsx` 中的 `creditWindows` 与 `Credit` 即可调整文字、位置和出现时间。

首版逐帧检查发现约 15.48、17.30、42.11、101.26 秒有黑帧或局部缺画面，神经网络段有重复错位的图块。第二版改用匹配的 Chrome Headless Shell，禁用 GPU 图块栅格化与加速 2D Canvas，保留硬件合成，使用 PNG 帧截图，并在 `src/StablePaint.tsx` 等待字体和两次绘制提交后才允许截帧。矩阵颜色切换也改为连续渐变。

`npm run render:qa` 渲染曾出问题的四段短片和三个署名关键帧，保存在 `.render-cache/`。

此次交付采用快速合成：复用首版中已正常渲染的镜头，替换问题片段、神经网络与矩阵片段，再叠加从 Remotion 导出的透明署名图层，统一片段颜色范围后直接合入原音轨。署名的快速合成淡入淡出使用线性渐变。

完整重渲染命令已改为先输出无声画面，再调用 FFmpeg 合入原音轨，以避免临时音频写入占用磁盘；需本机安装 FFmpeg。
