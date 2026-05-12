<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Truck, Package, DollarSign, AlertTriangle, ArrowUp, ArrowDown, Clock,
  CheckCircle2, TrendingUp, Activity, Users, Building2, Sparkles, RefreshCw,
  Download, Wrench, Power, MapPin,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import Sparkline from '@/components/charts/Sparkline.vue'
import { CHART_PALETTE } from '@/components/charts/chart-setup'
import { mockDieuDoRows } from '@/data/mockDieuDo'
import { mockVehicles, VEHICLE_STATUS_LABEL, type VehicleStatus } from '@/data/mockMaster'
import { formatVnd } from '@/lib/utils'

const auth = useAuthStore()

// Period filter
const period = ref<'today' | 'week' | 'month' | 'quarter' | 'year'>('month')

// Period multipliers for mock variation
const periodFactor = computed<{ mult: number; sub: string; days: number }>(() => {
  switch (period.value) {
    case 'today': return { mult: 0.04, sub: 'hôm nay', days: 1 }
    case 'week': return { mult: 0.25, sub: 'tuần này', days: 7 }
    case 'month': return { mult: 1.0, sub: 'tháng này', days: 30 }
    case 'quarter': return { mult: 3.1, sub: 'quý này', days: 90 }
    case 'year': return { mult: 12.4, sub: 'năm nay', days: 365 }
  }
})

const now = new Date('2026-05-12T08:30:00')
const greeting = computed(() => {
  const h = now.getHours()
  if (h < 12) return 'Chào buổi sáng'
  if (h < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
})

const todayLabel = computed(() => {
  return now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
})

// ============== Primary KPI =============
const heroKpis = computed(() => {
  const f = periodFactor.value
  return [
    {
      label: 'Doanh thu',
      value: Math.round(1840 * f.mult * 1_000_000),
      formatVnd: true,
      delta: '+8.2%',
      up: true,
      icon: DollarSign,
      tone: 'emerald',
      sparkline: [62, 68, 65, 72, 78, 75, 84, 88, 92, 89, 95, 102],
    },
    {
      label: 'Tổng lệnh',
      value: Math.round(124 * f.mult),
      delta: '+12%',
      up: true,
      icon: Package,
      tone: 'sky',
      sparkline: [8, 10, 9, 12, 14, 13, 15, 14, 16, 18, 17, 20],
    },
    {
      label: 'Cont đã giao',
      value: Math.round(248 * f.mult),
      delta: '+15%',
      up: true,
      icon: Truck,
      tone: 'violet',
      sparkline: [12, 14, 16, 18, 16, 19, 20, 22, 24, 23, 25, 28],
    },
    {
      label: 'Tỉ lệ đúng hẹn',
      value: 94,
      suffix: '%',
      delta: '+1.5%',
      up: true,
      icon: CheckCircle2,
      tone: 'amber',
      sparkline: [88, 89, 91, 90, 92, 93, 93, 92, 94, 94, 93, 94],
    },
  ]
})

function toneClasses(tone: string) {
  const map: Record<string, { bg: string; text: string; bar: string; spark: string }> = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-300',
      bar: 'from-emerald-400 to-emerald-600',
      spark: '#10b981',
    },
    sky: {
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-600 dark:text-sky-300',
      bar: 'from-sky-400 to-sky-600',
      spark: '#0ea5e9',
    },
    violet: {
      bg: 'bg-violet-50 dark:bg-violet-950/40',
      text: 'text-violet-600 dark:text-violet-300',
      bar: 'from-violet-400 to-violet-600',
      spark: '#8b5cf6',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-300',
      bar: 'from-amber-400 to-amber-600',
      spark: '#f59e0b',
    },
  }
  return map[tone] ?? map.sky
}

