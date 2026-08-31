import alarmResponse640Avif from '../assets/media/trial/alarm-response-640.avif'
import alarmResponse640Webp from '../assets/media/trial/alarm-response-640.webp'
import alarmResponse960Avif from '../assets/media/trial/alarm-response-960.avif'
import alarmResponse960Webp from '../assets/media/trial/alarm-response-960.webp'
import alarmResponse1280Avif from '../assets/media/trial/alarm-response-1280.avif'
import alarmResponse1280Webp from '../assets/media/trial/alarm-response-1280.webp'
import alarmResponse1600Avif from '../assets/media/trial/alarm-response-1600.avif'
import alarmResponse1600Webp from '../assets/media/trial/alarm-response-1600.webp'
import drillingPlan640Avif from '../assets/media/trial/drilling-plan-640.avif'
import drillingPlan640Webp from '../assets/media/trial/drilling-plan-640.webp'
import drillingPlan960Avif from '../assets/media/trial/drilling-plan-960.avif'
import drillingPlan960Webp from '../assets/media/trial/drilling-plan-960.webp'
import drillingPlan1280Avif from '../assets/media/trial/drilling-plan-1280.avif'
import drillingPlan1280Webp from '../assets/media/trial/drilling-plan-1280.webp'
import drillingPlan1600Avif from '../assets/media/trial/drilling-plan-1600.avif'
import drillingPlan1600Webp from '../assets/media/trial/drilling-plan-1600.webp'
import extractionVisualization640Avif from '../assets/media/trial/extraction-visualization-640.avif'
import extractionVisualization640Webp from '../assets/media/trial/extraction-visualization-640.webp'
import extractionVisualization960Avif from '../assets/media/trial/extraction-visualization-960.avif'
import extractionVisualization960Webp from '../assets/media/trial/extraction-visualization-960.webp'
import extractionVisualization1280Avif from '../assets/media/trial/extraction-visualization-1280.avif'
import extractionVisualization1280Webp from '../assets/media/trial/extraction-visualization-1280.webp'
import extractionVisualization1600Avif from '../assets/media/trial/extraction-visualization-1600.avif'
import extractionVisualization1600Webp from '../assets/media/trial/extraction-visualization-1600.webp'
import integration640Avif from '../assets/media/trial/system-integration-640.avif'
import integration640Webp from '../assets/media/trial/system-integration-640.webp'
import integration960Avif from '../assets/media/trial/system-integration-960.avif'
import integration960Webp from '../assets/media/trial/system-integration-960.webp'
import integration1280Avif from '../assets/media/trial/system-integration-1280.avif'
import integration1280Webp from '../assets/media/trial/system-integration-1280.webp'
import integration1600Avif from '../assets/media/trial/system-integration-1600.avif'
import integration1600Webp from '../assets/media/trial/system-integration-1600.webp'
import undergroundControlRoom640Avif from '../assets/media/trial/underground-control-room-640.avif'
import undergroundControlRoom640Webp from '../assets/media/trial/underground-control-room-640.webp'
import undergroundControlRoom960Avif from '../assets/media/trial/underground-control-room-960.avif'
import undergroundControlRoom960Webp from '../assets/media/trial/underground-control-room-960.webp'
import undergroundControlRoom1280Avif from '../assets/media/trial/underground-control-room-1280.avif'
import undergroundControlRoom1280Webp from '../assets/media/trial/underground-control-room-1280.webp'
import undergroundControlRoom1600Avif from '../assets/media/trial/underground-control-room-1600.avif'
import undergroundControlRoom1600Webp from '../assets/media/trial/underground-control-room-1600.webp'
import videoInspection640Avif from '../assets/media/trial/video-inspection-640.avif'
import videoInspection640Webp from '../assets/media/trial/video-inspection-640.webp'
import videoInspection960Avif from '../assets/media/trial/video-inspection-960.avif'
import videoInspection960Webp from '../assets/media/trial/video-inspection-960.webp'
import videoInspection1280Avif from '../assets/media/trial/video-inspection-1280.avif'
import videoInspection1280Webp from '../assets/media/trial/video-inspection-1280.webp'
import videoInspection1600Avif from '../assets/media/trial/video-inspection-1600.avif'
import videoInspection1600Webp from '../assets/media/trial/video-inspection-1600.webp'
import type { SiteFooterConfig } from './site'

