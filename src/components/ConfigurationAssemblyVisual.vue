<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import PlatformVisualChrome from './PlatformVisualChrome.vue'

defineProps<{ label: string }>()

const root = ref<HTMLElement | null>(null)
const isPlaying = ref(false)
const isStatic = ref(false)

let visibilityObserver: IntersectionObserver | undefined
let reducedMotionQuery: MediaQueryList | undefined

const projectItems = [
  { id: 'device', y: 103, label: '设备' },
  { id: 'data', y: 130, label: '数据' },
  { id: 'model', y: 157, label: '模型' },
  { id: 'alarm', y: 184, label: '报警' },
  { id: 'application', y: 211, label: '应用' },
  { id: 'flow', y: 238, label: '流程' },
] as const

const libraryItems = [
  { id: 'gauges', x: 186, label: '仪表组件' },
  { id: 'metrics', x: 300, label: '参数卡片' },
  { id: 'controls', x: 414, label: '控制组件' },
  { id: 'progress', x: 528, label: '钻进进度' },
] as const

const gauges = [
  { id: 'rotation', x: 238, label: '回转', value: '30.0', color: '#7bd934', dash: 72 },
  { id: 'impact', x: 356, label: '冲击', value: '210.0', color: '#9cecf5', dash: 118 },
  { id: 'feed', x: 474, label: '推进', value: '80.0', color: '#7bd934', dash: 92 },
] as const

const metrics = [
  { id: 'water', x: 598, label: '水量', value: '30.0' },
  { id: 'pressure', x: 638, label: '水压', value: '40.0' },
  { id: 'oil', x: 678, label: '润滑油压', value: '15.0' },
  { id: 'air', x: 718, label: '气压', value: '12.0' },
] as const

function observeVisibility() {
  visibilityObserver?.disconnect()

  if (typeof window.IntersectionObserver !== 'function') {
    isPlaying.value = true
    return
  }

  visibilityObserver = new window.IntersectionObserver(
    ([entry]) => {
      isPlaying.value = Boolean(entry?.isIntersecting)
    },
    { threshold: 0.28 },
  )

  if (root.value) {
    visibilityObserver.observe(root.value)
  }
}

function syncReducedMotion() {
  isStatic.value = Boolean(reducedMotionQuery?.matches)

  if (isStatic.value) {
    visibilityObserver?.disconnect()
    isPlaying.value = false
    return
  }

  observeVisibility()
}

onMounted(() => {
  reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  syncReducedMotion()
  if (reducedMotionQuery?.addEventListener) {
    reducedMotionQuery.addEventListener('change', syncReducedMotion)
  } else {
    reducedMotionQuery?.addListener?.(syncReducedMotion)
  }
})

onBeforeUnmount(() => {
  visibilityObserver?.disconnect()
  if (reducedMotionQuery?.removeEventListener) {
    reducedMotionQuery.removeEventListener('change', syncReducedMotion)
  } else {
    reducedMotionQuery?.removeListener?.(syncReducedMotion)
  }
})
</script>

