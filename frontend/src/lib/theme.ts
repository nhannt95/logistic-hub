import { ref, watchEffect } from 'vue'

type Theme = 'light' | 'dark'
const STORAGE_KEY = 'lh.theme'

function preferred(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(preferred())

watchEffect(() => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', theme.value === 'dark')
  root.style.colorScheme = theme.value
  localStorage.setItem(STORAGE_KEY, theme.value)
})

export function useTheme() {
  return {
    theme,
    isDark: () => theme.value === 'dark',
    toggle: () => (theme.value = theme.value === 'dark' ? 'light' : 'dark'),
    set: (t: Theme) => (theme.value = t),
  }
}
