<script setup lang="ts">
import { computed } from 'vue'

import type { SiteFooterConfig } from '../config/site'

const props = defineProps<{
  footer: SiteFooterConfig
}>()

const configuredValue = (value: string) => value.trim() || '待配置'
const contact = computed(() => ({
  email: props.footer.email?.trim() ?? '',
  phone: props.footer.phone?.trim() ?? '',
  wechat: props.footer.wechat?.trim() ?? '',
}))
const hasContact = computed(() => Object.values(contact.value).some(Boolean))
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__identity">
        <span>© {{ new Date().getFullYear() }} {{ configuredValue(footer.copyrightOwner) }}</span>
        <span>备案号：{{ configuredValue(footer.filingNumber) }}</span>
      </div>
      <address v-if="hasContact" class="site-footer__contacts">
        <a v-if="contact.email" :href="`mailto:${contact.email}`">邮箱：{{ contact.email }}</a>
        <a v-if="contact.phone" :href="`tel:${contact.phone}`">电话：{{ contact.phone }}</a>
        <span v-if="contact.wechat">微信：{{ contact.wechat }}</span>
      </address>
    </div>
  </footer>
</template>