// ============== Charts ===============
const last7Days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const trendData = computed(() => ({
  labels: last7Days,
  datasets: [
    {
      label: 'Doanh thu (triệu)',
      data: [82, 95, 88, 110, 105, 124, 76],
      borderColor: CHART_PALETTE.emerald,
      backgroundColor: CHART_PALETTE.emeraldSoft,
      fill: true,
    },
    {
      label: 'Chi phí (triệu)',
      data: [54, 62, 58, 70, 66, 78, 50],
      borderColor: CHART_PALETTE.rose,
      backgroundColor: CHART_PALETTE.roseSoft,
      fill: true,
    },
  ],
}))

const statusDoughnutData = computed(() => ({
  labels: ['XUẤT', 'NHẬP', 'Chuyển tải'],
  datasets: [
    {
      data: [
        mockDieuDoRows.filter((r) => r.tinhTrang === 'XUẤT').length,
        mockDieuDoRows.filter((r) => r.tinhTrang === 'NHẬP').length,
        mockDieuDoRows.filter((r) => r.tinhTrang === 'Chuyển tải').length,
      ],
      backgroundColor: [CHART_PALETTE.sky, CHART_PALETTE.emerald, CHART_PALETTE.amber],
      borderWidth: 0,
    },
  ],
}))

const totalContStatus = computed(() => mockDieuDoRows.length)

const carrierBarData = computed(() => ({
  labels: ['ANL', 'MSC', 'OOCL', 'ONE', 'MAERSK', 'EBKG', 'YANG'],
  datasets: [
    { label: '20\'', data: [18, 14, 11, 9, 16, 7, 5], backgroundColor: CHART_PALETTE.primary, borderRadius: 4 },
    { label: '40\'', data: [22, 19, 14, 12, 21, 9, 7], backgroundColor: CHART_PALETTE.violet, borderRadius: 4 },
  ],
}))

// ============== Top customers ===============
const topCustomers = computed(() => {
  const byKh = new Map<string, { revenue: number; count: number }>()
  for (const r of mockDieuDoRows) {
    const cur = byKh.get(r.khachHang) ?? { revenue: 0, count: 0 }
    cur.revenue += (r.doanhThu ?? r.chiPhiTaiXe ?? 1_500_000) * 1.6 // fake derived if no doanhThu
    cur.count += 1
    byKh.set(r.khachHang, cur)
  }
  const arr = Array.from(byKh.entries()).map(([name, info]) => ({ name, ...info }))
  arr.sort((a, b) => b.revenue - a.revenue)
  const max = arr[0]?.revenue ?? 1
  return arr.slice(0, 5).map((c) => ({ ...c, percent: (c.revenue / max) * 100 }))
})

// ============== Recent jobs ===============
const recentJobs = computed(() => {
  return [...mockDieuDoRows]
    .filter((r) => r.taiXe)
    .slice(0, 5)
    .map((r) => ({
      id: r.id,
      code: r.bookingBL || `HD ${r.hopDong}` || `KH-${r.id.padStart(4, '0')}`,
      customer: r.khachHang,
      route: r.tuyenVanChuyen,
      driver: r.taiXe,
      status: r.driverStatus === 'done' ? 'Hoàn thành'
        : r.driverStatus === 'delivering' ? 'Đang giao'
        : r.driverStatus === 'picking' ? 'Đang lấy'
        : 'Đang chạy',
      tone: r.driverStatus === 'done' ? 'success' as const
        : r.driverStatus === 'delivering' ? 'info' as const
        : 'warning' as const,
    }))
})

// ============== Fleet ===============
const fleetByStatus = computed(() => {
  const groups: Record<VehicleStatus, typeof mockVehicles> = {
    active: [],
    inactive: [],
    maintenance: [],
  }
  for (const v of mockVehicles) groups[v.status].push(v)
  return groups
})

const fleetCounts = computed(() => ({
  total: mockVehicles.length,
  active: fleetByStatus.value.active.length,
  maintenance: fleetByStatus.value.maintenance.length,
  inactive: fleetByStatus.value.inactive.length,
}))

function vehicleStatusVariant(s: VehicleStatus): 'success' | 'warning' | 'destructive' {
  if (s === 'active') return 'success'
  if (s === 'maintenance') return 'warning'
  return 'destructive'
}

