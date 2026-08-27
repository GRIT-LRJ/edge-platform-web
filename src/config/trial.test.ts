import { hasConfiguredTrialContact, trialScenes } from './trial'

describe('试用页配置', () => {
  it('提供六个有序且唯一的正式应用场景', () => {
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
    expect(trialScenes.every((scene) => scene.media.kind === 'image')).toBe(true)
    expect(
      trialScenes.every(
        (scene) => scene.media.kind === 'image' && scene.media.src && scene.media.alt,
      ),
    ).toBe(true)
    expect(trialScenes.map((scene) => scene.title)).toEqual([
      '地下矿山设备集中监控',
      '采掘过程可视化',
      '钻孔计划与进度跟踪',
      '设备故障与报警处置',
      '井下实时视频巡检',
      '多系统数据接入与集成',
    ])
  })

  it('保留可选的联系方式判断逻辑', () => {
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
