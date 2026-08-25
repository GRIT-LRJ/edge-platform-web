import { demoCategories, demoItems } from './demos'

describe('示例配置', () => {
  it('提供五类共 15 个唯一且分类有效的示例', () => {
    expect(demoCategories).toHaveLength(5)
    expect(demoItems).toHaveLength(15)
    expect(new Set(demoItems.map((demo) => demo.id)).size).toBe(15)

    for (const category of demoCategories) {
      expect(demoItems.filter((demo) => demo.categoryId === category.id)).toHaveLength(3)
    }
  })
})
