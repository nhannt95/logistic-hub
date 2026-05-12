<script setup lang="ts">
import { ArrowUp, ArrowDown, ChevronsUpDown, Pencil, Images, Receipt } from 'lucide-vue-next'
import { formatDate, cn, formatVnd } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { DieuDoRow } from '@/data/mockDieuDo'

export type SortKey = 'ngayDongHang' | 'khachHang' | 'hangTau' | 'cont20' | 'cont40' | 'etdEta'
export type SortDir = 'asc' | 'desc'

defineProps<{
  rows: DieuDoRow[]
  sortKey: SortKey | null
  sortDir: SortDir
}>()

const emit = defineEmits<{
  (e: 'toggleSort', key: SortKey): void
  (e: 'edit', row: DieuDoRow): void
  (e: 'evaluate', row: DieuDoRow): void
}>()

function formatDateTime(s: string | null | undefined): string {
  if (!s) return ''
  const d = new Date(s)
  if (isNaN(d.getTime())) return s
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
}

function tinhTrangVariant(t: string) {
  if (t === 'XUẤT') return 'info' as const
  if (t === 'NHẬP') return 'success' as const
  return 'warning' as const
}

function ariaSort(active: boolean, dir: SortDir): 'ascending' | 'descending' | 'none' {
  if (!active) return 'none'
  return dir === 'asc' ? 'ascending' : 'descending'
}

function evalCounts(r: DieuDoRow): { photos: number; invoices: number; total: number } {
  const evals = r.evaluations ?? []
  const photos = evals.filter((e) => e.kind === 'photo').length
  const invoices = evals.filter((e) => e.kind === 'invoice').length
  return { photos, invoices, total: evals.length }
}
</script>

