<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import type { DemoItem } from '../config/demos'

defineProps<{
  demo: DemoItem
  categoryName: string
}>()

const emit = defineEmits<{
  close: []
}>()

const dialogRoot = ref<HTMLElement>()
const closeButton = ref<HTMLButtonElement>()
const playbackError = ref(false)

function onDialogKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }

  if (event.key !== 'Tab' || !dialogRoot.value) {
    return
  }

  const focusableElements = Array.from(
    dialogRoot.value.querySelectorAll<HTMLElement>(
      'button, a[href], video[controls], [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('disabled'))
  const firstElement = focusableElements.at(0)
  const lastElement = focusableElements.at(-1)

  if (!firstElement || !lastElement) {
    event.preventDefault()
    return
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

onMounted(() => {
  document.body.classList.add('has-modal')
  closeButton.value?.focus()
})

onBeforeUnmount(() => document.body.classList.remove('has-modal'))
</script>

<template>
  <div
    ref="dialogRoot"
    class="demo-dialog-backdrop"
    @click.self="emit('close')"
    @keydown="onDialogKeydown"
  >
    <section
      class="demo-dialog"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`demo-dialog-title-${demo.id}`"
    >
      <header class="demo-dialog__header">
        <div>
          <span class="demo-dialog__category">{{ categoryName }}</span>
          <h2 :id="`demo-dialog-title-${demo.id}`">{{ demo.title }}</h2>
        </div>
        <button
          ref="closeButton"
          class="demo-dialog__close"
          type="button"
          aria-label="关闭视频弹窗"
          @click="emit('close')"
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>

      <div class="demo-dialog__media">
        <template v-if="demo.status === 'published' && demo.videoUrl">
          <video
            class="demo-dialog__video"
            :src="demo.videoUrl"
            :aria-label="`${demo.title}视频`"
            controls
            autoplay
            muted
            playsinline
            preload="metadata"
            @error="playbackError = true"
          ></video>
          <p v-if="playbackError" class="demo-dialog__error" role="status">
            视频暂时无法播放
          </p>
        </template>
        <div v-else class="demo-dialog__placeholder">
          <span class="demo-dialog__signal" aria-hidden="true"></span>
          <strong>视频即将上线</strong>
          <p>{{ demo.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
