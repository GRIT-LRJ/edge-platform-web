<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import BrandMark from './components/BrandMark.vue'
import SiteFooter from './components/SiteFooter.vue'
import { siteConfig } from './config/site'
import { useTheme } from './composables/useTheme'

const route = useRoute()
const isMenuOpen = ref(false)
const menuButton = ref<HTMLButtonElement>()
const navigation = ref<HTMLElement>()
const mainContent = ref<HTMLElement>()
const { isLightTheme, toggleTheme } = useTheme()

function updatePageMetadata() {
  const routeTitle = typeof route.meta.title === 'string' ? route.meta.title : ''
  document.title = routeTitle
    ? `${routeTitle}｜${siteConfig.brandName}`
    : siteConfig.seo.defaultTitle

  let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!description) {
    description = document.createElement('meta')
    description.name = 'description'
    document.head.append(description)
  }
  description.content = siteConfig.seo.defaultDescription
}

async function openMenu() {
  isMenuOpen.value = true
  await nextTick()
  navigation.value?.querySelector<HTMLAnchorElement>('a')?.focus()
}

async function closeMenu(returnFocus = false) {
  isMenuOpen.value = false
  if (returnFocus) {
    await nextTick()
    menuButton.value?.focus()
  }
}

function toggleMenu() {
  if (isMenuOpen.value) {
    void closeMenu(true)
    return
  }
  void openMenu()
}

function onNavigationKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isMenuOpen.value) {
    event.preventDefault()
    void closeMenu(true)
  }
}

function onNavigationClick(destination: string) {
  if (route.path === destination) {
    void closeMenu(true)
  }
}

watch(
  () => route.fullPath,
  async (_currentPath, previousPath) => {
    const menuWasOpen = isMenuOpen.value
    isMenuOpen.value = false
    updatePageMetadata()
    if (previousPath !== undefined && menuWasOpen) {
      await nextTick()
      mainContent.value?.focus()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="site-header__inner">
        <RouterLink class="brand" to="/" @click="onNavigationClick('/')">
          <BrandMark />
          <span>{{ siteConfig.brandName }}</span>
        </RouterLink>

        <button
          ref="menuButton"
          class="menu-button"
          type="button"
          aria-controls="primary-navigation"
          :aria-expanded="isMenuOpen"
          :aria-label="isMenuOpen ? '关闭导航菜单' : '打开导航菜单'"
          @click="toggleMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          id="primary-navigation"
          ref="navigation"
          aria-label="主导航"
          class="site-navigation"
          :data-open="String(isMenuOpen)"
          @keydown="onNavigationKeydown"
        >
          <RouterLink
            v-for="item in siteConfig.navigation"
            :key="item.path"
            :to="item.path"
            @click="onNavigationClick(item.path)"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <button
          class="theme-switch"
          type="button"
          role="switch"
          :aria-checked="isLightTheme"
          :aria-label="isLightTheme ? '切换为深色主题' : '切换为浅色主题'"
          :title="isLightTheme ? '切换为深色主题' : '切换为浅色主题'"
          @click="toggleTheme"
        >
          <span class="theme-switch__track" aria-hidden="true">
            <span class="theme-switch__sun">☀</span>
            <span class="theme-switch__moon">☾</span>
            <span class="theme-switch__thumb"></span>
          </span>
        </button>
      </div>
    </header>

    <main id="main-content" ref="mainContent" class="site-main" tabindex="-1">
      <RouterView />
    </main>

    <SiteFooter :footer="siteConfig.footer" />
  </div>
</template>