<template>
  <div
    ref="root"
    class="configuration-assembly"
    role="img"
    :aria-label="label"
    data-home-visual="configuration-builder"
    :data-playing="String(isPlaying)"
    :data-static="String(isStatic)"
  >
    <svg viewBox="0 0 960 540" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="configuration-stage" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#252b3d" />
          <stop offset="1" stop-color="#171d2b" />
        </linearGradient>
        <linearGradient id="configuration-canvas" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#271a28" />
          <stop offset="0.52" stop-color="#3a2431" />
          <stop offset="1" stop-color="#172535" />
        </linearGradient>
        <linearGradient id="configuration-wine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#5f2439" stop-opacity="0.86" />
          <stop offset="1" stop-color="#293448" stop-opacity="0.9" />
        </linearGradient>
        <radialGradient id="configuration-gauge" cx="50%" cy="42%" r="65%">
          <stop offset="0" stop-color="#3c2835" />
          <stop offset="1" stop-color="#171c2b" />
        </radialGradient>
        <pattern id="configuration-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 H 0 V 16" fill="none" stroke="#71809b" stroke-opacity="0.1" stroke-width="0.7" />
        </pattern>
        <filter id="configuration-cyan-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="configuration-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#050916" flood-opacity="0.5" />
        </filter>
      </defs>

      <rect width="960" height="540" rx="18" fill="url(#configuration-stage)" />

      <g data-platform-body="true" transform="translate(0 -12)">
      <g class="configuration-assembly__project" data-platform-region="project-tree">
        <rect x="0" y="44" width="126" height="490" />
        <text class="configuration-assembly__panel-title" x="14" y="68">工程目录</text>
        <path class="configuration-assembly__panel-close" d="M 112 57 L 120 65 M 120 57 L 112 65" />
        <g v-for="item in projectItems" :key="item.id" :transform="`translate(0 ${item.y})`">
          <circle cx="18" cy="0" r="4.5" />
          <path d="M 15 0 H 21 M 18 -3 V 3" />
          <text x="31" y="4">{{ item.label }}</text>
        </g>
        <rect class="configuration-assembly__project-active" x="8" y="198" width="110" height="26" rx="3" />
      </g>

      <g class="configuration-assembly__work-tabs" data-platform-region="editor-tabs">
        <rect x="126" y="44" width="688" height="27" />
        <g transform="translate(142 44)"><text x="20" y="18">设置</text><path d="M 4 12 H 12 M 8 8 V 16" /></g>
        <g transform="translate(220 44)"><text x="20" y="18">数据</text><circle cx="8" cy="12" r="4" /></g>
        <g class="configuration-assembly__tab-active" transform="translate(298 44)">
          <rect width="92" height="27" />
          <text x="17" y="18">share *</text>
        </g>
      </g>

      <g class="configuration-assembly__toolbar" data-platform-region="toolbar">
        <rect x="126" y="71" width="688" height="27" />
        <g v-for="index in 15" :key="index" :transform="`translate(${142 + (index - 1) * 29} 78)`">
          <rect width="11" height="11" rx="1.5" />
          <path d="M 3 5.5 H 8 M 5.5 3 V 8" />
        </g>
      </g>

      <g class="configuration-assembly__properties" data-platform-region="properties">
        <rect x="814" y="44" width="146" height="490" />
        <rect class="configuration-assembly__properties-tab" x="814" y="44" width="72" height="27" />
        <text class="configuration-assembly__panel-title" x="838" y="62">属性</text>
        <text x="833" y="92">钻孔监测</text>
        <text class="configuration-assembly__property-heading" x="829" y="120">基本信息</text>
        <text x="829" y="145">名称</text>
        <rect x="858" y="132" width="88" height="21" rx="2" />
        <text x="865" y="146">钻孔监测</text>
        <text x="829" y="174">尺寸</text>
        <rect x="858" y="160" width="88" height="21" rx="2" />
        <text x="865" y="174">1920 × 1080</text>
        <text class="configuration-assembly__property-heading" x="829" y="207">样式</text>
        <text x="829" y="233">背景</text>
        <rect class="configuration-assembly__color-chip" x="858" y="218" width="20" height="20" rx="2" />
        <rect x="884" y="218" width="62" height="20" rx="2" />
        <text x="890" y="232">#231923</text>
        <text class="configuration-assembly__property-heading" x="829" y="270">数据绑定</text>
        <rect x="829" y="282" width="117" height="24" rx="3" />
        <text x="838" y="298">设备 / 钻机01</text>
        <path class="configuration-assembly__property-lines" d="M 829 326 H 943 M 829 345 H 919 M 829 364 H 934 M 829 383 H 907" />
      </g>

      <g class="configuration-assembly__canvas-frame" data-platform-region="canvas">
        <rect x="126" y="98" width="688" height="308" />
        <rect x="148" y="108" width="644" height="292" rx="3" />
        <rect x="148" y="108" width="644" height="292" rx="3" fill="url(#configuration-grid)" />
        <rect class="configuration-assembly__selection-label" x="148" y="98" width="138" height="18" rx="3" />
        <text class="configuration-assembly__selection-text" x="157" y="111">06 钻孔监测 · 1920 × 1080</text>
        <g filter="url(#configuration-soft-shadow)">
          <rect class="configuration-assembly__dashboard" x="160" y="120" width="620" height="266" rx="5" />
          <rect class="configuration-assembly__dashboard-header" x="166" y="126" width="608" height="29" rx="4" />
          <text class="configuration-assembly__dashboard-muted" x="180" y="144">未登录</text>
          <text class="configuration-assembly__dashboard-step" x="336" y="144">正在执行的动作</text>
          <circle class="configuration-assembly__ok-dot" cx="610" cy="140" r="5" />
          <text class="configuration-assembly__dashboard-muted" x="622" y="144">当前无报警</text>
          <text class="configuration-assembly__dashboard-time" x="744" y="143">16:52:14</text>
        </g>

        <g class="configuration-assembly__empty-state">
          <rect x="270" y="205" width="400" height="105" rx="7" />
          <path d="M 454 241 H 486 M 470 225 V 257" />
          <text x="470" y="282">从下方组件库拖入画布</text>
        </g>

        <g data-configuration-result="complete">
          <g
            class="configuration-assembly__widget configuration-assembly__widget--gauges"
            data-configuration-widget="gauges"
          >
            <rect x="170" y="164" width="388" height="149" rx="5" />
            <g v-for="gauge in gauges" :key="gauge.id" data-configuration-gauge="true">
              <circle :cx="gauge.x" cy="222" r="47" class="configuration-assembly__gauge-face" />
              <circle :cx="gauge.x" cy="222" r="36" class="configuration-assembly__gauge-track" />
              <circle
                :cx="gauge.x"
                cy="222"
                r="36"
                class="configuration-assembly__gauge-value"
                :style="{ '--gauge-color': gauge.color, '--gauge-dash': String(gauge.dash) }"
              />
              <path :d="`M ${gauge.x} 222 L ${gauge.x + 20} 207`" class="configuration-assembly__gauge-needle" />
              <circle :cx="gauge.x" cy="222" r="3.8" class="configuration-assembly__gauge-hub" />
              <text :x="gauge.x" y="241" class="configuration-assembly__gauge-number">{{ gauge.value }}</text>
              <text :x="gauge.x" y="261" class="configuration-assembly__gauge-label">{{ gauge.label }}</text>
            </g>
          </g>

          <g
            class="configuration-assembly__widget configuration-assembly__widget--metrics"
            data-configuration-widget="metrics"
          >
            <rect x="568" y="164" width="202" height="69" rx="5" />
            <g v-for="metric in metrics" :key="metric.id">
              <text :x="metric.x" y="179" class="configuration-assembly__metric-label">{{ metric.label }}</text>
              <circle :cx="metric.x" cy="202" r="15" class="configuration-assembly__metric-ring" />
              <text :x="metric.x" y="205" class="configuration-assembly__metric-value">{{ metric.value }}</text>
            </g>
          </g>

          <g
            class="configuration-assembly__widget configuration-assembly__widget--controls"
            data-configuration-widget="controls"
          >
            <rect x="568" y="240" width="202" height="73" rx="5" />
            <text x="580" y="257" class="configuration-assembly__control-title">钻头选择</text>
            <rect x="580" y="265" width="52" height="33" rx="4" />
            <rect x="638" y="265" width="52" height="33" rx="4" />
            <rect class="configuration-assembly__control-active" x="696" y="265" width="62" height="33" rx="4" />
            <path d="M 598 275 L 608 281 L 598 287 Z" class="configuration-assembly__play-icon" />
            <text x="606" y="306">自动打孔</text>
            <text x="664" y="286">暂停</text>
            <text x="727" y="286">切换视图</text>
          </g>

          <g
            class="configuration-assembly__widget configuration-assembly__widget--progress"
            data-configuration-widget="progress"
          >
            <rect x="170" y="320" width="600" height="55" rx="5" />
            <path class="configuration-assembly__drill" d="M 184 340 H 232 L 245 348 H 184 Z M 190 335 H 226 V 340 H 190 Z M 245 348 H 260" />
            <rect class="configuration-assembly__progress-track" x="262" y="344" width="478" height="9" rx="4.5" />
            <rect class="configuration-assembly__progress-value" x="262" y="344" width="292" height="9" rx="4.5" />
            <circle class="configuration-assembly__progress-head" cx="554" cy="348.5" r="5" />
            <text x="452" y="338" class="configuration-assembly__progress-number">2.30 m</text>
            <text x="262" y="367" class="configuration-assembly__progress-label">M8</text>
            <text x="730" y="367" class="configuration-assembly__progress-label">M1</text>
          </g>

          <rect class="configuration-assembly__complete-outline" x="160" y="120" width="620" height="266" rx="5" />
        </g>

        <rect class="configuration-assembly__target configuration-assembly__target--gauges" x="170" y="164" width="388" height="149" rx="5" />
        <rect class="configuration-assembly__target configuration-assembly__target--metrics" x="568" y="164" width="202" height="69" rx="5" />
        <rect class="configuration-assembly__target configuration-assembly__target--controls" x="568" y="240" width="202" height="73" rx="5" />
        <rect class="configuration-assembly__target configuration-assembly__target--progress" x="170" y="320" width="600" height="55" rx="5" />
      </g>

      <g class="configuration-assembly__library" data-platform-region="component-library">
        <rect x="126" y="406" width="688" height="132" />
        <rect class="configuration-assembly__library-tabs" x="126" y="406" width="688" height="28" />
        <text x="151" y="424">基础图形</text>
        <text x="226" y="424">图表图形</text>
        <text class="configuration-assembly__library-active-label" x="302" y="424">高级控件</text>
        <text x="382" y="424">VUE组件</text>
        <text x="456" y="424">钻井业务</text>
        <path class="configuration-assembly__library-active-line" d="M 288 432 H 360" />
        <g
          v-for="item in libraryItems"
          :key="item.id"
          class="configuration-assembly__source"
          :transform="`translate(${item.x} 446)`"
          :data-configuration-source="item.id"
        >
          <rect width="86" height="50" rx="4" />
          <circle cx="43" cy="18" r="10" />
          <path d="M 36 18 H 50 M 43 11 V 25" />
          <text x="43" y="42">{{ item.label }}</text>
        </g>
        <rect class="configuration-assembly__library-search" x="666" y="412" width="134" height="17" rx="3" />
        <text class="configuration-assembly__library-search-text" x="680" y="424">搜索组件...</text>
      </g>

      <g
        v-for="item in libraryItems"
        :key="`drag-${item.id}`"
        class="configuration-assembly__drag"
        :class="`configuration-assembly__drag--${item.id}`"
        :data-configuration-drag="item.id"
      >
        <rect width="88" height="38" rx="5" />
        <circle cx="14" cy="19" r="7" />
        <path d="M 10 19 H 18 M 14 15 V 23" />
        <text x="51" y="23">{{ item.label }}</text>
        <path class="configuration-assembly__cursor" d="M 91 31 L 91 50 L 97 44 L 102 54 L 107 51 L 102 42 L 111 41 Z" />
      </g>
      </g>

      <PlatformVisualChrome />
    </svg>
  </div>
