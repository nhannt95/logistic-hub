<script setup lang="ts">
import { computed } from 'vue'
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  type DropdownMenuContentEmits,
  type DropdownMenuContentProps,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<DropdownMenuContentProps & { class?: string }>(), { sideOffset: 4 })
const emits = defineEmits<DropdownMenuContentEmits>()
const forwarded = useForwardPropsEmits(props, emits)
const classes = computed(() =>
  cn(
    'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    props.class
  )
)
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent v-bind="forwarded" :class="classes">
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
