<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { trialScenes } from '../config/trial'

const props = defineProps<{
  sceneId: string
}>()

const scene = computed(() => trialScenes.find((item) => item.id === props.sceneId))
const titleId = computed(() =>
  scene.value ? `${scene.value.id}-detail-title` : 'trial-scene-detail-title',
)
const sceneNumber = computed(() => {
  const match = scene.value?.id.match(/(\d+)$/)
  return match ? match[1].padStart(2, '0') : '01'
})
const placeholderStyle = computed<Record<string, string> | undefined>(() => {
  if (scene.value?.media.kind !== 'placeholder') {
    return undefined
  }

  return { '--trial-scene-hue': String(scene.value.media.hue) }
})
</script>

<template>
  <section class="trial-scene-detail" :aria-labelledby="titleId">
    <template v-if="scene">
      <header class="trial-scene-detail__hero">
        <p class="trial-scene-detail__eyebrow">功能介绍</p>
        <h1 :id="`${scene.id}-detail-title`">{{ scene.title }}</h1>
        <p class="trial-scene-detail__lead">{{ scene.description }}</p>
      </header>

      <div class="trial-scene-row__media trial-scene-detail__media">
        <picture v-if="scene.media.kind === 'image'">
          <source
            v-if="scene.media.avif"
            :srcset="scene.media.avif"
            sizes="(max-width: 52rem) calc(100vw - 2rem), 52rem"
            type="image/avif"
          />
          <source
            v-if="scene.media.webp"
            :srcset="scene.media.webp"
            sizes="(max-width: 52rem) calc(100vw - 2rem), 52rem"
            type="image/webp"
          />
          <img
            :src="scene.media.src"
            :alt="scene.media.alt"
            sizes="(max-width: 52rem) calc(100vw - 2rem), 52rem"
            loading="eager"
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
          <span class="trial-scene-visual-overlay__label">
            {{ scene.media.overlay.label }}
          </span>
          <strong>{{ scene.media.overlay.value }}</strong>
          <span class="trial-scene-visual-overlay__status">
            <i></i>{{ scene.media.overlay.status }}
          </span>
          <span class="trial-scene-visual-overlay__caption">产品示意 · 合成数据</span>
        </div>
      </div>

      <div class="trial-scene-detail__features">
        <h2>功能介绍</h2>
        <ul>
          <li v-for="feature in scene.features" :key="feature">{{ feature }}</li>
        </ul>
      </div>

      <div class="trial-scene-detail__actions">
        <RouterLink class="trial-scene-detail__back" to="/trial">返回试用页</RouterLink>
      </div>
    </template>

    <template v-else>
      <header class="trial-scene-detail__hero">
        <p class="trial-scene-detail__eyebrow">功能介绍</p>
        <h1 :id="titleId">未找到该功能介绍</h1>
        <p class="trial-scene-detail__lead">
          该介绍页面不存在或已调整，请返回试用页查看全部应用场景。
        </p>
      </header>

      <div class="trial-scene-detail__actions">
        <RouterLink class="trial-scene-detail__back" to="/trial">返回试用页</RouterLink>
      </div>
    </template>
  </section>
</template>
