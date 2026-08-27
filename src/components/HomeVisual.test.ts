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
})
