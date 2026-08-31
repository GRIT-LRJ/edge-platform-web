<script setup lang="ts">
import { computed } from 'vue'

import type { ShowcaseDefinition, ShowcaseId } from '../config/showcases'

const props = defineProps<{
  definition: ShowcaseDefinition
  kind: ShowcaseId
  playing: boolean
  replayKey: number
  reducedMotion: boolean
}>()

const animationStyle = computed<Record<string, string>>(() => ({
  '--showcase-duration': `${props.definition.durationMs}ms`,
}))

const titleId = computed(() => `showcase-animation-title-${props.kind}`)
const descriptionId = computed(() => `showcase-animation-description-${props.kind}`)
</script>

<template>
  <div
    class="showcase-animation"
    :class="{ 'showcase-animation--playing': playing }"
    :data-scene="kind"
    :data-static="String(reducedMotion && !playing)"
    :style="animationStyle"
  >
    <svg
      :key="replayKey"
      class="showcase-animation__svg"
      viewBox="0 0 1000 600"
      role="img"
      :aria-labelledby="titleId"
      :aria-describedby="descriptionId"
      preserveAspectRatio="xMidYMid meet"
    >
      <title :id="titleId">{{ definition.title }}</title>
      <desc :id="descriptionId">{{ definition.description }}</desc>
      <defs>
        <linearGradient id="showcase-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#071c2c" />
          <stop offset="0.55" stop-color="#06111f" />
          <stop offset="1" stop-color="#092031" />
        </linearGradient>
        <linearGradient id="showcase-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#4fa7ff" />
          <stop offset="1" stop-color="#3ce2c5" />
        </linearGradient>
        <linearGradient id="showcase-node" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1e7694" stop-opacity="0.9" />
          <stop offset="1" stop-color="#163a76" stop-opacity="0.72" />
        </linearGradient>
        <pattern id="showcase-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="#64d9e5" stroke-opacity="0.1" />
        </pattern>
        <filter id="showcase-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id="showcase-arrow" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto">
          <path d="M0 0L0 6L9 3z" fill="#53dbc9" />
        </marker>
      </defs>

      <rect width="1000" height="600" rx="22" fill="url(#showcase-bg)" />
      <rect x="20" y="20" width="960" height="560" rx="16" fill="url(#showcase-grid)" />
      <path class="showcase-animation__ambient" d="M-20 470C220 350 350 600 580 430S830 300 1020 390" />
      <path class="showcase-animation__ambient ambient-two" d="M-20 145C200 270 360 45 590 170S820 290 1020 130" />

      <g class="showcase-animation__chrome">
        <rect x="42" y="38" width="916" height="44" rx="10" />
        <circle cx="64" cy="60" r="5" /><circle cx="82" cy="60" r="5" /><circle cx="100" cy="60" r="5" />
        <text x="126" y="65">EDGE WORKFLOW / 示例工程</text>
        <text x="840" y="65" class="showcase-animation__chrome-status">LIVE PREVIEW</text>
        <circle cx="822" cy="60" r="4" class="showcase-animation__live-dot" />
      </g>

      <g v-if="kind === 'configuration'" class="showcase-config-scene">
        <rect class="showcase-panel" x="42" y="108" width="166" height="450" rx="12" />
        <text class="showcase-panel-title" x="66" y="142">组件库</text>
        <text class="showcase-panel-subtitle" x="66" y="164">基础组件 · 设备组件</text>
        <g class="showcase-config-card card-one"><rect x="66" y="192" width="118" height="54" rx="8" /><path d="M82 219h22M93 208v22" /><text x="116" y="224">状态卡片</text></g>
        <g class="showcase-config-card card-two"><rect x="66" y="264" width="118" height="54" rx="8" /><path d="M82 301l12-18 12 10 14-16 18 20" /><text x="116" y="296">趋势图</text></g>
        <g class="showcase-config-card card-three"><rect x="66" y="336" width="118" height="54" rx="8" /><circle cx="91" cy="363" r="12" /><path d="M91 354v9l6 4" /><text x="116" y="368">实时值</text></g>

        <rect class="showcase-panel" x="228" y="108" width="500" height="450" rx="12" />
        <text class="showcase-panel-title" x="252" y="142">设备画布</text>
        <text class="showcase-panel-subtitle" x="252" y="164">设备 A01 · HMI 页面</text>
        <rect class="showcase-canvas" x="252" y="188" width="452" height="340" rx="9" />
        <path class="showcase-canvas-grid" d="M252 228h452M252 268h452M252 308h452M252 348h452M252 388h452M252 428h452M252 468h452M292 188v340M332 188v340M372 188v340M412 188v340M452 188v340M492 188v340M532 188v340M572 188v340M612 188v340M652 188v340" />
        <g class="showcase-config-node node-one"><rect x="292" y="284" width="124" height="64" rx="8" /><text x="310" y="312">设备状态</text><text x="310" y="333" class="showcase-value">在线</text></g>
        <g class="showcase-config-node node-two"><rect x="474" y="250" width="188" height="106" rx="8" /><text x="494" y="278">运行趋势</text><path d="M494 328l25-25 24 15 28-35 28 21 30-38 30 17" /></g>
        <g class="showcase-config-node node-three"><rect x="474" y="412" width="188" height="72" rx="8" /><text x="494" y="439">转速</text><text x="494" y="468" class="showcase-number">1,280<tspan> rpm</tspan></text></g>
        <path class="showcase-config-link link-one" d="M416 316C442 316 450 302 474 302" /><path class="showcase-config-link link-two" d="M568 356v56" />

        <rect class="showcase-panel" x="748" y="108" width="210" height="450" rx="12" />
        <text class="showcase-panel-title" x="772" y="142">属性面板</text><text class="showcase-panel-subtitle" x="772" y="164">数据绑定</text>
        <g class="showcase-property property-one"><text x="772" y="208">变量路径</text><rect x="772" y="220" width="162" height="34" rx="6" /><text x="784" y="242" class="showcase-code">$mdl.status</text></g>
        <g class="showcase-property property-two"><text x="772" y="292">刷新周期</text><rect x="772" y="304" width="162" height="34" rx="6" /><text x="784" y="326" class="showcase-code">1000 ms</text></g>
        <g class="showcase-preview"><rect x="772" y="398" width="162" height="94" rx="8" /><circle cx="802" cy="438" r="16" /><path d="M802 427v12l7 5" /><text x="828" y="441">运行预览</text><text x="828" y="461" class="showcase-value">已连接</text></g>
      </g>

      <g v-else-if="kind === 'monitoring'" class="showcase-monitoring-scene">
        <rect class="showcase-panel" x="42" y="108" width="236" height="450" rx="12" /><text class="showcase-panel-title" x="66" y="142">设备状态</text><text class="showcase-panel-subtitle" x="66" y="164">示例工程 · 运行总览</text>
        <g class="showcase-device-row row-one"><circle cx="73" cy="210" r="7" /><text x="94" y="215">设备 A01</text><text x="222" y="215" class="showcase-value">在线</text><path d="M66 234h188" /></g>
        <g class="showcase-device-row row-two"><circle cx="73" cy="274" r="7" /><text x="94" y="279">设备 A02</text><text x="222" y="279" class="showcase-value">在线</text><path d="M66 298h188" /></g>
        <g class="showcase-device-row row-three"><circle cx="73" cy="338" r="7" /><text x="94" y="343">设备 B01</text><text x="222" y="343" class="showcase-muted">待机</text><path d="M66 362h188" /></g>
        <g class="showcase-device-row row-four"><circle cx="73" cy="402" r="7" /><text x="94" y="407">设备 B02</text><text x="222" y="407" class="showcase-value">在线</text></g>
        <g class="showcase-summary"><text x="66" y="478">在线率</text><text x="66" y="526" class="showcase-number">75<tspan>%</tspan></text><path d="M166 520h82M166 520l16-18 18 12 24-22 24 15" /></g>

        <rect class="showcase-panel" x="298" y="108" width="660" height="220" rx="12" /><text class="showcase-panel-title" x="324" y="142">实时指标</text><text class="showcase-panel-subtitle" x="324" y="164">设备 A01 · 最近 30 分钟</text>
        <g class="showcase-metric metric-one"><rect x="324" y="188" width="166" height="110" rx="8" /><text x="344" y="216">转速</text><text x="344" y="258" class="showcase-number">1,280</text><text x="344" y="280" class="showcase-muted">rpm</text></g>
        <g class="showcase-metric metric-two"><rect x="506" y="188" width="166" height="110" rx="8" /><text x="526" y="216">温度</text><text x="526" y="258" class="showcase-number">42.8</text><text x="526" y="280" class="showcase-muted">°C</text></g>
        <g class="showcase-metric metric-three"><rect x="688" y="188" width="244" height="110" rx="8" /><text x="708" y="216">负载趋势</text><path class="showcase-sparkline" d="M708 270l26-25 23 17 28-32 26 22 29-40 31 26 30-17" /></g>
        <rect class="showcase-panel" x="298" y="352" width="386" height="206" rx="12" /><text class="showcase-panel-title" x="324" y="386">参数趋势</text><path class="showcase-axis" d="M324 526h330M324 424v102" /><path class="showcase-chart-line chart-one" d="M324 500c34-22 58-8 84-42s52 20 78-14 52 21 80-28 56 8 88-34" /><path class="showcase-chart-line chart-two" d="M324 518c34-10 58 4 84-23s52 10 78-15 52 8 80-27 56 10 88-18" />
        <g class="showcase-alarm"><rect class="showcase-panel" x="710" y="352" width="248" height="206" rx="12" /><text class="showcase-panel-title" x="736" y="386">事件与视频</text><rect class="showcase-alarm-row" x="736" y="412" width="196" height="48" rx="7" /><circle cx="756" cy="436" r="7" /><text x="774" y="433">通道 01 波动</text><text x="774" y="450" class="showcase-muted">刚刚</text><rect class="showcase-video" x="736" y="480" width="196" height="58" rx="7" /><path d="M818 493l20 13-20 13z" /><text x="850" y="510">现场视频</text></g>
      </g>

      <g v-else class="showcase-integration-scene">
        <text class="showcase-kicker" x="58" y="142">OPEN PLATFORM GRAPH</text><text class="showcase-heading" x="58" y="176">从设备数据到应用交付</text><text class="showcase-subtitle" x="58" y="202">驱动、模型、接口和运行应用在同一条链路上协同</text>
        <g class="showcase-integration-links"><path class="integration-link path-one" d="M216 334C286 334 304 288 370 288" marker-end="url(#showcase-arrow)" /><path class="integration-link path-two" d="M516 288C578 288 598 334 660 334" marker-end="url(#showcase-arrow)" /><path class="integration-link path-three" d="M806 334C868 334 876 288 944 288" marker-end="url(#showcase-arrow)" /><path class="integration-link path-four" d="M216 456C286 456 304 504 370 504" marker-end="url(#showcase-arrow)" /><path class="integration-link path-five" d="M516 504C578 504 598 456 660 456" marker-end="url(#showcase-arrow)" /><path class="integration-link path-six" d="M806 456C868 456 876 504 944 504" marker-end="url(#showcase-arrow)" /></g>
        <g class="showcase-integration-pulses"><circle class="integration-pulse pulse-one" cx="264" cy="322" r="5" /><circle class="integration-pulse pulse-two" cx="558" cy="300" r="5" /><circle class="integration-pulse pulse-three" cx="838" cy="322" r="5" /><circle class="integration-pulse pulse-four" cx="264" cy="468" r="5" /><circle class="integration-pulse pulse-five" cx="558" cy="492" r="5" /><circle class="integration-pulse pulse-six" cx="838" cy="468" r="5" /></g>
        <g class="integration-node integration-device"><rect x="58" y="286" width="158" height="96" rx="12" /><circle cx="86" cy="320" r="12" /><path d="M86 312v16M78 320h16" /><text x="110" y="325">设备 / 驱动</text><text x="78" y="356" class="showcase-muted">Device adapter</text></g>
        <g class="integration-node integration-model"><rect x="370" y="240" width="146" height="96" rx="12" /><path d="M398 284h90M408 266l-10 18 10 18M478 266l10 18-10 18" /><text x="400" y="314">数据模型</text></g>
        <g class="integration-node integration-tags"><rect x="660" y="286" width="146" height="96" rx="12" /><circle cx="688" cy="320" r="11" /><path d="M688 309v22M677 320h22" /><text x="712" y="325">标签 / 数据集</text></g>
        <g class="integration-node integration-api"><rect x="944" y="240" width="58" height="96" rx="12" /><path d="M960 270h28v24h-28zM965 264h18" /><text x="958" y="315">API</text></g>
        <g class="integration-node integration-adapter"><rect x="370" y="456" width="146" height="96" rx="12" /><path d="M398 500h90M408 482l-10 18 10 18M478 482l10 18-10 18" /><text x="395" y="530">适配器</text></g>
        <g class="integration-node integration-hmi"><rect x="660" y="410" width="146" height="96" rx="12" /><rect x="684" y="436" width="44" height="30" rx="4" /><path d="M736 436v30M684 474h64" /><text x="740" y="454">HMI</text><text x="684" y="492" class="showcase-muted">运行应用</text></g>
        <g class="integration-node integration-runtime"><rect x="944" y="456" width="58" height="96" rx="12" /><circle cx="973" cy="492" r="18" /><path d="M966 492l5 5 10-12" /><text x="953" y="535">已交付</text></g>
        <g class="showcase-integration-footer"><rect x="58" y="224" width="210" height="34" rx="17" /><circle cx="78" cy="241" r="5" /><text x="94" y="246">SDK · API · 组件注册</text></g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.showcase-animation {
  --showcase-duration: 18000ms;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgb(102 217 227 / 30%);
  border-radius: 1.2rem;
  background: #06121e;
  box-shadow: 0 2rem 4rem rgb(0 0 0 / 28%), inset 0 0 3rem rgb(35 177 207 / 8%);
}

