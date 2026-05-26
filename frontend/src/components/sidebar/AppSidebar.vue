<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { LayoutDashboard, ClipboardList, ChevronLeft, Truck, Wallet, Settings as SettingsIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const props = defineProps<{ collapsed: boolean }>()
const emit = defineEmits<{ (e: 'toggle'): void }>()

const route = useRoute()

const nav = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/dieu-do', label: 'Điều Độ', icon: ClipboardList },
  { to: '/app/tai-xe', label: 'Tài Xế', icon: Truck },
  { to: '/app/ke-toan', label: 'Kế Toán', icon: Wallet },
  { to: '/app/settings', label: 'Setting', icon: SettingsIcon },
] as const

const widthClass = computed(() => (props.collapsed ? 'w-16' : 'w-60'))
</script>

<template>
  <aside
    :class="cn('shrink-0 border-r bg-card transition-[width] duration-200 flex flex-col', widthClass)"
  >
    <div class="h-16 flex items-center gap-3 px-4 border-b">
      <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
        <span class="text-[#0a1635] font-black text-sm tracking-tight">HK</span>
      </div>
      <div v-if="!collapsed" class="overflow-hidden">
        <div class="font-bold text-base leading-tight truncate">HoangKhang</div>
        <div class="text-[11px] text-muted-foreground leading-tight truncate uppercase tracking-widest">Logistics</div>
      </div>
    </div>

    <nav class="flex-1 p-2 space-y-1 overflow-y-auto">
      <RouterLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        :class="cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          route.path.startsWith(item.to)
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          collapsed && 'justify-center px-2'
        )"
        :title="collapsed ? item.label : undefined"
      >
        <component :is="item.icon" class="h-4 w-4 shrink-0" />
        <span v-if="!collapsed">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="p-2 border-t">
      <Button variant="ghost" size="sm" :class="cn('w-full', collapsed && 'px-0')" @click="emit('toggle')">
        <ChevronLeft :class="cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')" />
        <span v-if="!collapsed">Thu gọn</span>
      </Button>
    </div>
  </aside>
</template>
