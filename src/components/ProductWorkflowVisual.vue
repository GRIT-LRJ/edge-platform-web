<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

import PlatformVisualChrome from './PlatformVisualChrome.vue'

export type ProductWorkflowKind = 'parameter-alarm' | 'sfc' | 'monitoring'

const sfcProjectItems = [
  { id: 'device', y: 103, label: '设备' },
  { id: 'data', y: 130, label: '数据' },
  { id: 'model', y: 157, label: '模型' },
  { id: 'alarm', y: 184, label: '报警' },
  { id: 'application', y: 211, label: '应用' },
  { id: 'flow', y: 238, label: '流程' },
] as const

const MONITORING_TICK_MS = 50
const MONITORING_PROGRESS_X = 538
const MONITORING_PROGRESS_WIDTH = 376
const MONITORING_DEPTH_START = 2.3
const MONITORING_DEPTH_TARGET = 3.2
const MONITORING_REFRESH_START_SECONDS = 10 * 60 * 60 + 42 * 60 + 18
const MONITORING_DURATION_START_SECONDS = 8 * 60 + 42

interface MonitoringSample {
  rpm: number
  pressure: number
  feed: number
  waterFlow: number
  waterPressure: number
}

const monitoringSamples: MonitoringSample[] = [
  { rpm: 96, pressure: 12.6, feed: 68, waterFlow: 30.0, waterPressure: 4.2 },
  { rpm: 97, pressure: 12.7, feed: 69, waterFlow: 30.1, waterPressure: 4.2 },
  { rpm: 98, pressure: 12.8, feed: 68, waterFlow: 30.3, waterPressure: 4.3 },
  { rpm: 97, pressure: 12.7, feed: 67, waterFlow: 30.2, waterPressure: 4.2 },
  { rpm: 96, pressure: 12.6, feed: 68, waterFlow: 30.0, waterPressure: 4.1 },
  { rpm: 95, pressure: 12.5, feed: 69, waterFlow: 29.9, waterPressure: 4.2 },
  { rpm: 94, pressure: 12.4, feed: 68, waterFlow: 29.7, waterPressure: 4.3 },
  { rpm: 95, pressure: 12.5, feed: 67, waterFlow: 29.9, waterPressure: 4.2 },
  { rpm: 96, pressure: 12.6, feed: 68, waterFlow: 30.0, waterPressure: 4.2 },
  { rpm: 97, pressure: 12.7, feed: 68, waterFlow: 30.2, waterPressure: 4.1 },
  { rpm: 96, pressure: 12.6, feed: 69, waterFlow: 30.1, waterPressure: 4.2 },
  { rpm: 95, pressure: 12.5, feed: 68, waterFlow: 29.8, waterPressure: 4.3 },
  { rpm: 96, pressure: 12.6, feed: 67, waterFlow: 29.9, waterPressure: 4.2 },
  { rpm: 97, pressure: 12.7, feed: 68, waterFlow: 30.1, waterPressure: 4.1 },
  { rpm: 98, pressure: 12.8, feed: 69, waterFlow: 30.3, waterPressure: 4.2 },
  { rpm: 97, pressure: 12.7, feed: 68, waterFlow: 30.1, waterPressure: 4.3 },
  { rpm: 96, pressure: 12.6, feed: 67, waterFlow: 29.9, waterPressure: 4.2 },
  { rpm: 96, pressure: 12.6, feed: 68, waterFlow: 30.0, waterPressure: 4.2 },
]

function padClockPart(value: number) {
  return String(value).padStart(2, '0')
}

