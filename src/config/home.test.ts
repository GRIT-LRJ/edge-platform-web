import { homeHero, homeSections } from './home'

describe('首页配置', () => {
  it('提供两行主标题和平台能力摘要', () => {
    expect(homeHero.titleLines).toEqual(['可视化组态', '让矿山装备应用更快落地'])
    expect(homeHero.eyebrow).toBe('矿山装备数字化应用平台')
    expect(homeHero.description).toContain('设备模型')
    expect(homeHero.media.kind).toBe('image')
  })

  it('提供五段按左右交替排列的平台介绍正式内容', () => {
    expect(homeSections).toHaveLength(5)
    expect(homeSections.map((section) => section.id)).toEqual([
      'platform-introduction',
      'parameter-alarm-management',
      'sfc-workflow',
      'platform-introduction-02',
      'platform-introduction-03',
    ])
    expect(homeSections.map((section) => section.textSide)).toEqual([
      'left',
      'right',
      'left',
      'right',
      'left',
    ])
    expect(homeSections.every((section) => section.description.length > 20)).toBe(true)
    expect(homeSections.map((section) => section.media.kind)).toEqual([
      'configuration-animation',
      'parameter-alarm-animation',
      'sfc-animation',
      'monitoring-animation',
      'integration-topology',
    ])
    expect(homeSections.every((section) => 'alt' in section.media && section.media.alt)).toBe(true)
    expect(homeSections[1]?.media).toMatchObject({
      kind: 'parameter-alarm-animation',
      durationMs: 16_000,
    })
  })
})
