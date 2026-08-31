import { render, screen } from '@testing-library/vue'

import HomeVisual from './HomeVisual.vue'

describe('首页视觉媒体', () => {
  it.each(['configuration', 'monitoring', 'integration'] as const)(
    '渲染 %s 示意画面占位符',
    (visual) => {
      const { container } = render(HomeVisual, {
        props: {
          media: { kind: 'placeholder', visual },
        },
      })

      expect(container.querySelector('[data-visual="' + visual + '"]')).toBeInTheDocument()
      expect(screen.getByText('示意画面')).toBeVisible()
    },
  )

  it('首页正式图片显示产品演示标签并支持桌面与移动端焦点配置', () => {
    render(HomeVisual, {
      props: {
        hero: true,
        media: {
          kind: 'image',
          src: '/images/home-hero.webp',
          alt: '脱敏后的平台组态界面',
          avif: '/images/home-hero.avif',
          webp: '/images/home-hero.webp',
          desktopPosition: '65% center',
          mobilePosition: '35% center',
        },
      },
    })

    const image = screen.getByRole('img', { name: '脱敏后的平台组态界面' })
    expect(image).toHaveAttribute('loading', 'eager')
    expect(image).toHaveAttribute('src', '/images/home-hero.webp')
    expect(image).toHaveAttribute(
      'style',
      expect.stringContaining('--home-image-position-desktop: 65% center'),
    )
    expect(image).toHaveAttribute(
      'style',
      expect.stringContaining('--home-image-position-mobile: 35% center'),
    )
    expect(document.querySelector('source[type="image/avif"]')).toHaveAttribute(
      'srcset',
      '/images/home-hero.avif',
    )
    expect(document.querySelector('source[type="image/webp"]')).toHaveAttribute(
      'srcset',
      '/images/home-hero.webp',
    )
    expect(screen.getByText('产品演示界面')).toBeInTheDocument()
  })

  it('非首屏图片使用懒加载', () => {
    render(HomeVisual, {
      props: {
        media: {
          kind: 'image',
          src: '/images/platform.webp',
          alt: '平台能力画面',
        },
      },
    })

    expect(screen.getByRole('img', { name: '平台能力画面' })).toHaveAttribute('loading', 'lazy')
  })

  it('开放集成媒体渲染固定节点的 SVG 拓扑动画', () => {
    const { container } = render(HomeVisual, {
      props: {
        media: {
          kind: 'integration-topology',
          alt: 'Edge 平台开放集成拓扑动画',
        },
      },
    })

    expect(screen.getByRole('img', { name: 'Edge 平台开放集成拓扑动画' })).toBeVisible()
    expect(container.querySelectorAll('[data-topology-node="application"]')).toHaveLength(7)
    expect(container.querySelectorAll('[data-topology-node="driver"]')).toHaveLength(6)
    expect(container.querySelectorAll('[data-topology-node="module"]')).toHaveLength(1)
    expect(container.querySelectorAll('[data-topology-extension="true"]')).toHaveLength(4)
    expect(container.querySelector('[data-platform-region="main-menu"]')).toHaveTextContent(
      'DrillMind',
    )
  })
})
