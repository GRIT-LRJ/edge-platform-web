import { render } from '@testing-library/vue'

import PlatformVisualChrome from './PlatformVisualChrome.vue'

describe('DrillMind 动图公共框架', () => {
  it('提供统一的 32px 紧凑顶栏和 18px 底栏完整内容', () => {
    const { container } = render(PlatformVisualChrome)

    const mainMenu = container.querySelector('[data-platform-region="main-menu"]')
    const statusbar = container.querySelector('[data-platform-region="statusbar"]')
    const menus = Array.from(mainMenu?.querySelectorAll('.platform-visual-chrome__menu') ?? [])
    const actions = Array.from(
      mainMenu?.querySelectorAll('[data-platform-header-action]') ?? [],
    )

    expect(mainMenu?.querySelector(':scope > rect')).toHaveAttribute('height', '32')
    expect(mainMenu?.querySelector('.platform-visual-chrome__brand')).toHaveAttribute(
      'transform',
      'translate(12 5)',
    )
    expect(mainMenu).toHaveTextContent('DrillMind保存工程编译工程启动工程上传资产关于帮助')
    expect(mainMenu).not.toHaveTextContent('搜索模型变量')
    expect(mainMenu).not.toHaveTextContent('下载运行时')
    expect(menus.map((menu) => menu.getAttribute('transform'))).toEqual([
      'translate(150 0)',
      'translate(194 0)',
      'translate(238 0)',
      'translate(282 0)',
      'translate(326 0)',
      'translate(370 0)',
    ])
    expect(
      menus.map((menu) => menu.querySelector('.platform-visual-chrome__menu-icon')?.getAttribute('transform')),
    ).toEqual(Array(6).fill('translate(0 0)'))
    expect(menus.map((menu) => menu.querySelector('text')?.getAttribute('y'))).toEqual(
      Array(6).fill('26'),
    )
    expect(actions.map((action) => action.getAttribute('transform'))).toEqual([
      'translate(742 9)',
      'translate(776 9)',
      'translate(810 9)',
      'translate(843 9)',
      'translate(884 16)',
      'translate(918 16)',
      'translate(952 14)',
    ])
    expect(statusbar?.querySelector(':scope > rect')).toHaveAttribute('y', '522')
    expect(statusbar?.querySelector(':scope > rect')).toHaveAttribute('height', '18')
    expect(statusbar).toHaveTextContent(
      '18:55:40本地配置已连接工作区仓库：···尚未建立同步基线（需先全量同步一次）就绪DrillMind工业自动化组态平台（开发）就绪',
    )
  })
})
