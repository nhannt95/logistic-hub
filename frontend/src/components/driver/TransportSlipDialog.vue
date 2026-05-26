<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  FileText, Loader2, Receipt, Truck, Package, User as UserIcon, Printer,
} from 'lucide-vue-next'
import { toast } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog, DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { TINH_TRANG_LIST, type DieuDoRow, type TinhTrang } from '@/data/mockDieuDo'
import { formatVnd } from '@/lib/utils'

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ job: DieuDoRow | null; driverName: string }>()

const submitting = ref(false)

// ============ Cost line items (theo phiếu vận chuyển hàng) ============
const COST_LINES = [
  { key: 'hoa',        label: 'Hóa' },
  { key: 'tamUng',     label: 'Tiền tạm ứng' },
  { key: 'nangHa',     label: 'Nâng hạ' },
  { key: 'cauDuong',   label: 'Cầu đường' },
  { key: 'bocXep',     label: 'Bốc xếp' },
  { key: 'canCont',    label: 'Căn cont' },
  { key: 'khoanLayCont', label: 'Khoán lấy cont' },
  { key: 'neoXe',      label: 'Neo xe' },
  { key: 'hanMooc',    label: 'Hàn mooc' },
  { key: 'guiCont',    label: 'Gửi cont' },
] as const

type CostKey = typeof COST_LINES[number]['key']

interface SlipForm {
  soPhieu: string
  ngay: string
  soXe: string
  taiXe: string
  chuHang: string
  tenHang: string
  huongHang: TinhTrang
  soLuong: number
  hangVe: string
  soContainer: string
  soBooking: string
  costs: Record<CostKey, number | null>
  ghiChu: string
}

function genSoPhieu(): string {
  return 'X' + Date.now().toString().slice(-7)
}

function emptyForm(): SlipForm {
  return {
    soPhieu: genSoPhieu(),
    ngay: new Date().toISOString().slice(0, 10),
    soXe: '',
    taiXe: props.driverName,
    chuHang: '',
    tenHang: '',
    huongHang: 'XUẤT',
    soLuong: 1,
    hangVe: '',
    soContainer: '',
    soBooking: '',
    costs: Object.fromEntries(COST_LINES.map((c) => [c.key, null])) as Record<CostKey, number | null>,
    ghiChu: '',
  }
}

const form = ref<SlipForm>(emptyForm())

// Pre-fill from job
watch(open, (v) => {
  if (v && props.job) {
    form.value = {
      ...emptyForm(),
      soXe: props.job.dauKeo ?? '',
      taiXe: props.driverName,
      chuHang: props.job.khachHang,
      huongHang: props.job.tinhTrang,
      soLuong: (props.job.cont20 || 0) + (props.job.cont40 || 0),
      soContainer: props.job.containers?.map((c) => c.soCont).join(', ') ?? '',
      soBooking: props.job.bookingBL,
    }
  } else if (v) {
    form.value = emptyForm()
  }
})

const totalCost = computed(() =>
  Object.values(form.value.costs).reduce<number>((s, v) => s + (v ?? 0), 0)
)

function close() { open.value = false }

async function onSubmit(ev: Event) {
  ev.preventDefault()
  if (!form.value.soXe.trim()) {
    toast.error('Thiếu số xe', { description: 'Vui lòng nhập số xe.' })
    return
  }
  if (totalCost.value === 0) {
    toast.error('Chưa có chi phí', { description: 'Nhập ít nhất 1 khoản chi.' })
    return
  }
  submitting.value = true
  try {
    await new Promise((r) => setTimeout(r, 600))
    toast.success(`Đã lưu phiếu ${form.value.soPhieu}`, {
      description: `Tổng chi phí: ${formatVnd(totalCost.value)} đ`,
    })
    close()
  } finally {
    submitting.value = false
  }
}

