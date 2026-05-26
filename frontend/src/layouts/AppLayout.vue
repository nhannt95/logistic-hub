<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { Bell, LogOut, Search, Settings, User, Menu, Home } from 'lucide-vue-next'
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/components/ui/sonner'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const collapsed = ref(false)
const mobileOpen = ref(false)

watch(() => route.fullPath, () => { mobileOpen.value = false })

const pageTitle = computed(() => {
  switch (route.name) {
    case 'dashboard':
      return 'Dashboard'
    case 'dieu-do':
      return 'Điều Độ'
    case 'tai-xe':
      return 'Tài Xế'
    case 'ke-toan':
      return 'Kế Toán'
    case 'settings':
      return 'Setting'
    default:
      return ''
  }
})

const userInitials = computed(() => {
  const n = auth.user?.name ?? '?'
  return n.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
})

function onLogout() {
  auth.logout()
  router.replace({ name: 'login' })
  toast.success('Đã đăng xuất', { description: 'Hẹn gặp lại!' })
}
</script>

<template>
  <div class="h-screen flex bg-muted/40 overflow-hidden">
    <!-- Desktop sidebar (always in flow) -->
    <div class="hidden md:flex">
      <AppSidebar :collapsed="collapsed" @toggle="collapsed = !collapsed" />
    </div>

    <!-- Mobile sidebar overlay + drawer -->
    <div v-if="mobileOpen" class="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" @click="mobileOpen = false" />
    <Transition
      enter-active-class="transition-transform duration-200 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div v-if="mobileOpen" class="md:hidden fixed inset-y-0 left-0 z-50 flex">
        <AppSidebar :collapsed="false" @toggle="mobileOpen = false" />
      </div>
    </Transition>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-14 sm:h-16 border-b bg-card flex items-center px-3 sm:px-6 gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" class="h-9 w-9 md:hidden -ml-1" @click="mobileOpen = true" aria-label="Menu">
          <Menu class="h-5 w-5" />
        </Button>

        <h1 class="text-base sm:text-lg font-semibold tracking-tight truncate">{{ pageTitle }}</h1>

        <div class="ml-auto hidden lg:flex items-center gap-2 max-w-md flex-1 justify-end">
          <div class="relative w-full max-w-sm">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input placeholder="Tìm kiếm nhanh…" class="pl-9 h-9" />
          </div>
        </div>

        <div class="ml-auto lg:ml-0 flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            class="h-9 hidden sm:inline-flex gap-1.5"
            title="Về trang chủ"
            @click="router.push('/')"
          >
            <Home class="h-4 w-4" /> <span class="hidden md:inline">Trang chủ</span>
          </Button>
          <Button variant="ghost" size="icon" class="h-9 w-9 sm:hidden" title="Về trang chủ" @click="router.push('/')">
            <Home class="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" class="h-9 w-9 hidden sm:inline-flex">
            <Bell class="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button class="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Avatar class="h-9 w-9">
                  <AvatarFallback class="bg-primary/10 text-primary font-semibold">{{ userInitials }}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56">
              <DropdownMenuLabel>
                <div class="font-medium">{{ auth.user?.name }}</div>
                <div class="text-xs text-muted-foreground font-normal">{{ auth.user?.role }}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User class="h-4 w-4" /> Hồ sơ</DropdownMenuItem>
              <DropdownMenuItem><Settings class="h-4 w-4" /> Cài đặt</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="onLogout"><LogOut class="h-4 w-4" /> Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main class="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
