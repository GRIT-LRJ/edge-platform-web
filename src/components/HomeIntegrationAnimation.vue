<script setup lang="ts">
// 纯静态渲染：所有动画由本组件 <style> 内的 CSS @keyframes 驱动，无任何脚本逻辑。
</script>

<template>
  <svg
    class="integration-anim"
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid meet"
    role="img"
    aria-label="Edge 平台开放集成组态画布"
  >
    <defs>
      <linearGradient id="ia-logo" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#4da3ff" />
        <stop offset="1" stop-color="#3ce2c5" />
      </linearGradient>
      <radialGradient id="ia-halo">
        <stop stop-color="#b9ff9f" stop-opacity=".16" />
        <stop offset="1" stop-color="#b9ff9f" stop-opacity="0" />
      </radialGradient>
      <pattern id="ia-grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0V48" fill="none" stroke="#33506e" stroke-opacity=".16" />
      </pattern>
    </defs>

    <!-- ================= 窗口顶栏 ================= -->
    <rect x="0" y="0" width="1600" height="56" fill="#0e1626" />
    <path d="M30 14l16 11-16 11-16-11z" fill="url(#ia-logo)" />
    <text x="72" y="38" class="ia-title">DrillMind</text>
    <g class="ia-menu">
      <text x="190" y="37">保存工程</text>
      <text x="288" y="37">编译工程</text>
      <text x="386" y="37">启动工程</text>
      <text x="484" y="37">上传资产</text>
      <text x="582" y="37">关于</text>
      <text x="644" y="37">帮助</text>
    </g>
    <rect x="1420" y="12" width="112" height="32" rx="6" fill="#2f8f5b" />
    <text x="1476" y="33" class="ia-runbtn">下载运行时</text>
    <g fill="#22314a">
      <rect x="1544" y="16" width="20" height="20" rx="5" />
      <rect x="1570" y="16" width="20" height="20" rx="5" />
    </g>

    <!-- ================= 标签与工具栏 ================= -->
    <rect x="0" y="56" width="1600" height="56" fill="#111a2c" />
    <rect x="0" y="111" width="1600" height="1" fill="#22304a" />
    <text x="18" y="92" class="ia-tab">设备</text>
    <rect x="14" y="68" width="52" height="3" rx="1.5" fill="#4de0c9" />
    <g class="ia-toolbar">
      <text x="98" y="92">显示</text>
      <text x="166" y="92">放大</text>
      <text x="236" y="92">缩小</text>
      <text x="306" y="92">还原</text>
    </g>

    <!-- ================= 画布 ================= -->
    <rect x="0" y="112" width="1600" height="788" fill="#131a2a" />
    <rect x="0" y="112" width="1600" height="788" fill="url(#ia-grid)" />

    <!-- ================= 阶段1：应用 → 边缘服务器（青色链路） ================= -->
    <g class="ia-links" stroke="#45a2ff" stroke-width="2.5">
      <path class="ia-la" d="M498 221L505 307" />
      <path class="ia-la" d="M666 221L540 307" />
      <path class="ia-la" d="M819 221L575 307" />
      <path class="ia-la" d="M967 221L610 307" />
      <path class="ia-la" d="M1106 221L645 307" />
      <path class="ia-la" d="M1260 221L680 307" />
      <path class="ia-la" d="M1375 221L715 307" />
    </g>
    <text class="ia-applabel" x="900" y="258">应用</text>

    <!-- 应用链路光点 -->
    <circle class="ia-dot ia-dot-a1" cx="967" cy="221" r="5" fill="#7cc4ff" />
    <circle class="ia-dot ia-dot-a2" cx="1106" cy="221" r="5" fill="#7cc4ff" />
    <circle class="ia-dot ia-dot-a3" cx="1375" cy="221" r="5" fill="#7cc4ff" />

    <!-- ================= 边缘服务器 ================= -->
    <ellipse cx="616" cy="353" rx="250" ry="150" fill="url(#ia-halo)" />
    <g class="ia-ripple" fill="none" stroke="#a9d977" stroke-width="2">
      <circle class="ia-rip ia-rip-1" cx="616" cy="353" r="96" />
      <circle class="ia-rip ia-rip-2" cx="616" cy="353" r="96" />
    </g>
    <g class="ia-server ia-breathe">
      <rect x="478" y="307" width="276" height="93" rx="12" fill="#2e4230" stroke="#93b162" stroke-width="2" />
      <text x="616" y="352" class="ia-server-name">边缘服务器</text>
      <text x="616" y="380" class="ia-server-sub">EDGE RUNTIME</text>
    </g>

    <!-- ================= 阶段2：CAN 总线（紫色，CAN1/CAN2 各自独立、互不交叉） ================= -->
    <g class="ia-links" stroke="#a678f0" stroke-width="2.5">
      <path class="ia-lc" d="M515 400V475" />
      <path class="ia-lc" d="M617 400V475" />
      <!-- CAN2 → 独立扩展加号框 -->
      <path class="ia-lc" d="M515 505V552" />
      <!-- CAN1 → 主线：DTP / DrillArm / Power 三卡 + 底部扩展加号框 -->
      <path class="ia-lc" d="M617 505V830" />
      <path class="ia-lc" d="M617 568H627" />
      <path class="ia-lc" d="M617 652H627" />
      <path class="ia-lc" d="M617 736H627" />
      <path class="ia-lc" d="M617 830H660" />
    </g>
    <circle class="ia-dot ia-dot-c1" cx="617" cy="400" r="5" fill="#c9a4ff" />
    <circle class="ia-dot ia-dot-c2" cx="617" cy="400" r="5" fill="#c9a4ff" />
    <circle class="ia-dot ia-dot-c3" cx="617" cy="400" r="5" fill="#c9a4ff" />

    <g class="ia-breathe">
      <rect x="475" y="475" width="80" height="30" rx="6" fill="#3a2f66" stroke="#a678f0" stroke-width="1.5" />
      <text x="515" y="497" class="ia-chip">CAN2</text>
    </g>
    <g class="ia-breathe">
      <rect x="577" y="475" width="80" height="30" rx="6" fill="#3a2f66" stroke="#a678f0" stroke-width="1.5" />
      <text x="617" y="497" class="ia-chip">CAN1</text>
    </g>
    <g class="ia-card ia-breathe">
      <rect x="627" y="532" width="103" height="72" rx="8" fill="#222338" stroke="#a678f0" stroke-width="1.5" />
      <text x="637" y="560" class="ia-prefix">DRV_CanOpen-</text>
      <text x="637" y="584" class="ia-name">DTP</text>
    </g>
    <g class="ia-card ia-breathe">
      <rect x="627" y="616" width="103" height="72" rx="8" fill="#222338" stroke="#a678f0" stroke-width="1.5" />
      <text x="637" y="644" class="ia-prefix">DRV_CanOpen-</text>
      <text x="637" y="668" class="ia-name">DrillArm</text>
    </g>
    <g class="ia-card ia-breathe">
      <rect x="627" y="700" width="103" height="72" rx="8" fill="#222338" stroke="#a678f0" stroke-width="1.5" />
      <text x="637" y="728" class="ia-prefix">DRV_CanOpen-</text>
      <text x="637" y="752" class="ia-name">Power</text>
    </g>

    <!-- ================= 阶段3：TCP 网关（橙黄总线，连接 Empty / Sim / 扩展加号框） ================= -->
    <g class="ia-links" stroke="#e8a33d" stroke-width="2.5">
      <path class="ia-lt" d="M754 345H806V482" />
      <path class="ia-lt" d="M806 408H818" />
      <path class="ia-lt" d="M806 482H818" />
      <path class="ia-lt" d="M922 465H962" />
    </g>
    <circle class="ia-dot ia-dot-t1" cx="754" cy="345" r="5" fill="#ffd08a" />
    <circle class="ia-dot ia-dot-t2" cx="754" cy="345" r="5" fill="#ffd08a" />
    <circle cx="768" cy="330" r="4" fill="#e8a33d" />
    <text class="ia-tcp-label" x="778" y="324">TCP网关</text>

    <g class="ia-card ia-breathe">
      <rect x="818" y="387" width="104" height="43" rx="8" fill="#1d2334" stroke="#6b7f97" stroke-width="1.5" stroke-dasharray="6 6" />
      <text x="870" y="414" class="ia-empty">Empty</text>
    </g>
    <g class="ia-card ia-breathe">
      <rect x="818" y="453" width="104" height="58" rx="8" fill="#1e2536" stroke="#e8a33d" stroke-width="1.5" />
      <text x="828" y="478" class="ia-prefix ia-prefix-orange">DRV_CanOpen-</text>
      <text x="828" y="498" class="ia-name ia-name-orange">Sim</text>
    </g>
    <g class="ia-card ia-breathe">
      <rect x="818" y="519" width="104" height="58" rx="8" fill="#1e2536" stroke="#e8a33d" stroke-width="1.5" />
      <text x="828" y="544" class="ia-prefix ia-prefix-orange">DRV_Drill-</text>
      <text x="828" y="564" class="ia-name ia-name-orange">Plan</text>
    </g>
    <g class="ia-card ia-breathe">
      <rect x="818" y="586" width="104" height="59" rx="8" fill="#1e2536" stroke="#e8a33d" stroke-width="1.5" />
      <text x="828" y="611" class="ia-prefix ia-prefix-orange">DRV_Lidar-</text>
      <text x="828" y="631" class="ia-name ia-name-orange">Drill</text>
    </g>
    <!-- 右下角静态加号 -->
    <g class="ia-pulse">
      <rect x="822" y="664" width="52" height="53" rx="8" fill="none" stroke="#4a5a72" stroke-width="1.5" stroke-dasharray="7 7" />
      <path class="ia-plus-icon" d="M848 680v21M837.5 690.5h21" />
    </g>

    <!-- ================= 扩展槽 A：底部 CAN 加号 → 新驱动 Pump ================= -->
    <g>
      <g class="ia-slot-a-plus">
        <rect x="660" y="796" width="68" height="68" rx="8" fill="none" stroke="#4a5a72" stroke-width="1.5" stroke-dasharray="7 7" />
        <path class="ia-plus-icon" d="M694 815v30M679 830h30" />
      </g>
      <g class="ia-slot-a-ghost">
        <rect x="620" y="798" width="164" height="64" rx="8" fill="#222338" stroke="#a678f0" stroke-width="1.5" />
        <text x="634" y="826" class="ia-prefix">DRV_CanOpen-</text>
        <text x="634" y="850" class="ia-name">Pump</text>
      </g>
      <g class="ia-slot-a-flash">
        <rect x="620" y="798" width="164" height="64" rx="8" fill="none" stroke="#f2e6ff" stroke-width="2.5" />
      </g>
    </g>

    <!-- ================= 扩展槽 B：CAN2 正下方扩展加号 → 新驱动 Aux ================= -->
    <g>
      <g class="ia-slot-b-plus">
        <rect x="481" y="552" width="68" height="68" rx="8" fill="none" stroke="#4a5a72" stroke-width="1.5" stroke-dasharray="7 7" />
        <path class="ia-plus-icon" d="M515 568v36M497 586h36" />
      </g>
      <g class="ia-slot-b-ghost">
        <rect x="435" y="554" width="160" height="64" rx="8" fill="#222338" stroke="#a678f0" stroke-width="1.5" />
        <text x="449" y="582" class="ia-prefix">DRV_CanOpen-</text>
        <text x="449" y="606" class="ia-name">Aux</text>
      </g>
      <g class="ia-slot-b-flash">
        <rect x="435" y="554" width="160" height="64" rx="8" fill="none" stroke="#f2e6ff" stroke-width="2.5" />
      </g>
    </g>

    <!-- ================= 扩展槽 C：右上 TCP 加号 → 新驱动 Scan ================= -->
    <g>
      <g class="ia-slot-c-plus">
        <rect x="962" y="427" width="74" height="77" rx="8" fill="none" stroke="#4a5a72" stroke-width="1.5" stroke-dasharray="7 7" />
        <path class="ia-plus-icon" d="M999 446v39M979.5 465.5h39" />
      </g>
      <g class="ia-slot-c-ghost">
        <rect x="934" y="433" width="174" height="64" rx="8" fill="#1e2536" stroke="#e8a33d" stroke-width="1.5" />
        <text x="948" y="461" class="ia-prefix ia-prefix-orange">DRV_Drill-</text>
        <text x="948" y="485" class="ia-name ia-name-orange">Scan</text>
      </g>
      <g class="ia-slot-c-flash">
        <rect x="934" y="433" width="174" height="64" rx="8" fill="none" stroke="#ffe4c2" stroke-width="2.5" />
      </g>
    </g>

    <!-- ================= 扩展槽 D：顶部应用加号 → 新应用 ================= -->
    <g>
      <g class="ia-slot-d-plus">
        <rect x="1446" y="170" width="73" height="51" rx="8" fill="none" stroke="#4a5a72" stroke-width="1.5" stroke-dasharray="7 7" />
        <path class="ia-plus-icon" d="M1482.5 184v23M1471 195.5h23" />
      </g>
      <g class="ia-slot-d-ghost">
        <rect x="1428" y="158" width="152" height="64" rx="8" fill="#1b2438" stroke="#4da3ff" stroke-width="1.5" />
        <text x="1504" y="197" class="ia-app-new">视频巡检</text>
      </g>
      <g class="ia-slot-d-flash">
        <rect x="1428" y="158" width="152" height="64" rx="8" fill="none" stroke="#cfe9ff" stroke-width="2.5" />
      </g>
    </g>

    <!-- ================= 顶部应用节点 ================= -->
    <g class="ia-card ia-breathe">
      <rect x="430" y="170" width="137" height="51" rx="8" fill="#1b2438" stroke="#4da3ff" stroke-width="1.5" />
      <text x="498" y="201" class="ia-app">车载操作软件</text>
    </g>
    <g class="ia-card ia-breathe">
      <rect x="600" y="170" width="132" height="51" rx="8" fill="#1b2438" stroke="#4da3ff" stroke-width="1.5" />
      <text x="666" y="201" class="ia-app">历史版本备份</text>
    </g>
    <g class="ia-card ia-breathe">
      <rect x="754" y="170" width="131" height="51" rx="8" fill="#1b2438" stroke="#4da3ff" stroke-width="1.5" />
      <text x="819" y="201" class="ia-app">软键盘操控</text>
    </g>
    <g class="ia-card ia-breathe">
      <rect x="925" y="170" width="85" height="51" rx="8" fill="#1b2438" stroke="#4da3ff" stroke-width="1.5" />
      <text x="967" y="201" class="ia-app">设置</text>
    </g>
    <g class="ia-card ia-breathe">
      <rect x="1030" y="170" width="152" height="51" rx="8" fill="#1b2438" stroke="#4da3ff" stroke-width="1.5" />
      <text x="1106" y="201" class="ia-app">视频显示应用</text>
    </g>
    <g class="ia-card ia-breathe">
      <rect x="1203" y="170" width="115" height="51" rx="8" fill="#1b2438" stroke="#4da3ff" stroke-width="1.5" />
      <text x="1260" y="201" class="ia-app">展示应用</text>
    </g>
    <g class="ia-card ia-breathe">
      <rect x="1339" y="170" width="72" height="51" rx="8" fill="#1b2438" stroke="#4da3ff" stroke-width="1.5" />
      <text x="1375" y="201" class="ia-app ia-app-mono">share</text>
    </g>
  </svg>
