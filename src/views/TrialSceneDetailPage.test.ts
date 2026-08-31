import { screen } from '@testing-library/vue'

import { renderApp } from '../test/renderApp'

describe('试用场景介绍页', () => {
  it.each([
    ['/trial/underground-control-room', '地下矿山设备集中监控'],
    ['/trial/extraction-visualization', '采掘过程可视化'],
    ['/trial/drilling-plan-tracking', '钻孔计划与进度跟踪'],
    ['/trial/alarm-response', '设备故障与报警处置'],
    ['/trial/video-inspection', '井下实时视频巡检'],
    ['/trial/system-integration', '多系统数据接入与集成'],
  ])('打开 %s 展示对应的功能介绍页', async (path, title) => {
    const { router } = await renderApp(path)

    expect(router.currentRoute.value.path).toBe(path)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: '功能介绍' })).toBeVisible()
    expect(screen.getByRole('link', { name: '返回试用页' })).toHaveAttribute('href', '/trial')
  })

  it('未知场景显示未找到提示并可返回试用页', async () => {
    await renderApp('/trial/not-a-real-scene')

    expect(screen.getByRole('heading', { level: 1, name: '未找到该功能介绍' })).toBeVisible()
    expect(screen.getByRole('link', { name: '返回试用页' })).toHaveAttribute('href', '/trial')
  })
})
