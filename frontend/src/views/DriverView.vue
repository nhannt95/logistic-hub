<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Truck, MapPin, Package, FileText, Calendar as CalendarIcon, Clock,
  Phone, AlertCircle, CheckCircle2, Camera, Upload, Navigation, User, Receipt,
} from 'lucide-vue-next'
import { toast } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import TransportSlipDialog from '@/components/driver/TransportSlipDialog.vue'
import {
  mockDieuDoRows,
  DRIVER_LIST,
  DRIVER_STATUS_LABEL,
  type DieuDoRow,
  type DriverStatus,
} from '@/data/mockDieuDo'
import { formatDate } from '@/lib/utils'

// Mock "current driver" — in real app would be from auth
const currentDriver = ref<string>(DRIVER_LIST[0])

const myJobs = computed<DieuDoRow[]>(() =>
  mockDieuDoRows.filter((r) => r.taiXe === currentDriver.value)
)

function isToday(iso: string) {
  if (!iso) return false
  const today = new Date('2026-05-07').toISOString().slice(0, 10) // demo date
  return iso === today
}

const stats = computed(() => {
  const all = myJobs.value
  return {
    total: all.length,
    today: all.filter((r) => isToday(r.ngayDongHang)).length,
    active: all.filter((r) => r.driverStatus && !['done', 'delivered'].includes(r.driverStatus)).length,
    done: all.filter((r) => r.driverStatus === 'done').length,
  }
})

function formatDateTime(s: string | null | undefined): string {
  if (!s) return '—'
  const d = new Date(s)
  if (isNaN(d.getTime())) return s
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
}

const tabFilter = ref<'all' | 'active' | 'done'>('all')

const visibleJobs = computed<DieuDoRow[]>(() => {
  if (tabFilter.value === 'all') return myJobs.value
  if (tabFilter.value === 'done') return myJobs.value.filter((r) => r.driverStatus === 'done')
  return myJobs.value.filter((r) => r.driverStatus && !['done'].includes(r.driverStatus))
})

function statusBadgeTone(s: DriverStatus | undefined): 'secondary' | 'info' | 'warning' | 'success' {
  if (!s) return 'secondary'
  if (s === 'done') return 'success'
  if (s === 'delivered') return 'success'
  if (s === 'delivering' || s === 'picked') return 'info'
  if (s === 'picking') return 'warning'
  if (s === 'confirmed') return 'info'
  return 'secondary'
}

function routeParts(tuyen: string): { from: string; to: string } {
  const sep = tuyen.includes(' - ') ? ' - ' : tuyen.includes('-') ? '-' : '→'
  const [from = '', to = ''] = tuyen.split(sep)
  return { from: from.trim(), to: to.trim() }
}

function formatVnd(n: number | null | undefined) {
  return n ? n.toLocaleString('vi-VN') + ' đ' : '—'
}

// Actions (mock)
function actionConfirm(r: DieuDoRow) {
  toast.success('Đã xác nhận nhận lệnh', { description: `${r.khachHang} · ${r.tuyenVanChuyen}` })
}
function actionStart(r: DieuDoRow) {
  toast.info('Bắt đầu đi lấy hàng', { description: r.tuyenVanChuyen })
}
function actionPicked(r: DieuDoRow) {
  toast.success('Đã lấy cont, đang giao', { description: r.tuyenVanChuyen })
}
function actionComplete(r: DieuDoRow) {
  toast.success('Hoàn tất chuyến', { description: r.tuyenVanChuyen })
}
function actionUpload(r: DieuDoRow) {
  toast.info('Mở camera / chọn ảnh', { description: `Upload chứng từ cho ${r.bookingBL || r.khachHang}` })
}
function actionReport(r: DieuDoRow) {
  toast.warning('Đang báo cáo sự cố', { description: r.tuyenVanChuyen })
}

const nextActionMap: Partial<Record<DriverStatus, { label: string; fn: (r: DieuDoRow) => void }>> = {
  new: { label: 'Xác nhận', fn: actionConfirm },
  confirmed: { label: 'Bắt đầu đi lấy', fn: actionStart },
  picking: { label: 'Đã lấy cont', fn: actionPicked },
  picked: { label: 'Đang giao', fn: actionStart },
  delivering: { label: 'Đã hạ', fn: actionPicked },
  delivered: { label: 'Hoàn tất', fn: actionComplete },
}

// Transport slip dialog state
const slipOpen = ref(false)
const slipJob = ref<DieuDoRow | null>(null)
function openSlip(r: DieuDoRow) {
  slipJob.value = r
  slipOpen.value = true
}
</script>

