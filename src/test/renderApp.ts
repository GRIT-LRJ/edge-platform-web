import { render } from '@testing-library/vue'
import { createMemoryHistory } from 'vue-router'

import App from '../App.vue'
import { createAppRouter } from '../router'

export async function renderApp(initialPath = '/') {
  const router = createAppRouter(createMemoryHistory())
  await router.push(initialPath)
  await router.isReady()

  const result = render(App, {
    global: {
      plugins: [router],
    },
  })

  return { ...result, router }
}
