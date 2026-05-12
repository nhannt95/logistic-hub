<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar as CalendarIcon, X } from 'lucide-vue-next'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { isoToCalendarDate, calendarDateToIso, formatVN } from '@/lib/date'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  class?: string
  clearable?: boolean
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const open = ref(false)

const calDate = computed({
  get: () => isoToCalendarDate(props.modelValue),
  set: (v) => {
    emit('update:modelValue', calendarDateToIso(v))
    if (v) open.value = false
  },
})

const display = computed(() => formatVN(calDate.value))

function clear(e: Event) {
  e.stopPropagation()
  emit('update:modelValue', '')
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn('h-10 w-full justify-start text-left font-normal gap-2 group', !modelValue && 'text-muted-foreground', props.class)"
      >
        <CalendarIcon class="h-4 w-4 opacity-70" />
        <span class="flex-1 truncate">{{ display || placeholder || 'Chọn ngày' }}</span>
        <span
          v-if="clearable && modelValue"
          role="button"
          tabindex="0"
          class="opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground"
          @click="clear"
          @keydown.enter="clear"
          @keydown.space="clear"
        >
          <X class="h-3.5 w-3.5" />
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar v-model="calDate" />
    </PopoverContent>
  </Popover>
</template>
