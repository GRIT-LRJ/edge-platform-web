<script setup lang="ts">
import { computed } from 'vue'

import type { TrialScene } from '../config/trial'

const props = defineProps<{
  scene: TrialScene
  index: number
}>()

const sceneNumber = computed(() => String(props.index + 1).padStart(2, '0'))
const placeholderStyle = computed<Record<string, string> | undefined>(() => {
  if (props.scene.media.kind !== 'placeholder') {
    return undefined
  }

  return { '--trial-scene-hue': String(props.scene.media.hue) }
})
</script>

<template>
  <article class="trial-scene-row" :aria-labelledby="`${scene.id}-title`">
    <div class="trial-scene-row__media">
      <img
        v-if="scene.media.kind === 'image'"
        :src="scene.media.src"
        :alt="scene.media.alt"
        loading="lazy"
        decoding="async"
      />
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
    </div>

    <div class="trial-scene-row__content">
      <p>平台应用场景</p>
      <h3 :id="`${scene.id}-title`">{{ scene.title }}</h3>
      <div class="trial-scene-row__line" aria-hidden="true"></div>
      <p class="trial-scene-row__description">{{ scene.description }}</p>
    </div>
  </article>
</template>
