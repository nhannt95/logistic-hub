import { ref } from 'vue'

const MIN_DURATION = 600 // ms — đảm bảo loader hiện đủ lâu để thấy animation

const isLoading = ref(false)
let startedAt = 0
let timer: ReturnType<typeof setTimeout> | null = null

export function useLoading() {
  function start() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    isLoading.value = true
    startedAt = Date.now()
  }

  function stop() {
    const elapsed = Date.now() - startedAt
    const remaining = Math.max(0, MIN_DURATION - elapsed)
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      isLoading.value = false
      timer = null
    }, remaining)
  }

  return { isLoading, start, stop }
}
