<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const props = defineProps<{
  page: number
  pageSize: number
  total: number
  pageSizeOptions?: number[]
}>()

const emit = defineEmits<{
  (e: 'update:page', v: number): void
  (e: 'update:pageSize', v: number): void
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const currentPage = computed(() => Math.min(Math.max(1, props.page), totalPages.value))

const rangeStart = computed(() => (props.total === 0 ? 0 : (currentPage.value - 1) * props.pageSize + 1))
const rangeEnd = computed(() => Math.min(currentPage.value * props.pageSize, props.total))

const sizes = computed(() => props.pageSizeOptions ?? [10, 25, 50, 100])

function go(p: number) {
  const next = Math.min(Math.max(1, p), totalPages.value)
  if (next !== currentPage.value) emit('update:page', next)
}

function changeSize(v: string) {
  const n = Number(v)
  if (!Number.isNaN(n)) emit('update:pageSize', n)
}

const pageButtons = computed<(number | '…')[]>(() => {
  const tp = totalPages.value
  const cp = currentPage.value
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  const start = Math.max(2, cp - 1)
  const end = Math.min(tp - 1, cp + 1)
  if (start > 2) pages.push('…')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < tp - 1) pages.push('…')
  pages.push(tp)
  return pages
})
</script>

<template>
  <div class="flex items-center justify-between gap-3 flex-wrap px-3 py-2 border-t bg-card">
    <!-- LEFT: page size selector + showing info -->
    <div class="flex items-center gap-4 flex-wrap text-xs">
      <div class="flex items-center gap-2">
        <span class="text-muted-foreground">Số dòng / trang</span>
        <Select :model-value="String(pageSize)" @update:model-value="(v) => changeSize(v as string)">
          <SelectTrigger class="h-8 w-[72px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="s in sizes" :key="s" :value="String(s)">{{ s }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="text-muted-foreground">
        Hiển thị
        <span class="font-medium text-foreground">{{ rangeStart }}–{{ rangeEnd }}</span>
        / <span class="font-medium text-foreground">{{ total }}</span>
      </div>
    </div>

    <!-- RIGHT: page buttons -->
    <div class="flex items-center gap-1">
      <Button variant="outline" size="icon" class="h-8 w-8" :disabled="currentPage === 1" @click="go(1)">
        <ChevronsLeft class="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" class="h-8 w-8" :disabled="currentPage === 1" @click="go(currentPage - 1)">
        <ChevronLeft class="h-4 w-4" />
      </Button>

      <template v-for="(p, i) in pageButtons" :key="i">
        <span v-if="p === '…'" class="px-1.5 text-muted-foreground text-sm select-none">…</span>
        <Button
          v-else
          :variant="p === currentPage ? 'default' : 'outline'"
          size="sm"
          class="h-8 min-w-[32px] px-2"
          @click="go(p)"
        >
          {{ p }}
        </Button>
      </template>

      <Button variant="outline" size="icon" class="h-8 w-8" :disabled="currentPage === totalPages" @click="go(currentPage + 1)">
        <ChevronRight class="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" class="h-8 w-8" :disabled="currentPage === totalPages" @click="go(totalPages)">
        <ChevronsRight class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
