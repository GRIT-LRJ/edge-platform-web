import { render } from '@testing-library/vue'

import PlatformVisualChrome from './PlatformVisualChrome.vue'

describe('DrillMind 动图公共框架', () => {
  it('提供统一的 44px 顶栏和 18px 底栏完整内容', () => {
    const { container } = render(PlatformVisualChrome)

    const mainMenu = container.querySelector('[data-platform-region="main-menu"]')
    const statusbar = container.querySelector('[data-platform-region="statusbar"]')

    expect(mainMenu?.querySelector(':scope > rect')).toHaveAttribute('height', '44')
    expect(mainMenu).toHaveTextContent('DrillMind保存工程编译工程启动工程上传资产关于帮助')
    expect(mainMenu).not.toHaveTextContent('搜索模型变量')
    expect(mainMenu).not.toHaveTextContent('下载运行时')
    expect(mainMenu?.querySelectorAll('[data-platform-header-action]')).toHaveLength(7)
    expect(statusbar?.querySelector(':scope > rect')).toHaveAttribute('y', '522')
    expect(statusbar?.querySelector(':scope > rect')).toHaveAttribute('height', '18')
    expect(statusbar).toHaveTextContent(
      '18:55:40本地配置已连接工作区仓库：···尚未建立同步基线（需先全量同步一次）就绪DrillMind工业自动化组态平台（开发）就绪',
    )
  })
})
