<script setup lang="ts">
import TrialSceneRow from '../components/TrialSceneRow.vue'
import { siteConfig } from '../config/site'
import { hasConfiguredTrialContact, trialScenes } from '../config/trial'

const hasTrialContact = hasConfiguredTrialContact(siteConfig.footer)
</script>

<template>
  <section class="trial-page" aria-labelledby="trial-title">
    <header class="trial-hero">
      <p class="trial-hero__eyebrow">了解平台能力</p>
      <h1 id="trial-title">试用 Edge 平台</h1>
      <p class="trial-hero__lead">
        面向矿山装备应用建设，了解 Edge 平台的产品能力与典型应用方向。
      </p>
      <p v-if="!hasTrialContact" class="trial-contact-status" role="status">
        申请联系方式待配置
      </p>
    </header>

    <section class="trial-scenes" aria-labelledby="trial-scenes-title">
      <header class="trial-scenes__heading">
        <p>APPLICATION SCENARIOS</p>
        <h2 id="trial-scenes-title">平台应用场景</h2>
        <p>正式场景文案与图片正在准备中，以下内容为结构占位。</p>
      </header>

      <div class="trial-scene-list">
        <TrialSceneRow
          v-for="(scene, index) in trialScenes"
          :key="scene.id"
          :scene="scene"
          :index="index"
        />
      </div>
    </section>
  </section>
</template>