export type TrialSceneOverlay = {
  label: string
  value: string
  status: string
}

export type TrialSceneMedia =
  | {
      kind: 'placeholder'
      hue: number
    }
  | {
      kind: 'image'
      src: string
      alt: string
      avif?: string
      webp?: string
      overlay?: TrialSceneOverlay
    }

export interface TrialScene {
  id: string
  slug: string
  title: string
  description: string
  features: readonly string[]
  media: TrialSceneMedia
}

function srcset(entries: readonly [string, number][]) {
  return entries.map(([source, width]) => `${source} ${width}w`).join(', ')
}

export function trialScenePath(slug: string): string {
  return `/trial/${slug}`
}

const undergroundControlRoomWebp = srcset([
  [undergroundControlRoom640Webp, 640],
  [undergroundControlRoom960Webp, 960],
  [undergroundControlRoom1280Webp, 1280],
  [undergroundControlRoom1600Webp, 1600],
])
const undergroundControlRoomAvif = srcset([
  [undergroundControlRoom640Avif, 640],
  [undergroundControlRoom960Avif, 960],
  [undergroundControlRoom1280Avif, 1280],
  [undergroundControlRoom1600Avif, 1600],
])
const extractionVisualizationWebp = srcset([
  [extractionVisualization640Webp, 640],
  [extractionVisualization960Webp, 960],
  [extractionVisualization1280Webp, 1280],
  [extractionVisualization1600Webp, 1600],
])
const extractionVisualizationAvif = srcset([
  [extractionVisualization640Avif, 640],
  [extractionVisualization960Avif, 960],
  [extractionVisualization1280Avif, 1280],
  [extractionVisualization1600Avif, 1600],
])
const drillingPlanWebp = srcset([
  [drillingPlan640Webp, 640],
  [drillingPlan960Webp, 960],
  [drillingPlan1280Webp, 1280],
  [drillingPlan1600Webp, 1600],
])
const drillingPlanAvif = srcset([
  [drillingPlan640Avif, 640],
  [drillingPlan960Avif, 960],
  [drillingPlan1280Avif, 1280],
  [drillingPlan1600Avif, 1600],
])
const alarmResponseWebp = srcset([
  [alarmResponse640Webp, 640],
  [alarmResponse960Webp, 960],
  [alarmResponse1280Webp, 1280],
  [alarmResponse1600Webp, 1600],
])
const alarmResponseAvif = srcset([
  [alarmResponse640Avif, 640],
  [alarmResponse960Avif, 960],
  [alarmResponse1280Avif, 1280],
  [alarmResponse1600Avif, 1600],
])
const videoInspectionWebp = srcset([
  [videoInspection640Webp, 640],
  [videoInspection960Webp, 960],
  [videoInspection1280Webp, 1280],
  [videoInspection1600Webp, 1600],
])
const videoInspectionAvif = srcset([
  [videoInspection640Avif, 640],
  [videoInspection960Avif, 960],
  [videoInspection1280Avif, 1280],
  [videoInspection1600Avif, 1600],
])
const integrationWebp = srcset([
  [integration640Webp, 640],
  [integration960Webp, 960],
  [integration1280Webp, 1280],
  [integration1600Webp, 1600],
])
const integrationAvif = srcset([
  [integration640Avif, 640],
  [integration960Avif, 960],
  [integration1280Avif, 1280],
  [integration1600Avif, 1600],
])

