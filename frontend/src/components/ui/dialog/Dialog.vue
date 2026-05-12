<script setup lang="ts">
import { DialogRoot } from 'reka-ui'

const open = defineModel<boolean | undefined>('open')

defineProps<{ defaultOpen?: boolean; modal?: boolean }>()
</script>

<template>
  <DialogRoot v-model:open="open" :default-open="defaultOpen" :modal="modal">
    <slot />
  </DialogRoot>
</template>