<template>
  <div class="space-y-4 max-w-3xl mx-auto">
    <!-- Driver context selector (demo) -->
    <Card class="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-200 dark:border-amber-900">
      <CardContent class="p-3 flex items-center gap-3">
        <div class="h-10 w-10 rounded-full bg-amber-500/20 dark:bg-amber-500/30 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
          <User class="h-5 w-5" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-[10px] uppercase tracking-wide text-amber-700 dark:text-amber-300 font-semibold">Đang đăng nhập (demo)</div>
          <Select v-model="currentDriver">
            <SelectTrigger class="h-8 bg-white/80 dark:bg-background mt-0.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="d in DRIVER_LIST" :key="d" :value="d">{{ d }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- KPI -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      <Card>
        <CardContent class="p-3">
          <div class="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Tổng lệnh</div>
          <div class="text-xl sm:text-2xl font-bold mt-1">{{ stats.total }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-3">
          <div class="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Đang chạy</div>
          <div class="text-xl sm:text-2xl font-bold mt-1 text-sky-600 dark:text-sky-300">{{ stats.active }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-3">
          <div class="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Hoàn thành</div>
          <div class="text-xl sm:text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-300">{{ stats.done }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-3">
          <div class="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Hôm nay</div>
          <div class="text-xl sm:text-2xl font-bold mt-1 text-amber-600 dark:text-amber-300">{{ stats.today }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- Job filter tabs -->
    <Tabs v-model="tabFilter">
      <TabsList class="w-full">
        <TabsTrigger value="all" class="flex-1">Tất cả ({{ myJobs.length }})</TabsTrigger>
        <TabsTrigger value="active" class="flex-1">Đang chạy ({{ stats.active }})</TabsTrigger>
        <TabsTrigger value="done" class="flex-1">Hoàn thành ({{ stats.done }})</TabsTrigger>
      </TabsList>
      <TabsContent :value="tabFilter" class="space-y-3">
        <Card v-if="visibleJobs.length === 0">
          <CardContent class="p-8 text-center text-sm text-muted-foreground">
            <Truck class="h-8 w-8 mx-auto mb-2 opacity-30" />
            Không có lệnh nào.
          </CardContent>
        </Card>

        <Card v-for="job in visibleJobs" :key="job.id" class="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent class="p-0">
            <!-- Header: customer + status -->
            <div class="flex items-center justify-between gap-2 px-4 py-2.5 bg-muted/40 border-b">
              <div class="flex items-center gap-2 min-w-0">
                <Badge :variant="job.tinhTrang === 'XUẤT' ? 'info' : job.tinhTrang === 'NHẬP' ? 'success' : 'warning'" class="text-[10px]">{{ job.tinhTrang }}</Badge>
                <span class="font-semibold text-sm truncate">{{ job.khachHang }}</span>
                <span v-if="job.hopDong" class="text-[11px] text-muted-foreground font-mono truncate hidden sm:inline">· {{ job.hopDong }}</span>
              </div>
              <Badge :variant="statusBadgeTone(job.driverStatus)" class="text-[10px] whitespace-nowrap">
                {{ job.driverStatus ? DRIVER_STATUS_LABEL[job.driverStatus] : DRIVER_STATUS_LABEL.new }}
              </Badge>
            </div>

            <div class="p-4 space-y-3">
              <!-- Route (lấy → giao) -->
              <div class="flex items-start gap-3">
                <div class="flex flex-col items-center pt-1 shrink-0">
                  <div class="h-2.5 w-2.5 rounded-full bg-sky-500 ring-4 ring-sky-500/20" />
                  <div class="w-0.5 flex-1 my-1 border-l-2 border-dashed border-muted-foreground/30 min-h-[20px]" />
                  <div class="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                </div>
                <div class="flex-1 min-w-0 space-y-2">
                  <div>
                    <div class="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Điểm lấy</div>
                    <div class="font-semibold text-sm truncate">{{ routeParts(job.tuyenVanChuyen).from }}</div>
                  </div>
                  <div>
                    <div class="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Điểm giao</div>
                    <div class="font-semibold text-sm truncate">{{ routeParts(job.tuyenVanChuyen).to }}</div>
                  </div>
                </div>
              </div>

              <!-- Cargo + container -->
              <div class="rounded-md border bg-muted/30 p-3 space-y-2">
                <div class="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
                  <Package class="h-3.5 w-3.5" /> Hàng & Container
                </div>
                <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
                  <div>
                    <div class="text-[11px] text-muted-foreground">Hãng tàu</div>
                    <div class="font-medium">{{ job.hangTau || '—' }}</div>
                  </div>
                  <div>
                    <div class="text-[11px] text-muted-foreground">Packing</div>
                    <div class="font-medium">{{ job.packing || '—' }}</div>
                  </div>
                  <div v-if="job.bookingBL">
                    <div class="text-[11px] text-muted-foreground">Booking / BL</div>
                    <div class="font-medium font-mono text-[12px]">{{ job.bookingBL }}</div>
                  </div>
                  <div>
                    <div class="text-[11px] text-muted-foreground">Số lượng</div>
                    <div class="font-medium">
                      <span v-if="job.cont20">{{ job.cont20 }}×20'</span>
                      <span v-if="job.cont20 && job.cont40"> + </span>
                      <span v-if="job.cont40">{{ job.cont40 }}×40'</span>
                    </div>
                  </div>
                </div>

                <!-- Container detail -->
                <div v-if="job.containers && job.containers.length > 0" class="space-y-1 pt-1 border-t border-dashed">
                  <div class="text-[11px] text-muted-foreground font-medium">Chi tiết cont</div>
                  <div v-for="(c, i) in job.containers" :key="i" class="flex items-center gap-2 text-[12px]">
                    <Badge variant="outline" class="font-mono text-[10px]">{{ c.type }}'</Badge>
                    <span class="font-mono font-medium">{{ c.soCont }}</span>
                    <span class="text-muted-foreground">·</span>
                    <span class="text-muted-foreground">Seal:</span>
                    <span class="font-mono">{{ c.seal }}</span>
                  </div>
                </div>
              </div>

              <!-- Vehicle assigned -->
              <div class="rounded-md border bg-muted/30 p-3">
                <div class="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                  <Truck class="h-3.5 w-3.5" /> Phương tiện
                </div>
                <div class="grid grid-cols-2 gap-x-3 text-sm">
                  <div>
                    <div class="text-[11px] text-muted-foreground">Đầu kéo</div>
                    <div class="font-mono font-medium">{{ job.dauKeo || '—' }}</div>
                  </div>
                  <div>
                    <div class="text-[11px] text-muted-foreground">Mooc</div>
                    <div class="font-mono font-medium">{{ job.mooc || '—' }}</div>
                  </div>
                </div>
              </div>

              <!-- Time -->
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div class="flex items-start gap-2">
                  <CalendarIcon class="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <div class="text-[11px] text-muted-foreground">Ngày đóng</div>
                    <div class="font-medium">{{ formatDate(job.ngayDongHang) }}</div>
                  </div>
                </div>
                <div v-if="job.cutOff" class="flex items-start gap-2">
                  <Clock class="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <div class="text-[11px] text-muted-foreground">Cut off</div>
                    <div class="font-medium">{{ job.cutOff }}</div>
                  </div>
                </div>
                <div v-if="job.estimateCompletion" class="flex items-start gap-2">
                  <Clock class="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div class="text-[11px] text-muted-foreground">Hoàn thành dự kiến</div>
                    <div class="font-medium">{{ formatDateTime(job.estimateCompletion) }}</div>
                  </div>
                </div>
              </div>

              <!-- Pay info -->
              <div v-if="job.chiPhiTaiXe" class="flex items-center justify-between rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 px-3 py-2">
                <div class="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold uppercase tracking-wide">Chi phí lệnh này</div>
                <div class="font-bold text-emerald-700 dark:text-emerald-300">{{ formatVnd(job.chiPhiTaiXe) }}</div>
              </div>

              <!-- Remark from điều độ -->
              <div v-if="job.remark" class="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 text-sm">
                <div class="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-amber-700 dark:text-amber-300 font-semibold mb-1">
                  <AlertCircle class="h-3.5 w-3.5" /> Lưu ý từ điều độ
                </div>
                <p class="text-foreground/90">{{ job.remark }}</p>
              </div>

              <!-- Actions -->
              <div class="grid grid-cols-2 gap-2 pt-1">
                <Button
                  v-if="job.driverStatus && nextActionMap[job.driverStatus]"
                  size="sm"
                  class="w-full"
                  @click="nextActionMap[job.driverStatus]!.fn(job)"
                >
                  <CheckCircle2 class="h-4 w-4" />
                  {{ nextActionMap[job.driverStatus]!.label }}
                </Button>
                <Button v-else size="sm" class="w-full" disabled>
                  <CheckCircle2 class="h-4 w-4" /> Hoàn thành
                </Button>

                <Button variant="outline" size="sm" class="w-full" @click="actionUpload(job)">
                  <Camera class="h-4 w-4" /> Chụp / Upload
                </Button>

                <Button variant="outline" size="sm" class="w-full" as-child>
                  <a :href="`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(routeParts(job.tuyenVanChuyen).to)}`" target="_blank" rel="noopener noreferrer">
                    <Navigation class="h-4 w-4" /> Dẫn đường
                  </a>
                </Button>

                <Button variant="outline" size="sm" class="w-full text-rose-600 dark:text-rose-400 hover:text-rose-700" @click="actionReport(job)">
                  <AlertCircle class="h-4 w-4" /> Báo sự cố
                </Button>
              </div>

              <!-- Phiếu vận chuyển — full-width prominent button -->
              <Button
                size="sm"
                class="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                @click="openSlip(job)"
              >
                <Receipt class="h-4 w-4" /> Nhập phiếu vận chuyển
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <!-- Contact dispatcher (footer) -->
    <Card class="bg-muted/30">
      <CardContent class="p-3 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Phone class="h-5 w-5" />
          </div>
          <div>
            <div class="text-xs text-muted-foreground">Điều độ trực</div>
            <div class="font-semibold">Trần Thị Mai</div>
          </div>
        </div>
        <Button size="sm" as-child>
          <a href="tel:0912345678"><Phone class="h-4 w-4" /> Gọi</a>
        </Button>
      </CardContent>
    </Card>

    <TransportSlipDialog v-model:open="slipOpen" :job="slipJob" :driver-name="currentDriver" />
  </div>
</template>
