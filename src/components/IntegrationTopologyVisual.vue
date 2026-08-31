<script setup lang="ts">
defineProps<{ label: string }>()

type TopologyBus = 'application' | 'can1' | 'can2' | 'tcp'

type TopologyNode = {
  id: string
  x: number
  y: number
  width: number
  height: number
  label: string
  lines: readonly string[]
  bus?: 'can1' | 'tcp'
  connected?: boolean
}

type TopologyLink = {
  id: string
  sourceBus: TopologyBus
  targetId: string
  path: string
  timeline: string
  motionBegin: string
}

type ExtensionSlot = {
  id: string
  x: number
  y: number
  width: number
  height: number
  label: string
  timeline: string
}

const headerMenus = [
  { id: 'save', x: 128, label: '保存工程' },
  { id: 'edit', x: 190, label: '编辑工程' },
  { id: 'start', x: 252, label: '启动工程' },
  { id: 'upload', x: 314, label: '上传资产' },
  { id: 'about', x: 376, label: '关于' },
  { id: 'help', x: 438, label: '帮助' },
] as const

const appNodes: readonly TopologyNode[] = [
  { id: 'vehicle', x: 118, y: 112, width: 88, height: 42, label: '车载操作软件', lines: ['车载操作软件'] },
  { id: 'history', x: 214, y: 112, width: 88, height: 42, label: '历史版本备份', lines: ['历史版本备份'] },
  { id: 'keyboard', x: 310, y: 112, width: 88, height: 42, label: '软键盘操控', lines: ['软键盘操控'] },
  { id: 'settings', x: 406, y: 112, width: 78, height: 42, label: '设置', lines: ['设置'] },
  { id: 'video', x: 492, y: 112, width: 88, height: 42, label: '视频显示应用', lines: ['视频显示应用'] },
  { id: 'showcase', x: 588, y: 112, width: 88, height: 42, label: '展示应用', lines: ['展示应用'] },
  { id: 'share', x: 684, y: 112, width: 82, height: 42, label: 'Share', lines: ['Share'] },
]

const driverNodes: readonly TopologyNode[] = [
  { id: 'can-dptp', x: 468, y: 346, width: 142, height: 34, label: 'DRV-CanOpen-DPTP', lines: ['DRV-CanOpen-DPTP'], bus: 'can1', connected: true },
  { id: 'can-drill-arm1', x: 468, y: 389, width: 142, height: 38, label: 'DRV-CanOpen-DrillArm1', lines: ['DRV-CanOpen-', 'DrillArm1'], bus: 'can1', connected: true },
  { id: 'can-power', x: 468, y: 436, width: 142, height: 34, label: 'DRV-CanOpen-Power', lines: ['DRV-CanOpen-Power'], bus: 'can1', connected: true },
  { id: 'tcp-sim', x: 654, y: 342, width: 130, height: 38, label: 'DRV-CanOpen-SIM', lines: ['DRV-CanOpen-SIM'], bus: 'tcp', connected: true },
  { id: 'floating-plan', x: 802, y: 394, width: 132, height: 36, label: 'DRV-Drill-Plan', lines: ['DRV-Drill-Plan'], connected: false },
  { id: 'floating-lidar', x: 802, y: 446, width: 132, height: 36, label: 'DRV-Lidar-Drill', lines: ['DRV-Lidar-Drill'], connected: false },
]

const emptyNode: TopologyNode = {
  id: 'tcp-empty',
  x: 654,
  y: 300,
  width: 104,
  height: 28,
  label: 'Empty',
  lines: ['Empty'],
  bus: 'tcp',
  connected: true,
}

function flowTimeline(start: number): string {
  return `0;${start.toFixed(3)};${(start + 0.045).toFixed(3)};0.9;1`
}

const appLinks: readonly TopologyLink[] = appNodes.map((node, index) => ({
  id: `app-link-${index + 1}`,
  sourceBus: 'application',
  targetId: 'edge-server',
  path: `M ${node.x + node.width / 2} ${node.y + node.height} L 395 220`,
  timeline: flowTimeline(0.08 + index * 0.022),
  motionBegin: `${(0.9 + index * 0.12).toFixed(2)}s`,
}))

