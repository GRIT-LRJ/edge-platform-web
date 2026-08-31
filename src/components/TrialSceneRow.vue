<script setup lang="ts">
import { computed, inject } from 'vue'
import { RouterLink, routerKey } from 'vue-router'

import { trialScenePath, type TrialScene } from '../config/trial'

const props = defineProps<{
  scene: TrialScene
  index: number
}>()

const router = inject(routerKey, null)

const sceneNumber = computed(() => String(props.index + 1).padStart(2, '0'))
const detailPath = computed(() =>
  props.scene.slug ? trialScenePath(props.scene.slug) : undefined,
)
const isLink = computed(() => Boolean(detailPath.value))
const placeholderStyle = computed<Record<string, string> | undefined>(() => {
  if (props.scene.media.kind !== 'placeholder') {
    return undefined
  }

  return { '--trial-scene-hue': String(props.scene.media.hue) }
})
</script>

<template>
  <component
    :is="isLink ? (router ? RouterLink : 'a') : 'article'"
    :class="['trial-scene-row', isLink ? 'trial-scene-row--link' : '']"
    v-bind="
      isLink && router
        ? { to: detailPath }
        : isLink
          ? { href: detailPath }
          : {}
    "
    :aria-labelledby="`${scene.id}-title`"
  >
    <div class="trial-scene-row__media">
      <picture v-if="scene.media.kind === 'image'">
        <source
          v-if="scene.media.avif"
          :srcset="scene.media.avif"
          sizes="(max-width: 44rem) calc(100vw - 2rem), 18rem"
          type="image/avif"
        />
        <source
          v-if="scene.media.webp"
          :srcset="scene.media.webp"
          sizes="(max-width: 44rem) calc(100vw - 2rem), 18rem"
          type="image/webp"
        />
        <img
          :src="scene.media.src"
          :alt="scene.media.alt"
          sizes="(max-width: 44rem) calc(100vw - 2rem), 18rem"
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div
        v-else
        class="trial-scene-placeholder"
        :style="placeholderStyle"
        aria-hidden="true"
      >
        <span class="trial-scene-placeholder__grid"></span>
        <span class="trial-scene-placeholder__orbit"></span>
        <span class="trial-scene-placeholder__signal"></span>
        <span class="trial-scene-placeholder__number">{{ sceneNumber }}</span>
      </div>

      <div
        v-if="scene.media.kind === 'image' && scene.media.overlay"
        class="trial-scene-visual-overlay"
        aria-hidden="true"
      >
        <span class="trial-scene-visual-overlay__label">{{ scene.media.overlay.label }}</span>
        <strong>{{ scene.media.overlay.value }}</strong>
        <span class="trial-scene-visual-overlay__status">
          <i></i>{{ scene.media.overlay.status }}
        </span>
        <span class="trial-scene-visual-overlay__caption">产品示意 · 合成数据</span>
      </div>
    </div>

    <div class="trial-scene-row__content">
      <p>平台应用场景</p>
      <h3 :id="`${scene.id}-title`">{{ scene.title }}</h3>
      <div class="trial-scene-row__line" aria-hidden="true"></div>
      <p class="trial-scene-row__description">{{ scene.description }}</p>
      <span v-if="isLink" class="trial-scene-row__cta" aria-hidden="true">
        查看功能介绍 →
      </span>
    </div>
  </component>
</template>
