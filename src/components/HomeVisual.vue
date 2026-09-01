<script setup lang="ts">
import { computed } from 'vue'

import type { HomeMedia } from '../config/home'
import ConfigurationAssemblyVisual from './ConfigurationAssemblyVisual.vue'
import IntegrationTopologyVisual from './IntegrationTopologyVisual.vue'
import ProductWorkflowVisual, { type ProductWorkflowKind } from './ProductWorkflowVisual.vue'

const props = defineProps<{
  media: HomeMedia
  hero?: boolean
}>()

const imageStyle = computed<Record<string, string>>(() => {
  if (props.media.kind !== 'image') {
    return {}
  }

  return {
    '--home-image-position-desktop': props.media.desktopPosition ?? 'center',
    '--home-image-position-mobile': props.media.mobilePosition ?? props.media.desktopPosition ?? 'center',
  }
})

const workflowMedia = computed<
  { kind: ProductWorkflowKind; label: string; durationMs: number } | undefined
>(() => {
  if (props.media.kind === 'parameter-alarm-animation') {
    return { kind: 'parameter-alarm', label: props.media.alt, durationMs: props.media.durationMs }
  }
  if (props.media.kind === 'sfc-animation') {
    return { kind: 'sfc', label: props.media.alt, durationMs: props.media.durationMs }
  }
  if (props.media.kind === 'monitoring-animation') {
    return { kind: 'monitoring', label: props.media.alt, durationMs: props.media.durationMs }
  }
  return undefined
})
</script>

<template>
  <div
    class="home-visual"
    :class="{
      'home-visual--hero': hero,
      'home-visual--configuration-animation': media.kind === 'configuration-animation',
      'home-visual--integration-topology': media.kind === 'integration-topology',
      'home-visual--product-workflow': workflowMedia,
    }"
  >
    <template v-if="media.kind === 'image'">
      <picture class="home-visual__picture">
        <source v-if="media.avif" :srcset="media.avif" type="image/avif" />
        <source v-if="media.webp" :srcset="media.webp" type="image/webp" />
        <img
          class="home-visual__image"
          :src="media.src"
          :alt="media.alt"
          :style="imageStyle"
          :loading="hero ? 'eager' : 'lazy'"
          decoding="async"
        />
      </picture>
      <span class="home-visual__image-badge" aria-hidden="true">产品演示界面</span>
    </template>

    <ConfigurationAssemblyVisual
      v-else-if="media.kind === 'configuration-animation'"
      :label="media.alt"
    />

    <IntegrationTopologyVisual
      v-else-if="media.kind === 'integration-topology'"
      :label="media.alt"
    />

    <ProductWorkflowVisual
      v-else-if="workflowMedia"
      :kind="workflowMedia.kind"
      :label="workflowMedia.label"
      :duration-ms="workflowMedia.durationMs"
    />

    <div
      v-else
      class="home-visual__placeholder"
      :data-visual="media.visual"
      aria-hidden="true"
    >
      <div v-if="media.visual === 'configuration'" class="home-visual__editor">
        <div class="home-visual__window-bar">
          <span></span>
          <span></span>
          <span></span>
          <strong>Edge Studio</strong>
        </div>
        <div class="home-visual__editor-body">
          <aside class="home-visual__palette">
            <i v-for="index in 5" :key="index"></i>
          </aside>
          <div class="home-visual__canvas">
            <span class="home-visual__canvas-grid"></span>
            <span class="home-visual__canvas-node home-visual__canvas-node--one"></span>
            <span class="home-visual__canvas-node home-visual__canvas-node--two"></span>
            <span class="home-visual__canvas-node home-visual__canvas-node--three"></span>
            <span class="home-visual__canvas-link home-visual__canvas-link--one"></span>
            <span class="home-visual__canvas-link home-visual__canvas-link--two"></span>
          </div>
          <aside class="home-visual__properties">
            <span v-for="index in 4" :key="index"></span>
          </aside>
        </div>
      </div>

      <div v-else-if="media.visual === 'monitoring'" class="home-visual__monitoring">
        <div class="home-visual__monitoring-header">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="home-visual__monitoring-body">
          <div class="home-visual__metric home-visual__metric--large"></div>
          <div class="home-visual__metric"></div>
          <div class="home-visual__metric"></div>
          <div class="home-visual__chart"></div>
          <div class="home-visual__chart home-visual__chart--secondary"></div>
        </div>
      </div>

      <div v-else class="home-visual__integration">
        <span class="home-visual__integration-line home-visual__integration-line--one"></span>
        <span class="home-visual__integration-line home-visual__integration-line--two"></span>
        <span class="home-visual__integration-line home-visual__integration-line--three"></span>
        <span class="home-visual__integration-node home-visual__integration-node--one"></span>
        <span class="home-visual__integration-node home-visual__integration-node--two"></span>
        <span class="home-visual__integration-node home-visual__integration-node--three"></span>
        <span class="home-visual__integration-node home-visual__integration-node--four"></span>
        <strong>SDK · API · DATA</strong>
      </div>

      <span class="home-visual__badge">示意画面</span>
    </div>
  </div>
</template>
