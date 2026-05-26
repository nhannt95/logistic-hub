<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Sonner } from '@/components/ui/sonner'
import LoadingScreen from '@/components/ui/loading/LoadingScreen.vue'
import { useLoading } from '@/lib/loading'

const { isLoading } = useLoading()
</script>

<template>
  <RouterView />
  <Sonner />
  <LoadingScreen :show="isLoading" />
</template>
