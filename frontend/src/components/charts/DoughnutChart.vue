<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import { ensureChartsRegistered, getChartTokens } from './chart-setup'
import { useTheme } from '@/lib/theme'

ensureChartsRegistered()

const props = withDefaults(
  defineProps<{
    data: ChartData<'doughnut'>
    options?: ChartOptions<'doughnut'>
    height?: number
  }>(),
  { height: 240 }
)

const { theme } = useTheme()

const baseOptions = computed<ChartOptions<'doughnut'>>(() => {
  const t = getChartTokens(theme.value === 'dark')
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { position: 'right', labels: { color: t.text } },
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
    ...props.options,
  }
})
</script>

<template>
  <div :style="{ height: height + 'px' }">
    <Doughnut :data="data" :options="baseOptions" />
  </div>
</template>
