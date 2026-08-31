import { onBeforeUnmount, onMounted, ref } from 'vue'

function readReducedMotionPreference(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
}

export function useShowcasePlayback() {
  const prefersReducedMotion = ref(readReducedMotionPreference())
  const isPlaying = ref(!prefersReducedMotion.value)
  const replayKey = ref(0)
  let mediaQuery: MediaQueryList | undefined
  let userHasChosenPlayback = false

  function syncReducedMotionPreference() {
    prefersReducedMotion.value = readReducedMotionPreference()
    if (!userHasChosenPlayback) {
      isPlaying.value = !prefersReducedMotion.value
    }
  }

  function play() {
    userHasChosenPlayback = true
    isPlaying.value = true
  }

  function pause() {
    userHasChosenPlayback = true
    isPlaying.value = false
  }

  function replay() {
    userHasChosenPlayback = true
    replayKey.value += 1
    isPlaying.value = true
  }

  onMounted(() => {
    syncReducedMotionPreference()
    mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', syncReducedMotionPreference)
    } else {
      mediaQuery?.addListener?.(syncReducedMotionPreference)
    }
  })

  onBeforeUnmount(() => {
    if (mediaQuery?.removeEventListener) {
      mediaQuery.removeEventListener('change', syncReducedMotionPreference)
    } else {
      mediaQuery?.removeListener?.(syncReducedMotionPreference)
    }
  })

  return {
    isPlaying,
    replayKey,
    prefersReducedMotion,
    play,
    pause,
    replay,
  }
}
