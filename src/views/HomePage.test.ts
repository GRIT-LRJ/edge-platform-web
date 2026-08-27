import { render, screen } from '@testing-library/vue'

import HomePage from './HomePage.vue'

describe('首页', () => {
  it('直接展示沉浸式首屏和三段平台介绍正式内容', () => {
    render(HomePage)

    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toHaveTextContent('可视化组态')
    expect(title).toHaveTextContent('让矿山装备应用更快落地')
    expect(title.querySelectorAll('span')).toHaveLength(2)
    expect(screen.getByText(/将设备模型、实时变量、控制流程与 HMI 画面纳入同一工程/)).toBeVisible()
    expect(screen.getByRole('link', { name: '了解平台' })).toHaveAttribute(
      'href',
      '#platform-introduction',
    )
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.queryByText('内容待项目分析后补充')).not.toBeInTheDocument()
    expect(screen.getAllByText('产品演示界面')).toHaveLength(4)
  })

  it('平台介绍在桌面端按左、右、左交替标记', () => {
    render(HomePage)

    expect(
      screen.getAllByRole('article').map((article) => article.getAttribute('data-text-side')),
    ).toEqual(['left', 'right', 'left'])
    expect(
      document.querySelector('.home-hero__inner .home-hero__visual'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '查看示例' })).not.toBeInTheDocument()
  })
})
