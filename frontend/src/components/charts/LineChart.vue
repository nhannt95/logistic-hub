<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { ensureChartsRegistered, getChartTokens } from './chart-setup'
import { useTheme } from '@/lib/theme'

ensureChartsRegistered()

const props = withDefaults(
  defineProps<{
    data: ChartData<'line'>
    options?: ChartOptions<'line'>
    height?: number
  }>(),
  { height: 240 }
)

const { theme } = useTheme()

const baseOptions = computed<ChartOptions<'line'>>(() => {
  const t = getChartTokens(theme.value === 'dark')
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        display: (props.data.datasets?.length ?? 0) > 1,
        labels: { color: t.text },
      },
      tooltip: {
        backgroundColor: t.tooltipBg,
        titleColor: t.tooltipText,
        bodyColor: t.tooltipText,
        padding: 10,
        cornerRadius: 6,
        titleFont: { size: 12, weight: 600 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: { color: t.text, font: { size: 11 } } },
      y: { beginAtZero: true, grid: { color: t.grid }, border: { display: false }, ticks: { color: t.text, font: { size: 11 } } },
    },
    elements: { line: { tension: 0.35, borderWidth: 2 }, point: { radius: 0, hoverRadius: 5 } },
    ...props.options,
  }
})
</script>

<template>
  <div :style="{ height: height + 'px' }">
    <Line :data="data" :options="baseOptions" />
  </div>
</template>
