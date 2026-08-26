/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_GUIDE_URL?: string
  readonly VITE_GUIDE_PUBLIC?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
