<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    value?: number
    max?: number
    indicatorClass?: string
    class?: string
  }>(),
  { value: 0, max: 100 }
)

const pct = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))

const trackClasses = computed(() => cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', props.class))
const indicatorClasses = computed(() => cn('h-full rounded-full bg-primary transition-all', props.indicatorClass))
</script>

<template>
  <div :class="trackClasses">
    <div :class="indicatorClasses" :style="{ width: pct + '%' }" />
  </div>
</template>
