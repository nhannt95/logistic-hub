<script setup lang="ts">
import { computed } from 'vue'
import { Toaster, type ToasterProps } from 'vue-sonner'
import 'vue-sonner/style.css'
import { useTheme } from '@/lib/theme'

const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'top-right',
  richColors: true,
  closeButton: true,
  expand: false,
  duration: 3500,
})

const { theme } = useTheme()
const resolvedTheme = computed<'light' | 'dark'>(() => theme.value)
</script>

<template>
  <Toaster
    v-bind="props"
    :theme="resolvedTheme"
    :toast-options="{
      classes: {
        toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
      },
    }"
  />
</template>
