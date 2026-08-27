import { homeHero, homeSections } from './home'

describe('首页配置', () => {
  it('提供两行主标题和平台能力摘要', () => {
    expect(homeHero.titleLines).toEqual(['可视化组态', '让矿山装备应用更快落地'])
    expect(homeHero.eyebrow).toBe('矿山装备数字化应用平台')
    expect(homeHero.description).toContain('实时数据连接')
  })

  it('提供三段按左右交替排列的平台介绍占位内容', () => {
    expect(homeSections).toHaveLength(3)
    expect(homeSections.map((section) => section.id)).toEqual([
      'platform-introduction',
      'platform-introduction-02',
      'platform-introduction-03',
    ])
    expect(homeSections.map((section) => section.textSide)).toEqual(['left', 'right', 'left'])
    expect(homeSections.every((section) => section.description === '内容待项目分析后补充')).toBe(
      true,
    )
    expect(homeSections.map((section) => section.media)).toEqual([
      { kind: 'placeholder', visual: 'configuration' },
      { kind: 'placeholder', visual: 'monitoring' },
      { kind: 'placeholder', visual: 'integration' },
    ])
  })
})
