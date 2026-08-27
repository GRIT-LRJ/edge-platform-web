import {
  SHOWCASE_DURATION_MS,
  getShowcaseDefinition,
  isShowcaseId,
  showcaseDefinitions,
} from './showcases'

describe('动态演示配置', () => {
  it('提供三个固定的站内演示地址并统一使用 18 秒时间线', () => {
    expect(Object.keys(showcaseDefinitions)).toEqual(['configuration', 'monitoring', 'integration'])
    expect(Object.values(showcaseDefinitions).map((item) => item.path)).toEqual([
      '/showcase/configuration',
      '/showcase/monitoring',
      '/showcase/integration',
    ])
    expect(Object.values(showcaseDefinitions).every((item) => item.durationMs === SHOWCASE_DURATION_MS)).toBe(
      true,
    )
  })

  it('只接受已登记的演示类型，未知值回退到组态演示', () => {
    expect(isShowcaseId('configuration')).toBe(true)
    expect(isShowcaseId('monitoring')).toBe(true)
    expect(isShowcaseId('integration')).toBe(true)
    expect(isShowcaseId('unknown')).toBe(false)
    expect(getShowcaseDefinition('unknown').id).toBe('configuration')
  })
})
