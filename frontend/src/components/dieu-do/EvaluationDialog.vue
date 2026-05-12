<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Image as ImageIcon, Receipt, MessageSquare, ChevronLeft, ChevronRight,
  X, Download, Upload, ZoomIn,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/sonner'
import type { DieuDoRow, Evaluation } from '@/data/mockDieuDo'

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ row: DieuDoRow | null }>()

const photos = computed<Evaluation[]>(() => props.row?.evaluations?.filter((e) => e.kind === 'photo') ?? [])
const invoices = computed<Evaluation[]>(() => props.row?.evaluations?.filter((e) => e.kind === 'invoice') ?? [])

const remark = ref('')

watch(
  () => [open.value, props.row?.id],
  () => {
    remark.value = props.row?.remark ?? ''
    lightboxIdx.value = -1
  }
)

// Lightbox state
const lightboxList = ref<Evaluation[]>([])
const lightboxIdx = ref(-1)

function openLightbox(list: Evaluation[], idx: number) {
  lightboxList.value = list
  lightboxIdx.value = idx
}
function closeLightbox() {
  lightboxIdx.value = -1
}
function prev() {
  if (lightboxIdx.value > 0) lightboxIdx.value--
}
function next() {
  if (lightboxIdx.value < lightboxList.value.length - 1) lightboxIdx.value++
}
const lightboxItem = computed(() => (lightboxIdx.value >= 0 ? lightboxList.value[lightboxIdx.value] : null))

function fmtDateTime(s: string): string {
  if (!s) return ''
  const d = new Date(s)
  if (isNaN(d.getTime())) return s
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}

function saveRemark() {
  toast.success('Đã lưu remark', { description: 'Remark cập nhật cho điều độ viên.' })
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-[860px] max-h-[92vh] overflow-y-auto">
      <DialogHeader>
        <div class="flex items-start gap-3">
          <div class="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ImageIcon class="h-5 w-5" />
          </div>
          <div class="min-w-0">
            <DialogTitle>Đánh giá container</DialogTitle>
            <DialogDescription v-if="row">
              {{ row.khachHang }} · {{ row.tuyenVanChuyen }}
              <span v-if="row.bookingBL"> · BL {{ row.bookingBL }}</span>
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div v-if="!row" class="py-12 text-center text-sm text-muted-foreground">Chưa chọn lệnh nào.</div>

      <Tabs v-else default-value="photos" class="mt-2">
        <TabsList>
          <TabsTrigger value="photos">
            <ImageIcon class="h-4 w-4" /> Hình ảnh
            <Badge variant="secondary" class="ml-1 h-5 px-1.5">{{ photos.length }}</Badge>
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Receipt class="h-4 w-4" /> Hóa đơn
            <Badge variant="secondary" class="ml-1 h-5 px-1.5">{{ invoices.length }}</Badge>
          </TabsTrigger>
          <TabsTrigger value="remark">
            <MessageSquare class="h-4 w-4" /> Remark
          </TabsTrigger>
        </TabsList>

        <!-- Photos tab -->
        <TabsContent value="photos">
          <div v-if="photos.length === 0" class="py-12 text-center text-sm text-muted-foreground">
            Tài xế chưa upload ảnh nào.
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="(p, idx) in photos"
              :key="p.id"
              type="button"
              class="group relative overflow-hidden rounded-lg border bg-muted text-left hover:shadow-md transition-all hover:-translate-y-0.5"
              @click="openLightbox(photos, idx)"
            >
              <div class="aspect-[4/3] overflow-hidden bg-muted">
                <img :src="p.url" :alt="p.caption" class="h-full w-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <div class="text-white text-xs">
                  <div class="font-medium truncate">{{ p.caption }}</div>
                  <div class="opacity-80">{{ fmtDateTime(p.uploadedAt) }}</div>
                </div>
              </div>
              <div class="absolute top-2 right-2 h-7 w-7 rounded-md bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn class="h-3.5 w-3.5 text-white" />
              </div>
            </button>
          </div>
          <Button variant="outline" size="sm" class="mt-4 w-full">
            <Upload class="h-4 w-4" /> Upload ảnh mới
          </Button>
        </TabsContent>

        <!-- Invoices tab -->
        <TabsContent value="invoices">
          <div v-if="invoices.length === 0" class="py-12 text-center text-sm text-muted-foreground">
            Chưa có hóa đơn nào được upload.
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="(inv, idx) in invoices"
              :key="inv.id"
              type="button"
              class="group relative overflow-hidden rounded-lg border bg-muted text-left hover:shadow-md transition-all hover:-translate-y-0.5"
              @click="openLightbox(invoices, idx)"
            >
              <div class="aspect-[4/3] overflow-hidden bg-muted">
                <img :src="inv.url" :alt="inv.caption" class="h-full w-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
              </div>
              <div class="p-2 border-t bg-card">
                <div class="text-xs font-medium truncate">{{ inv.caption }}</div>
                <div class="text-[11px] text-muted-foreground mt-0.5">{{ fmtDateTime(inv.uploadedAt) }}</div>
              </div>
            </button>
          </div>
          <Button variant="outline" size="sm" class="mt-4 w-full">
            <Upload class="h-4 w-4" /> Upload hóa đơn mới
          </Button>
        </TabsContent>

        <!-- Remark tab -->
        <TabsContent value="remark">
          <div class="space-y-3">
            <p class="text-sm text-muted-foreground">
              Ghi chú trao đổi giữa điều độ và tài xế — cập nhật theo tiến độ.
            </p>
            <Textarea v-model="remark" rows="6" placeholder="Yêu cầu / lưu ý đặc biệt cho điều độ viên…" />
            <div class="flex justify-end gap-2">
              <Button variant="outline" size="sm" @click="open = false">Đóng</Button>
              <Button size="sm" @click="saveRemark">Lưu remark</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>

    <!-- Lightbox overlay -->
    <Teleport to="body">
      <div
        v-if="lightboxItem"
        class="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
        @click.self="closeLightbox"
      >
        <button
          class="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          @click="closeLightbox"
        >
          <X class="h-5 w-5" />
        </button>
        <button
          v-if="lightboxIdx > 0"
          class="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          @click="prev"
        >
          <ChevronLeft class="h-5 w-5" />
        </button>
        <button
          v-if="lightboxIdx < lightboxList.length - 1"
          class="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          @click="next"
        >
          <ChevronRight class="h-5 w-5" />
        </button>

        <div class="max-w-5xl w-full text-center" @click.stop>
          <img :src="lightboxItem.url" :alt="lightboxItem.caption" class="max-h-[78vh] mx-auto rounded-lg shadow-2xl" />
          <div class="mt-4 text-white">
            <div class="font-medium">{{ lightboxItem.caption }}</div>
            <div class="text-sm text-white/60 mt-1">
              {{ lightboxItem.uploadedBy }} · {{ fmtDateTime(lightboxItem.uploadedAt) }}
              · <span class="text-white/80">{{ lightboxIdx + 1 }} / {{ lightboxList.length }}</span>
            </div>
            <Button variant="outline" size="sm" class="mt-3 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white" as-child>
              <a :href="lightboxItem.url" target="_blank" rel="noopener noreferrer">
                <Download class="h-4 w-4" /> Tải về
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Teleport>
  </Dialog>
</template>
