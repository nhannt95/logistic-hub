<script setup lang="ts">
import { computed } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme'

const { theme, toggle } = useTheme()
const label = computed(() => (theme.value === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'))
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    class="h-9 w-9 relative overflow-hidden"
    :title="label"
    :aria-label="label"
    @click="toggle"
  >
    <Sun class="h-4 w-4 transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
    <Moon class="h-4 w-4 absolute transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
  </Button>
</template>
