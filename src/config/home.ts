import editorHeroImage from '../assets/media/home/edge-drillmind-hero.webp'
import editorHeroImageAvif from '../assets/media/home/edge-drillmind-hero.avif'
import monitoringDashboardImage from '../assets/media/home/edge-monitoring-dashboard.svg'
import type { ShowcasePath } from './showcases'

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

export type HomeMedia =
  | HomeImageMedia
  | HomePlaceholderMedia
  | HomeIntegrationTopologyMedia
  | HomeConfigurationAnimationMedia

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
    alt: 'Edge 平台 DrillMind 工程组态界面，展示钻孔设备运行仪表、参数面板和组件库',
    avif: editorHeroImageAvif,
    webp: editorHeroImage,
    desktopPosition: 'center',
    mobilePosition: '58% center',
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
    id: 'platform-introduction-02',
    title: '连接设备数据，看见每一项运行状态',
    description:
      '将设备变量、业务数据集和视图状态绑定到画面组件，集中呈现参数、状态、报警、趋势与实时视频。',
    media: {
      kind: 'image',
      src: monitoringDashboardImage,
      alt: 'Edge 平台设备运行监控画面，展示合成设备数据、趋势、报警和实时视频',
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
