<script setup lang="ts">
import { computed } from 'vue'
import { Label, type LabelProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<LabelProps & { class?: string }>()
const classes = computed(() =>
  cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', props.class)
)
</script>

<template>
  <Label :class="classes" v-bind="$attrs">
    <slot />
  </Label>
</template>
