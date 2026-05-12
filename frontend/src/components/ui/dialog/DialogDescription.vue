<script setup lang="ts">
import { computed } from 'vue'
import { DialogDescription, type DialogDescriptionProps, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<DialogDescriptionProps & { class?: string }>()
const forwarded = useForwardProps(props)
const classes = computed(() => cn('text-sm text-muted-foreground', props.class))
</script>

<template>
  <DialogDescription v-bind="forwarded" :class="classes"><slot /></DialogDescription>
</template>
