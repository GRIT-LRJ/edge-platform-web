import { fireEvent, render, screen, waitFor } from '@testing-library/vue'

import SiteFooter from './components/SiteFooter.vue'
import { renderApp } from './test/renderApp'

describe('Edge 官网壳层', () => {
  it('提供四项同级导航并标识当前路由', async () => {
    const { router } = await renderApp()

    expect(screen.getByRole('link', { name: 'Edge平台' })).toBeVisible()
    expect(screen.getByRole('link', { name: '首页' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: '示例' })).toBeVisible()
    expect(screen.getByRole('link', { name: '试用' })).toBeVisible()
    expect(screen.getByRole('link', { name: '用户指南' })).toBeVisible()

    await fireEvent.click(screen.getByRole('link', { name: '试用' }))

    await waitFor(() => expect(router.currentRoute.value.path).toBe('/trial'))
    expect(screen.getByRole('link', { name: '试用' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { name: '试用 Edge 平台' })).toBeVisible()
  })

  it('移动菜单支持打开、Escape 关闭并在路由切换后收起', async () => {
    const { router } = await renderApp()
    const menuButton = screen.getByRole('button', { name: '打开导航菜单' })
    const navigation = screen.getByRole('navigation', { name: '主导航' })

    menuButton.focus()
    await fireEvent.click(menuButton)

    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(navigation).toHaveAttribute('data-open', 'true')
    await waitFor(() => expect(screen.getByRole('link', { name: '首页' })).toHaveFocus())

    await fireEvent.keyDown(navigation, { key: 'Escape' })

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(menuButton).toHaveFocus()

    await fireEvent.click(menuButton)
    await fireEvent.click(screen.getByRole('link', { name: '用户指南' }))

    await waitFor(() => expect(router.currentRoute.value.path).toBe('/guide'))
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('必要页脚字段缺失时显示待配置且隐藏空联系方式', () => {
    render(SiteFooter, {
      props: {
        footer: {
          copyrightOwner: '',
          filingNumber: '',
          email: '   ',
          phone: '\t',
          wechat: '\n',
        },
      },
    })

    expect(screen.getAllByText(/待配置/)).toHaveLength(2)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByText(/邮箱/)).not.toBeInTheDocument()
    expect(screen.queryByText(/电话/)).not.toBeInTheDocument()
    expect(screen.queryByText(/微信/)).not.toBeInTheDocument()
  })
})
