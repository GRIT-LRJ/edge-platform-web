import { fireEvent, render, screen } from '@testing-library/vue'

import { siteConfig } from '../config/site'
import GuidePage from './GuidePage.vue'

describe('用户指南页面', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('显示默认指南、持续可用的操作入口和过渡说明', () => {
    render(GuidePage)

    expect(screen.getByRole('heading', { name: '用户指南' })).toBeVisible()
    expect(screen.getByText('正在加载')).toBeVisible()
    expect(screen.getByText(/当前用户指南可能需要项目账号和访问权限/)).toBeVisible()

    const frame = screen.getByTitle('Edge 平台用户指南')
    expect(frame).toHaveAttribute('src', siteConfig.guide.url)
    expect(frame).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin')

    const externalLink = screen.getByRole('link', { name: '在新窗口打开 用户指南' })
    expect(externalLink).toHaveAttribute('href', siteConfig.guide.url)
    expect(externalLink).toHaveAttribute('target', '_blank')
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('在 iframe 加载后持续显示已加载状态', async () => {
    render(GuidePage)

    await fireEvent.load(screen.getByTitle('Edge 平台用户指南'))

    expect(screen.getByText('已加载')).toBeVisible()
  })

  it('超时后保留 iframe 和两个恢复入口', async () => {
    vi.useFakeTimers()
    render(GuidePage)

    await vi.advanceTimersByTimeAsync(siteConfig.guide.loadTimeoutMs)

    expect(screen.getByText('加载较慢')).toBeVisible()
    expect(screen.getByText(/文档加载时间较长或暂时不可用/)).toBeVisible()
    expect(screen.getByTitle('Edge 平台用户指南')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '重新加载' })).toBeEnabled()
    expect(screen.getByRole('link', { name: '在新窗口打开 用户指南' })).toBeVisible()
  })

  it('重新加载会替换 iframe 并重置加载状态', async () => {
    render(GuidePage)
    const firstFrame = screen.getByTitle('Edge 平台用户指南')
    await fireEvent.load(firstFrame)

    await fireEvent.click(screen.getByRole('button', { name: '重新加载' }))

    expect(screen.getByText('正在加载')).toBeVisible()
    expect(screen.getByTitle('Edge 平台用户指南')).not.toBe(firstFrame)
  })
})
