<script setup lang="ts">
import HomeVisual from '../components/HomeVisual.vue'
import { homeHero, homeSections } from '../config/home'
</script>

<template>
  <div class="home-page">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="home-hero__overlay" aria-hidden="true"></div>

      <div class="home-hero__inner">
        <div class="home-hero__content">
          <p class="home-hero__eyebrow">{{ homeHero.eyebrow }}</p>
          <h1 id="home-title">
            <span>{{ homeHero.titleLines[0] }}</span>
            <span>{{ homeHero.titleLines[1] }}</span>
          </h1>
          <p class="home-hero__lead">{{ homeHero.description }}</p>
        </div>
        <HomeVisual class="home-hero__visual" :media="homeHero.media" hero />
      </div>

      <a class="home-scroll-cue" href="#platform-introduction">
        <span>了解平台</span>
        <span class="home-scroll-cue__arrow" aria-hidden="true">↓</span>
      </a>
    </section>

    <div class="home-features">
      <article
        v-for="section in homeSections"
        :id="section.id"
        :key="section.id"
        class="home-feature"
        :data-text-side="section.textSide"
      >
        <div class="home-feature__copy">
          <p class="home-feature__eyebrow">平台能力</p>
          <h2>{{ section.title }}</h2>
          <div class="home-feature__line" aria-hidden="true"></div>
          <p class="home-feature__description">{{ section.description }}</p>
        </div>
        <HomeVisual class="home-feature__visual" :media="section.media" />
      </article>
    </div>
  </div>
</template>