// ============== Alerts ===============
const alerts = [
  { title: 'Cont CSNU1234567 sắp hết free-time', detail: 'Còn 1 ngày · phí lưu bãi sẽ phát sinh', tone: 'warning' as const, icon: Clock },
  { title: '3 lệnh chưa có tài xế cho ngày mai', detail: 'Cần điều phối trước 17:00 hôm nay', tone: 'destructive' as const, icon: AlertTriangle },
  { title: 'XE003 đang trong xưởng', detail: 'Sửa hệ thống phanh · dự kiến 2 ngày', tone: 'warning' as const, icon: Wrench },
  { title: 'Đã nghiệm thu KH-2026/0511-09', detail: 'Khách hàng xác nhận hoàn thành', tone: 'success' as const, icon: CheckCircle2 },
]

function initials(name: string): string {
  return name.split(' ').slice(-2).map((p) => p[0]).join('').toUpperCase()
}
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- ===== Hero Banner ===== -->
    <Card class="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950 text-white">
      <CardContent class="p-4 sm:p-5">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="space-y-0.5 min-w-0 flex-1">
            <div class="flex items-center gap-2 text-white/70 text-xs">
              <Sparkles class="h-3.5 w-3.5" />
              <span>{{ todayLabel }}</span>
            </div>
            <h2 class="text-lg sm:text-xl font-bold tracking-tight truncate">
              {{ greeting }}, {{ auth.user?.name ?? 'bạn' }} 👋
            </h2>
            <p class="text-xs sm:text-sm text-white/70 max-w-xl">
              Tổng quan hoạt động {{ periodFactor.sub }} của Khải Hoàng Logistics.
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <!-- Compact period selector -->
            <Tabs v-model="period">
              <TabsList class="h-8 bg-white/10 border border-white/15 backdrop-blur-sm p-0.5 gap-0">
                <TabsTrigger value="today" class="h-7 px-2 text-[11px] sm:text-xs data-[state=active]:bg-white data-[state=active]:text-blue-700 dark:data-[state=active]:text-indigo-900 text-white/85">Hôm nay</TabsTrigger>
                <TabsTrigger value="week" class="h-7 px-2 text-[11px] sm:text-xs data-[state=active]:bg-white data-[state=active]:text-blue-700 dark:data-[state=active]:text-indigo-900 text-white/85">Tuần</TabsTrigger>
                <TabsTrigger value="month" class="h-7 px-2 text-[11px] sm:text-xs data-[state=active]:bg-white data-[state=active]:text-blue-700 dark:data-[state=active]:text-indigo-900 text-white/85">Tháng</TabsTrigger>
                <TabsTrigger value="quarter" class="h-7 px-2 text-[11px] sm:text-xs data-[state=active]:bg-white data-[state=active]:text-blue-700 dark:data-[state=active]:text-indigo-900 text-white/85">Quý</TabsTrigger>
                <TabsTrigger value="year" class="h-7 px-2 text-[11px] sm:text-xs data-[state=active]:bg-white data-[state=active]:text-blue-700 dark:data-[state=active]:text-indigo-900 text-white/85">Năm</TabsTrigger>
              </TabsList>
            </Tabs>

            <div class="h-6 w-px bg-white/20 hidden sm:block" />

            <Button variant="ghost" size="icon" class="h-8 w-8 bg-white/10 hover:bg-white/20 text-white border border-white/15" title="Làm mới">
              <RefreshCw class="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" class="h-8 w-8 bg-white/10 hover:bg-white/20 text-white border border-white/15" title="Export">
              <Download class="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- ===== Primary KPI cards with sparklines ===== -->
    <div class="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      <Card v-for="k in heroKpis" :key="k.label" class="relative overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
        <div :class="['absolute inset-y-0 left-0 w-1 bg-gradient-to-b', toneClasses(k.tone).bar]" />
        <CardContent class="p-4 pl-5">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{{ k.label }}</div>
              <div class="flex items-baseline gap-1 mt-1.5">
                <span class="text-2xl sm:text-3xl font-black tabular-nums leading-none truncate">
                  {{ k.formatVnd ? formatVnd(Number(k.value)) : k.value }}
                </span>
                <span v-if="k.suffix" class="text-sm text-muted-foreground">{{ k.suffix }}</span>
              </div>
              <div class="flex items-center gap-1 mt-1.5 text-[11px]" :class="k.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
                <ArrowUp v-if="k.up" class="h-3 w-3" />
                <ArrowDown v-else class="h-3 w-3" />
                <span class="font-semibold">{{ k.delta }}</span>
                <span class="text-muted-foreground">vs kỳ trước</span>
              </div>
            </div>
            <div :class="['h-10 w-10 rounded-lg flex items-center justify-center shrink-0', toneClasses(k.tone).bg, toneClasses(k.tone).text]">
              <component :is="k.icon" class="h-5 w-5" />
            </div>
          </div>
          <Sparkline :data="k.sparkline" :color="toneClasses(k.tone).spark" :fill-color="toneClasses(k.tone).spark" :height="36" class="mt-2" />
        </CardContent>
      </Card>
    </div>

    <!-- ===== Trend + Status ===== -->
    <div class="grid gap-3 sm:gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-2">
        <CardHeader class="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle class="text-base">Doanh thu / Chi phí — 7 ngày</CardTitle>
            <CardDescription>Đơn vị: triệu VND</CardDescription>
          </div>
          <Badge variant="info" class="gap-1">
            <TrendingUp class="h-3 w-3" /> Margin ~32%
          </Badge>
        </CardHeader>
        <CardContent>
          <LineChart :data="trendData" :height="260" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Phân bố trạng thái</CardTitle>
          <CardDescription>{{ totalContStatus }} lệnh trong tháng</CardDescription>
        </CardHeader>
        <CardContent class="relative">
          <DoughnutChart :data="statusDoughnutData" :height="260" />
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-6">
            <div class="text-3xl font-black tabular-nums">{{ totalContStatus }}</div>
            <div class="text-[11px] text-muted-foreground uppercase tracking-wide">Tổng lệnh</div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ===== Top hãng tàu + Top KH ===== -->
    <div class="grid gap-3 sm:gap-4 lg:grid-cols-5">
      <Card class="lg:col-span-3">
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Cont theo hãng tàu</CardTitle>
          <CardDescription>Top 7 hãng tàu trong kỳ — chia theo loại cont</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart :data="carrierBarData" :height="260" stacked />
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader class="flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardTitle class="text-base flex items-center gap-2">
              <Building2 class="h-4 w-4 text-primary" /> Top khách hàng
            </CardTitle>
            <CardDescription>Theo doanh thu kỳ này</CardDescription>
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div v-for="(c, idx) in topCustomers" :key="c.name" class="space-y-1.5">
            <div class="flex items-center justify-between gap-2 text-sm">
              <div class="flex items-center gap-2 min-w-0">
                <span class="h-5 w-5 rounded bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">{{ idx + 1 }}</span>
                <span class="font-medium truncate">{{ c.name }}</span>
              </div>
              <span class="font-mono text-xs tabular-nums text-muted-foreground shrink-0">
                {{ formatVnd(c.revenue) }} · {{ c.count }}
              </span>
            </div>
            <Progress :value="c.percent" />
          </div>
          <div v-if="topCustomers.length === 0" class="py-6 text-center text-sm text-muted-foreground">
            Chưa có dữ liệu doanh thu.
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ===== Recent jobs + Alerts ===== -->
    <div class="grid gap-3 sm:gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-2">
        <CardHeader class="flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardTitle class="text-base flex items-center gap-2">
              <Activity class="h-4 w-4 text-primary" /> Hoạt động gần đây
            </CardTitle>
            <CardDescription>Các lệnh có tài xế đã phân công</CardDescription>
          </div>
          <Button variant="ghost" size="sm">Xem tất cả</Button>
        </CardHeader>
        <CardContent>
          <div v-if="recentJobs.length === 0" class="py-6 text-center text-sm text-muted-foreground">Chưa có lệnh.</div>
          <div v-else class="divide-y">
            <div v-for="job in recentJobs" :key="job.id" class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <Avatar class="h-9 w-9 shrink-0">
                <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">{{ initials(job.driver as string) }}</AvatarFallback>
              </Avatar>
              <div class="min-w-0 flex-1">
                <div class="font-medium text-sm truncate">{{ job.customer }} · <span class="font-mono text-xs text-muted-foreground">{{ job.code }}</span></div>
                <div class="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                  <MapPin class="h-3 w-3 shrink-0" /> {{ job.route }}
                </div>
              </div>
              <Badge :variant="job.tone" class="shrink-0 text-[10px]">{{ job.status }}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base flex items-center gap-2">
            <AlertTriangle class="h-4 w-4 text-amber-600" /> Cảnh báo
            <Badge variant="destructive" class="ml-auto text-[10px] h-5 px-1.5">{{ alerts.length }}</Badge>
          </CardTitle>
          <CardDescription>Cần xử lý sớm</CardDescription>
        </CardHeader>
        <CardContent class="divide-y">
          <div v-for="a in alerts" :key="a.title" class="flex gap-3 py-3 first:pt-0 last:pb-0">
            <div
              :class="[
                'h-8 w-8 rounded-md flex items-center justify-center shrink-0',
                a.tone === 'success' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
                a.tone === 'warning' && 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
                a.tone === 'destructive' && 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300',
              ]"
            >
              <component :is="a.icon" class="h-4 w-4" />
            </div>
            <div class="min-w-0">
              <div class="text-sm font-medium leading-snug">{{ a.title }}</div>
              <div class="text-xs text-muted-foreground mt-0.5">{{ a.detail }}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ===== Fleet status ===== -->
    <Card>
      <CardHeader class="flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle class="text-base flex items-center gap-2">
            <Truck class="h-4 w-4 text-primary" /> Tình trạng đội xe
          </CardTitle>
          <CardDescription>
            <span class="text-emerald-600 dark:text-emerald-400 font-medium">{{ fleetCounts.active }}</span> hoạt động ·
            <span class="text-amber-600 dark:text-amber-400 font-medium">{{ fleetCounts.maintenance }}</span> bảo dưỡng ·
            <span class="text-rose-600 dark:text-rose-400 font-medium">{{ fleetCounts.inactive }}</span> ngưng
            / {{ fleetCounts.total }} đầu xe
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div v-for="v in mockVehicles" :key="v.code" class="rounded-lg border bg-muted/30 p-3 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div class="flex items-center justify-between gap-2 mb-2">
              <code class="text-[10px] font-bold text-primary">{{ v.code }}</code>
              <Badge :variant="vehicleStatusVariant(v.status)" class="text-[10px] gap-1">
                <span :class="['h-1.5 w-1.5 rounded-full', v.status === 'active' && 'bg-emerald-500', v.status === 'maintenance' && 'bg-amber-500', v.status === 'inactive' && 'bg-rose-500']" />
                {{ v.status === 'active' ? 'Hoạt động' : v.status === 'maintenance' ? 'Bảo dưỡng' : 'Ngưng' }}
              </Badge>
            </div>
            <div class="font-mono font-bold text-sm">{{ v.plateNumber }}</div>
            <div class="text-xs text-muted-foreground mt-0.5 truncate">{{ v.manufacturer }} {{ v.model }}</div>
            <div class="mt-2 pt-2 border-t text-[11px] text-muted-foreground space-y-0.5">
              <div class="flex items-center justify-between gap-1">
                <span>Mooc</span>
                <span class="font-mono text-foreground">{{ v.mooc }}</span>
              </div>
              <div class="flex items-center justify-between gap-1">
                <span>Tài xế</span>
                <span class="font-mono text-foreground">{{ v.assignedDriver || '—' }}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
