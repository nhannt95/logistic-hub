<script setup lang="ts">
import { computed } from 'vue'
import { TabsContent, type TabsContentProps, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<TabsContentProps & { class?: string }>()
const forwarded = useForwardProps(props)
const classes = computed(() =>
  cn(
    'mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    props.class
  )
)
</script>

<template>
  <TabsContent v-bind="forwarded" :class="classes"><slot /></TabsContent>
</template>