function onPrint() {
  toast.info('Đang chuẩn bị in phiếu...', { description: 'Sẽ mở hộp thoại in của trình duyệt.' })
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-[900px] max-h-[92vh] overflow-y-auto p-0">
      <!-- Sticky header với info + tổng tiền -->
      <DialogHeader class="px-6 pt-6 pb-3 border-b">
        <div class="flex items-start gap-3">
          <div class="h-11 w-11 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
            <Receipt class="h-5 w-5" />
          </div>
          <div class="flex-1 min-w-0">
            <DialogTitle class="font-display text-xl">Phiếu vận chuyển hàng</DialogTitle>
            <DialogDescription class="text-xs">
              CTY TNHH TM GNVT HoangKhang ·
              Số phiếu <span class="font-mono font-semibold text-foreground">{{ form.soPhieu }}</span>
            </DialogDescription>
          </div>
          <div class="text-right shrink-0">
            <div class="text-[10px] uppercase tracking-wide text-muted-foreground">Tổng chi phí</div>
            <div class="font-display text-2xl font-black tabular-nums text-amber-600 dark:text-amber-300">{{ formatVnd(totalCost) }}</div>
            <div class="text-[10px] text-muted-foreground">VND</div>
          </div>
        </div>
      </DialogHeader>

      <form @submit="onSubmit" class="grid lg:grid-cols-5 gap-0">
        <!-- ========== LEFT: Thông tin chuyến ========== -->
        <section class="lg:col-span-3 p-6 space-y-4 lg:border-r">
          <div class="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
            <Truck class="h-3.5 w-3.5" /> Thông tin chuyến
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="grid gap-1.5">
              <Label class="text-xs">Ngày</Label>
              <DatePicker v-model="form.ngay" placeholder="Chọn ngày" />
            </div>
            <div class="grid gap-1.5">
              <Label class="text-xs">Số xe <span class="text-destructive">*</span></Label>
              <Input v-model="form.soXe" placeholder="VD: 50H-29312" class="font-mono" />
            </div>
          </div>

          <div class="grid gap-1.5">
            <Label class="text-xs flex items-center gap-1"><UserIcon class="h-3 w-3" /> Họ và tên lái xe</Label>
            <Input v-model="form.taiXe" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="grid gap-1.5">
              <Label class="text-xs">Chủ hàng</Label>
              <Input v-model="form.chuHang" placeholder="Khách hàng" />
            </div>
            <div class="grid gap-1.5">
              <Label class="text-xs">Tên hàng</Label>
              <Input v-model="form.tenHang" placeholder="VD: Cà phê, Điều..." />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="grid gap-1.5">
              <Label class="text-xs">Hướng hàng</Label>
              <Select v-model="form.huongHang">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="t in TINH_TRANG_LIST" :key="t" :value="t">{{ t }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-1.5">
              <Label class="text-xs">Số lượng</Label>
              <Input v-model.number="form.soLuong" type="number" min="0" />
            </div>
            <div class="grid gap-1.5">
              <Label class="text-xs">Hàng về</Label>
              <Input v-model="form.hangVe" placeholder="VD: Cont rỗng" />
            </div>
          </div>

          <div class="h-px bg-border" />

          <div class="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
            <Package class="h-3.5 w-3.5" /> Container & booking
          </div>

          <div class="grid gap-1.5">
            <Label class="text-xs">Số container</Label>
            <Textarea v-model="form.soContainer" rows="2" placeholder="VD: PSXV9714340, EGRU4165768" class="font-mono text-sm" />
          </div>

          <div class="grid gap-1.5">
            <Label class="text-xs">Số booking</Label>
            <Input v-model="form.soBooking" placeholder="Số booking / BL" class="font-mono" />
          </div>

          <div class="h-px bg-border" />

          <div class="grid gap-1.5">
            <Label class="text-xs flex items-center gap-1"><FileText class="h-3 w-3" /> Ghi chú</Label>
            <Textarea v-model="form.ghiChu" rows="2" placeholder="VD: Lấy cont 2 nội · Hạ cont 1.2 nội..." />
          </div>
        </section>

        <!-- ========== RIGHT: Bảng chi phí ========== -->
        <section class="lg:col-span-2 p-6 bg-muted/30 space-y-3">
          <div class="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
            <Receipt class="h-3.5 w-3.5" /> Các khoản chi (VND)
          </div>

          <div class="space-y-1.5">
            <div
              v-for="line in COST_LINES"
              :key="line.key"
              class="grid grid-cols-[1fr_140px] gap-2 items-center"
            >
              <Label class="text-sm text-foreground font-normal">{{ line.label }}</Label>
              <Input
                v-model.number="form.costs[line.key]"
                type="number"
                min="0"
                step="10000"
                placeholder="0"
                class="h-9 text-right tabular-nums font-mono"
              />
            </div>
          </div>

          <div class="h-px bg-border my-2" />

          <div class="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-3 py-2.5 flex items-center justify-between">
            <span class="text-xs uppercase tracking-wide font-semibold text-amber-700 dark:text-amber-300">Cộng các khoản chi</span>
            <span class="font-display text-lg font-black tabular-nums text-amber-700 dark:text-amber-300">{{ formatVnd(totalCost) }}</span>
          </div>

          <p class="text-[11px] text-muted-foreground italic leading-relaxed">
            ⚠️ Tài xế có trách nhiệm bồi thường hàng hóa thất thoát (nếu có).
          </p>
        </section>

        <!-- Footer (full width) -->
        <DialogFooter class="lg:col-span-5 sticky bottom-0 bg-background border-t px-6 py-3 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" :disabled="submitting" @click="onPrint">
            <Printer class="h-4 w-4" /> In phiếu
          </Button>
          <Button type="button" variant="outline" :disabled="submitting" @click="close">Hủy</Button>
          <Button type="submit" :disabled="submitting" class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
            <Loader2 v-if="submitting" class="animate-spin" />
            {{ submitting ? 'Đang lưu…' : 'Lưu phiếu' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
