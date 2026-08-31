export type ShowcaseId = 'configuration' | 'monitoring' | 'integration'

export type ShowcasePath = `/showcase/${ShowcaseId}`

export interface ShowcaseDefinition {
  id: ShowcaseId
  path: ShowcasePath
  title: string
  description: string
  durationMs: number
}

export const SHOWCASE_DURATION_MS = 18_000

export const showcaseDefinitions: Readonly<Record<ShowcaseId, ShowcaseDefinition>> = {
  configuration: {
    id: 'configuration',
    path: '/showcase/configuration',
    title: '可视化组态动态演示',
    description: '组件组装、数据绑定与运行预览的示例工作流。',
    durationMs: SHOWCASE_DURATION_MS,
  },
  monitoring: {
    id: 'monitoring',
    path: '/showcase/monitoring',
    title: '设备运行监控动态演示',
    description: '设备上线、指标趋势、报警与视频状态的示例工作流。',
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
  return value === 'configuration' || value === 'monitoring' || value === 'integration'
}
