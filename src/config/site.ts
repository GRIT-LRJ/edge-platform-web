export interface SiteNavItem {
  label: string
  path: '/' | '/examples' | '/trial' | '/guide'
}

export interface SiteSeoConfig {
  defaultTitle: string
  defaultDescription: string
}

export interface SiteFooterConfig {
  copyrightOwner: string
  filingNumber: string
  email?: string
  phone?: string
  wechat?: string
}

export interface SiteGuideConfig {
  url: string
  publicMode: boolean
  loadTimeoutMs: number
}

export interface GuideEnvironment {
  VITE_GUIDE_URL?: string
  VITE_GUIDE_PUBLIC?: string
}

export interface SiteConfig {
  brandName: string
  siteUrl: string
  navigation: readonly SiteNavItem[]
  seo: SiteSeoConfig
  footer: SiteFooterConfig
  guide: SiteGuideConfig
}

export const DEFAULT_GUIDE_URL = 'https://edge.tmic.com.cn/docs/'

export function resolveGuideConfig(environment: GuideEnvironment): SiteGuideConfig {
  const configuredUrl = environment.VITE_GUIDE_URL?.trim()
  let url = DEFAULT_GUIDE_URL

  if (configuredUrl) {
    try {
      const parsedUrl = new URL(configuredUrl)
      if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
        url = parsedUrl.href
      }
    } catch {
      // Keep the known-safe default when the build-time value is not a valid URL.
    }
  }

  return {
    url,
    publicMode: environment.VITE_GUIDE_PUBLIC?.trim().toLowerCase() === 'true',
    loadTimeoutMs: 8_000,
  }
}

const guideConfig = resolveGuideConfig(import.meta.env)

export const siteConfig = {
  brandName: 'Edge平台',
  siteUrl: import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173',
  navigation: [
    { label: '首页', path: '/' },
    { label: '示例', path: '/examples' },
    { label: '试用', path: '/trial' },
    { label: '用户指南', path: '/guide' },
  ],
  seo: {
    defaultTitle: 'Edge平台｜矿山装备数字化应用平台',
    defaultDescription:
      'Edge 平台面向矿山装备企业，提供可视化组态、实时数据连接与开放集成能力。',
  },
  footer: {
    copyrightOwner: '',
    filingNumber: '',
    email: '',
    phone: '',
    wechat: '',
  },
  guide: guideConfig,
} as const satisfies SiteConfig
