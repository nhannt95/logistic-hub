<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import {
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridBody,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarCell,
  CalendarCellTrigger,
  CalendarNext,
  CalendarPrev,
  type CalendarRootEmits,
  type CalendarRootProps,
  useForwardPropsEmits,
} from 'reka-ui'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<CalendarRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<CalendarRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)

const classes = computed(() => cn('p-3', props.class))
</script>

<template>
  <CalendarRoot v-bind="forwarded" v-slot="{ grid, weekDays }" :class="classes" weekday-format="short">
    <CalendarHeader class="flex justify-center pt-1 relative items-center">
      <CalendarPrev class="absolute left-1 inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50">
        <ChevronLeft class="h-4 w-4" />
      </CalendarPrev>
      <CalendarHeading class="text-sm font-medium" />
      <CalendarNext class="absolute right-1 inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50">
        <ChevronRight class="h-4 w-4" />
      </CalendarNext>
    </CalendarHeader>

    <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 pt-4">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="w-full border-collapse space-y-1">
        <CalendarGridHead>
          <CalendarGridRow class="flex">
            <CalendarHeadCell v-for="day in weekDays" :key="day" class="text-muted-foreground rounded-md w-9 font-normal text-[0.78rem]">
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody class="grid">
          <CalendarGridRow v-for="(weekDates, idx) in month.rows" :key="idx" class="flex w-full mt-2">
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              class="relative w-9 h-9 text-center text-sm p-0 focus-within:relative focus-within:z-20"
            >
              <CalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                class="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-normal hover:bg-accent hover:text-accent-foreground focus:outline-none data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[today]:bg-accent data-[today]:text-accent-foreground data-[outside-view]:text-muted-foreground/40 data-[disabled]:text-muted-foreground/30 data-[disabled]:pointer-events-none data-[unavailable]:line-through transition-colors"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
