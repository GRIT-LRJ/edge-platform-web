<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { siteConfig } from '../config/site'

type GuideLoadStatus = 'loading' | 'loaded' | 'slow'

const frameKey = ref(0)
const loadStatus = ref<GuideLoadStatus>('loading')
let slowLoadTimer: ReturnType<typeof setTimeout> | undefined

const loadStatusLabel = computed(() => {
  const labels: Record<GuideLoadStatus, string> = {
    loading: '正在加载',
    loaded: '已加载',
    slow: '加载较慢',
  }

  return labels[loadStatus.value]
})

function clearSlowLoadTimer() {
  if (slowLoadTimer !== undefined) {
    clearTimeout(slowLoadTimer)
    slowLoadTimer = undefined
  }
}

function startLoading() {
  clearSlowLoadTimer()
  loadStatus.value = 'loading'
  slowLoadTimer = setTimeout(() => {
    if (loadStatus.value === 'loading') {
      loadStatus.value = 'slow'
    }
  }, siteConfig.guide.loadTimeoutMs)
}

function handleFrameLoad() {
  clearSlowLoadTimer()
  loadStatus.value = 'loaded'
}

function reloadGuide() {
  frameKey.value += 1
  startLoading()
}

onMounted(startLoading)
onBeforeUnmount(clearSlowLoadTimer)
</script>

<template>
  <section class="guide-page" aria-labelledby="guide-title">
    <header class="guide-toolbar">
      <div class="guide-toolbar__heading">
        <div>
          <p class="guide-toolbar__eyebrow">产品文档</p>
          <h1 id="guide-title">用户指南</h1>
        </div>
        <p class="guide-status" :data-status="loadStatus" aria-live="polite">
          <span class="guide-status__dot" aria-hidden="true"></span>
          {{ loadStatusLabel }}
        </p>
      </div>

      <div class="guide-toolbar__actions">
        <button class="guide-action" type="button" @click="reloadGuide">重新加载</button>
        <a
          class="guide-action guide-action--primary"
          :href="siteConfig.guide.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          在新窗口打开
          <span class="visually-hidden">用户指南</span>
        </a>
      </div>
    </header>

    <p class="guide-intro">查阅 Edge 平台的配置、接入与使用说明。</p>

    <p v-if="!siteConfig.guide.publicMode" class="guide-notice">
      当前用户指南可能需要项目账号和访问权限；免登录公开版上线后将通过部署配置切换。
    </p>

    <p v-if="loadStatus === 'slow'" class="guide-notice guide-notice--warning" role="status">
      文档加载时间较长或暂时不可用。你可以重新加载，或在新窗口中打开用户指南。
    </p>

    <div class="guide-frame-shell" :data-status="loadStatus">
      <iframe
        :key="frameKey"
        class="guide-frame"
        :src="siteConfig.guide.url"
        title="Edge 平台用户指南"
        loading="eager"
        referrerpolicy="strict-origin-when-cross-origin"
        @load="handleFrameLoad"
      ></iframe>
    </div>
  </section>
</template>