</template>

<style scoped>
.integration-anim {
  display: block;
  width: 100%;
  height: 100%;
}

/* ---------- 静态基础样式 ---------- */
.ia-title {
  font-size: 22px;
  font-weight: 700;
  fill: #eaf6ff;
}
.ia-menu text {
  font-size: 15px;
  fill: #b6cadd;
}
.ia-runbtn {
  font-size: 14px;
  font-weight: 700;
  fill: #eafff4;
  text-anchor: middle;
}
.ia-tab {
  font-size: 17px;
  font-weight: 700;
  fill: #e6f7ff;
}
.ia-toolbar text {
  font-size: 15px;
  fill: #9db3c6;
}
.ia-app {
  font-size: 16px;
  fill: #e8f0fa;
  text-anchor: middle;
}
.ia-app-mono {
  font-family: ui-monospace, Consolas, monospace;
}
.ia-app-new {
  font-size: 17px;
  font-weight: 700;
  fill: #e8f4ff;
  text-anchor: middle;
}
.ia-server-name {
  font-size: 30px;
  font-weight: 700;
  fill: #f2ffe9;
  text-anchor: middle;
}
.ia-server-sub {
  font-size: 12px;
  fill: #9fd2a0;
  text-anchor: middle;
  letter-spacing: 0.16em;
  font-family: ui-monospace, Consolas, monospace;
}
.ia-chip {
  font-size: 17px;
  font-weight: 700;
  fill: #f3edff;
  text-anchor: middle;
  font-family: ui-monospace, Consolas, monospace;
}
.ia-prefix {
  font-size: 12px;
  fill: #a78fd8;
  font-family: ui-monospace, Consolas, monospace;
}
.ia-name {
  font-size: 15px;
  font-weight: 700;
  fill: #f1eaff;
  font-family: ui-monospace, Consolas, monospace;
}
.ia-prefix-orange {
  fill: #d7a86a;
}
.ia-name-orange {
  fill: #fff2df;
}
.ia-empty {
  font-size: 14px;
  fill: #93a7c0;
  text-anchor: middle;
  font-family: ui-monospace, Consolas, monospace;
}
.ia-tcp-label {
  font-size: 16px;
  font-weight: 700;
  fill: #e8a33d;
  font-family: ui-monospace, Consolas, monospace;
}
.ia-applabel {
  font-size: 13px;
  fill: #6fb7ff;
}
.ia-plus-icon {
  stroke: #7488a2;
  stroke-width: 3;
  stroke-linecap: round;
  fill: none;
}

