<script setup lang="ts">
import { computed } from 'vue'
import { Search, X, SlidersHorizontal } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { DatePicker } from '@/components/ui/date-picker'
import { HANG_TAU_LIST, KHACH_HANG_LIST, TINH_TRANG_LIST } from '@/data/mockDieuDo'

export interface DieuDoFilterState {
  dateFrom: string
  dateTo: string
  khachHang: string
  hangTau: string
  tinhTrang: string
  search: string
}

const props = defineProps<{ modelValue: DieuDoFilterState; totalCount: number; filteredCount: number }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: DieuDoFilterState): void }>()

const ALL = '__all__'

function patch(part: Partial<DieuDoFilterState>) {
  emit('update:modelValue', { ...props.modelValue, ...part })
}

const chips = computed(() => {
  const v = props.modelValue
  const arr: { key: keyof DieuDoFilterState; label: string }[] = []
  if (v.dateFrom) arr.push({ key: 'dateFrom', label: `Từ: ${v.dateFrom}` })
  if (v.dateTo) arr.push({ key: 'dateTo', label: `Đến: ${v.dateTo}` })
  if (v.khachHang) arr.push({ key: 'khachHang', label: `KH: ${v.khachHang}` })
  if (v.hangTau) arr.push({ key: 'hangTau', label: `Hãng: ${v.hangTau}` })
  if (v.tinhTrang) arr.push({ key: 'tinhTrang', label: `TT: ${v.tinhTrang}` })
  if (v.search.trim()) arr.push({ key: 'search', label: `Tìm: ${v.search}` })
  return arr
})

const advancedCount = computed(
  () => (props.modelValue.khachHang ? 1 : 0) + (props.modelValue.hangTau ? 1 : 0) + (props.modelValue.tinhTrang ? 1 : 0)
)

function removeChip(key: keyof DieuDoFilterState) {
  patch({ [key]: '' } as Partial<DieuDoFilterState>)
}

function reset() {
  emit('update:modelValue', { dateFrom: '', dateTo: '', khachHang: '', hangTau: '', tinhTrang: '', search: '' })
}
</script>

<template>
  <div class="rounded-lg border bg-card p-3 space-y-2">
    <div class="flex items-center gap-2 flex-wrap">
      <!-- Search -->
      <div class="relative flex-1 min-w-[220px] max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Tìm booking, hợp đồng, tuyến, ghi chú…"
          class="pl-9 h-9"
          :model-value="modelValue.search"
          @update:model-value="(v) => patch({ search: String(v) })"
        />
      </div>

      <!-- Date range inline -->
      <div class="flex items-center gap-1.5">
        <DatePicker
          :model-value="modelValue.dateFrom"
          placeholder="Từ ngày"
          clearable
          class="h-9 w-[150px]"
          @update:model-value="(v) => patch({ dateFrom: v })"
        />
        <span class="text-muted-foreground text-sm">—</span>
        <DatePicker
          :model-value="modelValue.dateTo"
          placeholder="Đến ngày"
          clearable
          class="h-9 w-[150px]"
          @update:model-value="(v) => patch({ dateTo: v })"
        />
      </div>

      <!-- Advanced filter popover -->
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline" size="sm" class="h-9 gap-2">
            <SlidersHorizontal class="h-3.5 w-3.5" />
            <span>Bộ lọc nâng cao</span>
            <Badge v-if="advancedCount > 0" variant="info" class="ml-1 h-5 px-1.5">{{ advancedCount }}</Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" class="w-80 space-y-3">
          <div class="space-y-1.5">
            <Label class="text-xs">Khách hàng</Label>
            <Select
              :model-value="modelValue.khachHang || ALL"
              @update:model-value="(v) => patch({ khachHang: v === ALL ? '' : (v as string) })"
            >
              <SelectTrigger><SelectValue placeholder="Tất cả" /></SelectTrigger>
              <SelectContent>
                <SelectItem :value="ALL">Tất cả</SelectItem>
                <SelectItem v-for="kh in KHACH_HANG_LIST" :key="kh" :value="kh">{{ kh }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-1.5">
            <Label class="text-xs">Hãng tàu</Label>
            <Select
              :model-value="modelValue.hangTau || ALL"
              @update:model-value="(v) => patch({ hangTau: v === ALL ? '' : (v as string) })"
            >
              <SelectTrigger><SelectValue placeholder="Tất cả" /></SelectTrigger>
              <SelectContent>
                <SelectItem :value="ALL">Tất cả</SelectItem>
                <SelectItem v-for="ht in HANG_TAU_LIST" :key="ht" :value="ht">{{ ht }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-1.5">
            <Label class="text-xs">Tình trạng</Label>
            <Select
              :model-value="modelValue.tinhTrang || ALL"
              @update:model-value="(v) => patch({ tinhTrang: v === ALL ? '' : (v as string) })"
            >
              <SelectTrigger><SelectValue placeholder="Tất cả" /></SelectTrigger>
              <SelectContent>
                <SelectItem :value="ALL">Tất cả</SelectItem>
                <SelectItem v-for="tt in TINH_TRANG_LIST" :key="tt" :value="tt">{{ tt }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>

      <Button v-if="chips.length > 0" variant="ghost" size="sm" class="h-9" @click="reset">
        <X class="h-3.5 w-3.5" /> Xóa lọc
      </Button>

      <div class="ml-auto text-xs text-muted-foreground whitespace-nowrap">
        <span class="font-semibold text-foreground">{{ filteredCount }}</span> / {{ totalCount }} lệnh
      </div>
    </div>

    <!-- Active filter chips -->
    <div v-if="chips.length > 0" class="flex items-center gap-1.5 flex-wrap pt-1">
      <button
        v-for="c in chips"
        :key="c.key"
        type="button"
        class="inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs hover:bg-secondary/70 transition-colors"
        @click="removeChip(c.key)"
      >
        <span>{{ c.label }}</span>
        <X class="h-3 w-3 opacity-60" />
      </button>
    </div>
  </div>
</template>
