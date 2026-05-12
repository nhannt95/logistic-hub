<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Download, FileSpreadsheet, ClipboardList, ArrowUpRight, ArrowDownLeft, Repeat2, Boxes, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Pagination } from '@/components/ui/pagination'
import DieuDoFilters, { type DieuDoFilterState } from '@/components/dieu-do/DieuDoFilters.vue'
import DieuDoTable, { type SortKey, type SortDir } from '@/components/dieu-do/DieuDoTable.vue'
import PlanFormDialog from '@/components/dieu-do/PlanFormDialog.vue'
import EvaluationDialog from '@/components/dieu-do/EvaluationDialog.vue'
import { mockDieuDoRows, type DieuDoRow } from '@/data/mockDieuDo'

const filters = ref<DieuDoFilterState>({
  dateFrom: '',
  dateTo: '',
  khachHang: '',
  hangTau: '',
  tinhTrang: '',
  search: '',
})

const sortKey = ref<SortKey | null>('ngayDongHang')
const sortDir = ref<SortDir>('desc')
const page = ref(1)
const pageSize = ref(25)

function matchesSearch(haystack: string[], needle: string) {
  const q = needle.trim().toLowerCase()
  if (!q) return true
  return haystack.some((h) => h.toLowerCase().includes(q))
}

const filteredRows = computed(() => {
  const f = filters.value
  return mockDieuDoRows.filter((r) => {
    if (f.dateFrom && r.ngayDongHang < f.dateFrom) return false
    if (f.dateTo && r.ngayDongHang > f.dateTo) return false
    if (f.khachHang && r.khachHang !== f.khachHang) return false
    if (f.hangTau && r.hangTau !== f.hangTau) return false
    if (f.tinhTrang && r.tinhTrang !== f.tinhTrang) return false
    if (!matchesSearch([r.bookingBL, r.hopDong, r.tuyenVanChuyen, r.ghiChu, r.khachHang], f.search)) return false
    return true
  })
})

function compare(a: DieuDoRow, b: DieuDoRow, key: SortKey): number {
  const va = a[key]
  const vb = b[key]
  if (typeof va === 'number' && typeof vb === 'number') return va - vb
  return String(va ?? '').localeCompare(String(vb ?? ''), 'vi')
}

const sortedRows = computed(() => {
  if (!sortKey.value) return filteredRows.value
  const k = sortKey.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...filteredRows.value].sort((a, b) => compare(a, b, k) * dir)
})

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedRows.value.slice(start, start + pageSize.value)
})

function toggleSort(key: SortKey) {
  if (sortKey.value !== key) {
    sortKey.value = key
    sortDir.value = 'asc'
  } else if (sortDir.value === 'asc') {
    sortDir.value = 'desc'
  } else {
    sortKey.value = null
    sortDir.value = 'asc'
  }
}

// Reset to page 1 when filters or sort change
watch([filters, sortKey, sortDir, pageSize], () => {
  page.value = 1
}, { deep: true })

// Plan form (create + edit) state
const planFormOpen = ref(false)
const planFormMode = ref<'create' | 'edit'>('create')
const editingRow = ref<DieuDoRow | null>(null)

function openCreate() {
  planFormMode.value = 'create'
  editingRow.value = null
  planFormOpen.value = true
}
function openEdit(row: DieuDoRow) {
  planFormMode.value = 'edit'
  editingRow.value = row
  planFormOpen.value = true
}

// Evaluation dialog state
const evalOpen = ref(false)
const evalRow = ref<DieuDoRow | null>(null)

function openEvaluation(row: DieuDoRow) {
  evalRow.value = row
  evalOpen.value = true
}

const stats = computed(() => {
  const rows = filteredRows.value
  return {
    total: rows.length,
    xuat: rows.filter((r) => r.tinhTrang === 'XUẤT').length,
    nhap: rows.filter((r) => r.tinhTrang === 'NHẬP').length,
    chuyenTai: rows.filter((r) => r.tinhTrang === 'Chuyển tải').length,
    cont20: rows.reduce((s, r) => s + r.cont20, 0),
    cont40: rows.reduce((s, r) => s + r.cont40, 0),
  }
})
</script>

