<script setup lang="ts">
const headerMenus = [
  { id: 'save', x: 150, label: '保存工程', accent: true },
  { id: 'compile', x: 194, label: '编译工程', accent: false },
  { id: 'start', x: 238, label: '启动工程', accent: false },
  { id: 'upload', x: 282, label: '上传资产', accent: false },
  { id: 'about', x: 326, label: '关于', accent: true },
  { id: 'help', x: 370, label: '帮助', accent: false },
] as const
</script>

<template>
  <g data-platform-chrome="shared" data-platform-shell="true">
    <g class="platform-visual-chrome__main-menu" data-platform-region="main-menu">
      <rect width="960" height="28" />
      <g class="platform-visual-chrome__brand" transform="translate(12 3)">
        <path d="M0 15L6 1l5 7-4 12z" />
        <path d="M8 2l8 4-4 6z" />
        <path d="M9 13l9-5-3 11z" />
        <text x="25" y="17">DrillMind</text>
        <path class="platform-visual-chrome__brand-underline" d="M25 21h68" />
      </g>
      <g
        v-for="menu in headerMenus"
        :key="menu.id"
        :class="['platform-visual-chrome__menu', { 'platform-visual-chrome__menu--accent': menu.accent }]"
        :transform="`translate(${menu.x} 0)`"
      >
        <g class="platform-visual-chrome__menu-icon" transform="translate(0 -2)">
          <template v-if="menu.id === 'save'"><rect x="-3" y="9" width="7" height="7" rx="1" /><path d="M-1 9v3h3V9M-1 15v-2h3v2" /></template>
          <template v-else-if="menu.id === 'compile'"><path d="M-4 16l8-8M-3 8l3 3M1 13l3 3M2 7l3-1-1 3" /></template>
          <template v-else-if="menu.id === 'start'"><path class="platform-visual-chrome__menu-fill" d="M-3 8l7 4-7 4z" /></template>
          <template v-else-if="menu.id === 'upload'"><path class="platform-visual-chrome__menu-fill" d="M-5 15h10a3 3 0 0 0-1-6 5 5 0 0 0-9 2 2 2 0 0 0 0 4z" /><path d="M0 15V9m-3 3 3-3 3 3" /></template>
          <template v-else-if="menu.id === 'about'"><circle cy="12" r="5" /><path d="M0 11v4M0 8.5v.5" /></template>
          <template v-else><circle cy="12" r="5" /><path d="M-2 10a2 2 0 1 1 3 2c-1 .5-1 1.2-1 2M0 16v.3" /></template>
        </g>
        <text x="0" y="24">{{ menu.label }}</text>
      </g>

      <g class="platform-visual-chrome__actions">
        <g data-platform-header-action="layout-left" transform="translate(742 7)"><path d="M0 0h12v14H0zM4 0v14" /></g>
        <g data-platform-header-action="layout-bottom" transform="translate(776 7)"><path d="M0 0h12v14H0zM0 10h12" /></g>
        <g data-platform-header-action="layout-right" transform="translate(810 7)"><path d="M0 0h12v14H0zM8 0v14" /></g>
        <g data-platform-header-action="fullscreen" transform="translate(843 7)"><path d="M0 5V0h5M9 0h5v5M14 9v5H9M5 14H0V9" /></g>
        <g data-platform-header-action="theme" transform="translate(884 14)"><circle r="4.5" /><path d="M0-9v3M0 6v3M-9 0h3M6 0h3M-6-6l2 2M4 4l2 2M6-6L4-4M-4 4l-2 2" /></g>
        <g data-platform-header-action="settings" transform="translate(918 14)"><circle r="5" /><circle r="2" /><path d="M0-9v3M0 6v3M-9 0h3M6 0h3M-6-6l2 2M4 4l2 2M6-6L4-4M-4 4l-2 2" /></g>
        <g data-platform-header-action="account" transform="translate(952 12)"><circle cy="-2" r="4" /><path d="M-6 10c0-5 12-5 12 0" /></g>
      </g>
    </g>

    <g class="platform-visual-chrome__statusbar" data-platform-region="statusbar">
      <rect y="522" width="960" height="18" />
      <circle class="platform-visual-chrome__status-dot" cx="9" cy="531" r="2.4" />
      <text x="15" y="535">18:55:40</text>
      <path d="M 76 527 V 535 M 72 531 H 80 M 74 529 L 78 533 M 78 529 L 74 533" />
      <text x="84" y="535">本地配置</text>
      <circle class="platform-visual-chrome__connected" cx="174" cy="531" r="3" />
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
  </g>
</template>

<style scoped>
.platform-visual-chrome__main-menu > rect {
  fill: #34394c;
  stroke: none;
}

.platform-visual-chrome__statusbar > rect {
  fill: var(--drillmind-shell, #31394f);
  stroke: var(--drillmind-line, #56617b);
  stroke-width: 0.6;
}

.platform-visual-chrome__brand path:nth-of-type(1) { fill: #33d6ff; }
.platform-visual-chrome__brand path:nth-of-type(2) { fill: #f0cf39; }
.platform-visual-chrome__brand path:nth-of-type(3) { fill: #65efff; }
.platform-visual-chrome__brand .platform-visual-chrome__brand-underline { fill: none; stroke: #e5af22; stroke-width: 1.5; }
.platform-visual-chrome__brand text { fill: #f8f9fb; font-size: 16px; font-weight: 800; }
.platform-visual-chrome__menu rect,
.platform-visual-chrome__menu circle,
.platform-visual-chrome__menu path { fill: none; stroke: #8f9aaf; stroke-width: 1; stroke-linecap: round; stroke-linejoin: round; }
.platform-visual-chrome__menu .platform-visual-chrome__menu-fill { fill: #8f9aaf; stroke: none; }
.platform-visual-chrome__menu--accent rect,
.platform-visual-chrome__menu--accent circle { fill: #a3ce27; stroke: #a3ce27; }
.platform-visual-chrome__menu--accent path { stroke: #34404b; }
.platform-visual-chrome__menu text { fill: #eef2f8; font-size: 8px; font-weight: 700; text-anchor: middle; }
.platform-visual-chrome__actions path,
.platform-visual-chrome__actions circle { fill: none; stroke: #aab4c6; stroke-width: 1; stroke-linecap: round; stroke-linejoin: round; }
.platform-visual-chrome__statusbar text { fill: #9ea9be; font-size: 6.5px; }
.platform-visual-chrome__statusbar path { fill: none; stroke: #8f9bb4; stroke-width: 0.8; }
.platform-visual-chrome__statusbar circle { fill: #8994a8; }
.platform-visual-chrome__statusbar .platform-visual-chrome__connected { fill: #62cf42; }
</style>
