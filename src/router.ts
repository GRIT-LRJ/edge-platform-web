import { createRouter, createWebHistory, type RouterHistory, type RouteRecordRaw } from 'vue-router'

import ExamplesPage from './views/ExamplesPage.vue'
import GuidePage from './views/GuidePage.vue'
import HomePage from './views/HomePage.vue'
import ShowcasePage from './views/ShowcasePage.vue'
import TrialPage from './views/TrialPage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage, meta: { title: '首页' } },
  { path: '/examples', name: 'examples', component: ExamplesPage, meta: { title: '示例' } },
  { path: '/trial', name: 'trial', component: TrialPage, meta: { title: '试用' } },
  { path: '/guide', name: 'guide', component: GuidePage, meta: { title: '用户指南' } },
  {
    path: '/showcase/configuration',
    name: 'showcase-configuration',
    component: ShowcasePage,
    meta: {
      title: '可视化组态动态演示',
      description: 'Edge 平台可视化组态工作流动态演示。',
      noindex: true,
      showcaseId: 'configuration',
    },
  },
  {
    path: '/showcase/monitoring',
    name: 'showcase-monitoring',
    component: ShowcasePage,
    meta: {
      title: '设备运行监控动态演示',
      description: 'Edge 平台设备运行监控工作流动态演示。',
      noindex: true,
      showcaseId: 'monitoring',
    },
  },
  {
    path: '/showcase/integration',
    name: 'showcase-integration',
    component: ShowcasePage,
    meta: {
      title: '开放集成动态演示',
      description: 'Edge 平台开放组件与接口集成工作流动态演示。',
      noindex: true,
      showcaseId: 'integration',
    },
  },
]

export function createAppRouter(history: RouterHistory = createWebHistory()) {
  return createRouter({ history, routes })
}
