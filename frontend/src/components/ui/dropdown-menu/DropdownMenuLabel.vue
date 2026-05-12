<script setup lang="ts">
import { computed } from 'vue'
import { DropdownMenuLabel, type DropdownMenuLabelProps, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuLabelProps & { class?: string }>()
const forwarded = useForwardProps(props)
const classes = computed(() => cn('px-2 py-1.5 text-sm font-semibold', props.class))
</script>

<template>
  <DropdownMenuLabel v-bind="forwarded" :class="classes"><slot /></DropdownMenuLabel>
</template>