/* ---------- 链路：窗口内点亮 + 微呼吸辉光 ---------- */
.ia-la,
.ia-lc,
.ia-lt {
  fill: none;
}
.ia-la {
  animation: ia-link-app 10s ease-in-out infinite;
}
.ia-lc {
  animation: ia-link-can 10s ease-in-out infinite;
}
.ia-lt {
  animation: ia-link-tcp 10s ease-in-out infinite;
}
@keyframes ia-link-app {
  0%, 4% { opacity: 0.18; }
  6%, 13%, 16%, 23%, 26% { opacity: 1; }
  10%, 19% { opacity: 0.72; }
  30%, 100% { opacity: 0.18; }
}
@keyframes ia-link-can {
  0%, 32% { opacity: 0.16; }
  34%, 41%, 44%, 51%, 54% { opacity: 1; }
  38%, 47% { opacity: 0.7; }
  57%, 100% { opacity: 0.16; }
}
@keyframes ia-link-tcp {
  0%, 62% { opacity: 0.16; }
  64%, 70%, 73%, 77% { opacity: 1; }
  68%, 75% { opacity: 0.7; }
  80%, 100% { opacity: 0.16; }
}

/* ---------- 链路光点：沿路径单向滑动，淡入淡出，结束后隐蔽回位 ---------- */
.ia-dot {
  transform-box: fill-box;
}
.ia-dot-a1 { animation: ia-dot-move-a1 10s ease-in-out infinite, ia-dot-fade-a 10s ease-in-out infinite; }
.ia-dot-a2 { animation: ia-dot-move-a2 10s ease-in-out infinite, ia-dot-fade-a 10s ease-in-out infinite; }
.ia-dot-a3 { animation: ia-dot-move-a3 10s ease-in-out infinite, ia-dot-fade-a 10s ease-in-out infinite; }
.ia-dot-c1 { animation: ia-dot-move-c1 10s ease-in-out infinite, ia-dot-fade-c 10s ease-in-out infinite; }
.ia-dot-c2 { animation: ia-dot-move-c2 10s ease-in-out infinite, ia-dot-fade-c 10s ease-in-out infinite; }
.ia-dot-c3 { animation: ia-dot-move-c3 10s ease-in-out infinite, ia-dot-fade-c 10s ease-in-out infinite; }
.ia-dot-t1 { animation: ia-dot-move-t1 10s ease-in-out infinite, ia-dot-fade-t 10s ease-in-out infinite; }
.ia-dot-t2 { animation: ia-dot-move-t2 10s ease-in-out infinite, ia-dot-fade-t 10s ease-in-out infinite; }

