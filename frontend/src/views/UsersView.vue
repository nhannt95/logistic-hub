<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Search, MoreHorizontal, Shield, Users as UsersIcon,
  UserCheck, UserX, KeyRound, Pencil, Trash2, Lock, Unlock, X, SlidersHorizontal,
  Mail, Phone, Clock,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Pagination } from '@/components/ui/pagination'
import { toast } from '@/components/ui/sonner'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import AddUserDialog from '@/components/users/AddUserDialog.vue'
import DeleteUserDialog from '@/components/users/DeleteUserDialog.vue'
import { mockUsers, ROLE_LIST, PERMISSIONS, PERMISSION_MATRIX, type AppUser, type UserRole } from '@/data/mockUsers'

const ALL = '__all__'

const filters = ref({ role: '', status: '', search: '' })
const page = ref(1)
const pageSize = ref(10)

function patch(p: Partial<typeof filters.value>) {
  filters.value = { ...filters.value, ...p }
}

const filtered = computed(() => {
  const f = filters.value
  const q = f.search.trim().toLowerCase()
  return mockUsers.filter((u) => {
    if (f.role && u.role !== f.role) return false
    if (f.status && u.status !== f.status) return false
    if (q && ![u.name, u.username, u.email, u.phone].some((v) => v.toLowerCase().includes(q))) return false
    return true
  })
})

const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

watch([filters, pageSize], () => (page.value = 1), { deep: true })

const stats = computed(() => ({
  total: mockUsers.length,
  active: mockUsers.filter((u) => u.status === 'active').length,
  locked: mockUsers.filter((u) => u.status === 'locked').length,
  dieuDo: mockUsers.filter((u) => u.role === 'Điều Độ').length,
  taiXe: mockUsers.filter((u) => u.role === 'Tài Xế').length,
}))

const chips = computed(() => {
  const v = filters.value
  const arr: { key: keyof typeof v; label: string }[] = []
  if (v.role) arr.push({ key: 'role', label: `Role: ${v.role}` })
  if (v.status) arr.push({ key: 'status', label: `TT: ${v.status === 'active' ? 'Hoạt động' : 'Đã khóa'}` })
  if (v.search.trim()) arr.push({ key: 'search', label: `Tìm: ${v.search}` })
  return arr
})

function removeChip(key: 'role' | 'status' | 'search') {
  patch({ [key]: '' } as Partial<typeof filters.value>)
}

function resetFilters() {
  filters.value = { role: '', status: '', search: '' }
}

function roleBadgeVariant(r: UserRole) {
  switch (r) {
    case 'Giám Đốc': return 'default' as const
    case 'Điều Độ': return 'info' as const
    case 'Kế Toán': return 'warning' as const
    case 'Tài Xế': return 'secondary' as const
  }
}

function initials(name: string) {
  return name.split(' ').slice(-2).map((p) => p[0]).join('').toUpperCase()
}