<template>
  <div class="space-y-4">
    <!-- Header actions -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <p class="text-sm text-muted-foreground">
        Danh sách kế hoạch điều độ — quản lý theo ngày, khách hàng và hãng tàu
      </p>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <FileSpreadsheet class="h-4 w-4" /> Import
        </Button>
        <Button variant="outline" size="sm">
          <Download class="h-4 w-4" /> Export
        </Button>
        <Button size="sm" @click="openCreate">
          <Plus class="h-4 w-4" /> Thêm lệnh
        </Button>
      </div>
    </div>

    <!-- KPI strip — modern cards with icon + gradient accent -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Card class="relative overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 group">
        <div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-slate-500 to-slate-700" />
        <CardContent class="p-4 pl-5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Tổng lệnh</span>
            <div class="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ClipboardList class="h-4 w-4" />
            </div>
          </div>
          <div class="text-3xl font-black tracking-tight tabular-nums">{{ stats.total }}</div>
          <div class="text-[11px] text-muted-foreground mt-1">Sau lọc</div>
        </CardContent>
      </Card>

      <Card class="relative overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 group">
        <div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-400 to-sky-600" />
        <CardContent class="p-4 pl-5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Lệnh xuất</span>
            <div class="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight class="h-4 w-4" />
            </div>
          </div>
          <div class="text-3xl font-black tracking-tight tabular-nums text-sky-700 dark:text-sky-300">{{ stats.xuat }}</div>
          <div class="text-[11px] text-muted-foreground mt-1">
            {{ stats.total ? Math.round((stats.xuat / stats.total) * 100) : 0 }}% tổng lệnh
          </div>
        </CardContent>
      </Card>

      <Card class="relative overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 group">
        <div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600" />
        <CardContent class="p-4 pl-5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Lệnh nhập</span>
            <div class="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowDownLeft class="h-4 w-4" />
            </div>
          </div>
          <div class="text-3xl font-black tracking-tight tabular-nums text-emerald-700 dark:text-emerald-300">{{ stats.nhap }}</div>
          <div class="text-[11px] text-muted-foreground mt-1">
            {{ stats.total ? Math.round((stats.nhap / stats.total) * 100) : 0 }}% tổng lệnh
          </div>
        </CardContent>
      </Card>

      <Card class="relative overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 group">
        <div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" />
        <CardContent class="p-4 pl-5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Chuyển tải</span>
            <div class="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Repeat2 class="h-4 w-4" />
            </div>
          </div>
          <div class="text-3xl font-black tracking-tight tabular-nums text-amber-700 dark:text-amber-300">{{ stats.chuyenTai }}</div>
          <div class="text-[11px] text-muted-foreground mt-1">
            {{ stats.total ? Math.round((stats.chuyenTai / stats.total) * 100) : 0 }}% tổng lệnh
          </div>
        </CardContent>
      </Card>

      <Card class="relative overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 group">
        <div class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-violet-400 to-violet-600" />
        <CardContent class="p-4 pl-5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Tổng Cont</span>
            <div class="h-8 w-8 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Boxes class="h-4 w-4" />
            </div>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-3xl font-black tracking-tight tabular-nums text-violet-700 dark:text-violet-300">{{ stats.cont20 }}</span>
            <span class="text-xs text-muted-foreground">20'</span>
            <span class="text-muted-foreground mx-1">·</span>
            <span class="text-3xl font-black tracking-tight tabular-nums text-violet-700 dark:text-violet-300">{{ stats.cont40 }}</span>
            <span class="text-xs text-muted-foreground">40'</span>
          </div>
          <div class="text-[11px] text-muted-foreground mt-1">≈ {{ stats.cont20 + stats.cont40 * 2 }} TEU</div>
        </CardContent>
      </Card>
    </div>

    <!-- Compact filter bar -->
    <DieuDoFilters v-model="filters" :total-count="mockDieuDoRows.length" :filtered-count="filteredRows.length" />

    <!-- Grid + pagination -->
    <div class="rounded-lg border bg-card overflow-hidden">
      <DieuDoTable
        :rows="pagedRows"
        :sort-key="sortKey"
        :sort-dir="sortDir"
        @toggle-sort="toggleSort"
        @edit="openEdit"
        @evaluate="openEvaluation"
      />
      <Pagination
        :page="page"
        :page-size="pageSize"
        :total="sortedRows.length"
        @update:page="(v) => (page = v)"
        @update:page-size="(v) => (pageSize = v)"
      />
    </div>

    <PlanFormDialog v-model:open="planFormOpen" :mode="planFormMode" :row="editingRow" />
    <EvaluationDialog v-model:open="evalOpen" :row="evalRow" />
  </div>
</template>
