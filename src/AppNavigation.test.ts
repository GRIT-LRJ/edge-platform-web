import { fireEvent, screen, waitFor } from '@testing-library/vue'

import { renderApp } from './test/renderApp'

describe('Edge 官网导航', () => {
  it.each([
    { label: '首页', path: '/', source: '/guide', heading: '让设备应用更快落地' },
    { label: '示例', path: '/examples', source: '/', heading: '示例' },
    { label: '试用', path: '/trial', source: '/', heading: '试用' },
    { label: '用户指南', path: '/guide', source: '/', heading: '用户指南' },
  ])('可通过“$label”进入 $path 并标识当前路由', async ({ label, path, source, heading }) => {
    const { router } = await renderApp(source)

    await fireEvent.click(screen.getByRole('link', { name: label }))

    await waitFor(() => expect(router.currentRoute.value.path).toBe(path))
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { name: heading })).toBeVisible()
  })

  it('从展开的移动菜单导航后把焦点移到主内容', async () => {
    await renderApp('/')
    const menuButton = screen.getByRole('button', { name: '打开导航菜单' })

    await fireEvent.click(menuButton)
    await fireEvent.click(screen.getByRole('link', { name: '用户指南' }))

    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus())
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })
})
