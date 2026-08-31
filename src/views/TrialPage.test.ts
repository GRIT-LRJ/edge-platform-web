import { render, screen } from '@testing-library/vue'

import TrialPage from './TrialPage.vue'

describe('试用页面', () => {
  it('显示正式说明和六个可点击的应用场景介绍入口', () => {
    render(TrialPage)

    expect(screen.getByRole('heading', { level: 1, name: '试用 Edge 平台' })).toBeVisible()
    expect(screen.getByText(/围绕您的设备、数据源和应用目标/)).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: '平台应用场景' })).toBeVisible()
    expect(screen.getByText(/从地下矿山设备监控到数据集成/)).toBeVisible()

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(6)
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/trial/underground-control-room',
      '/trial/extraction-visualization',
      '/trial/drilling-plan-tracking',
      '/trial/alarm-response',
      '/trial/video-inspection',
      '/trial/system-integration',
    ])
    expect(screen.getAllByText('查看功能介绍 →')).toHaveLength(6)
    expect(document.querySelectorAll('.trial-scene-row__content > p:first-child')).toHaveLength(6)
    expect(screen.queryByText('场景内容待补充')).not.toBeInTheDocument()
  })

  it('联系方式为空时明确显示待配置', () => {
    render(TrialPage)

    expect(screen.getByRole('status')).toHaveTextContent('申请联系方式待配置')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })
})