<template>
  <div class="overflow-auto h-[calc(100vh-26rem)] min-h-[420px]">
    <table class="w-full caption-bottom text-xs border-separate border-spacing-0">
      <thead class="sticky top-0 z-20 bg-muted">
        <tr>
          <!-- Sticky left -->
          <th
            rowspan="2"
            :aria-sort="ariaSort(sortKey === 'ngayDongHang', sortDir)"
            class="sticky left-0 z-30 bg-muted border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap select-none cursor-pointer hover:bg-muted/80 transition-colors"
            @click="emit('toggleSort', 'ngayDongHang')"
          >
            <span class="inline-flex items-center gap-1">
              Ngày đóng hàng
              <ArrowUp v-if="sortKey === 'ngayDongHang' && sortDir === 'asc'" class="h-3 w-3" />
              <ArrowDown v-else-if="sortKey === 'ngayDongHang' && sortDir === 'desc'" class="h-3 w-3" />
              <ChevronsUpDown v-else class="h-3 w-3 opacity-40" />
            </span>
          </th>
          <th
            rowspan="2"
            :aria-sort="ariaSort(sortKey === 'khachHang', sortDir)"
            class="sticky left-[112px] z-30 bg-muted border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap select-none cursor-pointer hover:bg-muted/80 transition-colors"
            @click="emit('toggleSort', 'khachHang')"
          >
            <span class="inline-flex items-center gap-1">
              Khách hàng
              <ArrowUp v-if="sortKey === 'khachHang' && sortDir === 'asc'" class="h-3 w-3" />
              <ArrowDown v-else-if="sortKey === 'khachHang' && sortDir === 'desc'" class="h-3 w-3" />
              <ChevronsUpDown v-else class="h-3 w-3 opacity-40" />
            </span>
          </th>
          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap">Tuyến vận chuyển</th>
          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap">Hợp đồng</th>
          <th
            rowspan="2"
            :aria-sort="ariaSort(sortKey === 'hangTau', sortDir)"
            class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap select-none cursor-pointer hover:bg-muted/80 transition-colors"
            @click="emit('toggleSort', 'hangTau')"
          >
            <span class="inline-flex items-center gap-1">
              Hãng tàu
              <ArrowUp v-if="sortKey === 'hangTau' && sortDir === 'asc'" class="h-3 w-3" />
              <ArrowDown v-else-if="sortKey === 'hangTau' && sortDir === 'desc'" class="h-3 w-3" />
              <ChevronsUpDown v-else class="h-3 w-3 opacity-40" />
            </span>
          </th>
          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap">Booking / BL</th>
          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap">Tình trạng</th>
          <th colspan="3" class="border-b border-r px-2 py-2 text-center font-semibold">Số lượng Cont</th>
          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap">Packing</th>
          <th
            rowspan="2"
            :aria-sort="ariaSort(sortKey === 'etdEta', sortDir)"
            class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap select-none cursor-pointer hover:bg-muted/80 transition-colors"
            @click="emit('toggleSort', 'etdEta')"
          >
            <span class="inline-flex items-center gap-1">
              ETD / ETA
              <ArrowUp v-if="sortKey === 'etdEta' && sortDir === 'asc'" class="h-3 w-3" />
              <ArrowDown v-else-if="sortKey === 'etdEta' && sortDir === 'desc'" class="h-3 w-3" />
              <ChevronsUpDown v-else class="h-3 w-3 opacity-40" />
            </span>
          </th>
          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap">Cut off</th>

          <!-- NEW: Vận hành group -->
          <th colspan="5" class="border-b border-r px-2 py-2 text-center font-semibold bg-indigo-100 dark:bg-indigo-950/40">Vận hành & phân công</th>

          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap">Lấy cont rỗng</th>
          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap">Hạ Full</th>
          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap">Cuốc</th>
          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap">Đổi lệnh</th>
          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap">Lấy/Hạ cont</th>
          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap bg-amber-100 dark:bg-amber-950/40">Ghi chú</th>
          <th rowspan="2" class="border-b border-r px-2 py-2 text-left font-semibold whitespace-nowrap">Neo cs/zii</th>

          <th colspan="7" class="border-b border-r px-2 py-2 text-center font-semibold bg-rose-100 dark:bg-rose-950/40">Cược cont hàng nhập</th>
          <th colspan="4" class="border-b border-r px-2 py-2 text-center font-semibold bg-sky-100 dark:bg-sky-950/40">Khai Eport</th>
          <th colspan="4" class="border-b border-r px-2 py-2 text-center font-semibold bg-emerald-100 dark:bg-emerald-950/40">Theo dõi công nợ &amp; thanh toán</th>
          <th colspan="4" class="border-b border-r px-2 py-2 text-center font-semibold bg-violet-100 dark:bg-violet-950/40">Trọng lượng (NW/GW)</th>

          <!-- NEW: Đánh giá -->
          <th rowspan="2" class="border-b border-r px-2 py-2 text-center font-semibold whitespace-nowrap bg-fuchsia-100 dark:bg-fuchsia-950/40">
            Đánh giá
          </th>
          <!-- Sticky right Actions -->
          <th rowspan="2" class="sticky right-0 z-30 bg-muted border-b border-l px-2 py-2 text-center font-semibold whitespace-nowrap">

          </th>
        </tr>
        <tr class="text-[11px] text-muted-foreground">
          <th
            :aria-sort="ariaSort(sortKey === 'cont20', sortDir)"
            class="border-b border-r px-2 py-1.5 text-right font-medium whitespace-nowrap select-none cursor-pointer hover:bg-muted/80 transition-colors"
            @click="emit('toggleSort', 'cont20')"
          >
            <span class="inline-flex items-center gap-1 justify-end">
              20'
              <ArrowUp v-if="sortKey === 'cont20' && sortDir === 'asc'" class="h-3 w-3" />
              <ArrowDown v-else-if="sortKey === 'cont20' && sortDir === 'desc'" class="h-3 w-3" />
            </span>
          </th>
          <th
            :aria-sort="ariaSort(sortKey === 'cont40', sortDir)"
            class="border-b border-r px-2 py-1.5 text-right font-medium whitespace-nowrap select-none cursor-pointer hover:bg-muted/80 transition-colors"
            @click="emit('toggleSort', 'cont40')"
          >
            <span class="inline-flex items-center gap-1 justify-end">
              40'
              <ArrowUp v-if="sortKey === 'cont40' && sortDir === 'asc'" class="h-3 w-3" />
              <ArrowDown v-else-if="sortKey === 'cont40' && sortDir === 'desc'" class="h-3 w-3" />
            </span>
          </th>
          <th class="border-b border-r px-2 py-1.5 text-right font-medium whitespace-nowrap">Tấn</th>

          <!-- Vận hành sub-headers -->
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-indigo-50 dark:bg-indigo-950/30">Tài xế</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-indigo-50 dark:bg-indigo-950/30">Đầu kéo</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-indigo-50 dark:bg-indigo-950/30">Mooc</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-indigo-50 dark:bg-indigo-950/30">Hoàn thành dự kiến</th>
          <th class="border-b border-r px-2 py-1.5 text-right font-medium whitespace-nowrap bg-indigo-50 dark:bg-indigo-950/30">Chi phí TX</th>

          <th class="border-b border-r px-2 py-1.5 text-right font-medium whitespace-nowrap bg-rose-50 dark:bg-rose-950/30">Số tiền</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-rose-50 dark:bg-rose-950/30">Ngày cược</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-rose-50 dark:bg-rose-950/30">Ngày thu</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-rose-50 dark:bg-rose-950/30">Số định danh</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-rose-50 dark:bg-rose-950/30">Mã</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-rose-50 dark:bg-rose-950/30">Người tạo</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-rose-50 dark:bg-rose-950/30">Ngày in HĐ</th>

          <th class="border-b border-r px-2 py-1.5 text-right font-medium whitespace-nowrap bg-sky-50 dark:bg-sky-950/30">Số tiền</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-sky-50 dark:bg-sky-950/30">Ngày in HĐ</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-sky-50 dark:bg-sky-950/30">Số HĐ</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-sky-50 dark:bg-sky-950/30">Ngày đóng</th>

          <th class="border-b border-r px-2 py-1.5 text-right font-medium whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/30">VC</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/30">TT VC</th>
          <th class="border-b border-r px-2 py-1.5 text-right font-medium whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/30">Chi hộ</th>
          <th class="border-b border-r px-2 py-1.5 text-left font-medium whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/30">TT chi hộ</th>

          <th class="border-b border-r px-2 py-1.5 text-right font-medium whitespace-nowrap bg-violet-50 dark:bg-violet-950/30">NW</th>
          <th class="border-b border-r px-2 py-1.5 text-right font-medium whitespace-nowrap bg-violet-50 dark:bg-violet-950/30">GW</th>
          <th class="border-b border-r px-2 py-1.5 text-right font-medium whitespace-nowrap bg-violet-50 dark:bg-violet-950/30">NW</th>
          <th class="border-b border-r px-2 py-1.5 text-right font-medium whitespace-nowrap bg-violet-50 dark:bg-violet-950/30">GW</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0">
          <td :colspan="40" class="p-12 text-center text-sm text-muted-foreground">
            Không có lệnh nào phù hợp với bộ lọc hiện tại.
          </td>
        </tr>
        <tr v-for="(r, idx) in rows" :key="r.id" :class="cn('hover:bg-muted/40 transition-colors group', idx % 2 === 1 && 'bg-muted/20')">
          <td class="sticky left-0 z-10 bg-card group-hover:bg-muted/40 border-b border-r px-2 py-1.5 whitespace-nowrap">{{ formatDate(r.ngayDongHang) }}</td>
          <td class="sticky left-[112px] z-10 bg-card group-hover:bg-muted/40 border-b border-r px-2 py-1.5 whitespace-nowrap font-medium">{{ r.khachHang }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">{{ r.tuyenVanChuyen }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap font-mono text-[11px]">{{ r.hopDong }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">{{ r.hangTau }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap font-mono text-[11px]">{{ r.bookingBL }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">
            <Badge :variant="tinhTrangVariant(r.tinhTrang)" class="text-[10px]">{{ r.tinhTrang }}</Badge>
          </td>
          <td class="border-b border-r px-2 py-1.5 text-right tabular-nums">{{ r.cont20 || '' }}</td>
          <td class="border-b border-r px-2 py-1.5 text-right tabular-nums">{{ r.cont40 || '' }}</td>
          <td class="border-b border-r px-2 py-1.5 text-right tabular-nums">{{ r.tan ?? '' }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">{{ r.packing }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">{{ formatDate(r.etdEta) }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">{{ r.cutOff }}</td>

          <!-- Vận hành cells -->
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">
            <span v-if="r.taiXe" class="font-medium">{{ r.taiXe }}</span>
            <span v-else class="text-muted-foreground italic">Chưa phân công</span>
          </td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap font-mono text-[11px]">{{ r.dauKeo || '' }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap font-mono text-[11px]">{{ r.mooc || '' }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">{{ formatDateTime(r.estimateCompletion) }}</td>
          <td class="border-b border-r px-2 py-1.5 text-right tabular-nums">{{ r.chiPhiTaiXe ? formatVnd(r.chiPhiTaiXe) : '' }}</td>

          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">{{ r.layContRong }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">{{ r.haFull }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">{{ r.cuoc }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">{{ r.doiLenh }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">{{ r.layHaCont }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap bg-amber-50/40 dark:bg-amber-950/20">{{ r.ghiChu }}</td>
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">{{ r.neo }}</td>

          <td class="border-b border-r px-2 py-1.5 text-right">{{ r.cuocSoTien ?? '' }}</td>
          <td class="border-b border-r px-2 py-1.5">{{ formatDate(r.cuocNgayCuoc) }}</td>
          <td class="border-b border-r px-2 py-1.5">{{ formatDate(r.cuocNgayThu) }}</td>
          <td class="border-b border-r px-2 py-1.5">{{ r.cuocSoDinhDanh }}</td>
          <td class="border-b border-r px-2 py-1.5">{{ r.cuocMa }}</td>
          <td class="border-b border-r px-2 py-1.5">{{ r.cuocNguoiTao }}</td>
          <td class="border-b border-r px-2 py-1.5">{{ formatDate(r.cuocNgayInHd) }}</td>

          <td class="border-b border-r px-2 py-1.5 text-right">{{ r.eportSoTien ?? '' }}</td>
          <td class="border-b border-r px-2 py-1.5">{{ formatDate(r.eportNgayInHd) }}</td>
          <td class="border-b border-r px-2 py-1.5">{{ r.eportSoHd }}</td>
          <td class="border-b border-r px-2 py-1.5">{{ formatDate(r.eportNgayDong) }}</td>

          <td class="border-b border-r px-2 py-1.5 text-right">{{ r.congNoVc ?? '' }}</td>
          <td class="border-b border-r px-2 py-1.5">{{ r.congNoTtVc }}</td>
          <td class="border-b border-r px-2 py-1.5 text-right">{{ r.congNoChiHo ?? '' }}</td>
          <td class="border-b border-r px-2 py-1.5">{{ r.congNoTtChiHo }}</td>

          <td class="border-b border-r px-2 py-1.5 text-right">{{ r.trongLuongNw ?? '' }}</td>
          <td class="border-b border-r px-2 py-1.5 text-right">{{ r.trongLuongGw ?? '' }}</td>
          <td class="border-b border-r px-2 py-1.5 text-right">{{ r.trongLuongNw2 ?? '' }}</td>
          <td class="border-b border-r px-2 py-1.5 text-right">{{ r.trongLuongGw2 ?? '' }}</td>

          <!-- Đánh giá cell -->
          <td class="border-b border-r px-2 py-1.5 whitespace-nowrap">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-md hover:bg-fuchsia-100 dark:hover:bg-fuchsia-950/40 px-2 py-1 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              :disabled="evalCounts(r).total === 0"
              @click="emit('evaluate', r)"
            >
              <template v-if="evalCounts(r).total > 0">
                <Images class="h-3.5 w-3.5 text-fuchsia-600 dark:text-fuchsia-400" />
                <span class="text-[11px] font-medium">{{ evalCounts(r).photos }}</span>
                <Receipt class="h-3.5 w-3.5 text-fuchsia-600 dark:text-fuchsia-400 ml-1" />
                <span class="text-[11px] font-medium">{{ evalCounts(r).invoices }}</span>
              </template>
              <span v-else class="text-[11px] text-muted-foreground italic">Chưa có</span>
            </button>
          </td>

          <!-- Sticky right Actions -->
          <td class="sticky right-0 z-10 bg-card group-hover:bg-muted/40 border-b border-l px-2 py-1.5 text-center">
            <Button variant="ghost" size="icon" class="h-7 w-7" title="Sửa kế hoạch" @click="emit('edit', r)">
              <Pencil class="h-3.5 w-3.5" />
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
