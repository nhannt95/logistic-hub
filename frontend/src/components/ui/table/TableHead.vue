<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<{ class?: string }>()
const classes = computed(() =>
  cn(
    'h-10 px-3 text-left align-middle font-semibold text-foreground bg-muted/60 whitespace-nowrap [&:has([role=checkbox])]:pr-0',
    props.class
  )
)
</script>
<template><th :class="classes"><slot /></th></template>
