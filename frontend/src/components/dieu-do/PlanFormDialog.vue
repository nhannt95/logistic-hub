<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Loader2, ClipboardList, Package, Calendar as CalendarIcon, Truck, FileText,
  Plus, Trash2,
} from 'lucide-vue-next'
import { toast } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker, DateTimePicker } from '@/components/ui/date-picker'
import {
  Dialog, DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {
  HANG_TAU_LIST, TINH_TRANG_LIST, DRIVER_LIST,
  type TinhTrang, type ContType, type DieuDoRow,
} from '@/data/mockDieuDo'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  mode: 'create' | 'edit'
  row?: DieuDoRow | null
}>()

const NONE = '__none__'

const submitting = ref(false)

interface PlanForm {
  ngayDongHang: string
  khachHang: string
  tuyenVanChuyen: string
  hopDong: string
  hangTau: string
  bookingBL: string
  tinhTrang: TinhTrang
  cont20: number
  cont40: number
  packing: string
  etdEta: string
  cutOff: string
  taiXe: string
  dauKeo: string
  mooc: string
  estimateCompletion: string
  chiPhiTaiXe: number | null
  containers: Array<{ soCont: string; seal: string; type: ContType }>
  ghiChu: string
  remark: string
}

const today = new Date().toISOString().slice(0, 10)

function emptyForm(): PlanForm {
  return {
    ngayDongHang: today,
    khachHang: '',
    tuyenVanChuyen: '',
    hopDong: '',
    hangTau: '',
    bookingBL: '',
    tinhTrang: 'XUẤT',
    cont20: 0,
    cont40: 0,
    packing: '',
    etdEta: '',
    cutOff: '',
    taiXe: '',
    dauKeo: '',
    mooc: '',
    estimateCompletion: '',
    chiPhiTaiXe: null,
    containers: [],
    ghiChu: '',
    remark: '',
  }
}

function fromRow(r: DieuDoRow): PlanForm {
  return {
    ngayDongHang: r.ngayDongHang,
    khachHang: r.khachHang,
    tuyenVanChuyen: r.tuyenVanChuyen,
    hopDong: r.hopDong,
    hangTau: r.hangTau,
    bookingBL: r.bookingBL,
    tinhTrang: r.tinhTrang,
    cont20: r.cont20,
    cont40: r.cont40,
    packing: r.packing,
    etdEta: r.etdEta,
    cutOff: r.cutOff,
    taiXe: r.taiXe ?? '',
    dauKeo: r.dauKeo ?? '',
    mooc: r.mooc ?? '',
    estimateCompletion: r.estimateCompletion ?? '',
    chiPhiTaiXe: r.chiPhiTaiXe ?? null,
    containers: r.containers ? r.containers.map((c) => ({ ...c })) : [],
    ghiChu: r.ghiChu,
    remark: r.remark ?? '',
  }
}

const form = ref<PlanForm>(emptyForm())
const errors = ref<Record<string, string>>({})

watch(open, (v) => {
  if (v) {
    form.value = props.mode === 'edit' && props.row ? fromRow(props.row) : emptyForm()
    errors.value = {}
  }
})

const title = computed(() => (props.mode === 'edit' ? 'Chỉnh sửa kế hoạch' : 'Thêm kế hoạch điều độ'))
const description = computed(() =>
  props.mode === 'edit'
    ? 'Cập nhật thông tin kế hoạch, phân công tài xế và phương tiện.'
    : 'Nhập thông tin lệnh, gán tài xế và phương tiện vận hành.'
)
const submitLabel = computed(() => (props.mode === 'edit' ? 'Lưu thay đổi' : 'Tạo kế hoạch'))

function addContainer() {
  form.value.containers.push({ soCont: '', seal: '', type: '20' })
}
function removeContainer(idx: number) {
  form.value.containers.splice(idx, 1)
}

function validate(): boolean {
  const e: Record<string, string> = {}
  if (!form.value.ngayDongHang) e.ngayDongHang = 'Chọn ngày đóng hàng'
  if (!form.value.khachHang.trim()) e.khachHang = 'Nhập khách hàng'
  if (!form.value.tuyenVanChuyen.trim()) e.tuyenVanChuyen = 'Nhập tuyến vận chuyển'
  if (!form.value.hangTau) e.hangTau = 'Chọn hãng tàu'
  if (form.value.cont20 === 0 && form.value.cont40 === 0 && form.value.containers.length === 0)
    e.cont = 'Phải có ít nhất 1 cont'
  if (form.value.chiPhiTaiXe !== null && form.value.chiPhiTaiXe < 0) e.chiPhi = 'Chi phí không hợp lệ'
  errors.value = e
  return Object.keys(e).length === 0
}

