import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export type SiteTheme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'edge-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function readStoredTheme(): SiteTheme | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : undefined
  } catch {
    return undefined
  }
}

function writeStoredTheme(theme: SiteTheme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Theme switching remains available when storage is unavailable.
  }
}

function applyTheme(theme: SiteTheme) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (themeColor) {
    themeColor.content = theme === 'dark' ? '#050b13' : '#edf1f7'
  }
}

export function useTheme() {
  const mediaQuery =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(DARK_QUERY)
      : undefined
  const storedTheme = readStoredTheme()
  const hasUserPreference = ref(Boolean(storedTheme))
  const theme = ref<SiteTheme>(storedTheme ?? (mediaQuery?.matches ? 'dark' : 'light'))

  applyTheme(theme.value)

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    hasUserPreference.value = true
    applyTheme(theme.value)
    writeStoredTheme(theme.value)
  }

  function handleSystemThemeChange(event: MediaQueryListEvent) {
    if (hasUserPreference.value) {
      return
    }

    theme.value = event.matches ? 'dark' : 'light'
    applyTheme(theme.value)
  }

  onMounted(() => mediaQuery?.addEventListener('change', handleSystemThemeChange))
  onBeforeUnmount(() => mediaQuery?.removeEventListener('change', handleSystemThemeChange))

  return {
    isLightTheme: computed(() => theme.value === 'light'),
    theme,
    toggleTheme,
  }
}