@keyframes ia-dot-fade-a {
  0%, 4% { opacity: 0; }
  7%, 26% { opacity: 1; }
  30%, 100% { opacity: 0; }
}
@keyframes ia-dot-fade-c {
  0%, 32% { opacity: 0; }
  35%, 58% { opacity: 1; }
  61%, 100% { opacity: 0; }
}
@keyframes ia-dot-fade-t {
  0%, 62% { opacity: 0; }
  65%, 78% { opacity: 1; }
  81%, 100% { opacity: 0; }
}
@keyframes ia-dot-move-a1 {
  0%, 4% { transform: translate(0, 0); }
  30% { transform: translate(-357, 86); }
  100% { transform: translate(0, 0); }
}
@keyframes ia-dot-move-a2 {
  0%, 4% { transform: translate(0, 0); }
  30% { transform: translate(-461, 86); }
  100% { transform: translate(0, 0); }
}
@keyframes ia-dot-move-a3 {
  0%, 4% { transform: translate(0, 0); }
  30% { transform: translate(-660, 86); }
  100% { transform: translate(0, 0); }
}
@keyframes ia-dot-move-c1 {
  0%, 32% { transform: translate(0, 0); }
  48.5% { transform: translate(0, 105); }
  58.4% { transform: translate(0, 168); }
  60% { transform: translate(10, 168); }
  100% { transform: translate(0, 0); }
}
@keyframes ia-dot-move-c2 {
  0%, 32% { transform: translate(0, 0); }
  43.2% { transform: translate(0, 105); }
  58.9% { transform: translate(0, 252); }
  60% { transform: translate(10, 252); }
  100% { transform: translate(0, 0); }
}
@keyframes ia-dot-move-c3 {
  0%, 32% { transform: translate(0, 0); }
  40.5% { transform: translate(0, 105); }
  59.2% { transform: translate(0, 336); }
  60% { transform: translate(10, 336); }
  100% { transform: translate(0, 0); }
}
@keyframes ia-dot-move-t1 {
  0%, 62% { transform: translate(0, 0); }
  66.7% { transform: translate(52, 0); }
  78.9% { transform: translate(52, 137); }
  80% { transform: translate(64, 137); }
  100% { transform: translate(0, 0); }
}
@keyframes ia-dot-move-t2 {
  0%, 62% { transform: translate(0, 0); }
  69.4% { transform: translate(52, 0); }
  78.3% { transform: translate(52, 63); }
  80% { transform: translate(64, 63); }
  100% { transform: translate(0, 0); }
}

