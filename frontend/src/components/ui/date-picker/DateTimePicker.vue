<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar as CalendarIcon, Clock } from 'lucide-vue-next'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { isoToCalendarDate, formatVN } from '@/lib/date'
import type { CalendarDate } from '@internationalized/date'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  class?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const open = ref(false)

function splitDateTime(v: string): { date: string; time: string } {
  if (!v) return { date: '', time: '' }
  if (v.includes('T')) {
    const [d, t = ''] = v.split('T')
    return { date: d, time: t.slice(0, 5) }
  }
  const [d, t = ''] = v.split(' ')
  return { date: d, time: t.slice(0, 5) }
}

const parts = computed(() => splitDateTime(props.modelValue))

const calDate = computed({
  get: () => isoToCalendarDate(parts.value.date),
  set: (v: CalendarDate | undefined) => {
    const dateStr = v ? v.toString() : ''
    const time = parts.value.time || '08:00'
    emit('update:modelValue', dateStr ? `${dateStr}T${time}` : '')
  },
})

function onTime(e: Event) {
  const time = (e.target as HTMLInputElement).value
  const dateStr = parts.value.date
  if (!dateStr && !time) return emit('update:modelValue', '')
  emit('update:modelValue', `${dateStr || new Date().toISOString().slice(0, 10)}T${time}`)
}

const display = computed(() => {
  const d = calDate.value
  if (!d) return ''
  return `${formatVN(d)}${parts.value.time ? ' · ' + parts.value.time : ''}`
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn('h-10 w-full justify-start text-left font-normal gap-2', !modelValue && 'text-muted-foreground', props.class)"
      >
        <CalendarIcon class="h-4 w-4 opacity-70" />
        <span class="flex-1 truncate">{{ display || placeholder || 'Chọn ngày & giờ' }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar v-model="calDate" />
      <div class="flex items-center gap-2 p-3 border-t">
        <Clock class="h-4 w-4 text-muted-foreground shrink-0" />
        <Input type="time" :model-value="parts.time" class="h-9" @input="onTime" />
      </div>
    </PopoverContent>
  </Popover>
</template>
