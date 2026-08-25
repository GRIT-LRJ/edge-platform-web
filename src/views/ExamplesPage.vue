<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

import DemoDialog from '../components/DemoDialog.vue'
import {
  demoCategories,
  demoItems,
  getDemoCategory,
  type DemoCategoryId,
  type DemoItem,
} from '../config/demos'

const selectedCategoryIds = ref<DemoCategoryId[]>([])
const selectedDemo = ref<DemoItem>()
const lastTrigger = ref<HTMLElement>()

const visibleDemos = computed(() => {
  if (selectedCategoryIds.value.length === 0) {
    return demoItems
  }

  return demoItems.filter((demo) => selectedCategoryIds.value.includes(demo.categoryId))
})

function toggleCategory(categoryId: DemoCategoryId) {
  const selectedIndex = selectedCategoryIds.value.indexOf(categoryId)

  if (selectedIndex >= 0) {
    selectedCategoryIds.value.splice(selectedIndex, 1)
    return
  }

  selectedCategoryIds.value.push(categoryId)
}

function openDemo(demo: DemoItem, event: MouseEvent) {
  selectedDemo.value = demo
  lastTrigger.value = event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined
}

async function closeDemo() {
  selectedDemo.value = undefined
  await nextTick()
  lastTrigger.value?.focus()
}
</script>

<template>
  <section class="examples-page" aria-labelledby="examples-title">
    <h1 id="examples-title" class="visually-hidden">示例</h1>

    <div class="demo-filters" role="group" aria-label="示例分类">
      <button
        v-for="category in demoCategories"
        :key="category.id"
        class="demo-filter"
        type="button"
        :aria-pressed="selectedCategoryIds.includes(category.id)"
        @click="toggleCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>

    <div class="demo-grid" aria-live="polite">
      <button
        v-for="demo in visibleDemos"
        :key="demo.id"
        class="demo-card"
        type="button"
        :data-category="demo.categoryId"
        :aria-label="demo.title"
        @click="openDemo(demo, $event)"
      >
        <span class="demo-card__cover" aria-hidden="true">
          <span class="demo-card__grid"></span>
          <span class="demo-card__code">{{ demo.id.slice(-2) }}</span>
        </span>
        <span class="demo-card__content">
          <span class="demo-card__category">{{ getDemoCategory(demo.categoryId)?.name }}</span>
          <strong>{{ demo.title }}</strong>
          <span class="demo-card__status">
            {{ demo.status === 'published' && demo.videoUrl ? '可播放' : '即将上线' }}
          </span>
        </span>
      </button>
    </div>

    <Teleport to="body">
      <DemoDialog
        v-if="selectedDemo"
        :demo="selectedDemo"
        :category-name="getDemoCategory(selectedDemo.categoryId)?.name ?? ''"
        @close="closeDemo"
      />
    </Teleport>
  </section>
</template>
