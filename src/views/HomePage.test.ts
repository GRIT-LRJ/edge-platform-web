import { render, screen } from '@testing-library/vue'

import HomePage from './HomePage.vue'

describe('首页', () => {
  it('直接展示沉浸式首屏和五段平台介绍正式内容', () => {
    const { container } = render(HomePage)

    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toHaveTextContent('可视化组态')
    expect(title).toHaveTextContent('让矿山装备应用更快落地')
    expect(title.querySelectorAll('span')).toHaveLength(2)
    expect(screen.getByText(/将设备模型、实时变量、控制流程与 HMI 画面纳入同一工程/)).toBeVisible()
    expect(screen.getByRole('link', { name: '了解平台' })).toHaveAttribute(
      'href',
      '#platform-introduction',
    )
    expect(screen.getAllByRole('article')).toHaveLength(5)
    expect(container.querySelectorAll('.home-feature__visual')).toHaveLength(5)
    expect(container.querySelectorAll('.home-feature__visual--platform-animation')).toHaveLength(1)
    expect(container.querySelectorAll('.home-feature__visual--workflow')).toHaveLength(3)
    expect(container.querySelectorAll('.home-feature__visual--topology')).toHaveLength(1)
    expect(screen.queryByText('内容待项目分析后补充')).not.toBeInTheDocument()
    expect(screen.queryByText('产品演示界面')).not.toBeInTheDocument()
    expect(container.querySelector('[data-home-visual="configuration-builder"]')).toBeVisible()
    expect(
      screen.getByRole('img', {
        name: 'Edge 平台 DrillMind 工程开放集成拓扑，展示应用、边缘服务器、总线与设备驱动之间的连接',
      }),
    ).toBeVisible()
  })

  it('平台介绍在桌面端按左、右交替标记', () => {
    render(HomePage)

    expect(
      screen.getAllByRole('article').map((article) => article.getAttribute('data-text-side')),
    ).toEqual(['left', 'right', 'left', 'right', 'left'])
    expect(
      document.querySelector('.home-hero__inner .home-hero__visual'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '查看示例' })).not.toBeInTheDocument()
  })

  it('五段平台介绍图片均提供动态演示入口', () => {
    render(HomePage)

    expect(screen.getByRole('link', { name: '打开可视化组态动态演示' })).toHaveAttribute(
      'href',
      '/showcase/configuration',
    )
    expect(screen.getByRole('link', { name: '打开参数与报警管理动态演示' })).toHaveAttribute(
      'href',
      '/showcase/parameter-alarm',
    )
    expect(screen.getByRole('link', { name: '打开 SFC 流程编排动态演示' })).toHaveAttribute(
      'href',
      '/showcase/sfc',
    )
    expect(screen.getByRole('link', { name: '打开设备运行监控动态演示' })).toHaveAttribute(
      'href',
      '/showcase/monitoring',
    )
    expect(screen.getByRole('link', { name: '打开开放集成动态演示' })).toHaveAttribute(
      'href',
      '/showcase/integration',
    )
    expect(screen.getAllByText('打开动态演示 ↗')).toHaveLength(5)
    expect(document.querySelector('.home-hero__visual')?.closest('a')).toBeNull()
  })
})
