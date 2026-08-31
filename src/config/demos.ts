export type DemoCategoryId =
  | 'drill-jumbo'
  | 'mining-jumbo'
  | 'bolting-jumbo'
  | 'scaler'
  | 'shaft-drill'

export type DemoStatus = 'coming-soon' | 'published'

export interface DemoCategory {
  id: DemoCategoryId
  name: string
  order: number
}

export interface DemoItem {
  id: string
  categoryId: DemoCategoryId
  title: string
  description: string
  status: DemoStatus
  videoUrl?: string
}

export const demoCategories = [
  { id: 'drill-jumbo', name: '凿岩台车', order: 1 },
  { id: 'mining-jumbo', name: '采矿台车', order: 2 },
  { id: 'bolting-jumbo', name: '锚杆台车', order: 3 },
  { id: 'scaler', name: '撬毛台车', order: 4 },
  { id: 'shaft-drill', name: '竖井钻机', order: 5 },
] as const satisfies readonly DemoCategory[]

export const demoItems: readonly DemoItem[] = demoCategories
  .flatMap((category) =>
    Array.from({ length: 3 }, (_, index) => {
      const number = String(index + 1).padStart(2, '0')

      return {
        id: `${category.id}-${number}`,
        categoryId: category.id,
        title: `${category.name}示例 ${number}`,
        description: `${category.name}设备应用演示内容正在准备中。`,
        status: 'coming-soon',
      }
    }),
  )
  .map((item) =>
    item.id === 'drill-jumbo-01'
      ? {
          ...item,
          status: 'published',
          videoUrl: '/media/demos/drill-jumbo-01.webm',
          description:
            'DrillMind 组态演示：从组件库拖入 3 组仪表与参数标签，拼接钻孔监测画面，保存工程后在运行态实时展示。',
        }
      : item,
  )

export function getDemoCategory(categoryId: DemoCategoryId) {
  return demoCategories.find((category) => category.id === categoryId)
}
