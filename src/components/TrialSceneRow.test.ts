import { render, screen } from '@testing-library/vue'

import type { TrialScene } from '../config/trial'
import TrialSceneRow from './TrialSceneRow.vue'

describe('试用场景图文行', () => {
  it('没有正式图片时显示非交互式程序化占位视觉', () => {
    const scene: TrialScene = {
      id: 'placeholder-scene',
      title: '应用场景 01',
      description: '场景内容待补充',
      media: { kind: 'placeholder', hue: 188 },
    }

    render(TrialSceneRow, { props: { scene, index: 0 } })

    expect(screen.getByRole('article', { name: scene.title })).toBeVisible()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('正式图片提供现代格式来源、替代文本、懒加载和信息叠层', () => {
    const scene: TrialScene = {
      id: 'published-scene',
      title: '设备运行监控',
      description: '展示设备状态与运行参数。',
      media: {
        kind: 'image',
        src: '/images/trial/equipment-monitoring.webp',
        webp: '/images/trial/equipment-monitoring.webp',
        avif: '/images/trial/equipment-monitoring.avif',
        alt: 'Edge 平台设备运行监控界面',
        overlay: { label: '在线设备', value: '24 / 24', status: '稳定运行' },
      },
    }

    const { container } = render(TrialSceneRow, { props: { scene, index: 0 } })

    const image = screen.getByRole('img', { name: scene.media.kind === 'image' ? scene.media.alt : '' })
    expect(image).toHaveAttribute('src', '/images/trial/equipment-monitoring.webp')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(image).toHaveAttribute('decoding', 'async')
    expect(container.querySelector('source[type="image/avif"]')).toHaveAttribute(
      'srcset',
      '/images/trial/equipment-monitoring.avif',
    )
    expect(container.querySelector('source[type="image/webp"]')).toHaveAttribute(
      'srcset',
      '/images/trial/equipment-monitoring.webp',
    )
    expect(container.querySelector('.trial-scene-visual-overlay')).toBeInTheDocument()
  })
})
