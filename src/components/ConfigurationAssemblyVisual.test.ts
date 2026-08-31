import { render } from '@testing-library/vue'
import { nextTick } from 'vue'

import ConfigurationAssemblyVisual from './ConfigurationAssemblyVisual.vue'

describe('首页组态动画播放状态', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('进入视口后播放，离开视口后暂停', async () => {
    let intersectionCallback: IntersectionObserverCallback | undefined

    class MockIntersectionObserver {
      readonly root = null
      readonly rootMargin = '0px'
      readonly thresholds = [0.28]

      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback
      }

      disconnect = vi.fn()
      observe = vi.fn()
      takeRecords = vi.fn(() => [])
      unobserve = vi.fn()
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

    const { container } = render(ConfigurationAssemblyVisual, {
      props: { label: '组态动画' },
    })
    const root = container.querySelector('[data-home-visual="configuration-builder"]')

    expect(root).toHaveAttribute('data-playing', 'false')

    intersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    await nextTick()
    expect(root).toHaveAttribute('data-playing', 'true')

    intersectionCallback?.(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    await nextTick()
    expect(root).toHaveAttribute('data-playing', 'false')
  })

  it('减少动态偏好下直接进入静态完成状态', async () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    )

    const { container } = render(ConfigurationAssemblyVisual, {
      props: { label: '组态动画' },
    })
    await nextTick()

    const root = container.querySelector('[data-home-visual="configuration-builder"]')
    expect(root).toHaveAttribute('data-static', 'true')
    expect(root).toHaveAttribute('data-playing', 'false')
  })
})
