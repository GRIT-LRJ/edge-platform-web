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

export interface SiteConfig {
  brandName: string
  siteUrl: string
  navigation: readonly SiteNavItem[]
  seo: SiteSeoConfig
  footer: SiteFooterConfig
}

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
} as const satisfies SiteConfig