/* ---------- 常驻特效：服务器波纹 + 卡片呼吸 + 加号呼吸 ---------- */
.ia-rip {
  transform-box: fill-box;
  transform-origin: center;
  animation: ia-ripple 5s ease-out infinite;
}
.ia-rip-2 {
  animation-delay: -2.5s;
}
@keyframes ia-ripple {
  0% { transform: scale(0.5); opacity: 0.5; }
  30% { transform: scale(1.1); opacity: 0.34; }
  55%, 100% { transform: scale(1.9); opacity: 0; }
}
.ia-breathe {
  animation: ia-breathe 5s ease-in-out infinite;
}
@keyframes ia-breathe {
  0%, 100% { opacity: 0.86; }
  50% { opacity: 1; }
}
.ia-pulse {
  animation: ia-pulse 5s ease-in-out infinite;
}
@keyframes ia-pulse {
  0%, 100% { opacity: 0.45; }
  25%, 75% { opacity: 0.6; }
  50% { opacity: 0.85; }
}

/* ---------- 扩展挂载：四个加号槽轮流（80% / 85% / 90% / 95% 各 5%） ---------- */
.ia-slot-a-plus { animation: ia-slot-a-plus 10s ease-in-out infinite; }
.ia-slot-a-ghost { animation: ia-slot-a-ghost 10s ease-in-out infinite; }
.ia-slot-a-flash { animation: ia-slot-a-flash 10s ease-in-out infinite; }
.ia-slot-b-plus { animation: ia-slot-b-plus 10s ease-in-out infinite; }
.ia-slot-b-ghost { animation: ia-slot-b-ghost 10s ease-in-out infinite; }
.ia-slot-b-flash { animation: ia-slot-b-flash 10s ease-in-out infinite; }
.ia-slot-c-plus { animation: ia-slot-c-plus 10s ease-in-out infinite; }
.ia-slot-c-ghost { animation: ia-slot-c-ghost 10s ease-in-out infinite; }
.ia-slot-c-flash { animation: ia-slot-c-flash 10s ease-in-out infinite; }
.ia-slot-d-plus { animation: ia-slot-d-plus 10s ease-in-out infinite; }
.ia-slot-d-ghost { animation: ia-slot-d-ghost 10s ease-in-out infinite; }
.ia-slot-d-flash { animation: ia-slot-d-flash 10s ease-in-out infinite; }

