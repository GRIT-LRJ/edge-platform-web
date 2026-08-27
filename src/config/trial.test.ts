import { hasConfiguredTrialContact, trialScenes } from './trial'

describe('试用页配置', () => {
  it('提供六个有序且唯一的占位场景', () => {
    expect(trialScenes).toHaveLength(6)
    expect(trialScenes.map((scene) => scene.id)).toEqual([
      'trial-scene-01',
      'trial-scene-02',
      'trial-scene-03',
      'trial-scene-04',
      'trial-scene-05',
      'trial-scene-06',
    ])
    expect(new Set(trialScenes.map((scene) => scene.id))).toHaveLength(6)
    expect(trialScenes.every((scene) => scene.media.kind === 'placeholder')).toBe(true)
  })

  it('忽略空白联系方式并识别任意已配置联系方式', () => {
    expect(
      hasConfiguredTrialContact({
        copyrightOwner: '',
        filingNumber: '',
        email: ' ',
        phone: '\t',
        wechat: '\n',
      }),
    ).toBe(false)

    expect(
      hasConfiguredTrialContact({
        copyrightOwner: '',
        filingNumber: '',
        email: 'service@example.com',
      }),
    ).toBe(true)
  })
})