.showcase-animation__svg {
  width: 100%;
  height: 100%;
  display: block;
}

.showcase-animation__ambient {
  fill: none;
  stroke: #33d8c4;
  stroke-width: 1;
  opacity: 0.14;
  stroke-dasharray: 16 20;
  animation: showcase-ambient var(--showcase-duration) linear infinite;
  animation-play-state: paused;
}

.showcase-animation__ambient.ambient-two {
  stroke: #4da2ff;
  animation-direction: reverse;
}

.showcase-animation--playing .showcase-animation__svg * {
  animation-play-state: running;
}

.showcase-animation__chrome > rect,
.showcase-panel {
  fill: rgb(8 30 45 / 88%);
  stroke: rgb(111 220 229 / 26%);
  stroke-width: 1;
}

.showcase-animation__chrome circle:not(.showcase-animation__live-dot) {
  fill: #2bd1c0;
  opacity: 0.74;
}

.showcase-animation__chrome circle:nth-of-type(2) { fill: #4e9eff; }
.showcase-animation__chrome circle:nth-of-type(3) { fill: #f0b868; }

.showcase-animation__chrome text,
.showcase-panel-title,
.showcase-panel-subtitle,
.showcase-config-card text,
.showcase-property text,
.showcase-preview text,
.showcase-metric text,
.showcase-device-row text,
.showcase-summary text,
.showcase-alarm text {
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
}

.showcase-animation__chrome text {
  fill: rgb(217 246 251 / 74%);
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.1em;
}

.showcase-animation__chrome-status {
  fill: rgb(122 234 216 / 76%) !important;
  font-size: 9px !important;
}

.showcase-animation__live-dot {
  fill: #49e0c8;
  filter: url(#showcase-glow);
  animation: showcase-live-dot 1.8s ease-in-out infinite;
  animation-play-state: paused;
}

.showcase-panel {
  fill: rgb(8 25 39 / 78%);
}

.showcase-panel-title {
  fill: #e8f8ff;
  font-size: 16px;
  font-weight: 700;
}

.showcase-panel-subtitle {
  fill: rgb(156 193 208 / 72%);
  font-size: 11px;
}

.showcase-config-card rect,
.showcase-property rect,
.showcase-preview rect,
.showcase-metric rect,
.showcase-video,
.showcase-alarm-row {
  fill: rgb(11 43 60 / 74%);
  stroke: rgb(96 213 221 / 30%);
  stroke-width: 1;
}

.showcase-config-card text,
.showcase-property text,
.showcase-preview text,
.showcase-metric text,
.showcase-device-row text,
.showcase-summary text,
.showcase-alarm text {
  fill: rgb(219 243 249 / 78%);
  font-size: 11px;
}

.showcase-config-card path,
.showcase-config-card circle,
.showcase-preview path,
.showcase-device-row circle,
.showcase-video path {
  fill: none;
  stroke: #55decf;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.showcase-config-card,
.showcase-config-node,
.showcase-property,
.showcase-preview,
.showcase-device-row,
.showcase-metric,
.showcase-summary,
.showcase-alarm,
.integration-node,
.showcase-integration-footer {
  transform-box: fill-box;
  transform-origin: center;
}

.showcase-config-card {
  animation: showcase-config-card var(--showcase-duration) ease-in-out infinite;
  animation-play-state: paused;
}

.card-two { animation-name: showcase-config-card-two; }
.card-three { animation-name: showcase-config-card-three; }

.showcase-canvas {
  fill: rgb(4 19 31 / 78%);
  stroke: rgb(83 210 223 / 32%);
}

.showcase-canvas-grid {
  fill: none;
  stroke: rgb(81 193 216 / 12%);
  stroke-width: 1;
}

.showcase-config-node {
  opacity: 0;
  animation: showcase-node-reveal var(--showcase-duration) ease-in-out infinite;
  animation-play-state: paused;
}

.node-two { animation-delay: 2s; }
.node-three { animation-delay: 3.5s; }

.showcase-config-node rect {
  fill: url(#showcase-node);
  stroke: rgb(91 226 211 / 70%);
}

.showcase-config-node path {
  fill: none;
  stroke: #51ddcb;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.showcase-value { fill: #54dfcc !important; font-weight: 700; }
.showcase-muted { fill: rgb(158 192 204 / 64%) !important; }
.showcase-number { fill: #edfaff !important; font-size: 24px !important; font-weight: 720; }
.showcase-number tspan { fill: rgb(154 203 214 / 68%); font-size: 11px; font-weight: 500; }

.showcase-config-link {
  fill: none;
  stroke: url(#showcase-accent);
  stroke-width: 2;
  stroke-dasharray: 6 9;
  opacity: 0;
  animation: showcase-link-draw var(--showcase-duration) ease-in-out infinite;
  animation-play-state: paused;
}

.link-two { animation-delay: 1s; }

.showcase-property {
  opacity: 0;
  animation: showcase-property-in var(--showcase-duration) ease-in-out infinite;
  animation-play-state: paused;
}

.property-two { animation-delay: 1.2s; }

.showcase-code {
  fill: #68c9ff !important;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace !important;
  font-size: 10px !important;
}

.showcase-preview {
  opacity: 0;
  animation: showcase-preview-in var(--showcase-duration) ease-in-out infinite;
  animation-play-state: paused;
}

.showcase-preview circle {
  fill: none;
  stroke: #51ddcb;
  stroke-width: 2;
}

.showcase-device-row {
  opacity: 0;
  animation: showcase-device-in var(--showcase-duration) ease-in-out infinite;
  animation-play-state: paused;
}

.row-two { animation-delay: 0.8s; }
.row-three { animation-delay: 1.6s; }
.row-four { animation-delay: 2.4s; }

.showcase-device-row circle { fill: #4ce0c9; stroke: #4ce0c9; filter: url(#showcase-glow); }
.row-three circle { fill: #d6a65c; stroke: #d6a65c; }
.showcase-device-row path { fill: none; stroke: rgb(111 190 211 / 20%); }

.showcase-summary,
.showcase-metric,
.showcase-alarm {
  opacity: 0;
  animation: showcase-fade-up var(--showcase-duration) ease-in-out infinite;
  animation-play-state: paused;
}

.showcase-summary { animation-name: showcase-summary-in; animation-delay: 1.2s; }
.metric-two { animation-delay: 1s; }
.metric-three { animation-delay: 2s; }
.showcase-alarm { animation-name: showcase-alarm-in; animation-delay: 3s; }

.showcase-summary path,
.showcase-axis {
  fill: none;
  stroke: rgb(93 215 217 / 28%);
  stroke-width: 2;
  stroke-linecap: round;
}

.showcase-summary path:last-child { stroke: #4de1c8; }

.showcase-sparkline,
.showcase-chart-line {
  fill: none;
  stroke: #4fe1ca;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: showcase-chart-draw var(--showcase-duration) ease-in-out infinite;
  animation-play-state: paused;
}

.showcase-sparkline { stroke: #65a7ff; stroke-dasharray: 220; stroke-dashoffset: 220; }
.chart-two { stroke: #5e99f5; animation-delay: 1s; }

.showcase-alarm-row circle { fill: #f2ad5b; filter: url(#showcase-glow); }
.showcase-video { fill: rgb(4 18 29 / 82%); }
.showcase-video path { fill: #50dfca; stroke: none; }

.showcase-kicker {
  fill: #56dec9;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
}

.showcase-heading {
  fill: #eafaff;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 25px;
  font-weight: 760;
}

.showcase-subtitle {
  fill: rgb(160 198 211 / 72%);
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 12px;
}

.integration-link {
  fill: none;
  stroke: url(#showcase-accent);
  stroke-width: 2;
  stroke-dasharray: 8 10;
  opacity: 0;
  animation: showcase-integration-link var(--showcase-duration) ease-in-out infinite;
  animation-play-state: paused;
}

.path-two,
.path-five { animation-delay: 1s; }
.path-three,
.path-six { animation-delay: 2s; }

.integration-node {
  opacity: 0;
  animation: showcase-integration-node var(--showcase-duration) ease-in-out infinite;
  animation-play-state: paused;
}

.integration-model,
.integration-adapter { animation-delay: 0.8s; }
.integration-tags,
.integration-hmi { animation-delay: 1.6s; }
.integration-api,
.integration-runtime { animation-delay: 2.4s; }

.integration-node rect {
  fill: url(#showcase-node);
  stroke: rgb(95 221 211 / 62%);
  stroke-width: 1;
}

.integration-node path,
.integration-node circle {
  fill: none;
  stroke: #5ce0d1;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.integration-node text {
  fill: #e3f9fc;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 11px;
  font-weight: 650;
}

.integration-node .showcase-muted { font-size: 9px; font-weight: 450; }

.integration-pulse {
  fill: #5ee3d1;
  filter: url(#showcase-glow);
  opacity: 0;
  animation: showcase-pulse var(--showcase-duration) linear infinite;
  animation-play-state: paused;
}

.pulse-two,
.pulse-five { animation-delay: 1s; }
.pulse-three,
.pulse-six { animation-delay: 2s; }

.showcase-integration-footer {
  opacity: 0;
  animation: showcase-footer-in var(--showcase-duration) ease-in-out infinite;
  animation-play-state: paused;
}

.showcase-integration-footer rect { fill: rgb(21 86 94 / 32%); stroke: rgb(79 220 205 / 38%); }
.showcase-integration-footer circle { fill: #4fe0c9; filter: url(#showcase-glow); }
.showcase-integration-footer text { fill: rgb(209 246 247 / 82%); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10px; }

.showcase-animation[data-static="true"] .showcase-config-node,
.showcase-animation[data-static="true"] .showcase-config-link,
.showcase-animation[data-static="true"] .showcase-property,
.showcase-animation[data-static="true"] .showcase-preview,
.showcase-animation[data-static="true"] .showcase-device-row,
.showcase-animation[data-static="true"] .showcase-summary,
.showcase-animation[data-static="true"] .showcase-metric,
.showcase-animation[data-static="true"] .showcase-alarm,
.showcase-animation[data-static="true"] .integration-node,
.showcase-animation[data-static="true"] .showcase-integration-footer,
.showcase-animation[data-static="true"] .integration-link,
.showcase-animation[data-static="true"] .integration-pulse {
  opacity: 1;
  animation-play-state: paused;
}

.showcase-animation[data-static="true"] .card-one {
  opacity: .86;
  transform: translate(190px, 72px) scale(.72);
}

.showcase-animation[data-static="true"] .card-two {
  opacity: .86;
  transform: translate(230px, -18px) scale(.68);
}

.showcase-animation[data-static="true"] .card-three {
  opacity: .86;
  transform: translate(238px, 82px) scale(.68);
}

.showcase-animation[data-static="true"] .showcase-config-link,
.showcase-animation[data-static="true"] .showcase-sparkline,
.showcase-animation[data-static="true"] .showcase-chart-line {
  stroke-dashoffset: 0;
}

@keyframes showcase-ambient { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -220; } }
@keyframes showcase-live-dot { 0%, 100% { opacity: .45; transform: scale(.82); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes showcase-config-card { 0%, 8% { opacity: .62; transform: translate(0, 0); } 28%, 40% { opacity: 1; transform: translate(190px, 72px) scale(.72); } 100% { opacity: .86; transform: translate(190px, 72px) scale(.72); } }
@keyframes showcase-config-card-two { 0%, 14% { opacity: .62; transform: translate(0, 0); } 35%, 46% { opacity: 1; transform: translate(230px, -18px) scale(.68); } 100% { opacity: .86; transform: translate(230px, -18px) scale(.68); } }
@keyframes showcase-config-card-three { 0%, 20% { opacity: .62; transform: translate(0, 0); } 42%, 54% { opacity: 1; transform: translate(238px, 82px) scale(.68); } 100% { opacity: .86; transform: translate(238px, 82px) scale(.68); } }
@keyframes showcase-node-reveal { 0%, 27% { opacity: 0; transform: translateY(10px); } 42%, 100% { opacity: 1; transform: translateY(0); } }
@keyframes showcase-link-draw { 0%, 38% { opacity: 0; stroke-dashoffset: 50; } 48%, 100% { opacity: .9; stroke-dashoffset: 0; } }
@keyframes showcase-property-in { 0%, 47% { opacity: 0; transform: translateX(12px); } 58%, 100% { opacity: 1; transform: translateX(0); } }
@keyframes showcase-preview-in { 0%, 62% { opacity: 0; transform: translateY(14px); } 74%, 100% { opacity: 1; transform: translateY(0); } }
@keyframes showcase-device-in { 0%, 9% { opacity: 0; transform: translateX(-12px); } 22%, 100% { opacity: 1; transform: translateX(0); } }
@keyframes showcase-summary-in { 0%, 24% { opacity: 0; transform: translateY(10px); } 36%, 100% { opacity: 1; transform: translateY(0); } }
@keyframes showcase-fade-up { 0%, 22% { opacity: 0; transform: translateY(12px); } 36%, 100% { opacity: 1; transform: translateY(0); } }
@keyframes showcase-chart-draw { 0%, 32% { stroke-dashoffset: 420; } 58%, 100% { stroke-dashoffset: 0; } }
@keyframes showcase-alarm-in { 0%, 62% { opacity: 0; transform: translateY(14px); } 74%, 100% { opacity: 1; transform: translateY(0); } }
@keyframes showcase-integration-link { 0%, 18% { opacity: 0; stroke-dashoffset: 80; } 33%, 100% { opacity: .86; stroke-dashoffset: 0; } }
@keyframes showcase-integration-node { 0%, 22% { opacity: 0; transform: translateY(12px) scale(.92); } 36%, 100% { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes showcase-pulse { 0%, 26% { opacity: 0; transform: scale(.55); } 33%, 48% { opacity: 1; transform: scale(1); } 58%, 100% { opacity: 0; transform: scale(.55); } }
@keyframes showcase-footer-in { 0%, 46% { opacity: 0; transform: translateY(8px); } 58%, 100% { opacity: 1; transform: translateY(0); } }

@media (max-width: 44rem) {
  .showcase-animation { border-radius: .8rem; }
  .showcase-animation__ambient { display: none; }
  .showcase-animation__chrome-status { display: none; }
  .showcase-animation__svg { min-width: 0; transform: none; }
  .showcase-animation[data-scene="integration"] .showcase-integration-footer { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .showcase-animation__svg * { animation-duration: .01ms !important; }
  .showcase-animation.showcase-animation--playing .showcase-animation__svg * {
    animation-duration: var(--showcase-duration) !important;
    animation-iteration-count: infinite !important;
  }
}
</style>
