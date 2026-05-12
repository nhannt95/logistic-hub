<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    data: number[]
    color?: string
    fillColor?: string
    height?: number
    showArea?: boolean
    strokeWidth?: number
  }>(),
  {
    color: 'currentColor',
    fillColor: 'currentColor',
    height: 36,
    showArea: true,
    strokeWidth: 1.8,
  }
)

const W = 100
const H = 30

const stats = computed(() => {
  const d = props.data
  if (d.length < 2) return null
  const max = Math.max(...d)
  const min = Math.min(...d)
  const range = max - min || 1
  return { d, max, min, range, step: W / (d.length - 1) }
})

const linePoints = computed(() => {
  const s = stats.value
  if (!s) return ''
  return s.d.map((v, i) => `${i * s.step},${H - ((v - s.min) / s.range) * H}`).join(' ')
})

const areaPath = computed(() => {
  const s = stats.value
  if (!s) return ''
  const pts = s.d.map((v, i) => [i * s.step, H - ((v - s.min) / s.range) * H] as const)
  const start = `M ${pts[0][0]},${H}`
  const lines = pts.map(([x, y]) => `L ${x},${y}`).join(' ')
  const close = `L ${pts[pts.length - 1][0]},${H} Z`
  return `${start} ${lines} ${close}`
})

const id = computed(() => `spark-${Math.random().toString(36).slice(2, 9)}`)
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="w-full overflow-visible" :style="{ height: height + 'px' }">
    <defs>
      <linearGradient :id="id" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="fillColor" stop-opacity="0.35" />
        <stop offset="100%" :stop-color="fillColor" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path v-if="showArea && stats" :d="areaPath" :fill="`url(#${id})`" />
    <polyline
      v-if="stats"
      :points="linePoints"
      :stroke="color"
      :stroke-width="strokeWidth"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
