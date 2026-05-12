<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard,
  Download, FileSpreadsheet, Search, X, SlidersHorizontal, AlertCircle,
} from 'lucide-vue-next'
import { toast } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pagination } from '@/components/ui/pagination'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { DatePicker } from '@/components/ui/date-picker'
import BarChart from '@/components/charts/BarChart.vue'
import { CHART_PALETTE } from '@/components/charts/chart-setup'
import {
  mockDieuDoRows, KHACH_HANG_LIST, PAYMENT_LABEL,
  type DieuDoRow, type PaymentStatus,
} from '@/data/mockDieuDo'
import { formatDate, formatVnd } from '@/lib/utils'

const ALL = '__all__'

interface FinancialFilter {
  dateFrom: string
  dateTo: string
  khachHang: string
  thanhToan: string
  search: string
}

const filters = ref<FinancialFilter>({
  dateFrom: '',
  dateTo: '',
  khachHang: '',
  thanhToan: '',
  search: '',
})

const page = ref(1)
const pageSize = ref(25)

function patch(p: Partial<FinancialFilter>) {
  filters.value = { ...filters.value, ...p }
}

// Only rows that have financial data
const finRows = computed<DieuDoRow[]>(() => mockDieuDoRows.filter((r) => r.doanhThu != null || r.chiPhiTaiXe != null))

const filtered = computed(() => {
  const f = filters.value
  const q = f.search.trim().toLowerCase()
  return finRows.value.filter((r) => {
    if (f.dateFrom && r.ngayDongHang < f.dateFrom) return false
    if (f.dateTo && r.ngayDongHang > f.dateTo) return false
    if (f.khachHang && r.khachHang !== f.khachHang) return false
    if (f.thanhToan && r.thanhToan !== f.thanhToan) return false
    if (q && ![r.khachHang, r.tuyenVanChuyen, r.bookingBL, r.hopDong].some((v) => v.toLowerCase().includes(q))) return false
    return true
  })
})

const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

watch([filters, pageSize], () => (page.value = 1), { deep: true })

function totalCost(r: DieuDoRow): number {
  return (r.chiPhiTaiXe ?? 0) + (r.chiPhiKhac ?? 0)
}
function profit(r: DieuDoRow): number {
  return (r.doanhThu ?? 0) - totalCost(r)
}

const stats = computed(() => {
  const rs = filtered.value
  const doanhThu = rs.reduce((s, r) => s + (r.doanhThu ?? 0), 0)
  const chiPhi = rs.reduce((s, r) => s + totalCost(r), 0)
  const loiNhuan = doanhThu - chiPhi
  const congNo = rs
    .filter((r) => r.thanhToan === 'unpaid' || r.thanhToan === 'partial')
    .reduce((s, r) => s + (r.doanhThu ?? 0), 0)
  const margin = doanhThu ? (loiNhuan / doanhThu) * 100 : 0
  return { doanhThu, chiPhi, loiNhuan, congNo, margin, count: rs.length }
})

const chips = computed(() => {
  const v = filters.value
  const arr: { key: keyof FinancialFilter; label: string }[] = []
  if (v.dateFrom) arr.push({ key: 'dateFrom', label: `Từ: ${v.dateFrom}` })
  if (v.dateTo) arr.push({ key: 'dateTo', label: `Đến: ${v.dateTo}` })
  if (v.khachHang) arr.push({ key: 'khachHang', label: `KH: ${v.khachHang}` })
  if (v.thanhToan) arr.push({ key: 'thanhToan', label: `TT: ${PAYMENT_LABEL[v.thanhToan as PaymentStatus]}` })
  if (v.search.trim()) arr.push({ key: 'search', label: `Tìm: ${v.search}` })
  return arr
})

function removeChip(key: keyof FinancialFilter) { patch({ [key]: '' } as Partial<FinancialFilter>) }
function reset() { filters.value = { dateFrom: '', dateTo: '', khachHang: '', thanhToan: '', search: '' } }