</template>

<style scoped>
.configuration-assembly {
  --configuration-duration: 10s;
  --configuration-play-state: paused;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: var(--drillmind-stage, #202638);
}

.configuration-assembly[data-playing='true'] {
  --configuration-play-state: running;
}

.configuration-assembly svg {
  display: block;
  width: 100%;
  height: 100%;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  shape-rendering: geometricPrecision;
  text-rendering: geometricPrecision;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
}

.configuration-assembly__project > rect:first-child,
.configuration-assembly__properties > rect:first-child,
.configuration-assembly__library > rect:first-child { fill: var(--drillmind-panel, #3d465f); stroke: var(--drillmind-line, #56617b); stroke-width: 0.6; }
.configuration-assembly__project text,
.configuration-assembly__properties text,
.configuration-assembly__library text { fill: #dce3ee; font-size: 8px; }
.configuration-assembly__project circle { fill: none; stroke: #9eabc1; stroke-width: 0.9; }
.configuration-assembly__project path { fill: none; stroke: #9eabc1; stroke-width: 0.8; }
.configuration-assembly__panel-title { fill: #f4f7fb !important; font-size: 10px !important; font-weight: 750; }
.configuration-assembly__panel-close { fill: none; stroke: #8894aa; stroke-width: 1; }
.configuration-assembly__project-active { fill: #343c52; opacity: 0.7; }

.configuration-assembly__work-tabs > rect,
.configuration-assembly__toolbar > rect { fill: var(--drillmind-toolbar, #424b65); stroke: var(--drillmind-line, #56617b); stroke-width: 0.6; }
.configuration-assembly__work-tabs text { fill: #e2e8f2; font-size: 8.5px; font-weight: 650; }
.configuration-assembly__work-tabs path,
.configuration-assembly__work-tabs circle,
.configuration-assembly__toolbar g rect,
.configuration-assembly__toolbar g path { fill: none; stroke: #9ba7bd; stroke-width: 0.8; }
.configuration-assembly__tab-active rect { fill: #5d6478; stroke: none; }
.configuration-assembly__tab-active text { fill: #fff; }
.configuration-assembly__tab-active::after { stroke: #efbd36; }
.configuration-assembly__toolbar g:nth-child(6) rect,
.configuration-assembly__toolbar g:nth-child(6) path { stroke: #9a75dd; }

.configuration-assembly__properties-tab { fill: #596176; stroke: none; }
.configuration-assembly__properties > rect:not(:first-child):not(.configuration-assembly__properties-tab):not(.configuration-assembly__color-chip) { fill: #323a51; stroke: #62708a; stroke-width: 0.7; }
.configuration-assembly__properties > text { fill: #d8e0ec; font-size: 7px; }
.configuration-assembly__property-heading { fill: #eef3fa !important; font-size: 8px !important; font-weight: 700; }
.configuration-assembly__color-chip { fill: #211923; stroke: #8c5570; stroke-width: 0.7; }
.configuration-assembly__property-lines { fill: none; stroke: #67738c; stroke-width: 1; stroke-dasharray: 24 7; }

.configuration-assembly__canvas-frame > rect:first-child { fill: #171d2a; }
.configuration-assembly__canvas-frame > rect:nth-child(2) { fill: #202738; stroke: #258ce0; stroke-width: 1.2; }
.configuration-assembly__selection-label { fill: #258ce0; }
.configuration-assembly__selection-text { fill: #f6fbff; font-size: 7.4px; font-weight: 700; }
.configuration-assembly__dashboard { fill: url(#configuration-canvas); stroke: #415269; stroke-width: 0.8; }
.configuration-assembly__dashboard-header { fill: url(#configuration-wine); stroke: #6b3449; stroke-width: 0.6; }
.configuration-assembly__dashboard-muted { fill: #aab5c7; font-size: 6px; }
.configuration-assembly__dashboard-step { fill: #7de18c; font-size: 7px; font-weight: 700; text-anchor: middle; }
.configuration-assembly__ok-dot { fill: #66d53d; }
.configuration-assembly__dashboard-time { fill: #f1f5fb; font-size: 7px; text-anchor: end; }

.configuration-assembly__empty-state {
  animation: configuration-empty var(--configuration-duration) linear infinite;
  animation-play-state: var(--configuration-play-state);
}
.configuration-assembly__empty-state rect { fill: #20293a; fill-opacity: 0.76; stroke: #687792; stroke-width: 1; stroke-dasharray: 5 4; }
.configuration-assembly__empty-state path { fill: none; stroke: #66d7ed; stroke-width: 1.6; stroke-linecap: round; }
.configuration-assembly__empty-state text { fill: #9eacc0; font-size: 8px; text-anchor: middle; }

.configuration-assembly__widget {
  opacity: 0;
  animation-duration: var(--configuration-duration);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: var(--configuration-play-state);
}
.configuration-assembly__widget > rect:first-child { fill: rgb(24 31 45 / 88%); stroke: #5a657d; stroke-width: 0.7; }
.configuration-assembly__widget--gauges { animation-name: configuration-widget-gauges; }
.configuration-assembly__widget--metrics { animation-name: configuration-widget-metrics; }
.configuration-assembly__widget--controls { animation-name: configuration-widget-controls; }
.configuration-assembly__widget--progress { animation-name: configuration-widget-progress; }
.configuration-assembly__gauge-face { fill: url(#configuration-gauge); stroke: #3d465d; stroke-width: 1; }
.configuration-assembly__gauge-track,
.configuration-assembly__gauge-value { fill: none; stroke-width: 6; stroke-linecap: round; transform-box: fill-box; transform-origin: center; transform: rotate(132deg); }
.configuration-assembly__gauge-track { stroke: #626779; stroke-dasharray: 150 80; }
.configuration-assembly__gauge-value { stroke: var(--gauge-color); stroke-dasharray: var(--gauge-dash) 226; filter: url(#configuration-cyan-glow); }
.configuration-assembly__gauge-needle { fill: none; stroke: #dbeef3; stroke-width: 1.3; }
.configuration-assembly__gauge-hub { fill: #8fe8eb; stroke: #0d131e; stroke-width: 2; }
.configuration-assembly__gauge-number { fill: #f5f7fb; font-size: 9px; text-anchor: middle; }
.configuration-assembly__gauge-label { fill: #d5dce8; font-size: 10px; font-weight: 700; text-anchor: middle; }
.configuration-assembly__metric-label { fill: #c7d0df; font-size: 5.6px; text-anchor: middle; }
.configuration-assembly__metric-ring { fill: #152634; stroke: #68bbcf; stroke-width: 1.2; }
.configuration-assembly__metric-value { fill: #f0f8fb; font-size: 5.8px; text-anchor: middle; }
.configuration-assembly__widget--controls text { fill: #dce4ef; font-size: 5.5px; text-anchor: middle; }
.configuration-assembly__control-title { font-size: 7px !important; font-weight: 700; text-anchor: start !important; }
.configuration-assembly__widget--controls rect:not(:first-child) { fill: #182b3a; stroke: #426278; stroke-width: 0.8; }
.configuration-assembly__widget--controls .configuration-assembly__control-active { fill: #3b161d; stroke: #b7545c; }
.configuration-assembly__play-icon { fill: #e6edf6; }
.configuration-assembly__drill { fill: none; stroke: #95a6b8; stroke-width: 1.4; }
.configuration-assembly__progress-track { fill: #5a4054; }
.configuration-assembly__progress-value { fill: url(#configuration-wine); }
.configuration-assembly__progress-head { fill: #82dfea; filter: url(#configuration-cyan-glow); }
.configuration-assembly__progress-number { fill: #e8eef6; font-size: 7px; text-anchor: middle; }
.configuration-assembly__progress-label { fill: #8f9cb0; font-size: 5.5px; }
.configuration-assembly__complete-outline { fill: none; stroke: #69dbea; stroke-width: 1.2; opacity: 0; filter: url(#configuration-cyan-glow); animation: configuration-complete var(--configuration-duration) linear infinite; animation-play-state: var(--configuration-play-state); }

.configuration-assembly__target { fill: #5eddeb; fill-opacity: 0.04; stroke: #73e3ee; stroke-width: 1.2; stroke-dasharray: 6 4; opacity: 0; filter: url(#configuration-cyan-glow); animation-duration: var(--configuration-duration); animation-timing-function: linear; animation-iteration-count: infinite; animation-play-state: var(--configuration-play-state); }
.configuration-assembly__target--gauges { animation-name: configuration-target-gauges; }
.configuration-assembly__target--metrics { animation-name: configuration-target-metrics; }
.configuration-assembly__target--controls { animation-name: configuration-target-controls; }
.configuration-assembly__target--progress { animation-name: configuration-target-progress; }

.configuration-assembly__library-tabs { fill: #343d54; stroke: #56617b; stroke-width: 0.6; }
.configuration-assembly__library-active-label { fill: #f6f8fb !important; font-weight: 700; }
.configuration-assembly__library-active-line { fill: none; stroke: #f0bd35; stroke-width: 2; }
.configuration-assembly__source rect { fill: #374158; stroke: #596780; stroke-width: 0.7; }
.configuration-assembly__source circle { fill: none; stroke: #a9b6c8; stroke-width: 1.2; }
.configuration-assembly__source path { fill: none; stroke: #a9b6c8; stroke-width: 1; }
.configuration-assembly__source text { fill: #d8e0eb; font-size: 6.5px; font-weight: 650; text-anchor: middle; }
.configuration-assembly__library-search { fill: #30384d; stroke: #61708b; stroke-width: 0.7; }
.configuration-assembly__library-search-text { fill: #8794aa !important; font-size: 6px !important; }

.configuration-assembly__drag { opacity: 0; animation-duration: var(--configuration-duration); animation-timing-function: cubic-bezier(0.42, 0, 0.22, 1); animation-iteration-count: infinite; animation-play-state: var(--configuration-play-state); filter: url(#configuration-soft-shadow); }
.configuration-assembly__drag > rect { fill: #24384a; fill-opacity: 0.88; stroke: #72dfed; stroke-width: 1.25; stroke-dasharray: 5 3; }
.configuration-assembly__drag > circle { fill: #19303e; stroke: #79e5ee; stroke-width: 1; }
.configuration-assembly__drag > path:not(.configuration-assembly__cursor) { fill: none; stroke: #91eef3; stroke-width: 1; }
.configuration-assembly__drag > text { fill: #f0fbff; font-size: 7px; font-weight: 700; text-anchor: middle; }
.configuration-assembly__cursor { fill: #f7fbff; stroke: #101725; stroke-width: 1; }
.configuration-assembly__drag--gauges { animation-name: configuration-drag-gauges; }
.configuration-assembly__drag--metrics { animation-name: configuration-drag-metrics; }
.configuration-assembly__drag--controls { animation-name: configuration-drag-controls; }
.configuration-assembly__drag--progress { animation-name: configuration-drag-progress; }

@keyframes configuration-empty { 0%, 8% { opacity: 1; } 12%, 92% { opacity: 0; } 96%, 100% { opacity: 1; } }
@keyframes configuration-widget-gauges { 0%, 20% { opacity: 0; } 22%, 92% { opacity: 1; } 96%, 100% { opacity: 0; } }
@keyframes configuration-widget-metrics { 0%, 36% { opacity: 0; } 38%, 92% { opacity: 1; } 96%, 100% { opacity: 0; } }
@keyframes configuration-widget-controls { 0%, 52% { opacity: 0; } 54%, 92% { opacity: 1; } 96%, 100% { opacity: 0; } }
@keyframes configuration-widget-progress { 0%, 68% { opacity: 0; } 70%, 92% { opacity: 1; } 96%, 100% { opacity: 0; } }
@keyframes configuration-complete { 0%, 70% { opacity: 0; } 73% { opacity: 0.9; } 78%, 88% { opacity: 0.22; } 92% { opacity: 0.55; } 96%, 100% { opacity: 0; } }

@keyframes configuration-target-gauges { 0%, 14% { opacity: 0; } 17%, 21% { opacity: 0.9; } 24%, 100% { opacity: 0; } }
@keyframes configuration-target-metrics { 0%, 30% { opacity: 0; } 33%, 37% { opacity: 0.9; } 40%, 100% { opacity: 0; } }
@keyframes configuration-target-controls { 0%, 46% { opacity: 0; } 49%, 53% { opacity: 0.9; } 56%, 100% { opacity: 0; } }
@keyframes configuration-target-progress { 0%, 62% { opacity: 0; } 65%, 69% { opacity: 0.9; } 72%, 100% { opacity: 0; } }

@keyframes configuration-drag-gauges {
  0%, 7.9% { opacity: 0; transform: translate(185px, 451px); }
  9% { opacity: 0.92; transform: translate(185px, 451px); }
  15% { opacity: 0.92; transform: translate(260px, 320px); }
  21% { opacity: 0.92; transform: translate(320px, 215px); }
  22%, 100% { opacity: 0; transform: translate(320px, 215px); }
}
@keyframes configuration-drag-metrics {
  0%, 23.9% { opacity: 0; transform: translate(299px, 451px); }
  25% { opacity: 0.92; transform: translate(299px, 451px); }
  31% { opacity: 0.92; transform: translate(470px, 330px); }
  37% { opacity: 0.92; transform: translate(625px, 184px); }
  38%, 100% { opacity: 0; transform: translate(625px, 184px); }
}
@keyframes configuration-drag-controls {
  0%, 39.9% { opacity: 0; transform: translate(413px, 451px); }
  41% { opacity: 0.92; transform: translate(413px, 451px); }
  47% { opacity: 0.92; transform: translate(535px, 365px); }
  53% { opacity: 0.92; transform: translate(625px, 258px); }
  54%, 100% { opacity: 0; transform: translate(625px, 258px); }
}
@keyframes configuration-drag-progress {
  0%, 55.9% { opacity: 0; transform: translate(527px, 451px); }
  57% { opacity: 0.92; transform: translate(527px, 451px); }
  63% { opacity: 0.92; transform: translate(445px, 400px); }
  69% { opacity: 0.92; transform: translate(330px, 329px); }
  70%, 100% { opacity: 0; transform: translate(330px, 329px); }
}

.configuration-assembly[data-static='true'] .configuration-assembly__empty-state,
.configuration-assembly[data-static='true'] .configuration-assembly__drag,
.configuration-assembly[data-static='true'] .configuration-assembly__target,
.configuration-assembly[data-static='true'] .configuration-assembly__complete-outline { display: none; }
.configuration-assembly[data-static='true'] .configuration-assembly__widget { opacity: 1; animation: none; }

/* Keep labels legible in the compact 960 × 540 editor canvas. */
.configuration-assembly text { text-rendering: geometricPrecision; font-kerning: normal; }
.configuration-assembly__project text,
.configuration-assembly__properties text,
.configuration-assembly__library text { font-size: 9.5px; }
.configuration-assembly__panel-title { font-size: 12px !important; }
.configuration-assembly__work-tabs text { font-size: 10px; }
.configuration-assembly__properties > text { font-size: 8.5px; }
.configuration-assembly__property-heading { font-size: 9.5px !important; }
.configuration-assembly__selection-text { font-size: 9px; }
.configuration-assembly__dashboard-muted { font-size: 8px; }
.configuration-assembly__dashboard-step, .configuration-assembly__dashboard-time { font-size: 9px; }
.configuration-assembly__empty-state text { font-size: 10px; }
.configuration-assembly__gauge-number { font-size: 11px; }
.configuration-assembly__gauge-label { font-size: 11px; }
.configuration-assembly__metric-label { font-size: 8px; }
.configuration-assembly__metric-value { font-size: 8px; }
.configuration-assembly__widget--controls text { font-size: 8px; }
.configuration-assembly__control-title { font-size: 9px !important; }
.configuration-assembly__progress-number { font-size: 9px; }
.configuration-assembly__progress-label { font-size: 8px; }
.configuration-assembly__source text { font-size: 8.5px; }
.configuration-assembly__library-search-text { font-size: 8px !important; }
.configuration-assembly__drag > text { font-size: 8.5px; }

@media (max-width: 44rem) {
  .configuration-assembly__project text:not(.configuration-assembly__panel-title),
  .configuration-assembly__properties > text:not(.configuration-assembly__panel-title):not(.configuration-assembly__property-heading) { opacity: 0; }
  .configuration-assembly__widget > rect:first-child { stroke-width: 1; }
  .configuration-assembly__gauge-label { font-size: 11px; }
  .configuration-assembly__source text { font-size: 8.5px; }
}

@media (prefers-reduced-motion: reduce) {
  .configuration-assembly__empty-state,
  .configuration-assembly__drag,
  .configuration-assembly__target,
  .configuration-assembly__complete-outline { display: none; }
  .configuration-assembly__widget { opacity: 1; animation: none; }
}
</style>