@keyframes ia-slot-a-plus {
  0%, 80% { opacity: 1; }
  81.8% { opacity: 0.3; }
  83%, 84.6% { opacity: 0; }
  85%, 100% { opacity: 1; }
}
@keyframes ia-slot-a-ghost {
  0%, 80% { opacity: 0; }
  81% { opacity: 0.5; }
  82%, 83.6% { opacity: 1; }
  84.4% { opacity: 0.3; }
  85%, 100% { opacity: 0; }
}
@keyframes ia-slot-a-flash {
  0%, 82% { opacity: 0; }
  82.6% { opacity: 0.9; }
  83.4% { opacity: 0.25; }
  84.2%, 100% { opacity: 0; }
}

@keyframes ia-slot-b-plus {
  0%, 85% { opacity: 1; }
  86.8% { opacity: 0.3; }
  88%, 89.6% { opacity: 0; }
  90%, 100% { opacity: 1; }
}
@keyframes ia-slot-b-ghost {
  0%, 85% { opacity: 0; }
  86% { opacity: 0.5; }
  87%, 88.6% { opacity: 1; }
  89.4% { opacity: 0.3; }
  90%, 100% { opacity: 0; }
}
@keyframes ia-slot-b-flash {
  0%, 87% { opacity: 0; }
  87.6% { opacity: 0.9; }
  88.4% { opacity: 0.25; }
  89.2%, 100% { opacity: 0; }
}

