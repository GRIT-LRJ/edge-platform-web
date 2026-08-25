<script setup lang="ts">
import type { SiteFooterConfig } from '../config/site'

defineProps<{
  footer: SiteFooterConfig
}>()

const configuredValue = (value: string) => value.trim() || '待配置'
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__identity">
        <span>© {{ new Date().getFullYear() }} {{ configuredValue(footer.copyrightOwner) }}</span>
        <span>备案号：{{ configuredValue(footer.filingNumber) }}</span>
      </div>
      <address v-if="footer.email || footer.phone || footer.wechat" class="site-footer__contacts">
        <a v-if="footer.email" :href="`mailto:${footer.email}`">邮箱：{{ footer.email }}</a>
        <a v-if="footer.phone" :href="`tel:${footer.phone}`">电话：{{ footer.phone }}</a>
        <span v-if="footer.wechat">微信：{{ footer.wechat }}</span>
      </address>
    </div>
  </footer>
</template>