// Chart: revenue vs cost per customer
const chartData = computed(() => {
  const byKh = new Map<string, { dt: number; cp: number }>()
  for (const r of filtered.value) {
    const e = byKh.get(r.khachHang) ?? { dt: 0, cp: 0 }
    e.dt += r.doanhThu ?? 0
    e.cp += totalCost(r)
    byKh.set(r.khachHang, e)
  }
  const labels = Array.from(byKh.keys())
  return {
    labels,
    datasets: [
      { label: 'Doanh thu', data: labels.map((k) => Math.round((byKh.get(k)!.dt) / 1_000_000)), backgroundColor: CHART_PALETTE.emerald, borderRadius: 4 },
      { label: 'Chi phí', data: labels.map((k) => Math.round((byKh.get(k)!.cp) / 1_000_000)), backgroundColor: CHART_PALETTE.rose, borderRadius: 4 },
    ],
  }
})

function paymentVariant(s: PaymentStatus | undefined) {
  if (s === 'paid') return 'success' as const
  if (s === 'partial') return 'warning' as const
  return 'destructive' as const
}

function onExport() {
  toast.success('Đang export Excel…', { description: `${filtered.value.length} dòng được xuất ra file .xlsx` })
}
</script>

<template>
  <div class="space-y-4">
    <!-- KPI -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      <Card class="relative overflow-hidden hover:shadow-md transition-all">
        <div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600" />
        <CardContent class="p-3 pl-4">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Doanh thu</span>
            <div class="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center">
              <DollarSign class="h-3.5 w-3.5" />
            </div>
          </div>
          <div class="text-lg sm:text-2xl font-black tabular-nums text-emerald-700 dark:text-emerald-300">
            {{ formatVnd(stats.doanhThu) }}
          </div>
          <div class="text-[10px] text-muted-foreground mt-0.5">{{ stats.count }} lệnh</div>
        </CardContent>
      </Card>

      <Card class="relative overflow-hidden hover:shadow-md transition-all">
        <div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-rose-400 to-rose-600" />
        <CardContent class="p-3 pl-4">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Chi phí</span>
            <div class="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 flex items-center justify-center">
              <TrendingDown class="h-3.5 w-3.5" />
            </div>
          </div>
          <div class="text-lg sm:text-2xl font-black tabular-nums text-rose-700 dark:text-rose-300">
            {{ formatVnd(stats.chiPhi) }}
          </div>
          <div class="text-[10px] text-muted-foreground mt-0.5">TX + chi phí khác</div>
        </CardContent>
      </Card>

      <Card class="relative overflow-hidden hover:shadow-md transition-all">
        <div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-400 to-sky-600" />
        <CardContent class="p-3 pl-4">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Lợi nhuận</span>
            <div class="h-7 w-7 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300 flex items-center justify-center">
              <TrendingUp class="h-3.5 w-3.5" />
            </div>
          </div>
          <div class="text-lg sm:text-2xl font-black tabular-nums text-sky-700 dark:text-sky-300">
            {{ formatVnd(stats.loiNhuan) }}
          </div>
          <div class="text-[10px] text-muted-foreground mt-0.5">Margin {{ stats.margin.toFixed(1) }}%</div>
        </CardContent>
      </Card>

      <Card class="relative overflow-hidden hover:shadow-md transition-all">
        <div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" />
        <CardContent class="p-3 pl-4">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Công nợ</span>
            <div class="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300 flex items-center justify-center">
              <Wallet class="h-3.5 w-3.5" />
            </div>
          </div>
          <div class="text-lg sm:text-2xl font-black tabular-nums text-amber-700 dark:text-amber-300">
            {{ formatVnd(stats.congNo) }}
          </div>
          <div class="text-[10px] text-muted-foreground mt-0.5">Chưa thu / một phần</div>
        </CardContent>
      </Card>
    </div>

    <!-- Chart -->
    <Card>
      <CardHeader class="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle class="text-base">Doanh thu / Chi phí theo khách hàng</CardTitle>
          <CardDescription>Đơn vị: triệu VND</CardDescription>
        </div>
        <div class="hidden sm:flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileSpreadsheet class="h-4 w-4" /> Báo cáo
          </Button>
          <Button size="sm" @click="onExport">
            <Download class="h-4 w-4" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <BarChart v-if="chartData.labels.length" :data="chartData" :height="240" />
        <div v-else class="py-12 text-center text-sm text-muted-foreground">Chưa có dữ liệu tài chính.</div>
      </CardContent>
    </Card>

    <!-- Filter bar -->
    <div class="rounded-lg border bg-card p-3 space-y-2">
      <div class="flex items-center gap-2 flex-wrap">
        <div class="relative flex-1 min-w-[180px] max-w-md">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Tìm KH, tuyến, BL, HĐ…"
            class="pl-9 h-9"
            :model-value="filters.search"
            @update:model-value="(v) => patch({ search: String(v) })"
          />
        </div>

        <div class="hidden sm:flex items-center gap-1.5">
          <DatePicker :model-value="filters.dateFrom" placeholder="Từ ngày" clearable class="h-9 w-[150px]" @update:model-value="(v) => patch({ dateFrom: v })" />
          <span class="text-muted-foreground text-sm">—</span>
          <DatePicker :model-value="filters.dateTo" placeholder="Đến ngày" clearable class="h-9 w-[150px]" @update:model-value="(v) => patch({ dateTo: v })" />
        </div>

        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline" size="sm" class="h-9 gap-2">
              <SlidersHorizontal class="h-3.5 w-3.5" />
              <span class="hidden sm:inline">Bộ lọc</span>
              <Badge v-if="filters.khachHang || filters.thanhToan" variant="info" class="ml-1 h-5 px-1.5">
                {{ (filters.khachHang ? 1 : 0) + (filters.thanhToan ? 1 : 0) }}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" class="w-72 space-y-3">
            <div class="space-y-1.5 sm:hidden">
              <Label class="text-xs">Từ ngày</Label>
              <DatePicker :model-value="filters.dateFrom" placeholder="Từ ngày" clearable @update:model-value="(v) => patch({ dateFrom: v })" />
            </div>
            <div class="space-y-1.5 sm:hidden">
              <Label class="text-xs">Đến ngày</Label>
              <DatePicker :model-value="filters.dateTo" placeholder="Đến ngày" clearable @update:model-value="(v) => patch({ dateTo: v })" />
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs">Khách hàng</Label>
              <Select :model-value="filters.khachHang || ALL" @update:model-value="(v) => patch({ khachHang: v === ALL ? '' : (v as string) })">
                <SelectTrigger><SelectValue placeholder="Tất cả" /></SelectTrigger>
                <SelectContent>
                  <SelectItem :value="ALL">Tất cả</SelectItem>
                  <SelectItem v-for="kh in KHACH_HANG_LIST" :key="kh" :value="kh">{{ kh }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs">Thanh toán</Label>
              <Select :model-value="filters.thanhToan || ALL" @update:model-value="(v) => patch({ thanhToan: v === ALL ? '' : (v as string) })">
                <SelectTrigger><SelectValue placeholder="Tất cả" /></SelectTrigger>
                <SelectContent>
                  <SelectItem :value="ALL">Tất cả</SelectItem>
                  <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                  <SelectItem value="partial">Một phần</SelectItem>
                  <SelectItem value="paid">Đã thanh toán</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        <Button v-if="chips.length > 0" variant="ghost" size="sm" class="h-9 px-2" @click="reset">
          <X class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">Xóa lọc</span>
        </Button>

        <Button size="sm" class="sm:hidden h-9" @click="onExport">
          <Download class="h-4 w-4" />
        </Button>
      </div>

      <div v-if="chips.length > 0" class="flex items-center gap-1.5 flex-wrap pt-1">
        <button
          v-for="c in chips" :key="c.key"
          type="button"
          class="inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs hover:bg-secondary/70 transition-colors"
          @click="removeChip(c.key)"
        >
          <span>{{ c.label }}</span>
          <X class="h-3 w-3 opacity-60" />
        </button>
      </div>
    </div>

    <!-- Desktop table -->
    <div class="rounded-lg border bg-card overflow-hidden hidden md:block">
      <div class="overflow-x-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="bg-muted/60">
            <tr class="border-b">
              <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Ngày</th>
              <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Khách hàng</th>
              <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Tuyến</th>
              <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Tài xế</th>
              <th class="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Doanh thu</th>
              <th class="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Chi phí TX</th>
              <th class="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Chi phí khác</th>
              <th class="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Lợi nhuận</th>
              <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Thanh toán</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paged.length === 0">
              <td colspan="9" class="p-12 text-center text-sm text-muted-foreground">Không có lệnh tài chính phù hợp.</td>
            </tr>
            <tr v-for="(r, idx) in paged" :key="r.id" :class="['border-b transition-colors hover:bg-muted/40', idx % 2 === 1 && 'bg-muted/20']">
              <td class="px-3 py-2 whitespace-nowrap">{{ formatDate(r.ngayDongHang) }}</td>
              <td class="px-3 py-2 whitespace-nowrap font-medium">{{ r.khachHang }}</td>
              <td class="px-3 py-2 whitespace-nowrap">{{ r.tuyenVanChuyen }}</td>
              <td class="px-3 py-2 whitespace-nowrap">{{ r.taiXe || '—' }}</td>
              <td class="px-3 py-2 text-right tabular-nums font-medium text-emerald-700 dark:text-emerald-300">{{ formatVnd(r.doanhThu ?? 0) }}</td>
              <td class="px-3 py-2 text-right tabular-nums">{{ formatVnd(r.chiPhiTaiXe ?? 0) }}</td>
              <td class="px-3 py-2 text-right tabular-nums">{{ formatVnd(r.chiPhiKhac ?? 0) }}</td>
              <td class="px-3 py-2 text-right tabular-nums font-semibold" :class="profit(r) >= 0 ? 'text-sky-700 dark:text-sky-300' : 'text-rose-600'">
                {{ formatVnd(profit(r)) }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap">
                <Badge :variant="paymentVariant(r.thanhToan)" class="text-[10px]">
                  {{ r.thanhToan ? PAYMENT_LABEL[r.thanhToan] : '—' }}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        :page="page" :page-size="pageSize" :total="filtered.length"
        @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)"
      />
    </div>

    <!-- Mobile card list -->
    <div class="md:hidden space-y-2">
      <Card v-if="paged.length === 0">
        <CardContent class="p-8 text-center text-sm text-muted-foreground">
          <AlertCircle class="h-8 w-8 mx-auto mb-2 opacity-30" />
          Không có lệnh tài chính phù hợp.
        </CardContent>
      </Card>
      <Card v-for="r in paged" :key="r.id">
        <CardContent class="p-3 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="font-semibold truncate">{{ r.khachHang }}</div>
              <div class="text-xs text-muted-foreground truncate">{{ r.tuyenVanChuyen }}</div>
              <div class="text-[11px] text-muted-foreground mt-0.5">{{ formatDate(r.ngayDongHang) }} · TX {{ r.taiXe || '—' }}</div>
            </div>
            <Badge :variant="paymentVariant(r.thanhToan)" class="text-[10px] whitespace-nowrap">
              {{ r.thanhToan ? PAYMENT_LABEL[r.thanhToan] : '—' }}
            </Badge>
          </div>
          <div class="grid grid-cols-2 gap-2 pt-1 border-t">
            <div>
              <div class="text-[10px] text-muted-foreground uppercase">Doanh thu</div>
              <div class="font-bold text-sm text-emerald-700 dark:text-emerald-300 tabular-nums">{{ formatVnd(r.doanhThu ?? 0) }}</div>
            </div>
            <div>
              <div class="text-[10px] text-muted-foreground uppercase">Chi phí</div>
              <div class="font-bold text-sm text-rose-700 dark:text-rose-300 tabular-nums">{{ formatVnd(totalCost(r)) }}</div>
            </div>
            <div class="col-span-2">
              <div class="text-[10px] text-muted-foreground uppercase">Lợi nhuận</div>
              <div class="font-bold tabular-nums" :class="profit(r) >= 0 ? 'text-sky-700 dark:text-sky-300' : 'text-rose-600'">
                {{ formatVnd(profit(r)) }}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div class="rounded-lg border bg-card">
        <Pagination
          :page="page" :page-size="pageSize" :total="filtered.length"
          @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)"
        />
      </div>
    </div>
  </div>
</template>