const canLinks: readonly TopologyLink[] = [
  { id: 'can2-link-extension', sourceBus: 'can2', targetId: 'extension-can2', path: 'M 350 284 V 386 H 282', timeline: flowTimeline(0.33), motionBegin: '3.05s' },
  { id: 'can1-link-dptp', sourceBus: 'can1', targetId: 'can-dptp', path: 'M 418 284 V 363 H 468', timeline: flowTimeline(0.36), motionBegin: '3.25s' },
  { id: 'can1-link-drill-arm1', sourceBus: 'can1', targetId: 'can-drill-arm1', path: 'M 418 284 V 408 H 468', timeline: flowTimeline(0.39), motionBegin: '3.45s' },
  { id: 'can1-link-power', sourceBus: 'can1', targetId: 'can-power', path: 'M 418 284 V 453 H 468', timeline: flowTimeline(0.42), motionBegin: '3.65s' },
  { id: 'can1-link-extension', sourceBus: 'can1', targetId: 'extension-can1', path: 'M 418 284 V 497 H 468', timeline: flowTimeline(0.45), motionBegin: '3.85s' },
]

const tcpLinks: readonly TopologyLink[] = [
  { id: 'tcp-link-empty', sourceBus: 'tcp', targetId: 'tcp-empty', path: 'M 490 252 H 628 V 314 H 654', timeline: flowTimeline(0.52), motionBegin: '4.7s' },
  { id: 'tcp-link-sim', sourceBus: 'tcp', targetId: 'tcp-sim', path: 'M 490 252 H 628 V 361 H 654', timeline: flowTimeline(0.56), motionBegin: '4.95s' },
  { id: 'tcp-link-extension', sourceBus: 'tcp', targetId: 'extension-tcp', path: 'M 490 252 H 628 V 412 H 654', timeline: flowTimeline(0.6), motionBegin: '5.2s' },
]

const extensionSlots: readonly ExtensionSlot[] = [
  { id: 'application', x: 782, y: 112, width: 58, height: 42, label: 'MODULE', timeline: '0;0.46;0.5;0.72;0.8;1' },
  { id: 'can2', x: 214, y: 365, width: 68, height: 42, label: 'DRV-NEW', timeline: '0;0.54;0.58;0.76;0.84;1' },
  { id: 'can1', x: 468, y: 480, width: 68, height: 34, label: 'DRV-NEW', timeline: '0;0.62;0.66;0.82;0.88;1' },
  { id: 'tcp', x: 654, y: 393, width: 68, height: 38, label: 'DRV-NEW', timeline: '0;0.7;0.74;0.86;0.92;1' },
]
</script>

