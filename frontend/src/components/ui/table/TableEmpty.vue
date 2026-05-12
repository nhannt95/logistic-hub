<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
const props = defineProps<{ class?: string; colspan?: number }>()
const classes = computed(() => cn('p-8 text-center text-sm text-muted-foreground', props.class))
</script>
<template>
  <tr>
    <td :class="classes" :colspan="colspan"><slot /></td>
  </tr>
</template>