function formatMonitoringRefreshTime(elapsedSeconds: number) {
  const totalSeconds = (MONITORING_REFRESH_START_SECONDS + elapsedSeconds) % (24 * 60 * 60)
  const hours = Math.floor(totalSeconds / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = totalSeconds % 60
  return `${padClockPart(hours)}:${padClockPart(minutes)}:${padClockPart(seconds)}`
}

function formatMonitoringDuration(elapsedSeconds: number) {
  const totalSeconds = MONITORING_DURATION_START_SECONDS + elapsedSeconds
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${padClockPart(minutes)}:${padClockPart(seconds)}`
}

function roundMonitoringAngle(angle: number) {
  return Math.round(angle * 100) / 100
}

const props = withDefaults(
  defineProps<{
    kind: ProductWorkflowKind
    label: string
    controlled?: boolean
    playing?: boolean
    reducedMotion?: boolean
    durationMs?: number
    replayKey?: number
  }>(),
  {
    controlled: false,
    playing: false,
    reducedMotion: false,
    durationMs: 18_000,
    replayKey: 0,
  },
)

const root = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const localReducedMotion = ref(false)
const idPrefix = `workflow-${useId().replace(/:/g, '')}`

let visibilityObserver: IntersectionObserver | undefined
let reducedMotionQuery: MediaQueryList | undefined

const isPlaying = computed(() =>
  props.controlled ? props.playing : isVisible.value && !localReducedMotion.value,
)
const isStatic = computed(() =>
  props.controlled ? props.reducedMotion && !props.playing : localReducedMotion.value,
)
const animationStyle = computed<Record<string, string>>(() => ({
  '--workflow-duration': `${props.durationMs}ms`,
}))

const monitoringElapsedMs = ref(0)
const monitoringSampleIndex = computed(
  () => Math.floor(monitoringElapsedMs.value / 1000) % monitoringSamples.length,
)
const monitoringSample = computed(() => monitoringSamples[monitoringSampleIndex.value] ?? monitoringSamples[0])
const monitoringElapsedSeconds = computed(() => Math.floor(monitoringElapsedMs.value / 1000))
const monitoringRefreshTime = computed(() =>
  formatMonitoringRefreshTime(monitoringElapsedSeconds.value),
)
const monitoringWorkDuration = computed(() =>
  formatMonitoringDuration(monitoringElapsedSeconds.value),
)
const monitoringDepth = computed(() => {
  const duration = Math.max(props.durationMs, MONITORING_TICK_MS)
  const progress = Math.min(monitoringElapsedMs.value / duration, 1)
  return MONITORING_DEPTH_START + (MONITORING_DEPTH_TARGET - MONITORING_DEPTH_START) * progress
})
const monitoringDepthRatio = computed(
  () => Math.min(monitoringDepth.value / MONITORING_DEPTH_TARGET, 1),
)
const monitoringProgressWidth = computed(
  () => Math.round(MONITORING_PROGRESS_WIDTH * monitoringDepthRatio.value * 1000) / 1000,
)
const monitoringProgressEndX = computed(
  () => Math.round((MONITORING_PROGRESS_X + monitoringProgressWidth.value) * 1000) / 1000,
)
const monitoringNeedleAngles = computed(() => ({
  rpm: roundMonitoringAngle((monitoringSample.value.rpm - 96) * 2),
  pressure: roundMonitoringAngle((monitoringSample.value.pressure - 12.6) * 20),
  feed: roundMonitoringAngle((monitoringSample.value.feed - 68) * 4),
}))

let monitoringTimer: number | undefined

function stopMonitoringTimer() {
  if (monitoringTimer === undefined || typeof window === 'undefined') return
  window.clearInterval(monitoringTimer)
  monitoringTimer = undefined
}

function advanceMonitoringClock() {
  const duration = Math.max(props.durationMs, MONITORING_TICK_MS)
  const nextElapsedMs = monitoringElapsedMs.value + MONITORING_TICK_MS
  monitoringElapsedMs.value = nextElapsedMs >= duration ? 0 : nextElapsedMs
}

function syncMonitoringTimer() {
  const shouldPlay = props.kind === 'monitoring' && isPlaying.value && !isStatic.value
  if (!shouldPlay) {
    stopMonitoringTimer()
    return
  }

  if (monitoringTimer === undefined && typeof window !== 'undefined') {
    monitoringTimer = window.setInterval(advanceMonitoringClock, MONITORING_TICK_MS)
  }
}

function resetMonitoringClock() {
  monitoringElapsedMs.value = 0
}

watch([isPlaying, isStatic, () => props.kind], syncMonitoringTimer, { immediate: true })
watch(
  () => props.replayKey,
  () => {
    resetMonitoringClock()
  },
)
watch(
  () => props.durationMs,
  (durationMs) => {
    if (monitoringElapsedMs.value >= Math.max(durationMs, MONITORING_TICK_MS)) {
      resetMonitoringClock()
    }
  },
)

function observeVisibility() {
  if (typeof window.IntersectionObserver !== 'function') {
    isVisible.value = true
    return
  }

  visibilityObserver = new window.IntersectionObserver(
    ([entry]) => {
      isVisible.value = Boolean(entry?.isIntersecting)
    },
    { threshold: 0.24 },
  )

  if (root.value) visibilityObserver.observe(root.value)
}

function syncReducedMotion() {
  localReducedMotion.value = Boolean(reducedMotionQuery?.matches)
  if (localReducedMotion.value) {
    visibilityObserver?.disconnect()
    isVisible.value = false
  } else {
    visibilityObserver?.disconnect()
    observeVisibility()
  }
}

onMounted(() => {
  if (props.controlled) return
  reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  syncReducedMotion()
  reducedMotionQuery?.addEventListener?.('change', syncReducedMotion)
})

onBeforeUnmount(() => {
  stopMonitoringTimer()
  visibilityObserver?.disconnect()
  reducedMotionQuery?.removeEventListener?.('change', syncReducedMotion)
})
</script>

<template>
  <div
    ref="root"
    class="product-workflow"
    :class="`product-workflow--${kind}`"
    role="img"
    :aria-label="label"
    :data-workflow-visual="kind"
    :data-playing="String(isPlaying)"
    :data-static="String(isStatic)"
    :style="animationStyle"
  >
    <svg
      :key="replayKey"
      viewBox="0 0 960 540"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="`${idPrefix}-shell`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2b3247" />
          <stop offset="1" stop-color="#171d2c" />
        </linearGradient>
        <linearGradient :id="`${idPrefix}-panel`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#30394f" />
          <stop offset="1" stop-color="#242b3e" />
        </linearGradient>
        <linearGradient :id="`${idPrefix}-cyan`" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#3cbaf0" />
          <stop offset="1" stop-color="#59e0c5" />
        </linearGradient>
        <linearGradient :id="`${idPrefix}-hmi`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#361d2d" />
          <stop offset="0.55" stop-color="#20273b" />
          <stop offset="1" stop-color="#142f3b" />
        </linearGradient>
        <pattern :id="`${idPrefix}-grid`" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M18 0H0V18" fill="none" stroke="#91a1bc" stroke-opacity=".09" stroke-width=".7" />
        </pattern>
        <filter :id="`${idPrefix}-glow`" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker :id="`${idPrefix}-arrow`" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
          <path d="M0 0L0 6L7 3z" fill="#8793ab" />
        </marker>
      </defs>

      <rect width="960" height="540" rx="18" :fill="`url(#${idPrefix}-shell)`" />

      <g data-platform-body="true" transform="translate(0 -12)">
      <template v-if="kind === 'parameter-alarm'">
        <g class="product-workflow__sidebar product-workflow__parameter-project">
          <rect x="0" y="44" width="126" height="490" />
          <text class="product-workflow__panel-title" x="14" y="68">工程目录</text>
          <path class="product-workflow__panel-close" d="M112 57l8 8m0-8-8 8" />
          <rect class="product-workflow__sidebar-active" x="8" y="114" width="110" height="27" rx="3" />
          <g class="product-workflow__project-item" transform="translate(0 103)"><circle cx="18" cy="0" r="4.5" /><path d="M15 0h6m-3-3v6" /><text x="31" y="4">数据</text></g>
          <g class="product-workflow__project-item product-workflow__project-item--child" transform="translate(0 131)"><path d="M17-4v8m-4-4h8" /><text x="31" y="4">参数配置</text></g>
          <g class="product-workflow__project-item" transform="translate(0 172)"><circle cx="18" cy="0" r="4.5" /><path d="M15 0h6m-3-3v6" /><text x="31" y="4">报警</text></g>
          <g class="product-workflow__project-item product-workflow__project-item--child" transform="translate(0 200)"><path d="M17-4v8m-4-4h8" /><text x="31" y="4">报警参数配置</text></g>
          <g class="product-workflow__project-item" transform="translate(0 241)"><circle cx="18" cy="0" r="4.5" /><path d="M15 0h6m-3-3v6" /><text x="31" y="4">应用</text></g>
          <g class="product-workflow__project-item product-workflow__project-item--child" transform="translate(0 269)"><path d="M17-4v8m-4-4h8" /><text x="31" y="4">参数管理</text></g>
          <g class="product-workflow__project-item product-workflow__project-item--child" transform="translate(0 297)"><path d="M17-4v8m-4-4h8" /><text x="31" y="4">参数报警</text></g>
          <g class="product-workflow__project-item product-workflow__project-item--child" transform="translate(0 325)"><path d="M17-4v8m-4-4h8" /><text x="31" y="4">报警监控</text></g>
          <g class="product-workflow__project-item product-workflow__project-item--child" transform="translate(0 353)"><path d="M17-4v8m-4-4h8" /><text x="31" y="4">报警历史</text></g>
        </g>

        <g class="product-workflow__parameter-tabs" data-platform-region="editor-tabs">
          <rect class="product-workflow__parameter-tabs-base" x="126" y="44" width="834" height="27" />
          <g class="product-workflow__parameter-tab product-workflow__parameter-tab--1" data-workflow-tab="parameter-configuration" transform="translate(126 44)"><g class="product-workflow__parameter-tab-active"><rect width="84" height="27" /><path d="M0 26h84" /></g><path class="product-workflow__parameter-tab-icon" data-workflow-tab-icon="parameter-configuration" d="M12 8h12M12 12h12M12 16h12M15 6v4M18 10v4M14 14v4" /><text x="32" y="18">参数配置</text></g>
          <g class="product-workflow__parameter-tab product-workflow__parameter-tab--2" data-workflow-tab="parameter-management" transform="translate(210 44)"><g class="product-workflow__parameter-tab-active"><rect width="84" height="27" /><path d="M0 26h84" /></g><path class="product-workflow__parameter-tab-icon" data-workflow-tab-icon="parameter-management" d="M12 8c0-2 8-2 8 0v8c0 2-8 2-8 0zM12 8c0 2 8 2 8 0M12 12c0 2 8 2 8 0" /><text x="32" y="18">参数管理</text></g>
          <g class="product-workflow__parameter-tab product-workflow__parameter-tab--3" data-workflow-tab="alarm-rules" transform="translate(294 44)"><g class="product-workflow__parameter-tab-active"><rect width="84" height="27" /><path d="M0 26h84" /></g><path class="product-workflow__parameter-tab-icon" data-workflow-tab-icon="alarm-rules" d="M12 15h13l-2-3V9a3 3 0 0 0-6 0v3zM15 17h3" /><text x="32" y="18">报警规则</text></g>
          <g class="product-workflow__parameter-tab product-workflow__parameter-tab--4" data-workflow-tab="alarm-response" transform="translate(378 44)"><g class="product-workflow__parameter-tab-active"><rect width="84" height="27" /><path d="M0 26h84" /></g><path class="product-workflow__parameter-tab-icon" data-workflow-tab-icon="alarm-response" d="M16 7a5 5 0 1 1-4 2M12 6v4h4M16 9v4l3 2" /><text x="32" y="18">处置追溯</text></g>
        </g>

        <g class="product-workflow__stage product-workflow__stage--1" data-workflow-stage="parameter-configuration">
          <rect class="product-workflow__workspace" x="126" y="71" width="834" height="463" />
          <g class="product-workflow__parameter-tree" data-workflow-region="parameter-category-tree">
            <rect class="product-workflow__tree-panel" x="140" y="105" width="190" height="401" rx="6" />
            <text class="product-workflow__heading" x="156" y="132">参数分类</text>
            <g class="product-workflow__tree-count" transform="translate(274 116)"><rect width="42" height="20" rx="10" /><text x="21" y="14" text-anchor="middle">6 组</text></g>
            <g class="product-workflow__search-row"><rect class="product-workflow__search" x="152" y="146" width="166" height="25" rx="4" /><path d="M164 156a4 4 0 1 0 3 7l4 4M167 163l3 4" /><text class="product-workflow__tree-search-label" x="180" y="163">搜索参数组</text></g>
            <g class="product-workflow__tree-group" transform="translate(0 0)"><path class="product-workflow__tree-chevron" d="M160 197l4 4 4-4" /><text class="product-workflow__tree-group-label" x="174" y="201">钻孔参数</text><text class="product-workflow__tree-count-label" x="302" y="201" text-anchor="end">3</text></g>
            <rect class="product-workflow__tree-selection" x="166" y="214" width="148" height="27" rx="4" />
            <path class="product-workflow__tree-selection-bar" d="M166 218v19" />
            <g class="product-workflow__tree-item product-workflow__tree-item--selected"><circle cx="180" cy="227" r="3" /><text x="192" y="232">推进参数</text></g>
            <g class="product-workflow__tree-item"><circle cx="180" cy="255" r="3" /><text x="192" y="260">回转参数</text></g>
            <g class="product-workflow__tree-group"><path class="product-workflow__tree-chevron" d="M160 293l4 4 4-4" /><text class="product-workflow__tree-group-label" x="174" y="297">安全参数</text><text class="product-workflow__tree-count-label" x="302" y="297" text-anchor="end">3</text></g>
            <g class="product-workflow__tree-item"><circle cx="180" cy="323" r="3" /><text x="192" y="328">温度限制</text></g>
            <g class="product-workflow__tree-item"><circle cx="180" cy="351" r="3" /><text x="192" y="356">压力限制</text></g>
          </g>
          <rect class="product-workflow__form-panel" x="344" y="105" width="600" height="401" rx="4" />
          <text class="product-workflow__heading" x="364" y="134">推进参数</text><text class="product-workflow__muted" x="920" y="134" text-anchor="end">模板：钻孔基础参数</text>
          <g class="product-workflow__form-row" transform="translate(364 158)"><text y="17">推进速度</text><rect x="118" width="185" height="28" rx="3" /><text x="130" y="18">$mdl.feedSpeed</text><rect x="322" width="88" height="28" rx="3" /><text x="337" y="18">0–120 mm/s</text><rect x="430" width="72" height="28" rx="3" /><text x="448" y="18">可写</text></g>
          <g class="product-workflow__form-row" transform="translate(364 202)"><text y="17">推进压力</text><rect x="118" width="185" height="28" rx="3" /><text x="130" y="18">$mdl.feedPressure</text><rect x="322" width="88" height="28" rx="3" /><text x="337" y="18">0–25 MPa</text><rect x="430" width="72" height="28" rx="3" /><text x="448" y="18">可写</text></g>
          <g class="product-workflow__form-row" transform="translate(364 246)"><text y="17">回转速度</text><rect x="118" width="185" height="28" rx="3" /><text x="130" y="18">$mdl.rotation</text><rect x="322" width="88" height="28" rx="3" /><text x="337" y="18">0–180 rpm</text><rect x="430" width="72" height="28" rx="3" /><text x="448" y="18">可写</text></g>
          <text class="product-workflow__subheading" x="364" y="323">权限与联动</text>
          <rect class="product-workflow__permission" x="364" y="341" width="258" height="62" rx="6" /><text class="product-workflow__permission-label" x="380" y="366">可见权限　操作员 / 工程师</text><text class="product-workflow__permission-label" x="380" y="389">写入权限　工程师</text>
          <rect class="product-workflow__permission" x="638" y="341" width="282" height="62" rx="6" /><text class="product-workflow__permission-label" x="654" y="366">参数联动　推进模式 = 自动</text><text class="product-workflow__permission-label" x="654" y="389">模板同步　已启用</text>
          <g class="product-workflow__saved" transform="translate(792 447)"><rect width="128" height="34" rx="17" /><circle cx="18" cy="17" r="5" /><text x="32" y="21">参数配置已保存</text></g>
        </g>

        <g class="product-workflow__stage product-workflow__stage--2" data-workflow-stage="parameter-management">
          <rect class="product-workflow__workspace" x="126" y="71" width="834" height="463" />
          <rect class="product-workflow__hmi" x="142" y="107" width="802" height="399" rx="5" :fill="`url(#${idPrefix}-hmi)`" />
          <text class="product-workflow__hmi-title" x="166" y="139">钻孔参数管理</text><text class="product-workflow__muted" x="866" y="139">设备 01 · 在线</text>
          <g class="product-workflow__category-tabs"><rect x="162" y="156" width="160" height="34" rx="4" /><rect x="330" y="156" width="160" height="34" rx="4" /><rect x="498" y="156" width="160" height="34" rx="4" /><text x="209" y="178">推进参数</text><text x="377" y="178">回转参数</text><text x="545" y="178">安全参数</text></g>
          <rect class="product-workflow__param-list" x="162" y="206" width="490" height="270" rx="5" />
          <g class="product-workflow__param-row"><text x="184" y="240">推进速度</text><text x="414" y="240">68.0 mm/s</text><rect x="536" y="220" width="92" height="28" rx="14" /><text x="557" y="239">写入参数</text></g>
          <g class="product-workflow__param-row"><text x="184" y="288">推进压力</text><text x="414" y="288">12.6 MPa</text><rect x="536" y="268" width="92" height="28" rx="14" /><text x="557" y="287">写入参数</text></g>
          <g class="product-workflow__param-row"><text x="184" y="336">回转速度</text><text x="414" y="336">96 rpm</text><rect x="536" y="316" width="92" height="28" rx="14" /><text x="557" y="335">写入参数</text></g>
          <g class="product-workflow__param-row"><text x="184" y="384">钻孔深度</text><text x="414" y="384">2.30 m</text><text class="product-workflow__muted" x="554" y="384">只读</text></g>
          <g class="product-workflow__parameter-diagram" data-workflow-diagram="borehole">
            <rect class="product-workflow__diagram" x="672" y="206" width="248" height="270" rx="6" />
            <text class="product-workflow__subheading" x="692" y="233">钻孔参数</text>
            <g class="product-workflow__diagram-status" transform="translate(830 217)"><rect width="78" height="20" rx="10" /><circle cx="11" cy="10" r="3" /><text x="19" y="14">绑定正常</text></g>
            <g class="product-workflow__diagram-scale">
              <path d="M700 256v166M700 270h14M700 320h14M700 370h14M700 420h14" />
              <text x="680" y="274">0m</text><text x="680" y="324">1m</text><text x="680" y="374">2m</text><text x="680" y="424">3m</text>
            </g>
            <g class="product-workflow__borehole">
              <path class="product-workflow__borehole-wall" d="M748 256h64v166h-64z" />
              <path class="product-workflow__drill-rod" d="M773 256h14v114h-14z" />
              <path class="product-workflow__drill-bit" d="M769 370h22l-11 14z" />
              <path class="product-workflow__diagram-current" d="M742 384h76" />
              <path class="product-workflow__diagram-target" d="M742 408h76" />
              <circle class="product-workflow__diagram-current-dot" cx="780" cy="384" r="4" />
            </g>
            <g class="product-workflow__diagram-labels"><text x="826" y="387">当前 2.30m</text><text x="826" y="411">目标 3.00m</text></g>
            <text class="product-workflow__diagram-binding" x="692" y="451">变量绑定　$mdl.depth</text>
          </g>
        </g>

        <g class="product-workflow__stage product-workflow__stage--3" data-workflow-stage="alarm-rules">
          <rect class="product-workflow__workspace" x="126" y="71" width="834" height="463" />
          <g class="product-workflow__alarm-tree" data-workflow-region="alarm-group-tree">
            <rect class="product-workflow__tree-panel" x="140" y="105" width="250" height="401" rx="6" />
            <text class="product-workflow__heading" x="158" y="133">报警组</text>
            <g class="product-workflow__tree-count" transform="translate(314 116)"><rect width="58" height="20" rx="10" /><text x="29" y="14" text-anchor="middle">12 启用</text></g>
            <g class="product-workflow__alarm-tree-group"><path class="product-workflow__tree-chevron" d="M158 172l4 4 4-4" /><text class="product-workflow__tree-group-label" x="172" y="176">钻孔系统</text><text class="product-workflow__tree-count-label" x="368" y="176" text-anchor="end">3</text></g>
            <rect class="product-workflow__tree-selection product-workflow__tree-selection--alarm" x="166" y="189" width="210" height="28" rx="4" />
            <path class="product-workflow__tree-selection-bar product-workflow__tree-selection-bar--alarm" d="M166 193v20" />
            <g class="product-workflow__alarm-tree-item product-workflow__alarm-tree-item--selected"><circle class="product-workflow__alarm-tree-dot product-workflow__alarm-tree-dot--critical" cx="181" cy="203" r="4" /><text x="194" y="208">推进压力过高</text></g>
            <g class="product-workflow__alarm-tree-item"><circle class="product-workflow__alarm-tree-dot product-workflow__alarm-tree-dot--warning" cx="181" cy="235" r="4" /><text x="194" y="240">水压开关异常</text></g>
            <g class="product-workflow__alarm-tree-item"><circle class="product-workflow__alarm-tree-dot product-workflow__alarm-tree-dot--info" cx="181" cy="267" r="4" /><text x="194" y="272">钻具健康诊断</text></g>
          </g>
          <g class="product-workflow__alarm-type-tabs"><rect x="410" y="105" width="160" height="38" rx="4" /><rect x="580" y="105" width="160" height="38" rx="4" /><rect x="750" y="105" width="180" height="38" rx="4" /><text x="454" y="130">限值报警</text><text x="624" y="130">开关报警</text><text x="794" y="130">功能块报警</text></g>
          <rect class="product-workflow__form-panel" x="410" y="157" width="520" height="349" rx="4" />
          <text class="product-workflow__heading" x="430" y="187">推进压力过高</text><rect class="product-workflow__severity" x="820" y="170" width="88" height="26" rx="13" /><text class="product-workflow__severity-label" x="844" y="188">严重</text>
          <text class="product-workflow__field-label" x="430" y="225">监测目标</text><rect class="product-workflow__field" x="530" y="207" width="354" height="28" rx="4" /><text class="product-workflow__field-value" x="544" y="226">$mdl.feedPressure</text>
          <text class="product-workflow__field-label" x="430" y="269">前置条件</text><rect class="product-workflow__field" x="530" y="251" width="354" height="28" rx="4" /><text class="product-workflow__field-value" x="544" y="270">推进模式 = 自动　·　延时 2s</text>
          <text class="product-workflow__subheading" x="430" y="315">分级阈值与死区</text>
          <g class="product-workflow__thresholds"><rect x="430" y="331" width="104" height="64" rx="4" /><rect x="544" y="331" width="104" height="64" rx="4" /><rect x="658" y="331" width="104" height="64" rx="4" /><rect x="772" y="331" width="104" height="64" rx="4" /><text x="474" y="352">LL</text><text x="588" y="352">L</text><text x="702" y="352">H</text><text x="816" y="352">HH</text><text x="463" y="379">4.0</text><text x="577" y="379">6.0</text><text x="691" y="379">20.0</text><text x="805" y="379">23.0</text></g>
          <text class="product-workflow__field-label" x="430" y="431">消息模板</text><rect class="product-workflow__field" x="530" y="413" width="354" height="28" rx="4" /><text class="product-workflow__field-value" x="544" y="432">推进压力达到 {value} MPa，请检查液压回路</text>
          <g class="product-workflow__validated" transform="translate(741 459)"><rect width="143" height="30" rx="15" /><circle cx="17" cy="15" r="5" /><text x="30" y="19">规则校验通过</text></g>
        </g>

        <g class="product-workflow__stage product-workflow__stage--4" data-workflow-stage="alarm-response">
          <rect class="product-workflow__workspace" x="126" y="71" width="834" height="463" />
          <rect class="product-workflow__hmi" x="142" y="107" width="802" height="399" rx="5" :fill="`url(#${idPrefix}-hmi)`" />
          <text class="product-workflow__hmi-title" x="166" y="139">报警监控</text><text class="product-workflow__muted" x="854" y="139">实时订阅 · 已连接</text>
          <g class="product-workflow__alarm-summary"><rect x="162" y="158" width="236" height="72" rx="5" /><rect x="410" y="158" width="236" height="72" rx="5" /><rect x="658" y="158" width="236" height="72" rx="5" /><text x="182" y="183">当前报警</text><text x="182" y="216">03</text><text x="430" y="183">待确认</text><text x="430" y="216">01</text><text x="678" y="183">今日已处置</text><text x="678" y="216">12</text></g>
          <rect class="product-workflow__alarm-table" x="162" y="247" width="758" height="206" rx="5" />
          <g class="product-workflow__alarm-table-head"><text x="184" y="274">级别</text><text x="250" y="274">报警名称</text><text x="500" y="274">当前值</text><text x="608" y="274">发生时间</text><text x="796" y="274">操作</text></g>
          <g class="product-workflow__alarm-live"><rect x="174" y="286" width="734" height="52" rx="4" /><circle cx="202" cy="312" r="7" /><text x="240" y="316">推进压力过高</text><text x="500" y="316">23.6 MPa</text><text x="608" y="316">10:42:18</text><rect x="788" y="296" width="96" height="30" rx="15" /><text x="814" y="316">确认报警</text></g>
          <g class="product-workflow__alarm-history"><rect x="174" y="348" width="734" height="42" rx="4" /><circle cx="202" cy="369" r="6" /><text x="240" y="373">水压开关异常</text><text x="500" y="373">已恢复</text><text x="608" y="373">10:31:04</text><text x="813" y="373">已确认</text></g>
          <g class="product-workflow__alarm-history"><rect x="174" y="398" width="734" height="42" rx="4" /><circle cx="202" cy="419" r="6" /><text x="240" y="423">钻具健康诊断</text><text x="500" y="423">已恢复</text><text x="608" y="423">09:58:36</text><text x="813" y="423">已追溯</text></g>
          <g class="product-workflow__ack"><circle cx="836" cy="311" r="22" /><path d="M826 311l7 7 13-16" /></g>
        </g>
      </template>

      <template v-else-if="kind === 'sfc'">
        <g class="product-workflow__sfc-tree" data-sfc-region="project-tree">
          <rect x="0" y="44" width="126" height="490" />
          <text class="product-workflow__panel-title" x="14" y="68">工程目录</text>
          <path class="product-workflow__panel-close" d="M112 57l8 8m0-8-8 8" />
          <g
            v-for="item in sfcProjectItems"
            :key="item.id"
            class="product-workflow__sfc-tree-item"
            :data-sfc-tree-item="item.id"
            :transform="`translate(0 ${item.y})`"
          >
            <circle cx="18" cy="0" r="4.5" />
            <path d="M15 0h6m-3-3v6" />
            <text x="31" y="4">{{ item.label }}</text>
          </g>
          <rect class="product-workflow__sfc-tree-selection" data-sfc-selection="flow" x="8" y="225" width="110" height="26" rx="3" />
        </g>

        <g class="product-workflow__sfc-editor-tabs" data-sfc-region="editor-tabs">
          <rect class="product-workflow__sfc-editor-tabs-base" x="126" y="44" width="664" height="28" />
          <g class="product-workflow__sfc-editor-tab product-workflow__sfc-editor-tab--active" data-sfc-tab="manual-flow" transform="translate(126 44)">
            <rect width="112" height="28" />
            <path class="product-workflow__sfc-editor-tab-icon" d="M16 9h10v10H16zm3 0v10m4-10v10M16 14h10" />
            <text x="34" y="19">手动流程</text>
            <path class="product-workflow__sfc-editor-tab-close" d="M96 10l8 8m0-8-8 8" />
          </g>
        </g>

        <g class="product-workflow__sfc-toolbar" data-sfc-region="toolbar">
          <rect x="126" y="72" width="664" height="44" />
          <g class="product-workflow__sfc-tool" data-sfc-tool="save" transform="translate(146 72)"><path d="M-6 9h12v10H-6zM-3 9V6h6v3M-3 16h6" /><text x="0" y="35">保存</text></g>
          <g class="product-workflow__sfc-tool" data-sfc-tool="undo" transform="translate(220 72)"><path d="M6 10H-4l4-4M-4 10a7 7 0 1 1 2 7" /><text x="0" y="35">撤销</text></g>
          <g class="product-workflow__sfc-tool" data-sfc-tool="start" transform="translate(294 72)"><path d="M-5 7l10 6-10 6z" /><text x="0" y="35">开始</text></g>
          <g class="product-workflow__sfc-tool" data-sfc-tool="function-block" transform="translate(368 72)"><rect x="-7" y="7" width="14" height="12" rx="1" /><path d="M-3 7v12M3 7v12" /><text x="0" y="35">功能块</text></g>
          <g class="product-workflow__sfc-tool" data-sfc-tool="transition" transform="translate(442 72)"><path d="M-8 13h16" /><path d="M-5 9v8M5 9v8" /><text x="0" y="35">转换</text></g>
          <g class="product-workflow__sfc-tool" data-sfc-tool="step" transform="translate(516 72)"><rect x="-7" y="7" width="14" height="12" rx="1" /><text x="0" y="35">普通步骤</text></g>
          <g class="product-workflow__sfc-tool" data-sfc-tool="subflow" transform="translate(590 72)"><rect x="-7" y="7" width="14" height="12" rx="1" /><path d="M-3 7v12M3 7v12" /><text x="0" y="35">子流程</text></g>
          <g class="product-workflow__sfc-tool" data-sfc-tool="end" transform="translate(664 72)"><path d="M-5 8l5 10 5-10z" /><text x="0" y="35">结束</text></g>
        </g>

        <rect class="product-workflow__sfc-canvas" data-sfc-region="canvas" x="126" y="116" width="664" height="418" />
        <path class="product-workflow__sfc-guide" d="M126 238h664M126 404h664M430 116v418" />

        <g class="product-workflow__sfc-flow" data-sfc-region="flow">
          <path class="product-workflow__sfc-connector" d="M430 180v24" :marker-end="`url(#${idPrefix}-arrow)`" />
          <path class="product-workflow__sfc-connector" d="M430 234v24" :marker-end="`url(#${idPrefix}-arrow)`" />
          <path class="product-workflow__sfc-connector" d="M430 316v42" :marker-end="`url(#${idPrefix}-arrow)`" />
          <path class="product-workflow__sfc-connector" d="M430 376v42" :marker-end="`url(#${idPrefix}-arrow)`" />
          <path class="product-workflow__sfc-progress product-workflow__sfc-progress--one" data-sfc-progress="one" pathLength="1" d="M430 180v24" />
          <path class="product-workflow__sfc-progress product-workflow__sfc-progress--two" data-sfc-progress="two" pathLength="1" d="M430 234v24" />
          <path class="product-workflow__sfc-progress product-workflow__sfc-progress--three" data-sfc-progress="three" pathLength="1" d="M430 316v42" />
          <path class="product-workflow__sfc-progress product-workflow__sfc-progress--four" data-sfc-progress="four" pathLength="1" d="M430 376v42" />
          <g class="product-workflow__sfc-flow-block product-workflow__sfc-flow-block--start" data-sfc-block="start">
            <path class="product-workflow__sfc-flow-shape" d="M408 142h44l-22 38z" />
            <text class="product-workflow__sfc-start-label" data-sfc-label="start" x="430" y="158">开始</text>
          </g>
          <g class="product-workflow__sfc-flow-block product-workflow__sfc-flow-block--condition" data-sfc-block="condition">
            <rect class="product-workflow__sfc-flow-shape" x="398" y="204" width="64" height="30" rx="2" />
            <text x="430" y="224">true</text>
          </g>
          <g class="product-workflow__sfc-flow-block product-workflow__sfc-flow-block--state" data-sfc-block="state">
            <rect class="product-workflow__sfc-flow-shape" x="370" y="258" width="120" height="58" />
            <text x="430" y="293">待机状态</text>
          </g>
          <g class="product-workflow__sfc-flow-block product-workflow__sfc-flow-block--mode" data-sfc-block="auto-mode">
            <path class="product-workflow__sfc-flow-shape" d="M372 358h116M372 376h116" />
            <text x="430" y="370">自动模式开关</text>
          </g>
          <g class="product-workflow__sfc-flow-block product-workflow__sfc-flow-block--end" data-sfc-block="end">
            <path class="product-workflow__sfc-flow-shape" d="M430 418l22 40h-44z" />
            <text x="430" y="449">结束</text>
          </g>
        </g>

        <g class="product-workflow__sfc-vars" data-sfc-region="variables">
          <rect class="product-workflow__sfc-vars-panel" x="548" y="130" width="228" height="108" rx="4" />
          <text class="product-workflow__sfc-vars-title" x="562" y="151">流程变量</text>
          <path class="product-workflow__sfc-vars-rule" d="M558 160h208" />
          <text class="product-workflow__sfc-table-head" x="562" y="177">名称</text>
          <text class="product-workflow__sfc-table-head" x="656" y="177">描述</text>
          <text class="product-workflow__sfc-table-head" x="698" y="177">数据类型</text>
          <text class="product-workflow__sfc-table-head" x="754" y="177">默认</text>
          <rect class="product-workflow__sfc-table-row" x="556" y="184" width="212" height="38" rx="2" />
          <text x="562" y="207">自动模式开关</text><text x="656" y="207">—</text>
          <rect class="product-workflow__sfc-bool" x="698" y="193" width="32" height="17" rx="3" /><text x="704" y="205">bool</text><text x="754" y="207">—</text>
        </g>

        <g class="product-workflow__sfc-properties" data-sfc-region="properties">
          <rect class="product-workflow__sfc-properties-panel" x="790" y="44" width="170" height="490" />
          <text class="product-workflow__panel-title" x="806" y="68">属性</text>
          <path class="product-workflow__panel-close" d="M944 57l8 8m0-8-8 8" />
          <g class="product-workflow__sfc-property-section" data-sfc-property-section="node">
            <rect x="798" y="84" width="154" height="76" rx="4" />
            <text class="product-workflow__sfc-section-title" x="808" y="105">节点属性</text>
            <rect class="product-workflow__sfc-chip" x="866" y="91" width="76" height="18" rx="9" /><text x="874" y="104">Transition</text>
            <path class="product-workflow__sfc-section-rule" d="M806 114h138" />
            <text class="product-workflow__sfc-property-label" x="808" y="134">类型</text><text x="844" y="134">转换节点</text>
            <text class="product-workflow__sfc-property-label" x="808" y="151">描述</text><text class="product-workflow__sfc-property-muted" x="844" y="151">流程条件</text>
          </g>
          <g class="product-workflow__sfc-property-section" data-sfc-property-section="condition">
            <rect x="798" y="168" width="154" height="118" rx="4" />
            <text class="product-workflow__sfc-section-title" x="808" y="189">条件配置</text>
            <path class="product-workflow__sfc-section-rule" d="M806 198h138" />
            <text class="product-workflow__sfc-property-label" x="808" y="216">条件类型</text>
            <rect class="product-workflow__sfc-condition-option" x="808" y="224" width="42" height="20" rx="3" /><text x="817" y="238">表达式</text>
            <rect class="product-workflow__sfc-condition-option" x="854" y="224" width="34" height="20" rx="3" /><text x="862" y="238">变量</text>
            <rect class="product-workflow__sfc-condition-option product-workflow__sfc-condition-option--active" x="892" y="224" width="42" height="20" rx="3" /><text x="901" y="238">常量</text>
            <text class="product-workflow__sfc-property-label" x="808" y="264">常量</text>
            <circle class="product-workflow__sfc-radio product-workflow__sfc-radio--active" cx="844" cy="260" r="5" /><text x="854" y="264">TRUE</text>
            <circle class="product-workflow__sfc-radio" cx="900" cy="260" r="5" /><text x="910" y="264">FALSE</text>
          </g>
          <g class="product-workflow__sfc-property-section" data-sfc-property-section="style">
            <rect x="798" y="294" width="154" height="212" rx="4" />
            <text class="product-workflow__sfc-section-title" x="808" y="315">样式设置</text>
            <path class="product-workflow__sfc-section-rule" d="M806 324h138" />
            <text class="product-workflow__sfc-property-label" x="808" y="346">填充色</text>
            <rect class="product-workflow__sfc-color-swatch" x="808" y="354" width="20" height="20" rx="2" /><rect class="product-workflow__sfc-color-field" x="834" y="354" width="108" height="20" rx="3" /><text x="843" y="368">#252839</text>
            <text class="product-workflow__sfc-property-label" x="808" y="396">文字色</text>
            <rect class="product-workflow__sfc-color-swatch product-workflow__sfc-color-swatch--text" x="808" y="404" width="20" height="20" rx="2" /><rect class="product-workflow__sfc-color-field" x="834" y="404" width="108" height="20" rx="3" /><text x="843" y="418">#FFFFFF</text>
            <text class="product-workflow__sfc-property-muted" x="808" y="454">选中状态</text><text class="product-workflow__sfc-property-value" x="808" y="474">蓝色虚线 · 固定</text>
          </g>
        </g>
      </template>

      <template v-else>
        <rect class="product-workflow__monitor-shell" x="0" y="44" width="960" height="490" />
        <g class="product-workflow__monitor-nav">
          <rect x="0" y="44" width="126" height="490" />
          <text class="product-workflow__panel-title" x="14" y="70">运行画面</text>
          <rect class="product-workflow__sidebar-active" x="10" y="88" width="106" height="31" rx="3" />
          <text x="25" y="108">钻孔监测</text><text x="25" y="147">设备状态</text><text x="25" y="181">作业趋势</text><text x="25" y="215">实时视频</text>
          <circle cx="22" cy="477" r="4" /><text x="34" y="481">设备 01 在线</text>
        </g>
        <g class="product-workflow__monitor-stage">
          <rect x="126" y="44" width="834" height="490" :fill="`url(#${idPrefix}-hmi)`" />
          <text class="product-workflow__monitor-title" x="150" y="78">钻孔设备运行监控</text><text class="product-workflow__muted product-workflow__monitor-refresh" data-monitoring-clock="refresh" x="818" y="78">实时刷新 · {{ monitoringRefreshTime }}</text>
          <g class="product-workflow__monitor-status"><circle cx="150" cy="100" r="5" /><text x="162" y="104">自动钻进</text><text x="265" y="104">孔位 M8</text><text x="345" y="104">当前深度 {{ monitoringDepth.toFixed(2) }} m</text><text x="828" y="104">通讯正常</text></g>
          <g class="product-workflow__gauges">
            <rect x="150" y="124" width="356" height="174" rx="5" />
            <text class="product-workflow__subheading" x="168" y="150">作业指标</text>
            <g transform="translate(217 215)"><circle r="45" /><circle class="product-workflow__gauge-value" r="36" /><path class="product-workflow__gauge-needle" :style="{ transform: `rotate(${monitoringNeedleAngles.rpm}deg)` }" d="M0 0l23-19" /><text class="product-workflow__monitor-rpm" data-monitoring-gauge="rpm" y="8">{{ monitoringSample.rpm }}</text><text y="67">回转 rpm</text></g>
            <g transform="translate(328 215)"><circle r="45" /><circle class="product-workflow__gauge-value product-workflow__gauge-value--two" r="36" /><path class="product-workflow__gauge-needle" :style="{ transform: `rotate(${monitoringNeedleAngles.pressure}deg)` }" d="M0 0l18-25" /><text class="product-workflow__monitor-pressure" data-monitoring-gauge="pressure" y="8">{{ monitoringSample.pressure.toFixed(1) }}</text><text y="67">压力 MPa</text></g>
            <g transform="translate(439 215)"><circle r="45" /><circle class="product-workflow__gauge-value product-workflow__gauge-value--three" r="36" /><path class="product-workflow__gauge-needle" :style="{ transform: `rotate(${monitoringNeedleAngles.feed}deg)` }" d="M0 0l27-12" /><text class="product-workflow__monitor-feed" data-monitoring-gauge="feed" y="8">{{ monitoringSample.feed }}</text><text y="67">推进 mm/s</text></g>
          </g>
          <g class="product-workflow__monitor-metrics">
            <rect x="520" y="124" width="134" height="78" rx="5" /><rect x="668" y="124" width="134" height="78" rx="5" /><rect x="816" y="124" width="120" height="78" rx="5" />
            <text x="536" y="148">水量</text><text class="product-workflow__monitor-water-flow" data-monitoring-metric="water-flow" x="536" y="181">{{ monitoringSample.waterFlow.toFixed(1) }} L/min</text><text x="684" y="148">水压</text><text class="product-workflow__monitor-water-pressure" data-monitoring-metric="water-pressure" x="684" y="181">{{ monitoringSample.waterPressure.toFixed(1) }} MPa</text><text x="832" y="148">作业时长</text><text class="product-workflow__monitor-duration" data-monitoring-clock="duration" x="832" y="181">{{ monitoringWorkDuration }}</text>
          </g>
          <g class="product-workflow__monitor-progress">
            <rect x="520" y="216" width="416" height="82" rx="5" /><text x="538" y="242">钻孔深度</text><text class="product-workflow__monitor-depth" data-monitoring-depth="value" x="875" y="242">{{ monitoringDepth.toFixed(2) }} / 3.20 m</text><rect x="538" y="261" width="376" height="10" rx="5" /><rect class="product-workflow__progress-value" data-monitoring-depth="bar" x="538" y="261" :width="monitoringProgressWidth" height="10" rx="5" /><circle data-monitoring-depth="marker" :cx="monitoringProgressEndX" cy="266" r="6" />
          </g>
          <g class="product-workflow__monitor-chart">
            <rect x="150" y="314" width="512" height="182" rx="5" /><text class="product-workflow__subheading" x="168" y="342">作业趋势</text><text class="product-workflow__muted" x="582" y="342">最近 30 分钟</text>
            <path class="product-workflow__chart-grid" d="M174 470h462M174 430h462M174 390h462M174 358v112M250 358v112M326 358v112M402 358v112M478 358v112M554 358v112M630 358v112" />
            <path class="product-workflow__chart-line product-workflow__chart-line--one" d="M174 444l55-22 54 11 55-51 54 29 55-62 54 24 55-34 70 18" />
            <path class="product-workflow__chart-line product-workflow__chart-line--two" d="M174 464l55-31 54 18 55-20 54 9 55-43 54 30 55-14 70 8" />
          </g>
          <g class="product-workflow__monitor-video">
            <rect x="678" y="314" width="258" height="182" rx="5" /><text class="product-workflow__subheading" x="696" y="342">实时视频</text><text class="product-workflow__value" x="860" y="342">LIVE</text>
            <rect x="696" y="356" width="222" height="122" rx="4" /><path class="product-workflow__mine" d="M696 448l42-42 35 24 39-49 52 33 54-39v103H696z" /><circle cx="796" cy="395" r="13" /><path d="M796 384v22M785 395h22" />
            <path class="product-workflow__video-scan" d="M704 370h206" />
          </g>
          <g class="product-workflow__live-pulse"><circle cx="150" cy="100" r="5" :filter="`url(#${idPrefix}-glow)`" /><circle cx="808" cy="266" r="6" :filter="`url(#${idPrefix}-glow)`" /></g>
        </g>
      </template>
      </g>

      <PlatformVisualChrome />
    </svg>
  </div>
</template>

<style scoped>
.product-workflow { --workflow-duration: 18000ms; width: 100%; height: 100%; overflow: hidden; border-radius: inherit; background: #171d2c; }
.product-workflow svg { width: 100%; height: 100%; display: block; font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif; shape-rendering: geometricPrecision; text-rendering: geometricPrecision; font-synthesis: none; }
.product-workflow__sidebar rect:first-child, .product-workflow__monitor-nav > rect:first-child { fill: #252c3e; stroke: #505b72; stroke-width: .6; }
.product-workflow__sidebar text, .product-workflow__monitor-nav text { fill: #d9dfec; font-size: 10px; }.product-workflow__panel-title { fill: #f3f6fb !important; font-size: 11px !important; font-weight: 700; }
.product-workflow__sidebar-active { fill: #43516b !important; stroke: #6b7893 !important; }.product-workflow__workspace { fill: #1d2435; }
.product-workflow__sfc-toolbar > rect { fill: var(--drillmind-toolbar, #424b65); stroke: var(--drillmind-line, #56617b); stroke-width: .6; }
.product-workflow__stage { opacity: 0; animation-duration: var(--workflow-duration); animation-timing-function: linear; animation-iteration-count: infinite; animation-play-state: paused; }.product-workflow__stage--1 { animation-name: workflow-stage-one; }.product-workflow__stage--2 { animation-name: workflow-stage-two; }.product-workflow__stage--3 { animation-name: workflow-stage-three; }.product-workflow__stage--4 { animation-name: workflow-stage-four; }
.product-workflow[data-playing="true"] .product-workflow__stage, .product-workflow[data-playing="true"] .product-workflow__parameter-tab-active, .product-workflow[data-playing="true"] .product-workflow__saved, .product-workflow[data-playing="true"] .product-workflow__validated, .product-workflow[data-playing="true"] .product-workflow__sfc-flow *, .product-workflow[data-playing="true"] .product-workflow__monitor-stage * { animation-play-state: running; }
.product-workflow__tree-panel, .product-workflow__form-panel { fill: #272f42; stroke: #55617a; }.product-workflow__search, .product-workflow__form-row rect, .product-workflow__form-panel > rect:not(.product-workflow__permission), .product-workflow__alarm-type-tabs rect { fill: #1e2637; stroke: #59667e; }
.product-workflow__heading, .product-workflow__subheading { fill: #f1f4fa; font-size: 12px; font-weight: 700; }.product-workflow__subheading { font-size: 10px; }.product-workflow__muted { fill: #9aa6bd !important; font-size: 8px !important; }.product-workflow__selected { fill: #40506b; }
.product-workflow__tree-panel text, .product-workflow__form-panel text, .product-workflow__form-row text, .product-workflow__permission text, .product-workflow__alarm-type-tabs text, .product-workflow__thresholds text { fill: #d6ddea; font-size: 8px; }.product-workflow__form-row > text:first-child { font-size: 9px; }
.product-workflow__permission { fill: #202a3b; stroke: #4b5971; }.product-workflow__saved rect, .product-workflow__validated rect { fill: #254a48; stroke: #57d7c0; }.product-workflow__saved circle, .product-workflow__validated circle { fill: #5de0c5; }.product-workflow__saved text, .product-workflow__validated text { fill: #dffbf5; font-size: 8px; }
.product-workflow__hmi { stroke: #68748e; stroke-width: .8; }.product-workflow__hmi-title { fill: #f5f7fb; font-size: 13px; font-weight: 750; }.product-workflow__category-tabs rect { fill: #28344a; stroke: #60708c; }.product-workflow__category-tabs rect:first-child { fill: #426182; stroke: #62c6e6; }.product-workflow__category-tabs text { fill: #e8edf5; font-size: 9px; font-weight: 650; }
.product-workflow__param-list, .product-workflow__diagram, .product-workflow__alarm-table { fill: #20283a; stroke: #56637c; }.product-workflow__param-row text { fill: #e1e6ef; font-size: 10px; }.product-workflow__param-row rect { fill: #2f5361; stroke: #54d5c4; }.product-workflow__param-row + .product-workflow__param-row { transform: translateY(0); }.product-workflow__diagram text { fill: #aab6c9; font-size: 9px; }.product-workflow__diagram path, .product-workflow__diagram circle { fill: none; stroke: #72bfd2; stroke-width: 2; }
.product-workflow__severity { fill: #7b353e; stroke: #e07177; }.product-workflow__form-panel > .product-workflow__severity + text { fill: #ffd9dc; font-size: 8px; }.product-workflow__thresholds rect { fill: #252e42; stroke: #65718a; }.product-workflow__thresholds rect:nth-child(4) { fill: #67333d; stroke: #dd6d76; }.product-workflow__thresholds text { text-anchor: middle; }
.product-workflow__alarm-summary rect { fill: #253044; stroke: #5c6b86; }.product-workflow__alarm-summary text { fill: #dce3ef; font-size: 9px; }.product-workflow__alarm-summary text:nth-of-type(even) { fill: #f5f8fd; font-size: 20px; font-weight: 750; }.product-workflow__alarm-table-head text { fill: #9eabc0; font-size: 8px; }.product-workflow__alarm-live rect { fill: #552c38; stroke: #de6975; }.product-workflow__alarm-live circle { fill: #f26471; }.product-workflow__alarm-live text, .product-workflow__alarm-history text { fill: #f0e7eb; font-size: 9px; }.product-workflow__alarm-live > rect:nth-last-of-type(1) { fill: #3c5664; stroke: #58d7c4; }.product-workflow__alarm-history rect { fill: #252f41; stroke: #536077; }.product-workflow__alarm-history circle { fill: #5bd5bc; }.product-workflow__ack { opacity: 0; animation: workflow-ack var(--workflow-duration) ease-in-out infinite; }.product-workflow__ack circle { fill: #235c51; stroke: #62e2c9; }.product-workflow__ack path { fill: none; stroke: #dffff7; stroke-width: 3; }

.product-workflow--parameter-alarm svg { font-synthesis: none; text-rendering: geometricPrecision; }
.product-workflow--parameter-alarm text { stroke: none; font-weight: 400; }
.product-workflow__parameter-project > rect:first-child { fill: var(--drillmind-panel, #3d465f); stroke: var(--drillmind-line, #56617b); stroke-width: .6; }
.product-workflow__parameter-project .product-workflow__panel-title { fill: #f4f7fb !important; font-size: 14px !important; font-weight: 700; }
.product-workflow__panel-close { fill: none; stroke: #8f9bb1; stroke-width: 1.2; }
.product-workflow__parameter-project .product-workflow__sidebar-active { fill: #343c52 !important; stroke: #56617b !important; opacity: .82; }
.product-workflow__project-item text { fill: #e2e8f2; font-size: 11.5px; font-weight: 700; }
.product-workflow__project-item circle { fill: none; stroke: #a5b2c6; stroke-width: 1; }
.product-workflow__project-item path { fill: none; stroke: #a5b2c6; stroke-width: 1; }
.product-workflow__project-item--child text { fill: #d6deeb; font-size: 11px; font-weight: 400; }
.product-workflow__project-item--child path { stroke: #7fdceb; }
.product-workflow__parameter-tabs-base { fill: var(--drillmind-toolbar, #424b65); stroke: var(--drillmind-line, #56617b); stroke-width: .6; }
.product-workflow__parameter-tab-active { opacity: 0; animation-duration: var(--workflow-duration); animation-timing-function: linear; animation-iteration-count: infinite; animation-play-state: paused; }
.product-workflow__parameter-tab-active rect { fill: #5d6478; }
.product-workflow__parameter-tab-active path { fill: none; stroke: #efbd36; stroke-width: 2; }
.product-workflow__parameter-tab--1 .product-workflow__parameter-tab-active { animation-name: workflow-stage-one; }
.product-workflow__parameter-tab--2 .product-workflow__parameter-tab-active { animation-name: workflow-stage-two; }
.product-workflow__parameter-tab--3 .product-workflow__parameter-tab-active { animation-name: workflow-stage-three; }
.product-workflow__parameter-tab--4 .product-workflow__parameter-tab-active { animation-name: workflow-stage-four; }
.product-workflow__parameter-tab > path { fill: none; stroke: #9ba7bd; stroke-width: .8; }
.product-workflow__parameter-tab text { fill: #e2e8f2; font-size: 8.5px; font-weight: 650; }
.product-workflow--parameter-alarm .product-workflow__workspace { fill: #202638; }
.product-workflow--parameter-alarm .product-workflow__tree-panel, .product-workflow--parameter-alarm .product-workflow__form-panel { fill: #30384d; stroke: #5b6881; stroke-width: .8; }
.product-workflow--parameter-alarm .product-workflow__heading { fill: #f5f7fb; font-size: 16px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__subheading { fill: #eef3fa; font-size: 13px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__muted { fill: #aeb9ca !important; font-size: 11px !important; }
.product-workflow--parameter-alarm .product-workflow__search { fill: #272f43; stroke: #64718a; }
.product-workflow--parameter-alarm .product-workflow__tree-panel text { fill: #e0e6f0; font-size: 12px; }
.product-workflow--parameter-alarm .product-workflow__form-row text { fill: #e3e8f1; font-size: 10.5px; }
.product-workflow--parameter-alarm .product-workflow__form-row > text:first-child { font-size: 12px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__form-row rect { fill: #252d40; stroke: #637089; }
.product-workflow--parameter-alarm .product-workflow__permission { fill: #283145; stroke: #59667f; }
.product-workflow--parameter-alarm .product-workflow__permission text { fill: #dce3ee; font-size: 10.5px; }
.product-workflow--parameter-alarm .product-workflow__saved, .product-workflow--parameter-alarm .product-workflow__validated { opacity: 0; animation-duration: var(--workflow-duration); animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-play-state: paused; }
.product-workflow--parameter-alarm .product-workflow__saved { animation-name: workflow-parameter-saved; }
.product-workflow--parameter-alarm .product-workflow__validated { animation-name: workflow-parameter-validated; }
.product-workflow--parameter-alarm .product-workflow__saved text, .product-workflow--parameter-alarm .product-workflow__validated text { font-size: 10px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__hmi-title { fill: #f7f9fd; font-size: 17px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__category-tabs text { fill: #eef2f8; font-size: 12px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__category-tabs rect { fill: #303b51; stroke: #667590; }
.product-workflow--parameter-alarm .product-workflow__category-tabs rect:first-child { fill: #4b5d78; stroke: #75d7e7; }
.product-workflow--parameter-alarm .product-workflow__param-list, .product-workflow--parameter-alarm .product-workflow__diagram, .product-workflow--parameter-alarm .product-workflow__alarm-table { fill: #293145; stroke: #5f6c85; }
.product-workflow--parameter-alarm .product-workflow__param-row text { fill: #edf1f7; font-size: 12px; }
.product-workflow--parameter-alarm .product-workflow__param-row rect { fill: #365264; stroke: #66d8c6; }
.product-workflow--parameter-alarm .product-workflow__diagram text { fill: #c4cede; font-size: 11px; }
.product-workflow--parameter-alarm .product-workflow__alarm-type-tabs text { fill: #eef2f8; font-size: 12px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__alarm-type-tabs rect { fill: #303b51; stroke: #667590; }
.product-workflow--parameter-alarm .product-workflow__alarm-type-tabs rect:first-child { fill: #4b5d78; stroke: #75d7e7; }
.product-workflow--parameter-alarm .product-workflow__form-panel > text:not(.product-workflow__heading):not(.product-workflow__subheading):not(.product-workflow__muted) { fill: #e2e8f1; font-size: 11px; }
.product-workflow--parameter-alarm .product-workflow__form-panel > rect:not(.product-workflow__permission):not(.product-workflow__severity) { fill: #252d40; stroke: #637089; }
.product-workflow--parameter-alarm .product-workflow__severity + text { fill: #ffe2e5; font-size: 10.5px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__thresholds text { fill: #f0f3f8; font-size: 11px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__alarm-summary rect { fill: #2d374c; stroke: #65738c; }
.product-workflow--parameter-alarm .product-workflow__alarm-summary text { fill: #cbd4e2; font-size: 11px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__alarm-summary text:nth-of-type(even) { fill: #f8fafd; font-size: 22px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__alarm-table-head text { fill: #b6c0d0; font-size: 10.5px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__alarm-live text, .product-workflow--parameter-alarm .product-workflow__alarm-history text { fill: #f2edf0; font-size: 11px; }

/* Parameter/alarm editor polish: keep the four compact tabs aligned to the project rail. */
.product-workflow--parameter-alarm .product-workflow__parameter-tab { overflow: visible; }
.product-workflow--parameter-alarm .product-workflow__parameter-tab-icon { fill: none; stroke: #b4c0d2; stroke-width: .9; stroke-linecap: round; stroke-linejoin: round; }
.product-workflow--parameter-alarm .product-workflow__parameter-tab text { fill: #edf2f8; font-size: 8.5px; font-weight: 650; }
.product-workflow--parameter-alarm .product-workflow__parameter-tab-active rect { fill: #5b6479; }
.product-workflow--parameter-alarm .product-workflow__parameter-tab-active path { fill: none; stroke: #f2bf32; stroke-width: 2; }

/* SVG rects and labels are siblings in this illustration, so style the actual regions explicitly. */
.product-workflow--parameter-alarm .product-workflow__stage text { fill: #e7edf5; stroke: none; }
.product-workflow--parameter-alarm .product-workflow__stage .product-workflow__heading { fill: #f7f9fd; font-size: 16px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__stage .product-workflow__subheading { fill: #eef3fa; font-size: 13px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__stage .product-workflow__muted { fill: #aeb9ca !important; font-size: 11px !important; }

/* Compact parameter-category and alarm-group trees. */
.product-workflow--parameter-alarm .product-workflow__tree-count rect { fill: #1d3044; stroke: #4c7182; stroke-width: .8; }
.product-workflow--parameter-alarm .product-workflow__tree-count text { fill: #9fe3df; font-size: 8.5px; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__search-row path { fill: none; stroke: #7ed9df; stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; }
.product-workflow--parameter-alarm .product-workflow__tree-search-label { fill: #9baac0 !important; font-size: 9.5px !important; }
.product-workflow--parameter-alarm .product-workflow__tree-group-label { fill: #f0f4fa !important; font-size: 11.5px !important; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__tree-count-label { fill: #94a7bb !important; font-size: 9px !important; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__tree-chevron { fill: none; stroke: #85dce1; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.product-workflow--parameter-alarm .product-workflow__tree-item circle { fill: #7b8da5; stroke: none; }
.product-workflow--parameter-alarm .product-workflow__tree-item text { fill: #dfe8f2 !important; font-size: 10.5px !important; }
.product-workflow--parameter-alarm .product-workflow__tree-selection { fill: #34566a; stroke: #65d9ce; stroke-width: .8; opacity: .92; }
.product-workflow--parameter-alarm .product-workflow__tree-selection-bar { fill: none; stroke: #63dfcf; stroke-width: 2.5; stroke-linecap: round; }
.product-workflow--parameter-alarm .product-workflow__tree-selection--alarm { fill: #4a3949; stroke: #e27b75; }
.product-workflow--parameter-alarm .product-workflow__tree-selection-bar--alarm { stroke: #ef7778; }
.product-workflow--parameter-alarm .product-workflow__alarm-tree-item text { fill: #e8e9f0 !important; font-size: 10.5px !important; }
.product-workflow--parameter-alarm .product-workflow__alarm-tree-dot { stroke: #1b2333; stroke-width: .8; }
.product-workflow--parameter-alarm .product-workflow__alarm-tree-dot--critical { fill: #f2767b; }
.product-workflow--parameter-alarm .product-workflow__alarm-tree-dot--warning { fill: #efb64e; }
.product-workflow--parameter-alarm .product-workflow__alarm-tree-dot--info { fill: #72c9e1; }

/* The static drilling-parameter schematic replaces the old default-black circle. */
.product-workflow--parameter-alarm .product-workflow__parameter-diagram > .product-workflow__diagram { fill: #222d42; stroke: #5f718b; stroke-width: .8; }
.product-workflow--parameter-alarm .product-workflow__diagram-status rect { fill: #214e4d; stroke: #61d7c8; stroke-width: .8; }
.product-workflow--parameter-alarm .product-workflow__diagram-status circle { fill: #65e0c5; stroke: none; }
.product-workflow--parameter-alarm .product-workflow__diagram-status text { fill: #d9fbf3 !important; font-size: 8px !important; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__diagram-scale path { fill: none; stroke: #71859e; stroke-width: .8; }
.product-workflow--parameter-alarm .product-workflow__diagram-scale text { fill: #9eafc2 !important; font-size: 8px !important; }
.product-workflow--parameter-alarm .product-workflow__borehole-wall { fill: #172539; stroke: #506b84; stroke-width: .8; }
.product-workflow--parameter-alarm .product-workflow__drill-rod { fill: #3e7180; stroke: #78dcd0; stroke-width: 1; }
.product-workflow--parameter-alarm .product-workflow__drill-bit { fill: #65d9c8; stroke: #d5fff8; stroke-width: .7; }
.product-workflow--parameter-alarm .product-workflow__diagram-current { fill: none; stroke: #5de0c5; stroke-width: 1.4; }
.product-workflow--parameter-alarm .product-workflow__diagram-target { fill: none; stroke: #e9b949; stroke-width: 1.2; stroke-dasharray: 4 3; }
.product-workflow--parameter-alarm .product-workflow__diagram-current-dot { fill: #65e0c5; stroke: #d9fff7; stroke-width: .8; }
.product-workflow--parameter-alarm .product-workflow__diagram-labels text { fill: #e2eaf2 !important; font-size: 8.5px !important; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__diagram-binding { fill: #afc1d3 !important; font-size: 8.5px !important; }

/* Standalone alarm-rule fields need their own fill instead of relying on a rect parent. */
.product-workflow--parameter-alarm .product-workflow__field { fill: #252d40; stroke: #637089; stroke-width: .8; }
.product-workflow--parameter-alarm .product-workflow__field-label { fill: #dfe7f1 !important; font-size: 10.5px !important; font-weight: 650; }
.product-workflow--parameter-alarm .product-workflow__field-value { fill: #d3deeb !important; font-size: 10.5px !important; }
.product-workflow--parameter-alarm .product-workflow__severity-label { fill: #ffe2e5 !important; font-size: 10.5px !important; font-weight: 700; }

.product-workflow__sfc-tree > rect:first-child { fill: var(--drillmind-panel, #3d465f); stroke: var(--drillmind-line, #56617b); stroke-width: .6; }
.product-workflow__sfc-tree text { fill: #dce3ee; font-size: 9.5px; }
.product-workflow__sfc-tree .product-workflow__panel-title { fill: #f4f7fb !important; font-size: 12px !important; font-weight: 750; }
.product-workflow__sfc-tree circle { fill: none; stroke: #9eabc1; stroke-width: .9; }
.product-workflow__sfc-tree path { fill: none; stroke: #9eabc1; stroke-width: .8; }
.product-workflow__sfc-tree .product-workflow__panel-close { stroke: #8894aa; stroke-width: 1; }
.product-workflow__sfc-tree-selection { fill: #343c52; opacity: .7; }
.product-workflow__sfc-editor-tabs-base { fill: #252839; stroke: #4f5b72; stroke-width: .7; }
.product-workflow__sfc-editor-tab > rect { fill: #3b455f; stroke: #596781; stroke-width: .7; }
.product-workflow__sfc-editor-tab--active > rect { fill: #4b5a76; stroke: #6a7995; }
.product-workflow__sfc-editor-tab text { fill: #f3f6fb; font-size: 11px; font-weight: 700; }
.product-workflow__sfc-editor-tab-icon { fill: none; stroke: #66e2d0; stroke-width: 1.1; }
.product-workflow__sfc-editor-tab-close { fill: none; stroke: #a4afc2; stroke-width: 1.1; stroke-linecap: round; }
.product-workflow__sfc-toolbar > rect { fill: #343c53; stroke: #56637c; stroke-width: .7; }
.product-workflow__sfc-tool { color: #eef3fb; }
.product-workflow__sfc-tool text { fill: #eef3fb; font-size: 8.5px; font-weight: 700; text-anchor: middle; }
.product-workflow__sfc-tool path, .product-workflow__sfc-tool rect { fill: none; stroke: #afbdd1; stroke-width: 1.1; stroke-linecap: round; stroke-linejoin: round; }
.product-workflow__sfc-tool rect { fill: #2e3850; }
.product-workflow__sfc-canvas { fill: #252839; stroke: #4f5b72; stroke-width: .7; }
.product-workflow__sfc-guide { fill: none; stroke: #aab7ca; stroke-opacity: .055; stroke-width: .8; stroke-dasharray: 2 9; }

.product-workflow__sfc-flow { isolation: isolate; }
.product-workflow__sfc-connector { fill: none; stroke: #8995aa; stroke-width: 1.5; stroke-linecap: round; }
.product-workflow__sfc-flow-block text { fill: #f7f9fd; font-size: 12.5px; font-weight: 700; text-anchor: middle; }
.product-workflow__sfc-start-label { font-size: 8px !important; }
.product-workflow__sfc-flow-shape { animation-duration: var(--workflow-duration); animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-play-state: paused; }
.product-workflow__sfc-flow-block--start .product-workflow__sfc-flow-shape { fill: #252839; stroke: #a7d522; stroke-width: 2; }
.product-workflow__sfc-flow-block--condition .product-workflow__sfc-flow-shape { fill: #252839; stroke: #4aaeff; stroke-width: 1.8; stroke-dasharray: 5 3; }
.product-workflow__sfc-flow-block--state .product-workflow__sfc-flow-shape { fill: #252839; stroke: #aab4c5; stroke-width: 1.8; }
.product-workflow__sfc-flow-block--mode .product-workflow__sfc-flow-shape { fill: none; stroke: #aab4c5; stroke-width: 1.8; stroke-linecap: round; }
.product-workflow__sfc-flow-block--end .product-workflow__sfc-flow-shape { fill: #252839; stroke: #9f72ff; stroke-width: 2; }
.product-workflow__sfc-flow-block--start .product-workflow__sfc-flow-shape { animation-name: workflow-sfc-highlight-start; }
.product-workflow__sfc-flow-block--condition .product-workflow__sfc-flow-shape { animation-name: workflow-sfc-highlight-condition; }
.product-workflow__sfc-flow-block--state .product-workflow__sfc-flow-shape { animation-name: workflow-sfc-highlight-state; }
.product-workflow__sfc-flow-block--mode .product-workflow__sfc-flow-shape { animation-name: workflow-sfc-highlight-mode; }
.product-workflow__sfc-flow-block--end .product-workflow__sfc-flow-shape { animation-name: workflow-sfc-highlight-end; }
.product-workflow__sfc-progress { fill: none; stroke: #64e0c8; stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; filter: drop-shadow(0 0 2px rgb(100 224 200 / 90%)); animation-duration: var(--workflow-duration); animation-timing-function: linear; animation-iteration-count: infinite; animation-play-state: paused; }
.product-workflow__sfc-progress--one { animation-name: workflow-sfc-progress-one; }
.product-workflow__sfc-progress--two { animation-name: workflow-sfc-progress-two; }
.product-workflow__sfc-progress--three { animation-name: workflow-sfc-progress-three; }
.product-workflow__sfc-progress--four { animation-name: workflow-sfc-progress-four; }

.product-workflow__sfc-vars-panel, .product-workflow__sfc-properties-panel { fill: #343c53; stroke: #66738c; stroke-width: .8; }
.product-workflow__sfc-vars-title, .product-workflow__sfc-section-title { fill: #f2f5fb; font-size: 11.5px; font-weight: 750; }
.product-workflow__sfc-vars-rule, .product-workflow__sfc-section-rule { fill: none; stroke: #7d8aa1; stroke-opacity: .72; stroke-width: .7; }
.product-workflow__sfc-table-head { fill: #b7c2d2; font-size: 8.5px; font-weight: 700; }
.product-workflow__sfc-table-row { fill: #2a3349; stroke: #596780; stroke-width: .6; }
.product-workflow__sfc-vars > text:not(.product-workflow__sfc-table-head):not(.product-workflow__sfc-vars-title) { fill: #edf2f8; font-size: 9.5px; }
.product-workflow__sfc-bool { fill: #2f705a; stroke: #63d8a4; stroke-width: .6; }
.product-workflow__sfc-bool + text { fill: #a4f3bd; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 8px; font-weight: 700; }

.product-workflow__sfc-properties > .product-workflow__panel-close { fill: none; stroke: #a6b2c5; stroke-width: 1.1; stroke-linecap: round; }
.product-workflow__sfc-property-section > rect { fill: #30394e; stroke: #65718a; stroke-width: .7; }
.product-workflow__sfc-chip { fill: #3c8fd1; stroke: #64c7ed; stroke-width: .6; }
.product-workflow__sfc-chip + text { fill: #f3fbff; font-size: 8.3px; font-weight: 750; }
.product-workflow__sfc-property-label { fill: #c6d0df; font-size: 9px; font-weight: 650; }
.product-workflow__sfc-property-section > text:not(.product-workflow__sfc-section-title):not(.product-workflow__sfc-property-label):not(.product-workflow__sfc-property-muted):not(.product-workflow__sfc-property-value) { fill: #edf2f8; font-size: 9px; }
.product-workflow__sfc-property-muted { fill: #9daabd; font-size: 8.5px; }
.product-workflow__sfc-property-value { fill: #76e1ca; font-size: 8.8px; font-weight: 700; }
.product-workflow__sfc-condition-option { fill: #252d40; stroke: #64718a; stroke-width: .6; }
.product-workflow__sfc-condition-option--active { fill: #4388b3; stroke: #75d8ef; }
.product-workflow__sfc-condition-option + text { fill: #eef3fa; font-size: 7.8px; font-weight: 650; }
.product-workflow__sfc-radio { fill: none; stroke: #9eaabd; stroke-width: 1; }
.product-workflow__sfc-radio--active { fill: #ffc51f; stroke: #ffc51f; }
.product-workflow__sfc-radio + text { fill: #f3f6fb; font-size: 8.5px; font-weight: 700; }
.product-workflow__sfc-color-swatch { fill: #252839; stroke: #8491a8; stroke-width: .7; }
.product-workflow__sfc-color-swatch--text { fill: #ffffff; }
.product-workflow__sfc-color-field { fill: #252d40; stroke: #66738c; stroke-width: .6; }
.product-workflow__sfc-color-field + text { fill: #eef2f7; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 8.5px; }
.product-workflow__monitor-shell, .product-workflow__monitor-nav > rect:first-child { fill: #1f2637; }.product-workflow__monitor-nav circle { fill: #64dc49; }.product-workflow__monitor-stage > rect:first-child { stroke: #56627a; }.product-workflow__monitor-title { fill: #f4f6fb; font-size: 13px; font-weight: 750; }.product-workflow__monitor-status circle, .product-workflow__live-pulse circle { fill: #61dfc6; }.product-workflow__monitor-status text { fill: #dce3ee; font-size: 9px; }
.product-workflow__gauges > rect, .product-workflow__monitor-metrics rect, .product-workflow__monitor-progress > rect:first-child, .product-workflow__monitor-chart > rect, .product-workflow__monitor-video > rect:first-child { fill: #222b3d; stroke: #5a6a82; }.product-workflow__gauges g > circle:first-child { fill: #1b2232; stroke: #49566d; stroke-width: 8; }.product-workflow__gauge-value { fill: none; stroke: #69dc4e; stroke-width: 5; stroke-dasharray: 190 95; transform: rotate(-90deg); }.product-workflow__gauge-value--two { stroke: #65dce0; stroke-dasharray: 145 140; }.product-workflow__gauge-value--three { stroke: #d7d85b; stroke-dasharray: 170 115; }.product-workflow__gauges g path { stroke: #f1f6fb; stroke-width: 2; }.product-workflow__gauge-needle { transform-box: fill-box; transform-origin: 0 100%; transition: transform 280ms ease-out; }.product-workflow__gauges g text { fill: #f5f8fc; font-size: 13px; font-weight: 700; text-anchor: middle; }.product-workflow__gauges g text:last-child { fill: #a7b2c5; font-size: 8px; }
.product-workflow__monitor-metrics text, .product-workflow__monitor-progress text { fill: #aeb9ca; font-size: 8px; }.product-workflow__monitor-metrics text:nth-of-type(even) { fill: #f1f5fa; font-size: 13px; font-weight: 700; }.product-workflow__monitor-progress > rect:nth-of-type(2) { fill: #182131; stroke: none; }.product-workflow__progress-value { fill: #62d9c3 !important; stroke: none !important; }.product-workflow__monitor-progress circle { fill: #d8fcf5; }
.product-workflow__chart-grid { fill: none; stroke: #718098; stroke-opacity: .2; }.product-workflow__chart-line { fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 620; stroke-dashoffset: 620; animation: workflow-chart var(--workflow-duration) ease-in-out infinite; animation-play-state: paused; }.product-workflow__chart-line--one { stroke: #5ee0c8; }.product-workflow__chart-line--two { stroke: #63a7f0; animation-delay: -1.2s; }
.product-workflow__monitor-video > rect:nth-of-type(2) { fill: #161d2b; stroke: #4b596f; }.product-workflow__mine { fill: #2d4351; stroke: #65a9b5; }.product-workflow__monitor-video circle { fill: none; stroke: #70dbc8; }.product-workflow__monitor-video path:not(.product-workflow__mine):not(.product-workflow__video-scan) { stroke: #70dbc8; }.product-workflow__video-scan { stroke: #58e3cd; opacity: .75; animation: workflow-video-scan 4s ease-in-out infinite; animation-play-state: paused; }
.product-workflow__live-pulse circle { animation: workflow-live 1.7s ease-in-out infinite; animation-play-state: paused; }
/* Legibility pass: use crisp vector text and a readable minimum size in every workflow view. */
.product-workflow { -webkit-font-smoothing: antialiased; }
.product-workflow text { font-kerning: normal; }
.product-workflow__sidebar text, .product-workflow__monitor-nav text { font-size: 11px; }
.product-workflow--sfc .product-workflow__sfc-editor-tab text { font-size: 11px; }
.product-workflow--sfc .product-workflow__sfc-tool text { font-size: 8.5px; }
.product-workflow--sfc .product-workflow__sfc-flow-block text { font-size: 12.5px; }
.product-workflow--sfc .product-workflow__sfc-vars text { font-size: 9.5px; }
.product-workflow--sfc .product-workflow__sfc-properties text { font-size: 9px; }
.product-workflow__monitor-status text { font-size: 10px; }
.product-workflow__gauges g text:last-child { font-size: 9px; }
.product-workflow__monitor-metrics text, .product-workflow__monitor-progress text { font-size: 9px; }
.product-workflow--parameter-alarm .product-workflow__parameter-tab text { font-size: 9.5px; }
.product-workflow--parameter-alarm .product-workflow__tree-search-label { font-size: 10px !important; }
.product-workflow--parameter-alarm .product-workflow__tree-group-label { font-size: 12px !important; }
.product-workflow--parameter-alarm .product-workflow__tree-item text, .product-workflow--parameter-alarm .product-workflow__alarm-tree-item text { font-size: 11.5px !important; }
.product-workflow--parameter-alarm .product-workflow__permission-label { fill: #dce3ee !important; font-size: 11px !important; }
.product-workflow--parameter-alarm .product-workflow__hmi-title { fill: #f7f9fd !important; font-size: 17px !important; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__category-tabs text { fill: #eef2f8 !important; font-size: 12px !important; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__param-row text { fill: #edf1f7 !important; font-size: 12px !important; }
.product-workflow--parameter-alarm .product-workflow__alarm-type-tabs text { fill: #eef2f8 !important; font-size: 12px !important; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__alarm-summary text { fill: #cbd4e2 !important; font-size: 11px !important; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__alarm-summary text:nth-of-type(even) { fill: #f8fafd !important; font-size: 22px !important; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__alarm-table-head text { fill: #b6c0d0 !important; font-size: 11px !important; font-weight: 700; }
.product-workflow--parameter-alarm .product-workflow__alarm-live text, .product-workflow--parameter-alarm .product-workflow__alarm-history text { fill: #f2edf0 !important; font-size: 11px !important; }
.product-workflow--parameter-alarm .product-workflow__diagram-status text { font-size: 9px !important; }
.product-workflow--parameter-alarm .product-workflow__diagram-scale text { font-size: 8.5px !important; }
.product-workflow--parameter-alarm .product-workflow__diagram-labels text { font-size: 9.5px !important; }
.product-workflow--parameter-alarm .product-workflow__diagram-binding { font-size: 9.5px !important; }
.product-workflow--parameter-alarm .product-workflow__field-label, .product-workflow--parameter-alarm .product-workflow__field-value { font-size: 11.5px !important; }
.product-workflow[data-static="true"] .product-workflow__stage { opacity: 0; animation: none; }.product-workflow[data-static="true"] .product-workflow__stage--4 { opacity: 1; }.product-workflow[data-static="true"] .product-workflow__parameter-tab-active { opacity: 0; animation: none; }.product-workflow[data-static="true"] .product-workflow__parameter-tab--4 .product-workflow__parameter-tab-active { opacity: 1; }.product-workflow[data-static="true"] .product-workflow__sfc-flow * { opacity: 1; animation: none; stroke-dashoffset: 0; }.product-workflow[data-static="true"] .product-workflow__monitor-stage * { animation: none; stroke-dashoffset: 0; }
@keyframes workflow-stage-one { 0%, 23.125% { opacity: 1; } 25%, 98.125% { opacity: 0; } 100% { opacity: 1; } } @keyframes workflow-stage-two { 0%, 23.125% { opacity: 0; } 25%, 45% { opacity: 1; } 46.875%, 100% { opacity: 0; } } @keyframes workflow-stage-three { 0%, 45% { opacity: 0; } 46.875%, 73.125% { opacity: 1; } 75%, 100% { opacity: 0; } } @keyframes workflow-stage-four { 0%, 73.125% { opacity: 0; } 75%, 98.125% { opacity: 1; } 100% { opacity: 0; } }
@keyframes workflow-parameter-saved { 0%, 10% { opacity: 0; transform: translateY(6px); } 15%, 23% { opacity: 1; transform: translateY(0); } 25%, 100% { opacity: 0; } } @keyframes workflow-parameter-validated { 0%, 58% { opacity: 0; transform: translateY(6px); } 63%, 73% { opacity: 1; transform: translateY(0); } 75%, 100% { opacity: 0; } } @keyframes workflow-ack { 0%, 78% { opacity: 0; transform: scale(.7); } 84%, 94% { opacity: 1; transform: scale(1); } 100% { opacity: 0; } }
@keyframes workflow-sfc-progress-one { 0%, 8% { stroke-dashoffset: 1; opacity: 0; } 9% { opacity: 1; } 22%, 92% { stroke-dashoffset: 0; opacity: 1; } 98%, 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes workflow-sfc-progress-two { 0%, 26% { stroke-dashoffset: 1; opacity: 0; } 27% { opacity: 1; } 40%, 92% { stroke-dashoffset: 0; opacity: 1; } 98%, 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes workflow-sfc-progress-three { 0%, 44% { stroke-dashoffset: 1; opacity: 0; } 45% { opacity: 1; } 60%, 92% { stroke-dashoffset: 0; opacity: 1; } 98%, 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes workflow-sfc-progress-four { 0%, 64% { stroke-dashoffset: 1; opacity: 0; } 65% { opacity: 1; } 80%, 92% { stroke-dashoffset: 0; opacity: 1; } 98%, 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes workflow-sfc-highlight-start { 0%, 8% { opacity: 1; filter: drop-shadow(0 0 3px rgb(100 224 200 / 95%)); } 12%, 92% { opacity: .9; filter: none; } 98%, 100% { opacity: .9; filter: none; } }
@keyframes workflow-sfc-highlight-condition { 0%, 20% { opacity: .9; filter: none; } 22%, 27% { opacity: 1; filter: drop-shadow(0 0 3px rgb(100 224 200 / 95%)); } 31%, 100% { opacity: .9; filter: none; } }
@keyframes workflow-sfc-highlight-state { 0%, 38% { opacity: .9; filter: none; } 40%, 45% { opacity: 1; filter: drop-shadow(0 0 3px rgb(100 224 200 / 95%)); } 49%, 100% { opacity: .9; filter: none; } }
@keyframes workflow-sfc-highlight-mode { 0%, 58% { opacity: .9; filter: none; } 60%, 65% { opacity: 1; filter: drop-shadow(0 0 3px rgb(100 224 200 / 95%)); } 69%, 100% { opacity: .9; filter: none; } }
@keyframes workflow-sfc-highlight-end { 0%, 78% { opacity: .9; filter: none; } 80%, 90% { opacity: 1; filter: drop-shadow(0 0 3px rgb(100 224 200 / 95%)); } 92%, 100% { opacity: .9; filter: none; } }
@keyframes workflow-chart { 0%, 18% { stroke-dashoffset: 620; } 55%, 100% { stroke-dashoffset: 0; } } @keyframes workflow-video-scan { 0%, 100% { transform: translateY(0); opacity: .2; } 50% { transform: translateY(96px); opacity: .9; } } @keyframes workflow-live { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
@media (max-width: 44rem) { .product-workflow--parameter-alarm svg { transform: scale(1.22) translateX(-5%); transform-origin: 57% center; }.product-workflow--sfc .product-workflow__sfc-vars, .product-workflow--sfc .product-workflow__sfc-properties { display: none; }.product-workflow--sfc .product-workflow__sfc-tree-item text { opacity: 0; }.product-workflow--sfc svg { transform: scale(1.24) translateX(6%); transform-origin: 46% center; }.product-workflow--monitoring svg { transform: scale(1.13) translateX(-4%); transform-origin: 59% center; } }
@media (prefers-reduced-motion: reduce) { .product-workflow svg * { animation-duration: .01ms !important; }.product-workflow[data-playing="true"] svg * { animation-duration: var(--workflow-duration) !important; } }
</style>
