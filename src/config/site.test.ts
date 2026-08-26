import { DEFAULT_GUIDE_URL, resolveGuideConfig } from './site'

describe('用户指南配置', () => {
  it('未配置环境变量时使用受限文档默认值', () => {
    expect(resolveGuideConfig({})).toEqual({
      url: DEFAULT_GUIDE_URL,
      publicMode: false,
      loadTimeoutMs: 8_000,
    })
  })

  it('接受 HTTP(S) 指南地址并显式启用公开模式', () => {
    expect(
      resolveGuideConfig({
        VITE_GUIDE_URL: ' https://docs.example.com/edge ',
        VITE_GUIDE_PUBLIC: ' TRUE ',
      }),
    ).toEqual({
      url: 'https://docs.example.com/edge',
      publicMode: true,
      loadTimeoutMs: 8_000,
    })
  })

  it.each(['not-a-url', 'javascript:alert(1)', 'file:///private/docs'])('%s 回退到默认地址', (url) => {
    expect(resolveGuideConfig({ VITE_GUIDE_URL: url }).url).toBe(DEFAULT_GUIDE_URL)
  })
})
