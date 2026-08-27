export type HomeVisualVariant = 'configuration' | 'monitoring' | 'integration'

export interface HomeImageMedia {
  kind: 'image'
  src: string
  alt: string
  desktopPosition?: string
  mobilePosition?: string
}

export interface HomePlaceholderMedia {
  kind: 'placeholder'
  visual: HomeVisualVariant
}

export type HomeMedia = HomeImageMedia | HomePlaceholderMedia

export interface HomeHeroConfig {
  eyebrow: string
  titleLines: readonly [string, string]
  description: string
  media: HomeMedia
}

export interface HomeSection {
  id: string
  title: string
  description: string
  media: HomeMedia
  textSide: 'left' | 'right'
}

export const homeHero: HomeHeroConfig = {
  eyebrow: '矿山装备数字化应用平台',
  titleLines: ['可视化组态', '让矿山装备应用更快落地'],
  description: '从可视化组态到实时数据连接，以开放的平台能力承载设备应用。',
  media: {
    kind: 'placeholder',
    visual: 'configuration',
  },
}

export const homeSections: readonly HomeSection[] = [
  {
    id: 'platform-introduction',
    title: '平台介绍 01',
    description: '内容待项目分析后补充',
    media: {
      kind: 'placeholder',
      visual: 'configuration',
    },
    textSide: 'left',
  },
  {
    id: 'platform-introduction-02',
    title: '平台介绍 02',
    description: '内容待项目分析后补充',
    media: {
      kind: 'placeholder',
      visual: 'monitoring',
    },
    textSide: 'right',
  },
  {
    id: 'platform-introduction-03',
    title: '平台介绍 03',
    description: '内容待项目分析后补充',
    media: {
      kind: 'placeholder',
      visual: 'integration',
    },
    textSide: 'left',
  },
]
