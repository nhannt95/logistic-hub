<script setup lang="ts">
import { computed } from 'vue'
import { DropdownMenuSeparator, type DropdownMenuSeparatorProps, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuSeparatorProps & { class?: string }>()
const forwarded = useForwardProps(props)
const classes = computed(() => cn('-mx-1 my-1 h-px bg-muted', props.class))
</script>

<template><DropdownMenuSeparator v-bind="forwarded" :class="classes" /></template>