function close() {
  open.value = false
}

async function onSubmit(ev: Event) {
  ev.preventDefault()
  if (!validate()) {
    toast.error('Thiếu thông tin', { description: 'Vui lòng kiểm tra các trường bắt buộc.' })
    return
  }
  submitting.value = true
  try {
    await new Promise((r) => setTimeout(r, 700))
    if (props.mode === 'edit') {
      toast.success('Đã cập nhật kế hoạch', {
        description: `${form.value.khachHang} · ${form.value.tuyenVanChuyen}${form.value.taiXe ? ` · TX: ${form.value.taiXe}` : ''}`,
      })
    } else {
      toast.success('Đã thêm kế hoạch mới', {
        description: `${form.value.khachHang} · ${form.value.tuyenVanChuyen} · ${form.value.cont20} × 20' + ${form.value.cont40} × 40'`,
      })
    }
    close()
  } finally {
    submitting.value = false
  }
}

function fmtVnd(n: number | null): string {
  if (n === null || n === undefined) return ''
  return n.toLocaleString('vi-VN')
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-[820px] max-h-[92vh] overflow-y-auto">
      <DialogHeader>
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ClipboardList class="h-5 w-5" />
          </div>
          <div>
            <DialogTitle>{{ title }}</DialogTitle>
            <DialogDescription>{{ description }}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form @submit="onSubmit" class="grid gap-5">
        <!-- ====== 1. Thông tin lệnh ====== -->
        <section class="space-y-3">
          <div class="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
            <CalendarIcon class="h-3.5 w-3.5" /> Thông tin lệnh
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="grid gap-1.5">
              <Label>Ngày đóng hàng <span class="text-destructive">*</span></Label>
              <DatePicker v-model="form.ngayDongHang" placeholder="Chọn ngày" />
              <p v-if="errors.ngayDongHang" class="text-xs text-destructive">{{ errors.ngayDongHang }}</p>
            </div>
            <div class="grid gap-1.5">
              <Label>Tình trạng <span class="text-destructive">*</span></Label>
              <Select v-model="form.tinhTrang">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="t in TINH_TRANG_LIST" :key="t" :value="t">{{ t }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="grid gap-1.5">
              <Label>Khách hàng <span class="text-destructive">*</span></Label>
              <Input v-model="form.khachHang" placeholder="VD: ACOM LB" />
              <p v-if="errors.khachHang" class="text-xs text-destructive">{{ errors.khachHang }}</p>
            </div>
            <div class="grid gap-1.5">
              <Label>Tuyến vận chuyển <span class="text-destructive">*</span></Label>
              <Input v-model="form.tuyenVanChuyen" placeholder="VD: LONG BÌNH - ĐỒNG NAI" />
              <p v-if="errors.tuyenVanChuyen" class="text-xs text-destructive">{{ errors.tuyenVanChuyen }}</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="grid gap-1.5">
              <Label>Hợp đồng</Label>
              <Input v-model="form.hopDong" placeholder="Số HĐ" />
            </div>
            <div class="grid gap-1.5">
              <Label>Hãng tàu <span class="text-destructive">*</span></Label>
              <Select v-model="form.hangTau">
                <SelectTrigger><SelectValue placeholder="Chọn hãng tàu" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="h in HANG_TAU_LIST" :key="h" :value="h">{{ h }}</SelectItem>
                </SelectContent>
              </Select>
              <p v-if="errors.hangTau" class="text-xs text-destructive">{{ errors.hangTau }}</p>
            </div>
            <div class="grid gap-1.5">
              <Label>Booking / BL</Label>
              <Input v-model="form.bookingBL" placeholder="Mã booking" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="grid gap-1.5">
              <Label>Packing</Label>
              <Input v-model="form.packing" placeholder="VD: IN BULK" />
            </div>
            <div class="grid gap-1.5">
              <Label>ETD / ETA</Label>
              <DatePicker v-model="form.etdEta" placeholder="Chọn ngày" clearable />
            </div>
            <div class="grid gap-1.5">
              <Label>Cut off</Label>
              <DateTimePicker v-model="form.cutOff" placeholder="Hạn cut off" />
            </div>
          </div>
        </section>

        <div class="h-px bg-border" />

        <!-- ====== 2. Container ====== -->
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              <Package class="h-3.5 w-3.5" /> Container
            </div>
            <Button type="button" variant="outline" size="sm" @click="addContainer">
              <Plus class="h-3.5 w-3.5" /> Thêm cont
            </Button>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="grid gap-1.5">
              <Label>Số cont 20' (tổng)</Label>
              <Input v-model.number="form.cont20" type="number" min="0" />
            </div>
            <div class="grid gap-1.5">
              <Label>Số cont 40' (tổng)</Label>
              <Input v-model.number="form.cont40" type="number" min="0" />
            </div>
          </div>
          <p v-if="errors.cont" class="text-xs text-destructive">{{ errors.cont }}</p>

          <!-- Container detail list -->
          <div v-if="form.containers.length > 0" class="space-y-2 rounded-md border bg-muted/30 p-3">
            <div class="text-xs font-medium text-muted-foreground mb-1">
              Chi tiết container ({{ form.containers.length }})
            </div>
            <div v-for="(c, idx) in form.containers" :key="idx" class="grid grid-cols-[1fr_1fr_80px_36px] gap-2 items-end">
              <div class="grid gap-1">
                <Label v-if="idx === 0" class="text-[11px]">Số container</Label>
                <Input v-model="c.soCont" placeholder="VD: CSNU1234567" class="h-9" />
              </div>
              <div class="grid gap-1">
                <Label v-if="idx === 0" class="text-[11px]">Seal</Label>
                <Input v-model="c.seal" placeholder="VD: SL00123" class="h-9" />
              </div>
              <div class="grid gap-1">
                <Label v-if="idx === 0" class="text-[11px]">Loại</Label>
                <Select v-model="c.type">
                  <SelectTrigger class="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20'</SelectItem>
                    <SelectItem value="40">40'</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="ghost" size="icon" class="h-9 w-9 text-destructive" @click="removeContainer(idx)">
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p v-else class="text-xs text-muted-foreground italic">
            Bấm "Thêm cont" để khai báo chi tiết số cont + seal cho từng container.
          </p>
        </section>

        <div class="h-px bg-border" />

        <!-- ====== 3. Vận hành ====== -->
        <section class="space-y-3">
          <div class="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
            <Truck class="h-3.5 w-3.5" /> Vận hành & phân công
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="grid gap-1.5">
              <Label>Tài xế</Label>
              <Select
                :model-value="form.taiXe || NONE"
                @update:model-value="(v) => (form.taiXe = v === NONE ? '' : (v as string))"
              >
                <SelectTrigger><SelectValue placeholder="Chọn tài xế" /></SelectTrigger>
                <SelectContent>
                  <SelectItem :value="NONE">— Chưa phân công —</SelectItem>
                  <SelectItem v-for="d in DRIVER_LIST" :key="d" :value="d">{{ d }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-1.5">
              <Label>Đầu kéo (BKS)</Label>
              <Input v-model="form.dauKeo" placeholder="VD: 51C-12345" />
            </div>
            <div class="grid gap-1.5">
              <Label>Mooc</Label>
              <Input v-model="form.mooc" placeholder="VD: R-9876" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="grid gap-1.5">
              <Label>Hoàn thành dự kiến</Label>
              <DateTimePicker v-model="form.estimateCompletion" placeholder="Chọn ngày & giờ" />
            </div>
            <div class="grid gap-1.5">
              <Label>Chi phí tài xế (VND)</Label>
              <div class="relative">
                <Input v-model.number="form.chiPhiTaiXe" type="number" min="0" step="100000" placeholder="VD: 2500000" />
                <span v-if="form.chiPhiTaiXe" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none tabular-nums">
                  {{ fmtVnd(form.chiPhiTaiXe) }}
                </span>
              </div>
              <p v-if="errors.chiPhi" class="text-xs text-destructive">{{ errors.chiPhi }}</p>
            </div>
          </div>
        </section>

        <div class="h-px bg-border" />

        <!-- ====== 4. Ghi chú ====== -->
        <section class="space-y-3">
          <div class="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-semibold">
            <FileText class="h-3.5 w-3.5" /> Ghi chú
          </div>
          <div class="grid gap-1.5">
            <Label>Ghi chú chung</Label>
            <Textarea v-model="form.ghiChu" placeholder="Ghi chú hiển thị trên bảng…" rows="2" />
          </div>
          <div class="grid gap-1.5">
            <Label>Remark cho điều độ</Label>
            <Textarea v-model="form.remark" placeholder="Yêu cầu / lưu ý đặc biệt cho điều độ viên…" rows="3" />
          </div>
        </section>

        <DialogFooter class="mt-2 sticky bottom-0 bg-background pt-3 -mx-6 px-6 -mb-6 pb-4 border-t">
          <Button type="button" variant="outline" :disabled="submitting" @click="close">Hủy</Button>
          <Button type="submit" :disabled="submitting">
            <Loader2 v-if="submitting" class="animate-spin" />
            {{ submitting ? 'Đang lưu…' : submitLabel }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
