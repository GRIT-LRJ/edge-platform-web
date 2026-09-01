import { fireEvent, screen, waitFor } from '@testing-library/vue'

import { renderApp } from '../test/renderApp'

describe('动态演示页面', () => {
  it('展示主题动画、播放控制和返回首页入口', async () => {
    await renderApp('/showcase/configuration')

    expect(screen.getByRole('heading', { name: '可视化组态动态演示' })).toBeVisible()
    expect(screen.getByRole('img', { name: '可视化组态动态演示' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '暂停演示' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '重新播放' })).toBeEnabled()
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('navigation', { name: '主导航' })).toBeVisible()
  })

  it('支持暂停、继续和重新播放', async () => {
    await renderApp('/showcase/monitoring')

    await fireEvent.click(screen.getByRole('button', { name: '暂停演示' }))
    expect(screen.getByRole('button', { name: '继续演示' })).toBeVisible()

    await fireEvent.click(screen.getByRole('button', { name: '继续演示' }))
    expect(screen.getByRole('button', { name: '暂停演示' })).toBeVisible()

    await fireEvent.click(screen.getByRole('button', { name: '重新播放' }))
    expect(screen.getByRole('button', { name: '暂停演示' })).toBeVisible()
  })

  it.each([
    ['/showcase/configuration', '可视化组态动态演示'],
    ['/showcase/parameter-alarm', '参数与报警管理动态演示'],
    ['/showcase/sfc', 'SFC 流程编排动态演示'],
    ['/showcase/monitoring', '设备运行监控动态演示'],
    ['/showcase/integration', '开放集成动态演示'],
  ])('直接访问 %s 显示对应主题', async (path, title) => {
    const { router } = await renderApp(path)

    expect(router.currentRoute.value.path).toBe(path)
    expect(screen.getByRole('heading', { name: title })).toBeVisible()
  })

  it('演示页设置 noindex，返回普通页面后移除 robots 标记', async () => {
    const { router } = await renderApp('/showcase/integration')

    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Edge 平台开放组件与接口集成工作流动态演示。',
    )

    await router.push('/')
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).not.toBeInTheDocument())
  })

  it('从首页能力图进入演示页时使用无刷新路由跳转', async () => {
    const { router } = await renderApp('/')

    await fireEvent.click(screen.getByRole('link', { name: '打开开放集成动态演示' }))

    await waitFor(() => expect(router.currentRoute.value.path).toBe('/showcase/integration'))
    expect(screen.getByRole('heading', { name: '开放集成动态演示' })).toBeVisible()
  })
})
