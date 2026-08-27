import { render, screen } from '@testing-library/vue'

import TrialPage from './TrialPage.vue'

describe('试用页面', () => {
  it('显示正式说明和六个应用场景', () => {
    render(TrialPage)

    expect(screen.getByRole('heading', { level: 1, name: '试用 Edge 平台' })).toBeVisible()
    expect(screen.getByText(/围绕您的设备、数据源和应用目标/)).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: '平台应用场景' })).toBeVisible()
    expect(screen.getByText(/从地下矿山设备监控到数据集成/)).toBeVisible()
    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(document.querySelectorAll('.trial-scene-row__content > p:first-child')).toHaveLength(6)
    expect(screen.queryByText('场景内容待补充')).not.toBeInTheDocument()
  })

  it('联系方式为空时明确显示待配置且场景列表保持静态', () => {
    render(TrialPage)

    expect(screen.getByRole('status')).toHaveTextContent('申请联系方式待配置')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })
})
