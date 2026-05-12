<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { ensureChartsRegistered, getChartTokens } from './chart-setup'
import { useTheme } from '@/lib/theme'

ensureChartsRegistered()

const props = withDefaults(
  defineProps<{
    data: ChartData<'bar'>
    options?: ChartOptions<'bar'>
    height?: number
    stacked?: boolean
  }>(),
  { height: 240, stacked: false }
)

const { theme } = useTheme()

const baseOptions = computed<ChartOptions<'bar'>>(() => {
  const t = getChartTokens(theme.value === 'dark')
  return {
    responsive: true,
    maintainAspectRatio: false,
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
      x: { stacked: props.stacked, grid: { display: false }, border: { display: false }, ticks: { color: t.text, font: { size: 11 } } },
      y: { stacked: props.stacked, beginAtZero: true, grid: { color: t.grid }, border: { display: false }, ticks: { color: t.text, font: { size: 11 } } },
    },
    ...props.options,
  }
})
</script>

<template>
  <div :style="{ height: height + 'px' }">
    <Bar :data="data" :options="baseOptions" />
  </div>
</template>
