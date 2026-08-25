import { fireEvent, screen } from '@testing-library/vue'

import { renderApp } from '../test/renderApp'

const categoryNames = ['凿岩台车', '采矿台车', '锚杆台车', '撬毛台车', '竖井钻机']

describe('示例页面', () => {
  it('默认显示全部五类共 15 个示例', async () => {
    await renderApp('/examples')

    for (const categoryName of categoryNames) {
      expect(screen.getByRole('button', { name: categoryName })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    }

    expect(screen.getAllByRole('button', { name: /示例 \d{2}/ })).toHaveLength(15)
  })

  it('合并显示所有选中分类并在全部取消后恢复完整列表', async () => {
    await renderApp('/examples')
    const drillingFilter = screen.getByRole('button', { name: '凿岩台车' })
    const boltingFilter = screen.getByRole('button', { name: '锚杆台车' })

    await fireEvent.click(drillingFilter)

    expect(drillingFilter).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('button', { name: /示例 \d{2}/ })).toHaveLength(3)
    expect(screen.queryByRole('button', { name: /采矿台车示例/ })).not.toBeInTheDocument()

    await fireEvent.click(boltingFilter)

    expect(boltingFilter).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('button', { name: /示例 \d{2}/ })).toHaveLength(6)

    await fireEvent.click(drillingFilter)
    expect(screen.getAllByRole('button', { name: /示例 \d{2}/ })).toHaveLength(3)
    expect(screen.queryByRole('button', { name: /凿岩台车示例/ })).not.toBeInTheDocument()

    await fireEvent.click(boltingFilter)
    expect(screen.getAllByRole('button', { name: /示例 \d{2}/ })).toHaveLength(15)
  })

  it('点击占位示例时打开即将上线弹窗', async () => {
    await renderApp('/examples')

    await fireEvent.click(screen.getByRole('button', { name: /凿岩台车示例 01/ }))

    expect(screen.getByRole('dialog', { name: '凿岩台车示例 01' })).toBeVisible()
    expect(screen.getByText('视频即将上线')).toBeVisible()
    expect(screen.queryByRole('video')).not.toBeInTheDocument()
  })

  it('打开弹窗后管理焦点并支持 Escape 关闭', async () => {
    await renderApp('/examples')
    const card = screen.getByRole('button', { name: /凿岩台车示例 01/ })

    await fireEvent.click(card)

    const dialog = screen.getByRole('dialog', { name: '凿岩台车示例 01' })
    const closeButton = screen.getByRole('button', { name: '关闭视频弹窗' })
    expect(closeButton).toHaveFocus()

    await fireEvent.keyDown(dialog, { key: 'Escape' })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(card).toHaveFocus()
  })
})
