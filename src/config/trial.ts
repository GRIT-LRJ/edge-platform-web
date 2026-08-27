import type { SiteFooterConfig } from './site'

export type TrialSceneMedia =
  | {
      kind: 'placeholder'
      hue: number
    }
  | {
      kind: 'image'
      src: string
      alt: string
    }

export interface TrialScene {
  id: string
  title: string
  description: string
  media: TrialSceneMedia
}

export const trialScenes: readonly TrialScene[] = Array.from({ length: 6 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')

  return {
    id: `trial-scene-${number}`,
    title: `应用场景 ${number}`,
    description: '场景内容待补充',
    media: {
      kind: 'placeholder',
      hue: 188 + index * 17,
    },
  }
})

export function hasConfiguredTrialContact(footer: SiteFooterConfig) {
  return [footer.email, footer.phone, footer.wechat].some((value) => Boolean(value?.trim()))
}