export const trialScenes: readonly TrialScene[] = [
  {
    id: 'trial-scene-01',
    slug: 'underground-control-room',
    title: '地下矿山设备集中监控',
    description: '汇集设备状态、关键参数和在线情况，在统一画面掌握地下矿山设备的运行概况。',
    features: [
      '设备状态、关键参数与在线情况集中呈现',
      '在统一画面掌握地下矿山设备的运行概况',
      '在线设备与通讯状态一目了然',
    ],
    media: {
      kind: 'image',
      src: undergroundControlRoom1600Webp,
      webp: undergroundControlRoomWebp,
      avif: undergroundControlRoomAvif,
      alt: '虚构地下矿山控制环境与 Edge 平台设备状态信息叠层',
      overlay: { label: '在线设备', value: '24 / 24', status: '稳定运行' },
    },
  },
  {
    id: 'trial-scene-02',
    slug: 'extraction-visualization',
    title: '采掘过程可视化',
    description: '将作业流程、设备动作和关键数据组织为 HMI 画面，辅助现场操作与调度。',
    features: [
      '将作业流程与设备动作组织为 HMI 画面',
      '关键数据与现场操作同屏呈现',
      '辅助现场操作与调度决策',
    ],
    media: {
      kind: 'image',
      src: extractionVisualization1600Webp,
      webp: extractionVisualizationWebp,
      avif: extractionVisualizationAvif,
      alt: '虚构地下采掘作业场景与 Edge 平台过程信息叠层',
      overlay: { label: '作业进度', value: '68%', status: '数据同步' },
    },
  },
  {
    id: 'trial-scene-03',
    slug: 'drilling-plan-tracking',
    title: '钻孔计划与进度跟踪',
    description: '结合孔位、钻深、姿态和进度信息，辅助凿岩作业计划查看与过程跟踪。',
    features: [
      '结合孔位、钻深、姿态与进度信息',
      '辅助凿岩作业计划查看与过程跟踪',
      '计划与现场进度持续同步',
    ],
    media: {
      kind: 'image',
      src: drillingPlan1600Webp,
      webp: drillingPlanWebp,
      avif: drillingPlanAvif,
      alt: '虚构地下钻孔作业场景与 Edge 平台计划信息叠层',
      overlay: { label: '计划跟踪', value: '12 个孔位', status: '同步中' },
    },
  },
  {
    id: 'trial-scene-04',
    slug: 'alarm-response',
    title: '设备故障与报警处置',
    description: '配置报警规则，集中呈现报警等级、状态、确认和历史信息。',
    features: [
      '配置报警规则并按等级集中呈现',
      '支持报警确认与历史查看',
      '帮助现场快速定位设备故障',
    ],
    media: {
      kind: 'image',
      src: alarmResponse1600Webp,
      webp: alarmResponseWebp,
      avif: alarmResponseAvif,
      alt: '虚构矿山设备作业区与 Edge 平台报警信息叠层',
      overlay: { label: '报警摘要', value: '03 条', status: '待确认' },
    },
  },
  {
    id: 'trial-scene-05',
    slug: 'video-inspection',
    title: '井下实时视频巡检',
    description: '将 WebRTC、HLS 或 FLV 视频与设备状态同屏呈现，辅助远程查看现场。',
    features: [
      '接入 WebRTC、HLS 或 FLV 视频',
      '视频与设备状态同屏展示',
      '辅助远程查看井下现场',
    ],
    media: {
      kind: 'image',
      src: videoInspection1600Webp,
      webp: videoInspectionWebp,
      avif: videoInspectionAvif,
      alt: '虚构井下巷道与 Edge 平台实时视频巡检信息叠层',
      overlay: { label: '视频通道', value: '06 路', status: '在线' },
    },
  },
  {
    id: 'trial-scene-06',
    slug: 'system-integration',
    title: '多系统数据接入与集成',
    description: '通过设备驱动、模型点表、数据集、API 和适配器连接既有设备与应用。',
    features: [
      '通过设备驱动连接既有设备',
      '以模型点表、数据集和 API 组织数据',
      '用适配器接入应用并扩展系统能力',
    ],
    media: {
      kind: 'image',
      src: integration1600Webp,
      webp: integrationWebp,
      avif: integrationAvif,
      alt: '虚构矿山设备基础设施与 Edge 平台系统集成信息叠层',
      overlay: { label: '数据链路', value: '04 类', status: '已接入' },
    },
  },
]

export function hasConfiguredTrialContact(footer: SiteFooterConfig) {
  return [footer.email, footer.phone, footer.wechat].some((value) => Boolean(value?.trim()))
}
