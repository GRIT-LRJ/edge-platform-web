import { fireEvent, render, screen } from '@testing-library/vue'

import DemoDialog from './DemoDialog.vue'

describe('示例视频弹窗', () => {
  it('已发布示例使用原生播放器自动静音播放', () => {
    const { container } = render(DemoDialog, {
      props: {
        categoryName: '凿岩台车',
        demo: {
          id: 'drill-jumbo-01',
          categoryId: 'drill-jumbo',
          title: '凿岩台车示例 01',
          description: '演示说明',
          status: 'published',
          videoUrl: 'https://media.example.com/drill-jumbo-01.mp4',
        },
      },
    })

    const video = container.querySelector('video')

    expect(screen.getByRole('dialog', { name: '凿岩台车示例 01' })).toBeVisible()
    expect(video).toHaveAttribute('src', 'https://media.example.com/drill-jumbo-01.mp4')
    expect(video).toHaveAttribute('controls')
    expect(video).toHaveAttribute('autoplay')
    expect(video).toHaveProperty('muted', true)
    expect(video).toHaveAttribute('playsinline')
    expect(screen.queryByText('视频即将上线')).not.toBeInTheDocument()
  })

  it('视频资源加载失败时显示明确提示', async () => {
    const { container } = render(DemoDialog, {
      props: {
        categoryName: '凿岩台车',
        demo: {
          id: 'drill-jumbo-01',
          categoryId: 'drill-jumbo',
          title: '凿岩台车示例 01',
          description: '演示说明',
          status: 'published',
          videoUrl: 'https://media.example.com/missing.mp4',
        },
      },
    })

    const video = container.querySelector('video')
    expect(video).not.toBeNull()

    await fireEvent.error(video as HTMLVideoElement)

    expect(screen.getByText('视频暂时无法播放')).toBeVisible()
  })
})
