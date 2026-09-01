import editorHeroImage from '../assets/media/home/edge-drillmind-hero-v2.webp'
import editorHeroImageAvif from '../assets/media/home/edge-drillmind-hero-v2.avif'
import { SFC_SHOWCASE_DURATION_MS, type ShowcasePath } from './showcases'

export type HomeVisualVariant = 'configuration' | 'monitoring' | 'integration'

export interface HomeImageMedia {
  kind: 'image'
  src: string
  alt: string
  avif?: string
  webp?: string
  desktopPosition?: string
  mobilePosition?: string
}

export interface HomePlaceholderMedia {
  kind: 'placeholder'
  visual: HomeVisualVariant
}

export interface HomeIntegrationTopologyMedia {
  kind: 'integration-topology'
  alt: string
}

export interface HomeConfigurationAnimationMedia {
  kind: 'configuration-animation'
  alt: string
}

export interface HomeParameterAlarmAnimationMedia {
  kind: 'parameter-alarm-animation'
  alt: string
  durationMs: number
}

export interface HomeSfcAnimationMedia {
  kind: 'sfc-animation'
  alt: string
  durationMs: number
}

export interface HomeMonitoringAnimationMedia {
  kind: 'monitoring-animation'
  alt: string
  durationMs: number
}

export type HomeMedia =
  | HomeImageMedia
  | HomePlaceholderMedia
  | HomeIntegrationTopologyMedia
  | HomeConfigurationAnimationMedia
  | HomeParameterAlarmAnimationMedia
  | HomeSfcAnimationMedia
  | HomeMonitoringAnimationMedia

export interface HomeHeroConfig {
  eyebrow: string
  titleLines: readonly [string, string]
  description: string
  media: HomeMedia
}

export interface HomeSection {
  id: string
  title: string
  description: string
  media: HomeMedia
  textSide: 'left' | 'right'
  showcase?: {
    path: ShowcasePath
    label: string
  }
}

export const homeHero: HomeHeroConfig = {
  eyebrow: '矿山装备数字化应用平台',
  titleLines: ['可视化组态', '让矿山装备应用更快落地'],
  description:
    '将设备模型、实时变量、控制流程与 HMI 画面纳入同一工程，让应用设计、数据绑定、预览运行与现场集成形成完整链路。',
  media: {
    kind: 'image',
    src: editorHeroImage,
    alt: 'DrillMind 工业自动化组态平台首界面，下方展示由数据链路连接的数字孪生工厂设备',
    avif: editorHeroImageAvif,
    webp: editorHeroImage,
    desktopPosition: 'center',
    mobilePosition: 'center',
  },
}

export const homeSections: readonly HomeSection[] = [
  {
    id: 'platform-introduction',
    title: '一套编辑器，完成设备画面组态',
    description:
      '通过组件库、画布、图层和属性面板搭建设备界面，支持 SVG、图片与 Vue 组件，并提供对齐、分组、复制粘贴和撤销重做等常用编辑能力。',
    media: {
      kind: 'configuration-animation',
      alt: 'DrillMind 平台设备画面组态动画，展示从组件库拖入模块并生成钻孔监测界面',
    },
    textSide: 'left',
    showcase: {
      path: '/showcase/configuration',
      label: '打开可视化组态动态演示',
    },
  },
  {
    id: 'parameter-alarm-management',
    title: '从参数配置到报警处置，形成完整闭环',
    description:
      '可视化配置参数分组、变量绑定、范围与权限，通过参数管理组件完成现场读写；再以限值、开关和功能块规则驱动报警提示、实时监控、确认处置与历史追溯。',
    media: {
      kind: 'parameter-alarm-animation',
      alt: 'DrillMind 参数与报警管理动画，依次展示参数配置、现场参数管理、报警规则和处置追溯',
      durationMs: 16_000,
    },
    textSide: 'right',
    showcase: {
      path: '/showcase/parameter-alarm',
      label: '打开参数与报警管理动态演示',
    },
  },
  {
    id: 'sfc-workflow',
    title: '用 SFC 编排并调试设备流程',
    description:
      '以顺序功能图拖拽组织步骤、条件、功能块与子流程，联动模型变量并实时校验；通过仿真、运行轨迹、断点和单步调试，让复杂控制流程更易设计、验证与维护。',
    media: {
      kind: 'sfc-animation',
      alt: 'DrillMind SFC 流程动画，展示步骤编排、规则校验、运行轨迹、变量与断点调试',
      durationMs: SFC_SHOWCASE_DURATION_MS,
    },
    textSide: 'left',
    showcase: {
      path: '/showcase/sfc',
      label: '打开 SFC 流程编排动态演示',
    },
  },
  {
    id: 'platform-introduction-02',
    title: '让设备状态、趋势与视频实时联动',
    description:
      '将设备状态、作业指标、趋势与实时视频汇聚到 HMI 运行画面，随现场数据同步刷新，帮助操作人员持续掌握设备与作业变化。',
    media: {
      kind: 'monitoring-animation',
      alt: 'DrillMind 设备 HMI 运行监控动画，展示设备状态、作业指标、趋势和实时视频',
      durationMs: 18_000,
    },
    textSide: 'right',
    showcase: {
      path: '/showcase/monitoring',
      label: '打开设备运行监控动态演示',
    },
  },
  {
    id: 'platform-introduction-03',
    title: '开放组件与接口，持续扩展设备应用',
    description:
      '通过 SDK、组件注册和适配器接入数据、资源、权限与导航能力，沉淀行业组件，并将设计结果交付到运行环境。',
    media: {
      kind: 'integration-topology',
      alt: 'Edge 平台 DrillMind 工程开放集成拓扑，展示应用、边缘服务器、总线与设备驱动之间的连接',
    },
    textSide: 'left',
    showcase: {
      path: '/showcase/integration',
      label: '打开开放集成动态演示',
    },
  },
]