function formatDateTime(s: string | null) {
  if (!s) return 'Chưa đăng nhập'
  const d = new Date(s)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Permission matrix state
const matrix = ref<Record<UserRole, Record<string, boolean>>>(
  Object.fromEntries(
    ROLE_LIST.map((r) => [r, Object.fromEntries(PERMISSIONS.map((p) => [p.key, PERMISSION_MATRIX[r].has(p.key)]))])
  ) as Record<UserRole, Record<string, boolean>>
)

// Mobile: selected role for single-column view
const mobileRole = ref<UserRole>('Điều Độ')

const permissionGroups = computed(() => {
  const groups = new Map<string, typeof PERMISSIONS>()
  for (const p of PERMISSIONS) {
    if (!groups.has(p.group)) groups.set(p.group, [])
    groups.get(p.group)!.push(p)
  }
  return Array.from(groups.entries())
})

function roleRowCount(r: UserRole) {
  return Object.values(matrix.value[r]).filter(Boolean).length
}

function toggleRow(r: UserRole, allOn: boolean) {
  for (const p of PERMISSIONS) matrix.value[r][p.key] = !allOn
}

// Actions
const deleteOpen = ref(false)
const deletingUser = ref<AppUser | null>(null)

function handleEdit(u: AppUser) { toast.info('Mở form chỉnh sửa', { description: `${u.name} (@${u.username})` }) }
function handleResetPassword(u: AppUser) { toast.success('Đã gửi link đặt lại mật khẩu', { description: `Đến email ${u.email}` }) }
function handleLockToggle(u: AppUser) {
  const next = u.status === 'active' ? 'locked' : 'active'
  toast[next === 'locked' ? 'warning' : 'success'](
    next === 'locked' ? 'Đã khóa user' : 'Đã mở khóa user',
    { description: `${u.name} → ${next === 'locked' ? 'Đã khóa' : 'Hoạt động'}` }
  )
}
function handleDelete(u: AppUser) { deletingUser.value = u; deleteOpen.value = true }

function savePermissions() { toast.success('Đã lưu cấu hình phân quyền', { description: 'Áp dụng cho tất cả user theo từng vai trò.' }) }
function resetPermissions() {
  for (const r of ROLE_LIST) for (const p of PERMISSIONS) matrix.value[r][p.key] = PERMISSION_MATRIX[r].has(p.key)
  toast.info('Đã khôi phục cấu hình mặc định')
}
</script>

<template>
  <Tabs default-value="list" class="space-y-4">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <TabsList class="h-9">
        <TabsTrigger value="list" class="px-2.5 sm:px-3">
          <UsersIcon class="h-4 w-4" />
          <span class="hidden sm:inline">Danh sách user</span>
          <span class="sm:hidden">User</span>
        </TabsTrigger>
        <TabsTrigger value="roles" class="px-2.5 sm:px-3">
          <Shield class="h-4 w-4" />
          <span class="hidden sm:inline">Phân quyền</span>
          <span class="sm:hidden">Quyền</span>
        </TabsTrigger>
      </TabsList>

      <AddUserDialog />
    </div>

    <!-- ============ TAB 1: LIST ============ -->
    <TabsContent value="list" class="space-y-4 mt-0">
      <!-- KPI: 2 cols mobile → 5 cols desktop -->
      <div class="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardContent class="p-3">
            <div class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Tổng user</div>
            <div class="text-lg sm:text-xl font-bold mt-1">{{ stats.total }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-3">
            <div class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-medium flex items-center gap-1">
              <UserCheck class="h-3 w-3 text-emerald-600" /> Hoạt động
            </div>
            <div class="text-lg sm:text-xl font-bold mt-1 text-emerald-600">{{ stats.active }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-3">
            <div class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-medium flex items-center gap-1">
              <UserX class="h-3 w-3 text-rose-600" /> Đã khóa
            </div>
            <div class="text-lg sm:text-xl font-bold mt-1 text-rose-600">{{ stats.locked }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-3">
            <div class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Điều Độ</div>
            <div class="text-lg sm:text-xl font-bold mt-1">{{ stats.dieuDo }}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-3">
            <div class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Tài Xế</div>
            <div class="text-lg sm:text-xl font-bold mt-1">{{ stats.taiXe }}</div>
          </CardContent>
        </Card>
      </div>

      <!-- Filter bar -->
      <div class="rounded-lg border bg-card p-3 space-y-2">
        <div class="flex items-center gap-2 flex-wrap">
          <div class="relative flex-1 min-w-[180px]">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Tìm tên, username, email, SĐT…"
              class="pl-9 h-9"
              :model-value="filters.search"
              @update:model-value="(v) => patch({ search: String(v) })"
            />
          </div>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline" size="sm" class="h-9 gap-2">
                <SlidersHorizontal class="h-3.5 w-3.5" />
                <span class="hidden sm:inline">Bộ lọc nâng cao</span>
                <span class="sm:hidden">Lọc</span>
                <Badge v-if="filters.role || filters.status" variant="info" class="ml-1 h-5 px-1.5">
                  {{ (filters.role ? 1 : 0) + (filters.status ? 1 : 0) }}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" class="w-72 space-y-3">
              <div class="space-y-1.5">
                <Label class="text-xs">Vai trò</Label>
                <Select :model-value="filters.role || ALL" @update:model-value="(v) => patch({ role: v === ALL ? '' : (v as string) })">
                  <SelectTrigger><SelectValue placeholder="Tất cả" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="ALL">Tất cả</SelectItem>
                    <SelectItem v-for="r in ROLE_LIST" :key="r" :value="r">{{ r }}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-1.5">
                <Label class="text-xs">Trạng thái</Label>
                <Select :model-value="filters.status || ALL" @update:model-value="(v) => patch({ status: v === ALL ? '' : (v as string) })">
                  <SelectTrigger><SelectValue placeholder="Tất cả" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="ALL">Tất cả</SelectItem>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="locked">Đã khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>

          <Button v-if="chips.length > 0" variant="ghost" size="sm" class="h-9 px-2" @click="resetFilters">
            <X class="h-3.5 w-3.5" />
            <span class="hidden sm:inline">Xóa lọc</span>
          </Button>

          <div class="w-full sm:w-auto sm:ml-auto text-xs text-muted-foreground whitespace-nowrap order-last sm:order-none">
            <span class="font-semibold text-foreground">{{ filtered.length }}</span> / {{ mockUsers.length }} user
          </div>
        </div>

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

      <!-- ====== Desktop: Table ====== -->
      <div class="rounded-lg border bg-card overflow-hidden hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="bg-muted/60">
              <tr class="border-b">
                <th class="text-left font-semibold px-4 py-2.5 whitespace-nowrap">Người dùng</th>
                <th class="text-left font-semibold px-4 py-2.5 whitespace-nowrap">Liên hệ</th>
                <th class="text-left font-semibold px-4 py-2.5 whitespace-nowrap">Vai trò</th>
                <th class="text-left font-semibold px-4 py-2.5 whitespace-nowrap">Trạng thái</th>
                <th class="text-left font-semibold px-4 py-2.5 whitespace-nowrap">Đăng nhập gần nhất</th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paged.length === 0">
                <td colspan="6" class="p-12 text-center text-sm text-muted-foreground">Không có user nào phù hợp.</td>
              </tr>
              <tr v-for="(u, idx) in paged" :key="u.id" :class="['border-b transition-colors hover:bg-muted/40', idx % 2 === 1 && 'bg-muted/20']">
                <td class="px-4 py-2.5">
                  <div class="flex items-center gap-3 min-w-0">
                    <Avatar class="h-9 w-9 shrink-0">
                      <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">{{ initials(u.name) }}</AvatarFallback>
                    </Avatar>
                    <div class="min-w-0">
                      <div class="font-medium truncate">{{ u.name }}</div>
                      <div class="text-xs text-muted-foreground font-mono">@{{ u.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-2.5">
                  <div class="text-sm">{{ u.email }}</div>
                  <div class="text-xs text-muted-foreground">{{ u.phone }}</div>
                </td>
                <td class="px-4 py-2.5"><Badge :variant="roleBadgeVariant(u.role)">{{ u.role }}</Badge></td>
                <td class="px-4 py-2.5">
                  <Badge :variant="u.status === 'active' ? 'success' : 'destructive'" class="gap-1">
                    <span :class="['h-1.5 w-1.5 rounded-full', u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500']" />
                    {{ u.status === 'active' ? 'Hoạt động' : 'Đã khóa' }}
                  </Badge>
                </td>
                <td class="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">{{ formatDateTime(u.lastLoginAt) }}</td>
                <td class="px-2 py-2.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="h-8 w-8"><MoreHorizontal class="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleEdit(u)"><Pencil class="h-4 w-4" /> Chỉnh sửa</DropdownMenuItem>
                      <DropdownMenuItem @click="handleResetPassword(u)"><KeyRound class="h-4 w-4" /> Đặt lại mật khẩu</DropdownMenuItem>
                      <DropdownMenuItem v-if="u.status === 'active'" @click="handleLockToggle(u)"><Lock class="h-4 w-4" /> Khóa user</DropdownMenuItem>
                      <DropdownMenuItem v-else @click="handleLockToggle(u)"><Unlock class="h-4 w-4" /> Mở khóa</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(u)"><Trash2 class="h-4 w-4" /> Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination
          :page="page" :page-size="pageSize" :total="filtered.length"
          @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)"
        />
      </div>

      <!-- ====== Mobile: Card list ====== -->
      <div class="md:hidden space-y-2">
        <div v-if="paged.length === 0" class="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Không có user nào phù hợp.
        </div>
        <div v-for="u in paged" :key="u.id" class="rounded-lg border bg-card p-3">
          <div class="flex items-start gap-3">
            <Avatar class="h-10 w-10 shrink-0">
              <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">{{ initials(u.name) }}</AvatarFallback>
            </Avatar>
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <div class="font-semibold truncate">{{ u.name }}</div>
                  <div class="text-xs text-muted-foreground font-mono">@{{ u.username }}</div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-8 w-8 shrink-0 -mr-2 -mt-1"><MoreHorizontal class="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="handleEdit(u)"><Pencil class="h-4 w-4" /> Chỉnh sửa</DropdownMenuItem>
                    <DropdownMenuItem @click="handleResetPassword(u)"><KeyRound class="h-4 w-4" /> Đặt lại MK</DropdownMenuItem>
                    <DropdownMenuItem v-if="u.status === 'active'" @click="handleLockToggle(u)"><Lock class="h-4 w-4" /> Khóa</DropdownMenuItem>
                    <DropdownMenuItem v-else @click="handleLockToggle(u)"><Unlock class="h-4 w-4" /> Mở khóa</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(u)"><Trash2 class="h-4 w-4" /> Xóa</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div class="flex items-center gap-1.5 flex-wrap mt-1.5">
                <Badge :variant="roleBadgeVariant(u.role)" class="text-[10px]">{{ u.role }}</Badge>
                <Badge :variant="u.status === 'active' ? 'success' : 'destructive'" class="gap-1 text-[10px]">
                  <span :class="['h-1.5 w-1.5 rounded-full', u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500']" />
                  {{ u.status === 'active' ? 'Hoạt động' : 'Đã khóa' }}
                </Badge>
              </div>

              <div class="mt-2 space-y-0.5 text-xs">
                <div class="flex items-center gap-1.5 text-muted-foreground">
                  <Mail class="h-3 w-3 shrink-0" />
                  <span class="truncate">{{ u.email }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-muted-foreground">
                  <Phone class="h-3 w-3 shrink-0" />
                  <span>{{ u.phone }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-muted-foreground">
                  <Clock class="h-3 w-3 shrink-0" />
                  <span class="truncate">{{ formatDateTime(u.lastLoginAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-lg border bg-card">
          <Pagination
            :page="page" :page-size="pageSize" :total="filtered.length"
            @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)"
          />
        </div>
      </div>
    </TabsContent>

    <!-- ============ TAB 2: PERMISSION MATRIX ============ -->
    <TabsContent value="roles" class="mt-0">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Ma trận phân quyền</CardTitle>
          <CardDescription>Cấu hình quyền cho từng vai trò.</CardDescription>
        </CardHeader>
        <CardContent>
          <!-- ====== Desktop: full matrix ====== -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-muted/60 sticky top-0 z-10">
                <tr class="border-b">
                  <th class="text-left font-semibold px-4 py-3 w-[280px]">Quyền</th>
                  <th v-for="r in ROLE_LIST" :key="r" class="text-center font-semibold px-3 py-3 whitespace-nowrap">
                    <div>{{ r }}</div>
                    <div class="text-[11px] font-normal text-muted-foreground mt-0.5">{{ roleRowCount(r) }} / {{ PERMISSIONS.length }}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="[group, perms] in permissionGroups" :key="group">
                  <tr class="bg-muted/30">
                    <td :colspan="ROLE_LIST.length + 1" class="px-4 py-1.5 text-[11px] uppercase tracking-wide font-semibold text-muted-foreground">{{ group }}</td>
                  </tr>
                  <tr v-for="p in perms" :key="p.key" class="border-b hover:bg-muted/30 transition-colors">
                    <td class="px-4 py-2">
                      <div class="font-medium">{{ p.label }}</div>
                      <code class="text-[10px] text-muted-foreground font-mono">{{ p.key }}</code>
                    </td>
                    <td v-for="r in ROLE_LIST" :key="r" class="text-center px-3 py-2">
                      <input
                        type="checkbox"
                        :checked="matrix[r][p.key]"
                        class="h-4 w-4 rounded border-input accent-primary cursor-pointer"
                        @change="matrix[r][p.key] = ($event.target as HTMLInputElement).checked"
                      />
                    </td>
                  </tr>
                </template>
                <tr class="bg-muted/40 border-t-2">
                  <td class="px-4 py-2 text-xs text-muted-foreground">Bật / tắt toàn bộ</td>
                  <td v-for="r in ROLE_LIST" :key="r" class="text-center px-3 py-2">
                    <Button variant="ghost" size="sm" class="h-7 text-xs" @click="toggleRow(r, roleRowCount(r) === PERMISSIONS.length)">
                      {{ roleRowCount(r) === PERMISSIONS.length ? 'Bỏ tất cả' : 'Chọn tất cả' }}
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ====== Mobile: role selector + permission checklist ====== -->
          <div class="md:hidden space-y-3">
            <div class="space-y-1.5">
              <Label class="text-xs">Chọn vai trò</Label>
              <Select v-model="mobileRole">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="r in ROLE_LIST" :key="r" :value="r">
                    {{ r }} — {{ roleRowCount(r) }}/{{ PERMISSIONS.length }} quyền
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">
                Đang bật: <span class="font-semibold text-foreground">{{ roleRowCount(mobileRole) }} / {{ PERMISSIONS.length }}</span>
              </span>
              <Button variant="ghost" size="sm" class="h-7 text-xs" @click="toggleRow(mobileRole, roleRowCount(mobileRole) === PERMISSIONS.length)">
                {{ roleRowCount(mobileRole) === PERMISSIONS.length ? 'Bỏ tất cả' : 'Chọn tất cả' }}
              </Button>
            </div>

            <div class="space-y-3">
              <div v-for="[group, perms] in permissionGroups" :key="group" class="rounded-md border bg-muted/20">
                <div class="px-3 py-1.5 text-[10px] uppercase tracking-wide font-semibold text-muted-foreground border-b">{{ group }}</div>
                <div>
                  <label
                    v-for="p in perms"
                    :key="p.key"
                    class="flex items-start gap-2.5 px-3 py-2 border-b last:border-b-0 cursor-pointer hover:bg-muted/40"
                  >
                    <input
                      type="checkbox"
                      :checked="matrix[mobileRole][p.key]"
                      class="h-4 w-4 mt-0.5 rounded border-input accent-primary"
                      @change="matrix[mobileRole][p.key] = ($event.target as HTMLInputElement).checked"
                    />
                    <div class="min-w-0 flex-1">
                      <div class="text-sm">{{ p.label }}</div>
                      <code class="text-[10px] text-muted-foreground font-mono">{{ p.key }}</code>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" @click="resetPermissions">Hủy thay đổi</Button>
            <Button size="sm" @click="savePermissions">Lưu cấu hình</Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <DeleteUserDialog v-model:open="deleteOpen" :user="deletingUser" />
  </Tabs>
</template>
