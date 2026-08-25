import { createRouter, createWebHistory, type RouterHistory, type RouteRecordRaw } from 'vue-router'

import ExamplesPage from './views/ExamplesPage.vue'
import GuidePage from './views/GuidePage.vue'
import HomePage from './views/HomePage.vue'
import TrialPage from './views/TrialPage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage, meta: { title: '首页' } },
  { path: '/examples', name: 'examples', component: ExamplesPage, meta: { title: '示例' } },
  { path: '/trial', name: 'trial', component: TrialPage, meta: { title: '试用' } },
  { path: '/guide', name: 'guide', component: GuidePage, meta: { title: '用户指南' } },
]

export function createAppRouter(history: RouterHistory = createWebHistory()) {
  return createRouter({ history, routes })
}
