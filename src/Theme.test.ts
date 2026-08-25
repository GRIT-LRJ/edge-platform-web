import { fireEvent, screen, waitFor } from '@testing-library/vue'

import { renderApp } from './test/renderApp'

function stubSystemTheme(prefersDark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: prefersDark,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  )
}

describe('全站主题切换', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('首次跟随系统主题并记忆用户切换', async () => {
    stubSystemTheme(true)
    await renderApp()

    const themeSwitch = screen.getByRole('switch', { name: '切换为浅色主题' })
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(themeSwitch).toHaveAttribute('aria-checked', 'false')

    await fireEvent.click(themeSwitch)

    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(themeSwitch).toHaveAttribute('aria-checked', 'true')
    expect(themeSwitch).toHaveAccessibleName('切换为深色主题')
    expect(localStorage.getItem('edge-theme')).toBe('light')
  })

  it('优先使用已经保存的主题偏好', async () => {
    localStorage.setItem('edge-theme', 'dark')
    stubSystemTheme(false)

    await renderApp()

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByRole('switch')).toHaveAccessibleName('切换为浅色主题')
  })

  it('本地存储不可用时仍可跟随系统并切换主题', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage unavailable')
    })
    stubSystemTheme(false)

    await renderApp()
    const themeSwitch = screen.getByRole('switch', { name: '切换为深色主题' })
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')

    await fireEvent.click(themeSwitch)

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  it('没有人工偏好时响应操作系统主题变化', async () => {
    let changeHandler: ((event: MediaQueryListEvent) => void) | undefined
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener: vi.fn((_event, handler) => {
          changeHandler = handler
        }),
        removeEventListener: vi.fn(),
      }),
    )

    await renderApp()
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')

    changeHandler?.({ matches: true } as MediaQueryListEvent)

    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark'),
    )
  })
})
