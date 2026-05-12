import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

let registered = false

export function ensureChartsRegistered() {
  if (registered) return
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
  )
  ChartJS.defaults.font.family =
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  ChartJS.defaults.font.size = 12
  ChartJS.defaults.plugins.legend.labels.boxWidth = 12
  ChartJS.defaults.plugins.legend.labels.boxHeight = 12
  ChartJS.defaults.plugins.legend.labels.padding = 16
  registered = true
}

export interface ChartTokens {
  text: string
  grid: string
  tooltipBg: string
  tooltipText: string
}

export function getChartTokens(isDark: boolean): ChartTokens {
  return isDark
    ? {
        text: 'rgba(203, 213, 225, 0.75)',
        grid: 'rgba(148, 163, 184, 0.18)',
        tooltipBg: '#0f172a',
        tooltipText: '#f1f5f9',
      }
    : {
        text: 'rgba(71, 85, 105, 0.85)',
        grid: 'rgba(15, 23, 42, 0.1)',
        tooltipBg: '#0f172a',
        tooltipText: '#f8fafc',
      }
}

export const CHART_PALETTE = {
  primary: '#3b82f6',
  primarySoft: 'rgba(59, 130, 246, 0.18)',
  emerald: '#10b981',
  emeraldSoft: 'rgba(16, 185, 129, 0.18)',
  amber: '#f59e0b',
  amberSoft: 'rgba(245, 158, 11, 0.18)',
  rose: '#ef4444',
  roseSoft: 'rgba(239, 68, 68, 0.18)',
  violet: '#8b5cf6',
  violetSoft: 'rgba(139, 92, 246, 0.18)',
  sky: '#0ea5e9',
  slate: '#64748b',
} as const
