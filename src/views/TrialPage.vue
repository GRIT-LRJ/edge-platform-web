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
        围绕您的设备、数据源和应用目标，获取产品演示、平台试用与集成指导。我们将从一个可验证的设备画面开始，帮助您评估组态、数据绑定和运行部署流程。
      </p>
      <p v-if="!hasTrialContact" class="trial-contact-status" role="status">
        申请联系方式待配置
      </p>
    </header>

    <section class="trial-scenes" aria-labelledby="trial-scenes-title">
      <header class="trial-scenes__heading">
        <p>APPLICATION SCENARIOS</p>
        <h2 id="trial-scenes-title">平台应用场景</h2>
        <p>从地下矿山设备监控到数据集成，用可验证的产品能力支撑设备应用落地。</p>
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