<template>
  <div class="integration-topology" role="img" :aria-label="label">
    <svg viewBox="0 0 960 540" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="topology-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#202638" />
          <stop offset="1" stop-color="#24293b" />
        </linearGradient>
        <linearGradient id="topology-hub" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2d3834" />
          <stop offset="1" stop-color="#29312f" />
        </linearGradient>
        <linearGradient id="topology-card" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#222a40" />
          <stop offset="1" stop-color="#202538" />
        </linearGradient>
        <radialGradient id="topology-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="#27b8ff" stop-opacity="0.12" />
          <stop offset="1" stop-color="#27b8ff" stop-opacity="0" />
        </radialGradient>
        <filter id="topology-line-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width="960" height="540" rx="18" fill="url(#topology-panel)" />

      <g class="integration-topology__platform" data-platform-shell="true">
        <g class="integration-topology__main-menu" data-platform-region="main-menu">
          <rect width="960" height="38" />
          <g class="integration-topology__brand" transform="translate(12 8)">
            <path d="M 0 15 L 6 1 L 11 8 L 7 19 Z" />
            <path d="M 8 2 L 15 6 L 12 12 Z" />
            <path d="M 9 13 L 17 8 L 15 18 Z" />
            <text x="23" y="16">DrillMind</text>
          </g>
          <g v-for="menu in headerMenus" :key="menu.id" class="integration-topology__menu-item" :transform="`translate(${menu.x} 4)`">
            <circle cx="15" cy="7" r="3.2" />
            <path d="M 11 7 H 19 M 15 3 V 11" />
            <text x="15" y="27">{{ menu.label }}</text>
          </g>
          <g class="integration-topology__runtime" transform="translate(742 6)">
            <rect width="88" height="26" rx="3" />
            <path d="M 9 7 V 16 M 5 12 L 9 16 L 13 12 M 5 20 H 13" />
            <text x="19" y="13">下载运行时</text>
            <text x="19" y="21">EdgeClr · EdgeHmi</text>
          </g>
          <g class="integration-topology__window-actions" transform="translate(844 12)">
            <rect x="0" width="10" height="10" rx="1" />
            <rect x="27" width="10" height="10" rx="1" />
            <rect x="54" width="10" height="10" rx="1" />
            <path d="M 82 0 V 10 M 77 5 H 87 M 108 1 L 116 9 M 116 1 L 108 9" />
          </g>
        </g>

        <g class="integration-topology__device-tab" data-platform-region="device-tab">
          <rect y="38" width="960" height="22" />
          <rect y="38" width="82" height="22" class="integration-topology__device-tab-active" />
          <circle cx="13" cy="49" r="4" />
          <path d="M 11 49 H 15 M 13 47 V 51" />
          <text x="24" y="53">设备</text>
          <path d="M 65 46 L 71 52 M 71 46 L 65 52" />
        </g>

        <g class="integration-topology__toolbar" data-platform-region="toolbar">
          <rect y="60" width="960" height="28" />
          <g transform="translate(16 63)"><path d="M 6 4 H 14 M 8 4 V 2 H 12 V 4 M 8 7 V 16 M 12 7 V 16" /><text x="10" y="24">删除</text></g>
          <g transform="translate(54 63)"><circle cx="10" cy="8" r="5" /><path d="M 14 12 L 18 16 M 7 8 H 13 M 10 5 V 11" /><text x="10" y="24">放大</text></g>
          <g transform="translate(92 63)"><circle cx="10" cy="8" r="5" /><path d="M 14 12 L 18 16 M 7 8 H 13" /><text x="10" y="24">缩小</text></g>
          <g transform="translate(132 63)"><rect x="4" y="2" width="12" height="12" rx="1" /><path d="M 7 5 H 13 V 11 H 7 Z" /><text x="10" y="24">适应</text></g>
        </g>
      </g>

      <rect y="88" width="960" height="434" fill="#23283a" />
      <ellipse cx="440" cy="310" rx="330" ry="205" fill="url(#topology-glow)" />
      <g class="integration-topology__grid" aria-hidden="true">
        <path v-for="x in [80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880]" :key="`v-${x}`" :d="`M ${x} 96 V 514`" />
        <path v-for="y in [120, 180, 240, 300, 360, 420, 480]" :key="`h-${y}`" :d="`M 18 ${y} H 942`" />
      </g>

      <g class="integration-topology__base-links integration-topology__base-links--app">
        <path v-for="link in appLinks" :id="link.id" :key="link.id" :d="link.path" :data-topology-link="link.id" :data-source-bus="link.sourceBus" :data-target-id="link.targetId" />
      </g>
      <g class="integration-topology__base-links integration-topology__base-links--can">
        <path v-for="link in canLinks" :id="link.id" :key="link.id" :d="link.path" :data-topology-link="link.id" :data-source-bus="link.sourceBus" :data-target-id="link.targetId" />
      </g>
      <g class="integration-topology__base-links integration-topology__base-links--tcp">
        <path v-for="link in tcpLinks" :id="link.id" :key="link.id" :d="link.path" :data-topology-link="link.id" :data-source-bus="link.sourceBus" :data-target-id="link.targetId" />
      </g>

      <g class="integration-topology__active-links integration-topology__active-links--app">
        <path v-for="link in appLinks" :key="`active-${link.id}`" :d="link.path"><animate attributeName="opacity" values="0;0;1;1;0" :keyTimes="link.timeline" dur="9s" repeatCount="indefinite" /></path>
      </g>
      <g class="integration-topology__active-links integration-topology__active-links--can">
        <path v-for="link in canLinks" :key="`active-${link.id}`" :d="link.path"><animate attributeName="opacity" values="0;0;1;1;0" :keyTimes="link.timeline" dur="9s" repeatCount="indefinite" /></path>
      </g>
      <g class="integration-topology__active-links integration-topology__active-links--tcp">
        <path v-for="link in tcpLinks" :key="`active-${link.id}`" :d="link.path"><animate attributeName="opacity" values="0;0;1;1;0" :keyTimes="link.timeline" dur="9s" repeatCount="indefinite" /></path>
      </g>

      <g class="integration-topology__packets integration-topology__packets--app">
        <circle v-for="link in appLinks" :key="`packet-${link.id}`" r="3"><animate attributeName="opacity" values="0;0;1;1;0" :keyTimes="link.timeline" dur="9s" repeatCount="indefinite" /><animateMotion :begin="link.motionBegin" dur="1.8s" repeatCount="indefinite"><mpath :href="`#${link.id}`" /></animateMotion></circle>
      </g>
      <g class="integration-topology__packets integration-topology__packets--can">
        <circle v-for="link in canLinks" :key="`packet-${link.id}`" r="3"><animate attributeName="opacity" values="0;0;1;1;0" :keyTimes="link.timeline" dur="9s" repeatCount="indefinite" /><animateMotion :begin="link.motionBegin" dur="2.25s" repeatCount="indefinite"><mpath :href="`#${link.id}`" /></animateMotion></circle>
      </g>
      <g class="integration-topology__packets integration-topology__packets--tcp">
        <circle v-for="link in tcpLinks" :key="`packet-${link.id}`" r="3"><animate attributeName="opacity" values="0;0;1;1;0" :keyTimes="link.timeline" dur="9s" repeatCount="indefinite" /><animateMotion :begin="link.motionBegin" dur="1.8s" repeatCount="indefinite"><mpath :href="`#${link.id}`" /></animateMotion></circle>
      </g>

      <text class="integration-topology__bus-label integration-topology__bus-label--app" x="515" y="191">应用</text>
      <text class="integration-topology__bus-label integration-topology__bus-label--can" x="350" y="313">CAN2</text>
      <text class="integration-topology__bus-label integration-topology__bus-label--can" x="418" y="313">CAN1</text>
      <text class="integration-topology__bus-label integration-topology__bus-label--tcp" x="557" y="240">TCP网关</text>

      <g v-for="node in appNodes" :key="node.id" class="integration-topology__node integration-topology__node--app" data-topology-node="application" :data-node-id="node.id">
        <rect :x="node.x" :y="node.y" :width="node.width" :height="node.height" rx="5" />
        <text :x="node.x + node.width / 2" :y="node.y + node.height / 2 + 4">{{ node.lines[0] }}</text>
      </g>

      <g class="integration-topology__hub-waves" aria-hidden="true"><circle v-for="radius in [42, 54, 66]" :key="radius" cx="395" cy="252" :r="radius" /></g>
      <g class="integration-topology__hub" data-topology-node="hub" data-node-id="edge-server">
        <rect x="300" y="220" width="190" height="64" rx="6" />
        <text x="395" y="257">边缘服务器</text>
        <circle cx="468" cy="237" r="3.2" />
      </g>

      <g v-for="node in driverNodes" :key="node.id" class="integration-topology__node integration-topology__node--driver" :class="node.bus ? `integration-topology__node--${node.bus}` : 'integration-topology__node--floating'" data-topology-node="driver" :data-node-id="node.id" :data-node-label="node.label" :data-source-bus="node.bus ?? undefined" :data-connected="String(node.connected)">
        <rect :x="node.x" :y="node.y" :width="node.width" :height="node.height" rx="5" />
        <text :x="node.x + node.width / 2" :y="node.y + node.height / 2 - (node.lines.length - 1) * 6 + 4">
          <tspan v-for="(line, index) in node.lines" :key="`${node.id}-${index}`" :x="node.x + node.width / 2" :dy="index === 0 ? 0 : 12">{{ line }}</tspan>
        </text>
      </g>

      <g class="integration-topology__node integration-topology__node--module integration-topology__node--tcp" data-topology-node="module" :data-node-id="emptyNode.id" :data-node-label="emptyNode.label" data-source-bus="tcp" data-connected="true">
        <rect :x="emptyNode.x" :y="emptyNode.y" :width="emptyNode.width" :height="emptyNode.height" rx="5" />
        <text :x="emptyNode.x + emptyNode.width / 2" :y="emptyNode.y + emptyNode.height / 2 + 4">Empty</text>
      </g>

      <g v-for="slot in extensionSlots" :key="slot.id" :transform="`translate(${slot.x} ${slot.y})`" class="integration-topology__extension" :class="`integration-topology__extension--${slot.id}`" data-topology-extension="true" :data-extension-id="slot.id" :data-node-id="`extension-${slot.id}`">
        <g class="integration-topology__extension-plus">
          <animate attributeName="opacity" values="1;1;0;0;1;1" :keyTimes="slot.timeline" dur="9s" repeatCount="indefinite" />
          <rect :width="slot.width" :height="slot.height" rx="5" />
          <path :d="`M ${slot.width / 2 - 6} ${slot.height / 2} H ${slot.width / 2 + 6} M ${slot.width / 2} ${slot.height / 2 - 6} V ${slot.height / 2 + 6}`" />
        </g>
        <g class="integration-topology__extension-ghost">
          <animate attributeName="opacity" values="0;0;1;1;0;0" :keyTimes="slot.timeline" dur="9s" repeatCount="indefinite" />
          <rect :width="slot.width" :height="slot.height" rx="5"><animate attributeName="stroke-dashoffset" values="260;260;0;0;0;260" :keyTimes="slot.timeline" dur="9s" repeatCount="indefinite" /><animate attributeName="fill-opacity" values="0;0;0;0.72;0.72;0" :keyTimes="slot.timeline" dur="9s" repeatCount="indefinite" /><animate attributeName="stroke-width" values="1.4;1.4;1.4;2.8;1.4;1.4" :keyTimes="slot.timeline" dur="9s" repeatCount="indefinite" /></rect>
          <text :x="slot.width / 2" :y="slot.height / 2 + 3">{{ slot.label }}</text>
        </g>
      </g>

      <g class="integration-topology__statusbar" data-platform-region="statusbar">
        <rect y="522" width="960" height="18" />
        <circle class="integration-topology__status-dot" cx="9" cy="531" r="2.4" />
        <text x="15" y="535">18:55:40</text>
        <path d="M 76 527 V 535 M 72 531 H 80 M 74 529 L 78 533 M 78 529 L 74 533" />
        <text x="84" y="535">本地配置</text>
        <circle class="integration-topology__status-connected" cx="174" cy="531" r="3" />
        <text x="181" y="535">已连接</text>
        <path d="M 229 531 L 233 527 L 237 531 L 233 535 Z" />
        <text x="241" y="535">工作区仓库：···</text>
        <circle cx="354" cy="531" r="3.4" />
        <path d="M 354 528.5 V 531 L 356 532" />
        <text x="362" y="535">尚未建立同步基线（需先全量同步一次）</text>
        <text x="648" y="535">就绪</text>
        <text x="776" y="535">DrillMind工业自动化组态平台（开发）</text>
        <text x="944" y="535" text-anchor="end">就绪</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.integration-topology { width: 100%; height: 100%; overflow: hidden; border-radius: inherit; background: #202638; }
.integration-topology svg { width: 100%; height: 100%; display: block; font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif; shape-rendering: geometricPrecision; }
.integration-topology__main-menu > rect, .integration-topology__device-tab > rect:first-child, .integration-topology__toolbar > rect, .integration-topology__statusbar rect { fill: #31394f; stroke: #56617b; stroke-width: 0.6; }
.integration-topology__brand path:first-child { fill: #33d6ff; }
.integration-topology__brand path:nth-child(2) { fill: #f0cf39; }
.integration-topology__brand path:nth-child(3) { fill: #65efff; }
.integration-topology__brand text { fill: #f8fbff; font-size: 15px; font-weight: 800; }
.integration-topology__menu-item circle { fill: #9eca2b; }
.integration-topology__menu-item path { fill: none; stroke: #30384c; stroke-width: 1; }
.integration-topology__menu-item text { fill: #f4f6fb; font-size: 8px; font-weight: 700; text-anchor: middle; }
.integration-topology__runtime rect, .integration-topology__window-actions rect { fill: none; stroke: #76839e; stroke-width: 0.8; }
.integration-topology__runtime path, .integration-topology__window-actions path { fill: none; stroke: #a7b1c6; stroke-width: 0.9; }
.integration-topology__runtime text:first-of-type { fill: #f3f6fb; font-size: 7.6px; font-weight: 700; }
.integration-topology__runtime text:last-of-type { fill: #8f9ab1; font-size: 4.8px; }
.integration-topology__device-tab-active { fill: #3e4b66; }
.integration-topology__device-tab circle { fill: none; stroke: #b4bfd0; stroke-width: 0.9; }
.integration-topology__device-tab path, .integration-topology__toolbar path, .integration-topology__toolbar circle, .integration-topology__toolbar g > rect { fill: none; stroke: #8f9bb4; stroke-width: 0.8; }
.integration-topology__device-tab text, .integration-topology__toolbar text { fill: #e8edf6; font-size: 8px; font-weight: 700; text-anchor: middle; }
.integration-topology__device-tab text { text-anchor: start; }
.integration-topology__grid { opacity: 0.08; }
.integration-topology__grid path { fill: none; stroke: #65718d; stroke-width: 0.65; vector-effect: non-scaling-stroke; }
.integration-topology__base-links path, .integration-topology__active-links path { fill: none; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.integration-topology__base-links path { stroke-width: 1.2; opacity: 0.52; }
.integration-topology__base-links--app path { stroke: #42bfe9; stroke-dasharray: 4 3; }
.integration-topology__base-links--can path { stroke: #d05ce2; }
.integration-topology__base-links--tcp path { stroke: #f3a72e; }
.integration-topology__active-links path { stroke-width: 2; stroke-dasharray: 7 11; stroke-dashoffset: 0; opacity: 0; filter: url(#topology-line-glow); animation: integration-topology-flow 1.5s linear infinite; }
.integration-topology__active-links--app path { stroke: #52cfff; }
.integration-topology__active-links--can path { stroke: #ef70ff; }
.integration-topology__active-links--tcp path { stroke: #ffb338; }
.integration-topology__packets circle { opacity: 0; filter: url(#topology-line-glow); }
.integration-topology__packets--app circle { fill: #b7f2ff; }
.integration-topology__packets--can circle { fill: #ffbdff; }
.integration-topology__packets--tcp circle { fill: #ffe0a2; }
.integration-topology__bus-label { font-size: 11px; font-weight: 700; text-anchor: middle; }
.integration-topology__bus-label--app { fill: #61d5ff; }
.integration-topology__bus-label--can { fill: #ee8df5; }
.integration-topology__bus-label--tcp { fill: #ffbd52; }
.integration-topology__node rect { fill: url(#topology-card); stroke-width: 1.25; vector-effect: non-scaling-stroke; animation: integration-topology-breathe 4.5s ease-in-out infinite; }
.integration-topology__node text { fill: #f4f7ff; font-size: 10.5px; font-weight: 650; text-anchor: middle; }
.integration-topology__node--app rect { stroke: #51c9f7; }
.integration-topology__node--app text { font-size: 9.4px; }
.integration-topology__node--can1 rect { stroke: #dc71e9; }
.integration-topology__node--tcp rect, .integration-topology__node--floating rect, .integration-topology__node--module rect { stroke: #f2a936; }
.integration-topology__node--floating rect { stroke-opacity: 0.82; }
.integration-topology__hub-waves circle { fill: none; stroke: #a9d51f; stroke-width: 1.15; opacity: 0; transform-box: view-box; transform-origin: 395px 252px; vector-effect: non-scaling-stroke; animation: integration-topology-wave 3s ease-out infinite; }
.integration-topology__hub-waves circle:nth-child(2) { animation-delay: 0.45s; }
.integration-topology__hub-waves circle:nth-child(3) { animation-delay: 0.9s; }
.integration-topology__hub rect { fill: url(#topology-hub); stroke: #a9d51f; stroke-width: 1.5; vector-effect: non-scaling-stroke; animation: integration-topology-hub-breathe 4.5s ease-in-out infinite; }
.integration-topology__hub text { fill: #f5fbff; font-size: 15px; font-weight: 750; text-anchor: middle; }
.integration-topology__hub > circle { fill: #b6e62a; filter: url(#topology-line-glow); animation: integration-topology-status 1.5s ease-in-out infinite; }
.integration-topology__extension-plus rect { fill: rgb(28 35 53 / 72%); stroke: #8291ae; stroke-width: 1.2; stroke-dasharray: 5 3; vector-effect: non-scaling-stroke; }
.integration-topology__extension-plus path { fill: none; stroke: #91a8ce; stroke-width: 1.7; stroke-linecap: round; vector-effect: non-scaling-stroke; }
.integration-topology__extension-ghost { opacity: 0; }
.integration-topology__extension-ghost rect { fill: #123247; fill-opacity: 0; stroke: #5ce5f5; stroke-width: 1.4; stroke-dasharray: 260; stroke-dashoffset: 260; filter: url(#topology-line-glow); vector-effect: non-scaling-stroke; }
.integration-topology__extension-ghost text { fill: #e7fbff; font-size: 8px; font-weight: 750; letter-spacing: 0.03em; text-anchor: middle; }
.integration-topology__statusbar text { fill: #9ea9be; font-size: 6.5px; }
.integration-topology__statusbar circle, .integration-topology__statusbar path { fill: none; stroke: #8f9bb4; stroke-width: 0.7; }
.integration-topology__statusbar .integration-topology__status-dot { fill: #8f9bb4; stroke: none; }
.integration-topology__statusbar .integration-topology__status-connected { fill: #62cf42; stroke: none; }

@keyframes integration-topology-flow { to { stroke-dashoffset: -36; } }
@keyframes integration-topology-breathe { 0%, 100% { filter: drop-shadow(0 0 2px rgb(74 204 242 / 8%)); stroke-opacity: 0.78; } 50% { filter: drop-shadow(0 0 6px rgb(74 204 242 / 26%)); stroke-opacity: 1; } }
@keyframes integration-topology-hub-breathe { 0%, 100% { filter: drop-shadow(0 0 4px rgb(170 213 31 / 12%)); } 50% { filter: drop-shadow(0 0 10px rgb(170 213 31 / 32%)); } }
@keyframes integration-topology-wave { 0% { opacity: 0; transform: scale(0.82); } 18% { opacity: 0.24; } 78%, 100% { opacity: 0; transform: scale(1.36); } }
@keyframes integration-topology-status { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .integration-topology__active-links path, .integration-topology__node rect, .integration-topology__hub rect, .integration-topology__hub > circle { animation: none; }
  .integration-topology__active-links path { opacity: 0.42 !important; }
  .integration-topology__packets, .integration-topology__hub-waves, .integration-topology__extension-ghost { display: none; }
  .integration-topology__extension-plus { opacity: 1 !important; }
}
</style>
