<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

import PlatformVisualChrome from './PlatformVisualChrome.vue'

export type ProductWorkflowKind = 'parameter-alarm' | 'sfc' | 'monitoring'

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
          <g class="product-workflow__parameter-tab product-workflow__parameter-tab--1" data-workflow-tab="parameter-configuration" transform="translate(142 44)"><g class="product-workflow__parameter-tab-active"><rect width="92" height="27" /><path d="M0 26h92" /></g><path data-workflow-tab-icon="parameter-configuration" d="M4 8h8M4 12h8M4 16h8M7 6v4M10 10v4M6 14v4" /><text x="20" y="18">参数配置</text></g>
          <g class="product-workflow__parameter-tab product-workflow__parameter-tab--2" data-workflow-tab="parameter-management" transform="translate(234 44)"><g class="product-workflow__parameter-tab-active"><rect width="92" height="27" /><path d="M0 26h92" /></g><path data-workflow-tab-icon="parameter-management" d="M4 8c0-2 8-2 8 0v8c0 2-8 2-8 0zM4 8c0 2 8 2 8 0M4 12c0 2 8 2 8 0" /><text x="20" y="18">参数管理</text></g>
          <g class="product-workflow__parameter-tab product-workflow__parameter-tab--3" data-workflow-tab="alarm-rules" transform="translate(326 44)"><g class="product-workflow__parameter-tab-active"><rect width="92" height="27" /><path d="M0 26h92" /></g><path data-workflow-tab-icon="alarm-rules" d="M4 15h9l-2-3V9a3 3 0 0 0-6 0v3zM7 17h3" /><text x="20" y="18">报警规则</text></g>
          <g class="product-workflow__parameter-tab product-workflow__parameter-tab--4" data-workflow-tab="alarm-response" transform="translate(418 44)"><g class="product-workflow__parameter-tab-active"><rect width="92" height="27" /><path d="M0 26h92" /></g><path data-workflow-tab-icon="alarm-response" d="M8 7a5 5 0 1 1-4 2M4 6v4h4M8 9v4l3 2" /><text x="20" y="18">处置追溯</text></g>
        </g>

        <g class="product-workflow__stage product-workflow__stage--1" data-workflow-stage="parameter-configuration">
          <rect class="product-workflow__workspace" x="126" y="71" width="834" height="463" />
          <rect class="product-workflow__tree-panel" x="140" y="105" width="190" height="401" rx="4" />
          <text class="product-workflow__heading" x="156" y="132">参数分类</text>
          <rect class="product-workflow__search" x="152" y="146" width="166" height="25" rx="3" /><text x="164" y="163">搜索参数组</text>
          <text x="160" y="201">▾ 钻孔参数</text><text x="180" y="232">推进参数</text><text x="180" y="260">回转参数</text>
          <text x="160" y="297">▾ 安全参数</text><text x="180" y="328">温度限制</text><text x="180" y="356">压力限制</text>
          <rect class="product-workflow__selected" x="166" y="214" width="148" height="27" rx="3" />
          <rect class="product-workflow__form-panel" x="344" y="105" width="600" height="401" rx="4" />
          <text class="product-workflow__heading" x="364" y="134">推进参数</text><text class="product-workflow__muted" x="920" y="134" text-anchor="end">模板：钻进基础参数</text>
          <g class="product-workflow__form-row" transform="translate(364 158)"><text y="17">推进速度</text><rect x="118" width="185" height="28" rx="3" /><text x="130" y="18">$mdl.feedSpeed</text><rect x="322" width="88" height="28" rx="3" /><text x="337" y="18">0–120 mm/s</text><rect x="430" width="72" height="28" rx="3" /><text x="448" y="18">可写</text></g>
          <g class="product-workflow__form-row" transform="translate(364 202)"><text y="17">推进压力</text><rect x="118" width="185" height="28" rx="3" /><text x="130" y="18">$mdl.feedPressure</text><rect x="322" width="88" height="28" rx="3" /><text x="337" y="18">0–25 MPa</text><rect x="430" width="72" height="28" rx="3" /><text x="448" y="18">可写</text></g>
          <g class="product-workflow__form-row" transform="translate(364 246)"><text y="17">回转速度</text><rect x="118" width="185" height="28" rx="3" /><text x="130" y="18">$mdl.rotation</text><rect x="322" width="88" height="28" rx="3" /><text x="337" y="18">0–180 rpm</text><rect x="430" width="72" height="28" rx="3" /><text x="448" y="18">可写</text></g>
          <text class="product-workflow__subheading" x="364" y="323">权限与联动</text>
          <rect class="product-workflow__permission" x="364" y="341" width="258" height="62" rx="4" /><text x="380" y="366">可见权限　操作员 / 工程师</text><text x="380" y="389">写入权限　工程师</text>
          <rect class="product-workflow__permission" x="638" y="341" width="282" height="62" rx="4" /><text x="654" y="366">参数联动　推进模式 = 自动</text><text x="654" y="389">模板同步　已启用</text>
          <g class="product-workflow__saved" transform="translate(792 447)"><rect width="128" height="34" rx="17" /><circle cx="18" cy="17" r="5" /><text x="32" y="21">参数配置已保存</text></g>
        </g>

        <g class="product-workflow__stage product-workflow__stage--2" data-workflow-stage="parameter-management">
          <rect class="product-workflow__workspace" x="126" y="71" width="834" height="463" />
          <rect class="product-workflow__hmi" x="142" y="107" width="802" height="399" rx="5" :fill="`url(#${idPrefix}-hmi)`" />
          <text class="product-workflow__hmi-title" x="166" y="139">钻进参数管理</text><text class="product-workflow__muted" x="866" y="139">设备 01 · 在线</text>
          <g class="product-workflow__category-tabs"><rect x="162" y="156" width="160" height="34" rx="4" /><rect x="330" y="156" width="160" height="34" rx="4" /><rect x="498" y="156" width="160" height="34" rx="4" /><text x="209" y="178">推进参数</text><text x="377" y="178">回转参数</text><text x="545" y="178">安全参数</text></g>
          <rect class="product-workflow__param-list" x="162" y="206" width="490" height="270" rx="5" />
          <g class="product-workflow__param-row"><text x="184" y="240">推进速度</text><text x="414" y="240">68.0 mm/s</text><rect x="536" y="220" width="92" height="28" rx="14" /><text x="557" y="239">写入参数</text></g>
          <g class="product-workflow__param-row"><text x="184" y="288">推进压力</text><text x="414" y="288">12.6 MPa</text><rect x="536" y="268" width="92" height="28" rx="14" /><text x="557" y="287">写入参数</text></g>
          <g class="product-workflow__param-row"><text x="184" y="336">回转速度</text><text x="414" y="336">96 rpm</text><rect x="536" y="316" width="92" height="28" rx="14" /><text x="557" y="335">写入参数</text></g>
          <g class="product-workflow__param-row"><text x="184" y="384">钻孔深度</text><text x="414" y="384">2.30 m</text><text class="product-workflow__muted" x="554" y="384">只读</text></g>
          <rect class="product-workflow__diagram" x="672" y="206" width="248" height="270" rx="5" /><text class="product-workflow__subheading" x="692" y="236">参数示意</text><path d="M710 398h165M734 370h116M752 343h78M791 264v150M765 292h52" /><circle cx="791" cy="292" r="20" /><text x="733" y="446">所见即所得 · 权限隔离</text>
          <g class="product-workflow__cursor product-workflow__cursor--parameter"><path d="M0 0l4 18 5-7 7 8 4-4-8-7 8-3z" /><circle cx="1" cy="1" r="12" /></g>
        </g>

        <g class="product-workflow__stage product-workflow__stage--3" data-workflow-stage="alarm-rules">
          <rect class="product-workflow__workspace" x="126" y="71" width="834" height="463" />
          <rect class="product-workflow__tree-panel" x="140" y="105" width="250" height="401" rx="4" />
          <text class="product-workflow__heading" x="158" y="133">报警组</text><text class="product-workflow__muted" x="324" y="133">已启用 12</text>
          <text x="158" y="176">▾ 钻进系统</text><text x="178" y="208">推进压力过高</text><text x="178" y="240">水压开关异常</text><text x="178" y="272">钻具健康诊断</text>
          <rect class="product-workflow__selected" x="166" y="189" width="210" height="28" rx="3" />
          <g class="product-workflow__alarm-type-tabs"><rect x="410" y="105" width="160" height="38" rx="4" /><rect x="580" y="105" width="160" height="38" rx="4" /><rect x="750" y="105" width="180" height="38" rx="4" /><text x="454" y="130">限值报警</text><text x="624" y="130">开关报警</text><text x="794" y="130">功能块报警</text></g>
          <rect class="product-workflow__form-panel" x="410" y="157" width="520" height="349" rx="4" />
          <text class="product-workflow__heading" x="430" y="187">推进压力过高</text><rect class="product-workflow__severity" x="820" y="170" width="88" height="26" rx="13" /><text x="844" y="188">严重</text>
          <text x="430" y="225">监测目标</text><rect x="530" y="207" width="354" height="28" rx="3" /><text x="544" y="226">$mdl.feedPressure</text>
          <text x="430" y="269">前置条件</text><rect x="530" y="251" width="354" height="28" rx="3" /><text x="544" y="270">推进模式 = 自动　·　延时 2s</text>
          <text class="product-workflow__subheading" x="430" y="315">分级阈值与死区</text>
          <g class="product-workflow__thresholds"><rect x="430" y="331" width="104" height="64" rx="4" /><rect x="544" y="331" width="104" height="64" rx="4" /><rect x="658" y="331" width="104" height="64" rx="4" /><rect x="772" y="331" width="104" height="64" rx="4" /><text x="474" y="352">LL</text><text x="588" y="352">L</text><text x="702" y="352">H</text><text x="816" y="352">HH</text><text x="463" y="379">4.0</text><text x="577" y="379">6.0</text><text x="691" y="379">20.0</text><text x="805" y="379">23.0</text></g>
          <text x="430" y="431">消息模板</text><rect x="530" y="413" width="354" height="28" rx="3" /><text x="544" y="432">推进压力达到 {value} MPa，请检查液压回路</text>
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
        <g class="product-workflow__sidebar product-workflow__sfc-tree">
          <rect x="0" y="44" width="208" height="490" />
          <text class="product-workflow__panel-title" x="14" y="68">任务组</text>
          <text x="16" y="105">▾ 00 主流程</text><text x="38" y="136">手动流程</text><text x="38" y="164">自动流程</text><text x="38" y="192">急停流程</text>
          <text x="16" y="232">▾ 02 扫描</text><text x="38" y="263">巷道左侧扫描</text><text x="38" y="291">巷道右侧扫描</text>
          <text x="16" y="331">▾ 03 规划</text><text x="38" y="362">路径规划</text><text x="38" y="390">目标孔规划</text>
          <rect class="product-workflow__sidebar-active" x="24" y="119" width="170" height="27" rx="3" />
        </g>
        <g class="product-workflow__sfc-toolbar">
          <rect x="208" y="44" width="752" height="47" />
          <text x="230" y="73">主流程</text><path d="M320 57v19M343 57v19M366 57v19" />
          <g transform="translate(690 54)"><rect width="74" height="27" rx="4" /><circle cx="14" cy="13.5" r="4" /><text x="26" y="18">调试模式</text></g>
          <g transform="translate(774 54)"><rect width="70" height="27" rx="4" /><path d="M12 8l10 6-10 6z" /><text x="28" y="18">运行</text></g>
          <g transform="translate(854 54)"><rect width="78" height="27" rx="4" /><text x="18" y="18">监控</text></g>
        </g>
        <rect class="product-workflow__sfc-canvas" x="208" y="91" width="752" height="443" />
        <rect x="208" y="91" width="752" height="443" :fill="`url(#${idPrefix}-grid)`" />

        <g class="product-workflow__sfc-palette">
          <rect x="222" y="107" width="105" height="245" rx="4" />
          <text class="product-workflow__heading" x="238" y="134">节点</text>
          <g transform="translate(239 153)"><circle cx="10" cy="10" r="8" /><text x="28" y="14">开始</text></g>
          <g transform="translate(239 190)"><rect x="1" y="1" width="20" height="18" /><text x="28" y="14">步骤</text></g>
          <g transform="translate(239 227)"><path d="M1 10h20" /><text x="28" y="14">转换</text></g>
          <g transform="translate(239 264)"><rect x="1" y="1" width="20" height="18" /><path d="M6 1v18M16 1v18" /><text x="28" y="14">并行</text></g>
          <g transform="translate(239 301)"><rect x="1" y="1" width="20" height="18" /><text x="28" y="14">子流程</text></g>
        </g>

        <g class="product-workflow__sfc-flow">
          <path class="product-workflow__sfc-link" d="M515 133v43M515 220v38M515 302v42M515 388v40M515 472v24" :marker-end="`url(#${idPrefix}-arrow)`" />
          <path class="product-workflow__sfc-branch" d="M515 302v20H402v52M515 322h116v52M402 418v24h113M631 418v24H515" />
          <g class="product-workflow__sfc-node product-workflow__sfc-node--start"><circle cx="515" cy="126" r="16" /><path d="M508 116l14 10-14 10z" /><text x="542" y="131">开始</text></g>
          <g class="product-workflow__sfc-node product-workflow__sfc-node--one"><rect x="456" y="176" width="118" height="44" rx="3" /><text x="515" y="203">设备自检</text></g>
          <g class="product-workflow__sfc-transition product-workflow__sfc-transition--one"><path d="M454 258h122" /><text x="515" y="250">自检完成 == true</text></g>
          <g class="product-workflow__sfc-node product-workflow__sfc-node--two"><rect x="456" y="258" width="118" height="44" rx="3" /><text x="515" y="285">待机就绪</text></g>
          <g class="product-workflow__sfc-node product-workflow__sfc-node--three"><rect x="343" y="374" width="118" height="44" rx="3" /><text x="402" y="401">手动流程</text></g>
          <g class="product-workflow__sfc-node product-workflow__sfc-node--four"><rect x="572" y="374" width="118" height="44" rx="3" /><text x="631" y="401">自动流程</text></g>
          <g class="product-workflow__sfc-transition product-workflow__sfc-transition--two"><path d="M454 450h122" /><text x="515" y="466">急停信号 == false</text></g>
          <g class="product-workflow__sfc-breakpoint"><circle cx="574" cy="450" r="7" /><text x="588" y="454">断点 01</text></g>
          <circle class="product-workflow__sfc-runner" cx="515" cy="126" r="7" :filter="`url(#${idPrefix}-glow)`" />
        </g>

        <g class="product-workflow__sfc-vars">
          <rect x="720" y="107" width="220" height="228" rx="5" />
          <text class="product-workflow__heading" x="738" y="135">运行变量</text><text class="product-workflow__muted" x="867" y="135">当前周期</text>
          <path d="M736 151h188" />
          <text x="738" y="179">复位信号</text><text x="865" y="179">false</text>
          <text x="738" y="211">急停信号</text><text x="865" y="211">false</text>
          <text x="738" y="243">自动开关</text><text class="product-workflow__value" x="865" y="243">true</text>
          <text x="738" y="275">流程模式</text><text x="865" y="275">AUTO</text>
          <text x="738" y="307">模型联动</text><text class="product-workflow__value" x="842" y="307">双向</text>
        </g>
        <g class="product-workflow__sfc-validation" transform="translate(731 358)"><rect width="198" height="54" rx="5" /><circle cx="24" cy="27" r="10" /><path d="M19 27l4 4 8-9" /><text x="45" y="24">流程规则校验通过</text><text class="product-workflow__muted" x="45" y="41">0 错误 · 0 警告</text></g>
        <g class="product-workflow__sfc-debug" transform="translate(731 430)"><rect width="198" height="58" rx="5" /><text x="16" y="23">已暂停在断点 01</text><rect x="16" y="32" width="72" height="19" rx="9.5" /><text x="28" y="46">单步执行</text><rect x="98" y="32" width="82" height="19" rx="9.5" /><text x="110" y="46">运行到下一步</text></g>
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
.product-workflow svg { width: 100%; height: 100%; display: block; font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif; shape-rendering: geometricPrecision; }
.product-workflow__sidebar rect:first-child, .product-workflow__monitor-nav > rect:first-child { fill: #252c3e; stroke: #505b72; stroke-width: .6; }
.product-workflow__sidebar text, .product-workflow__monitor-nav text { fill: #d9dfec; font-size: 10px; }.product-workflow__panel-title { fill: #f3f6fb !important; font-size: 11px !important; font-weight: 700; }
.product-workflow__sidebar-active { fill: #43516b !important; stroke: #6b7893 !important; }.product-workflow__workspace { fill: #1d2435; }
.product-workflow__sfc-toolbar > rect { fill: var(--drillmind-toolbar, #424b65); stroke: var(--drillmind-line, #56617b); stroke-width: .6; }
.product-workflow__stage { opacity: 0; animation-duration: var(--workflow-duration); animation-timing-function: linear; animation-iteration-count: infinite; animation-play-state: paused; }.product-workflow__stage--1 { animation-name: workflow-stage-one; }.product-workflow__stage--2 { animation-name: workflow-stage-two; }.product-workflow__stage--3 { animation-name: workflow-stage-three; }.product-workflow__stage--4 { animation-name: workflow-stage-four; }
.product-workflow[data-playing="true"] .product-workflow__stage, .product-workflow[data-playing="true"] .product-workflow__parameter-tab-active, .product-workflow[data-playing="true"] .product-workflow__saved, .product-workflow[data-playing="true"] .product-workflow__validated, .product-workflow[data-playing="true"] .product-workflow__sfc-flow *, .product-workflow[data-playing="true"] .product-workflow__sfc-validation, .product-workflow[data-playing="true"] .product-workflow__sfc-debug, .product-workflow[data-playing="true"] .product-workflow__monitor-stage *, .product-workflow[data-playing="true"] .product-workflow__cursor { animation-play-state: running; }
.product-workflow__tree-panel, .product-workflow__form-panel { fill: #272f42; stroke: #55617a; }.product-workflow__search, .product-workflow__form-row rect, .product-workflow__form-panel > rect:not(.product-workflow__permission), .product-workflow__alarm-type-tabs rect { fill: #1e2637; stroke: #59667e; }
.product-workflow__heading, .product-workflow__subheading { fill: #f1f4fa; font-size: 12px; font-weight: 700; }.product-workflow__subheading { font-size: 10px; }.product-workflow__muted { fill: #9aa6bd !important; font-size: 8px !important; }.product-workflow__selected { fill: #40506b; }
.product-workflow__tree-panel text, .product-workflow__form-panel text, .product-workflow__form-row text, .product-workflow__permission text, .product-workflow__alarm-type-tabs text, .product-workflow__thresholds text { fill: #d6ddea; font-size: 8px; }.product-workflow__form-row > text:first-child { font-size: 9px; }
.product-workflow__permission { fill: #202a3b; stroke: #4b5971; }.product-workflow__saved rect, .product-workflow__validated rect { fill: #254a48; stroke: #57d7c0; }.product-workflow__saved circle, .product-workflow__validated circle { fill: #5de0c5; }.product-workflow__saved text, .product-workflow__validated text { fill: #dffbf5; font-size: 8px; }
.product-workflow__hmi { stroke: #68748e; stroke-width: .8; }.product-workflow__hmi-title { fill: #f5f7fb; font-size: 13px; font-weight: 750; }.product-workflow__category-tabs rect { fill: #28344a; stroke: #60708c; }.product-workflow__category-tabs rect:first-child { fill: #426182; stroke: #62c6e6; }.product-workflow__category-tabs text { fill: #e8edf5; font-size: 9px; font-weight: 650; }
.product-workflow__param-list, .product-workflow__diagram, .product-workflow__alarm-table { fill: #20283a; stroke: #56637c; }.product-workflow__param-row text { fill: #e1e6ef; font-size: 10px; }.product-workflow__param-row rect { fill: #2f5361; stroke: #54d5c4; }.product-workflow__param-row + .product-workflow__param-row { transform: translateY(0); }.product-workflow__diagram text { fill: #aab6c9; font-size: 9px; }.product-workflow__diagram path, .product-workflow__diagram circle { fill: none; stroke: #72bfd2; stroke-width: 2; }
.product-workflow__cursor { transform: translate(576px, 236px); animation: workflow-cursor var(--workflow-duration) ease-in-out infinite; animation-play-state: paused; }.product-workflow__cursor path { fill: #f5fbff; stroke: #172130; }.product-workflow__cursor circle { fill: none; stroke: #55e0c6; opacity: .7; }
.product-workflow__severity { fill: #7b353e; stroke: #e07177; }.product-workflow__form-panel > .product-workflow__severity + text { fill: #ffd9dc; font-size: 8px; }.product-workflow__thresholds rect { fill: #252e42; stroke: #65718a; }.product-workflow__thresholds rect:nth-child(4) { fill: #67333d; stroke: #dd6d76; }.product-workflow__thresholds text { text-anchor: middle; }
.product-workflow__alarm-summary rect { fill: #253044; stroke: #5c6b86; }.product-workflow__alarm-summary text { fill: #dce3ef; font-size: 9px; }.product-workflow__alarm-summary text:nth-of-type(even) { fill: #f5f8fd; font-size: 20px; font-weight: 750; }.product-workflow__alarm-table-head text { fill: #9eabc0; font-size: 8px; }.product-workflow__alarm-live rect { fill: #552c38; stroke: #de6975; }.product-workflow__alarm-live circle { fill: #f26471; }.product-workflow__alarm-live text, .product-workflow__alarm-history text { fill: #f0e7eb; font-size: 9px; }.product-workflow__alarm-live > rect:nth-last-of-type(1) { fill: #3c5664; stroke: #58d7c4; }.product-workflow__alarm-history rect { fill: #252f41; stroke: #536077; }.product-workflow__alarm-history circle { fill: #5bd5bc; }.product-workflow__ack { opacity: 0; animation: workflow-ack var(--workflow-duration) ease-in-out infinite; }.product-workflow__ack circle { fill: #235c51; stroke: #62e2c9; }.product-workflow__ack path { fill: none; stroke: #dffff7; stroke-width: 3; }

.product-workflow--parameter-alarm svg { font-synthesis: none; text-rendering: optimizeLegibility; }
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
.product-workflow__sfc-toolbar text { fill: #eef2f8; font-size: 9px; font-weight: 650; }.product-workflow__sfc-toolbar path { stroke: #9da8bc; }.product-workflow__sfc-toolbar g rect { fill: #293246; stroke: #68758e; }.product-workflow__sfc-toolbar g circle { fill: #f15e66; }.product-workflow__sfc-canvas { fill: #22283a; }
.product-workflow__sfc-palette > rect, .product-workflow__sfc-vars > rect, .product-workflow__sfc-validation rect, .product-workflow__sfc-debug rect { fill: #30384d; stroke: #5e6982; }.product-workflow__sfc-palette text, .product-workflow__sfc-vars text, .product-workflow__sfc-validation text, .product-workflow__sfc-debug text { fill: #e1e6f0; font-size: 8px; }.product-workflow__sfc-palette circle, .product-workflow__sfc-palette rect, .product-workflow__sfc-palette path { fill: none; stroke: #d160d8; }
.product-workflow__sfc-link, .product-workflow__sfc-branch { fill: none; stroke: #7e899f; stroke-width: 1.5; stroke-dasharray: 480; stroke-dashoffset: 480; animation: workflow-sfc-draw var(--workflow-duration) ease-in-out infinite; animation-play-state: paused; }.product-workflow__sfc-node, .product-workflow__sfc-transition { opacity: 0; animation: workflow-sfc-node var(--workflow-duration) ease-in-out infinite; animation-play-state: paused; }.product-workflow__sfc-node--one { animation-delay: -1s; }.product-workflow__sfc-node--two { animation-delay: -2s; }.product-workflow__sfc-node--three, .product-workflow__sfc-node--four { animation-delay: -3s; }.product-workflow__sfc-transition { animation-delay: -2.5s; }
.product-workflow__sfc-node rect { fill: #31394e; stroke: #abb4c6; stroke-width: 1.5; }.product-workflow__sfc-node circle { fill: #334965; stroke: #b9c4d6; }.product-workflow__sfc-node path { fill: #d9e3f0; }.product-workflow__sfc-node text, .product-workflow__sfc-transition text { fill: #f2f4f8; font-size: 10px; text-anchor: middle; }.product-workflow__sfc-transition path { stroke: #b9c2d2; stroke-width: 2; }
.product-workflow__sfc-runner { fill: #72df4c; offset-path: path("M515 126v176m0 20h116v96m0 24H515v54"); animation: workflow-sfc-run var(--workflow-duration) linear infinite; animation-play-state: paused; }.product-workflow__sfc-breakpoint circle { fill: #f05c67; }.product-workflow__sfc-breakpoint text { fill: #ffbec3; font-size: 8px; }.product-workflow__sfc-vars path { stroke: #59657a; }.product-workflow__value { fill: #65e0c5 !important; }.product-workflow__sfc-validation, .product-workflow__sfc-debug { opacity: 0; animation: workflow-sfc-panel var(--workflow-duration) ease-in-out infinite; animation-play-state: paused; }.product-workflow__sfc-validation circle { fill: #2c6758; stroke: #65e2c8; }.product-workflow__sfc-validation path { fill: none; stroke: #dffef5; stroke-width: 2; }.product-workflow__sfc-debug { animation-delay: -4s; }.product-workflow__sfc-debug rect { stroke: #d75f69; }.product-workflow__sfc-debug > rect:not(:first-child) { fill: #3a4b5c; stroke: #69c9d3; }
.product-workflow__monitor-shell, .product-workflow__monitor-nav > rect:first-child { fill: #1f2637; }.product-workflow__monitor-nav circle { fill: #64dc49; }.product-workflow__monitor-stage > rect:first-child { stroke: #56627a; }.product-workflow__monitor-title { fill: #f4f6fb; font-size: 13px; font-weight: 750; }.product-workflow__monitor-status circle, .product-workflow__live-pulse circle { fill: #61dfc6; }.product-workflow__monitor-status text { fill: #dce3ee; font-size: 9px; }
.product-workflow__gauges > rect, .product-workflow__monitor-metrics rect, .product-workflow__monitor-progress > rect:first-child, .product-workflow__monitor-chart > rect, .product-workflow__monitor-video > rect:first-child { fill: #222b3d; stroke: #5a6a82; }.product-workflow__gauges g > circle:first-child { fill: #1b2232; stroke: #49566d; stroke-width: 8; }.product-workflow__gauge-value { fill: none; stroke: #69dc4e; stroke-width: 5; stroke-dasharray: 190 95; transform: rotate(-90deg); }.product-workflow__gauge-value--two { stroke: #65dce0; stroke-dasharray: 145 140; }.product-workflow__gauge-value--three { stroke: #d7d85b; stroke-dasharray: 170 115; }.product-workflow__gauges g path { stroke: #f1f6fb; stroke-width: 2; }.product-workflow__gauge-needle { transform-box: fill-box; transform-origin: 0 100%; transition: transform 280ms ease-out; }.product-workflow__gauges g text { fill: #f5f8fc; font-size: 13px; font-weight: 700; text-anchor: middle; }.product-workflow__gauges g text:last-child { fill: #a7b2c5; font-size: 8px; }
.product-workflow__monitor-metrics text, .product-workflow__monitor-progress text { fill: #aeb9ca; font-size: 8px; }.product-workflow__monitor-metrics text:nth-of-type(even) { fill: #f1f5fa; font-size: 13px; font-weight: 700; }.product-workflow__monitor-progress > rect:nth-of-type(2) { fill: #182131; stroke: none; }.product-workflow__progress-value { fill: #62d9c3 !important; stroke: none !important; }.product-workflow__monitor-progress circle { fill: #d8fcf5; }
.product-workflow__chart-grid { fill: none; stroke: #718098; stroke-opacity: .2; }.product-workflow__chart-line { fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 620; stroke-dashoffset: 620; animation: workflow-chart var(--workflow-duration) ease-in-out infinite; animation-play-state: paused; }.product-workflow__chart-line--one { stroke: #5ee0c8; }.product-workflow__chart-line--two { stroke: #63a7f0; animation-delay: -1.2s; }
.product-workflow__monitor-video > rect:nth-of-type(2) { fill: #161d2b; stroke: #4b596f; }.product-workflow__mine { fill: #2d4351; stroke: #65a9b5; }.product-workflow__monitor-video circle { fill: none; stroke: #70dbc8; }.product-workflow__monitor-video path:not(.product-workflow__mine):not(.product-workflow__video-scan) { stroke: #70dbc8; }.product-workflow__video-scan { stroke: #58e3cd; opacity: .75; animation: workflow-video-scan 4s ease-in-out infinite; animation-play-state: paused; }
.product-workflow__live-pulse circle { animation: workflow-live 1.7s ease-in-out infinite; animation-play-state: paused; }
.product-workflow[data-static="true"] .product-workflow__stage { opacity: 0; animation: none; }.product-workflow[data-static="true"] .product-workflow__stage--4 { opacity: 1; }.product-workflow[data-static="true"] .product-workflow__parameter-tab-active { opacity: 0; animation: none; }.product-workflow[data-static="true"] .product-workflow__parameter-tab--4 .product-workflow__parameter-tab-active { opacity: 1; }.product-workflow[data-static="true"] .product-workflow__sfc-flow *, .product-workflow[data-static="true"] .product-workflow__sfc-validation, .product-workflow[data-static="true"] .product-workflow__sfc-debug { opacity: 1; animation: none; stroke-dashoffset: 0; }.product-workflow[data-static="true"] .product-workflow__sfc-runner { display: none; }.product-workflow[data-static="true"] .product-workflow__monitor-stage * { animation: none; stroke-dashoffset: 0; }
@keyframes workflow-stage-one { 0%, 23.125% { opacity: 1; } 25%, 98.125% { opacity: 0; } 100% { opacity: 1; } } @keyframes workflow-stage-two { 0%, 23.125% { opacity: 0; } 25%, 45% { opacity: 1; } 46.875%, 100% { opacity: 0; } } @keyframes workflow-stage-three { 0%, 45% { opacity: 0; } 46.875%, 73.125% { opacity: 1; } 75%, 100% { opacity: 0; } } @keyframes workflow-stage-four { 0%, 73.125% { opacity: 0; } 75%, 98.125% { opacity: 1; } 100% { opacity: 0; } }
@keyframes workflow-parameter-saved { 0%, 10% { opacity: 0; transform: translateY(6px); } 15%, 23% { opacity: 1; transform: translateY(0); } 25%, 100% { opacity: 0; } } @keyframes workflow-parameter-validated { 0%, 58% { opacity: 0; transform: translateY(6px); } 63%, 73% { opacity: 1; transform: translateY(0); } 75%, 100% { opacity: 0; } } @keyframes workflow-cursor { 0%, 27% { transform: translate(576px, 236px); } 34%, 43% { transform: translate(590px, 283px); } 47%, 100% { transform: translate(606px, 236px); } } @keyframes workflow-ack { 0%, 78% { opacity: 0; transform: scale(.7); } 84%, 94% { opacity: 1; transform: scale(1); } 100% { opacity: 0; } }
@keyframes workflow-sfc-draw { 0%, 14% { stroke-dashoffset: 480; } 42%, 100% { stroke-dashoffset: 0; } } @keyframes workflow-sfc-node { 0%, 12% { opacity: 0; transform: translateY(8px); } 30%, 100% { opacity: 1; transform: translateY(0); } } @keyframes workflow-sfc-run { 0%, 50% { offset-distance: 0%; opacity: 0; } 55% { opacity: 1; } 92% { offset-distance: 100%; opacity: 1; } 100% { offset-distance: 100%; opacity: 0; } } @keyframes workflow-sfc-panel { 0%, 38% { opacity: 0; transform: translateY(8px); } 52%, 100% { opacity: 1; transform: translateY(0); } }
@keyframes workflow-chart { 0%, 18% { stroke-dashoffset: 620; } 55%, 100% { stroke-dashoffset: 0; } } @keyframes workflow-video-scan { 0%, 100% { transform: translateY(0); opacity: .2; } 50% { transform: translateY(96px); opacity: .9; } } @keyframes workflow-live { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
@media (max-width: 44rem) { .product-workflow--parameter-alarm svg { transform: scale(1.22) translateX(-5%); transform-origin: 57% center; }.product-workflow--sfc svg { transform: scale(1.17) translateX(-4%); transform-origin: 59% center; }.product-workflow--monitoring svg { transform: scale(1.13) translateX(-4%); transform-origin: 59% center; } }
@media (prefers-reduced-motion: reduce) { .product-workflow svg * { animation-duration: .01ms !important; }.product-workflow[data-playing="true"] svg * { animation-duration: var(--workflow-duration) !important; } }
</style>
