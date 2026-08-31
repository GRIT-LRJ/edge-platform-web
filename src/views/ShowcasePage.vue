<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import ShowcaseAnimation from '../components/ShowcaseAnimation.vue'
import {
  getShowcaseDefinition,
  isShowcaseId,
  type ShowcaseId,
} from '../config/showcases'
import { useShowcasePlayback } from '../composables/useShowcasePlayback'

const route = useRoute()

const kind = computed<ShowcaseId>(() => {
  const routeShowcaseId = typeof route.meta.showcaseId === 'string' ? route.meta.showcaseId : undefined
  return isShowcaseId(routeShowcaseId) ? routeShowcaseId : 'configuration'
})

const definition = computed(() => getShowcaseDefinition(kind.value))
const { isPlaying, replayKey, prefersReducedMotion, play, pause, replay } = useShowcasePlayback()
</script>

<template>
  <section class="showcase-page" :data-showcase="kind" :aria-labelledby="`showcase-page-title-${kind}`">
    <div class="showcase-page__heading">
      <h1 :id="`showcase-page-title-${kind}`">{{ definition.title }}</h1>
    </div>

    <div class="showcase-page__stage">
      <ShowcaseAnimation
        :definition="definition"
        :kind="kind"
        :playing="isPlaying"
        :replay-key="replayKey"
        :reduced-motion="prefersReducedMotion"
      />
    </div>

    <div class="showcase-page__controls" aria-label="动态演示控制">
      <button v-if="isPlaying" class="showcase-control" type="button" @click="pause">
        暂停演示
      </button>
      <button v-else class="showcase-control showcase-control--primary" type="button" @click="play">
        继续演示
      </button>
      <button class="showcase-control" type="button" @click="replay">重新播放</button>
      <RouterLink class="showcase-control showcase-control--back" to="/">返回首页</RouterLink>
    </div>
  </section>
</template>
