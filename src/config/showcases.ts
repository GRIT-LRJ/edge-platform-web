export type ShowcaseId = 'configuration' | 'parameter-alarm' | 'sfc' | 'monitoring' | 'integration'

export type ShowcasePath = `/showcase/${ShowcaseId}`

export interface ShowcaseDefinition {
  id: ShowcaseId
  path: ShowcasePath
  title: string
  description: string
  durationMs: number
}

export const SHOWCASE_DURATION_MS = 18_000
export const SFC_SHOWCASE_DURATION_MS = 12_000

export const showcaseDefinitions: Readonly<Record<ShowcaseId, ShowcaseDefinition>> = {
  configuration: {
    id: 'configuration',
    path: '/showcase/configuration',
    title: '可视化组态动态演示',
    description: '组件组装、数据绑定与运行预览的示例工作流。',
    durationMs: SHOWCASE_DURATION_MS,
  },
  'parameter-alarm': {
    id: 'parameter-alarm',
    path: '/showcase/parameter-alarm',
    title: '参数与报警管理动态演示',
    description: '参数配置、现场管理、报警规则与处置追溯的完整工作流。',
    durationMs: 16_000,
  },
  sfc: {
    id: 'sfc',
    path: '/showcase/sfc',
    title: 'SFC 流程编排动态演示',
    description: '顺序功能图编排、校验、运行监控与断点调试工作流。',
    durationMs: SFC_SHOWCASE_DURATION_MS,
  },
  monitoring: {
    id: 'monitoring',
    path: '/showcase/monitoring',
    title: '设备运行监控动态演示',
    description: '设备状态、作业指标、趋势与实时视频联动的示例工作流。',
    durationMs: SHOWCASE_DURATION_MS,
  },
  integration: {
    id: 'integration',
    path: '/showcase/integration',
    title: '开放集成动态演示',
    description: '设备接入、数据模型、接口适配与应用交付的示例工作流。',
    durationMs: SHOWCASE_DURATION_MS,
  },
} as const

export function getShowcaseDefinition(id: string | undefined): ShowcaseDefinition {
  if (isShowcaseId(id)) {
    return showcaseDefinitions[id as ShowcaseId]
  }

  return showcaseDefinitions.configuration
}

export function isShowcaseId(value: string | undefined): value is ShowcaseId {
  return (
    value === 'configuration' ||
    value === 'parameter-alarm' ||
    value === 'sfc' ||
    value === 'monitoring' ||
    value === 'integration'
  )
}