@keyframes ia-slot-c-plus {
  0%, 90% { opacity: 1; }
  91.8% { opacity: 0.3; }
  93%, 94.6% { opacity: 0; }
  95%, 100% { opacity: 1; }
}
@keyframes ia-slot-c-ghost {
  0%, 90% { opacity: 0; }
  91% { opacity: 0.5; }
  92%, 93.6% { opacity: 1; }
  94.4% { opacity: 0.3; }
  95%, 100% { opacity: 0; }
}
@keyframes ia-slot-c-flash {
  0%, 92% { opacity: 0; }
  92.6% { opacity: 0.9; }
  93.4% { opacity: 0.25; }
  94.2%, 100% { opacity: 0; }
}

@keyframes ia-slot-d-plus {
  0%, 95% { opacity: 1; }
  96.8% { opacity: 0.3; }
  98%, 99.6% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes ia-slot-d-ghost {
  0%, 95% { opacity: 0; }
  96% { opacity: 0.5; }
  97%, 98.6% { opacity: 1; }
  99.4% { opacity: 0.3; }
  100% { opacity: 0; }
}
@keyframes ia-slot-d-flash {
  0%, 97% { opacity: 0; }
  97.6% { opacity: 0.9; }
  98.4% { opacity: 0.25; }
  99.2%, 100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .integration-anim * {
    animation: none !important;
  }
  .ia-la, .ia-lc, .ia-lt { opacity: 0.18; }
  .ia-breathe, .ia-pulse { opacity: 1; }
}
</style>
