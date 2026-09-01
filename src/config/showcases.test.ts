import {
  SHOWCASE_DURATION_MS,
  getShowcaseDefinition,
  isShowcaseId,
  showcaseDefinitions,
} from './showcases'

describe('动态演示配置', () => {
  it('提供五个固定的站内演示地址及各自时间线', () => {
    expect(Object.keys(showcaseDefinitions)).toEqual([
      'configuration',
      'parameter-alarm',
      'sfc',
      'monitoring',
      'integration',
    ])
    expect(Object.values(showcaseDefinitions).map((item) => item.path)).toEqual([
      '/showcase/configuration',
      '/showcase/parameter-alarm',
      '/showcase/sfc',
      '/showcase/monitoring',
      '/showcase/integration',
    ])
    expect(Object.values(showcaseDefinitions).map((item) => item.durationMs)).toEqual([
      SHOWCASE_DURATION_MS,
      16_000,
      22_000,
      SHOWCASE_DURATION_MS,
      SHOWCASE_DURATION_MS,
    ])
  })

  it('只接受已登记的演示类型，未知值回退到组态演示', () => {
    expect(isShowcaseId('configuration')).toBe(true)
    expect(isShowcaseId('parameter-alarm')).toBe(true)
    expect(isShowcaseId('sfc')).toBe(true)
    expect(isShowcaseId('monitoring')).toBe(true)
    expect(isShowcaseId('integration')).toBe(true)
    expect(isShowcaseId('unknown')).toBe(false)
    expect(getShowcaseDefinition('unknown').id).toBe('configuration')
  })
})
