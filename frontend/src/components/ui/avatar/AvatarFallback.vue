<script setup lang="ts">
import { computed } from 'vue'
import { AvatarFallback, type AvatarFallbackProps, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<AvatarFallbackProps & { class?: string }>()
const forwarded = useForwardProps(props)
const classes = computed(() =>
  cn('flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium', props.class)
)
</script>

<template>
  <AvatarFallback v-bind="forwarded" :class="classes"><slot /></AvatarFallback>
</template>
