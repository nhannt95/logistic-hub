<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Users, Truck, Building2, Route as RouteIcon, Wrench,
  Search, X, Plus, MoreHorizontal, Pencil, Power, PowerOff, Trash2,
  Mail, Phone, MapPin,
} from 'lucide-vue-next'
import { toast } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Pagination } from '@/components/ui/pagination'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  mockCustomers, mockDrivers, mockVendors, mockRoutes, mockVehicles,
  VENDOR_TYPE_LABEL, VEHICLE_STATUS_LABEL,
  type Customer, type Driver, type Vendor, type Route, type Vehicle,
  type Status, type VendorType, type VehicleStatus,
} from '@/data/mockMaster'
import { formatVnd } from '@/lib/utils'

const ALL = '__all__'

const tab = ref<'customers' | 'drivers' | 'vendors' | 'routes' | 'vehicles'>('customers')

const search = ref('')
const status = ref<'' | Status | VehicleStatus>('')
const vendorType = ref<'' | VendorType>('')
const page = ref(1)
const pageSize = ref(10)

watch([tab, search, status, vendorType, pageSize], () => (page.value = 1), { deep: true })
watch(tab, () => { search.value = ''; status.value = ''; vendorType.value = '' })

// ------------------ filtering helpers ------------------
function statusFilter<T extends { status: Status | VehicleStatus }>(items: T[]): T[] {
  if (!status.value) return items
  return items.filter((it) => it.status === status.value)
}

function searchIn<T>(items: T[], getFields: (it: T) => string[]): T[] {
  const q = search.value.trim().toLowerCase()
  if (!q) return items
  return items.filter((it) => getFields(it).some((f) => f.toLowerCase().includes(q)))
}

const filteredCustomers = computed(() => {
  return statusFilter(searchIn(mockCustomers, (c) => [c.code, c.name, c.shortName, c.taxCode, c.phone, c.email, c.contactPerson]))
})
const filteredDrivers = computed(() => {
  return statusFilter(searchIn(mockDrivers, (d) => [d.code, d.name, d.phone, d.cccd, d.license, d.assignedVehicle]))
})
const filteredVendors = computed(() => {
  let list = statusFilter(searchIn(mockVendors, (v) => [v.code, v.name, v.phone, v.email, v.contactPerson]))
  if (vendorType.value) list = list.filter((v) => v.type === vendorType.value)
  return list
})
const filteredRoutes = computed(() => {
  return statusFilter(searchIn(mockRoutes, (r) => [r.code, r.from, r.to, r.note]))
})
const filteredVehicles = computed(() => {
  return statusFilter(searchIn(mockVehicles, (v) => [v.code, v.plateNumber, v.manufacturer, v.model, v.mooc, v.assignedDriver]))
})

// Pagination per tab
function paginated<T>(items: T[]): T[] {
  const start = (page.value - 1) * pageSize.value
  return items.slice(start, start + pageSize.value)
}

const pagedCustomers = computed(() => paginated(filteredCustomers.value))
const pagedDrivers = computed(() => paginated(filteredDrivers.value))
const pagedVendors = computed(() => paginated(filteredVendors.value))
const pagedRoutes = computed(() => paginated(filteredRoutes.value))
const pagedVehicles = computed(() => paginated(filteredVehicles.value))

const totalFiltered = computed(() => {
  switch (tab.value) {
    case 'customers': return filteredCustomers.value.length
    case 'drivers': return filteredDrivers.value.length
    case 'vendors': return filteredVendors.value.length
    case 'routes': return filteredRoutes.value.length
    case 'vehicles': return filteredVehicles.value.length
  }
})

const totalAll = computed(() => {
  switch (tab.value) {
    case 'customers': return mockCustomers.length
    case 'drivers': return mockDrivers.length
    case 'vendors': return mockVendors.length
    case 'routes': return mockRoutes.length
    case 'vehicles': return mockVehicles.length
  }
})

// ------------------ tab stats ------------------
const tabStats = computed(() => {
  switch (tab.value) {
    case 'customers':
      return {
        total: mockCustomers.length,
        active: mockCustomers.filter((c) => c.status === 'active').length,
        inactive: mockCustomers.filter((c) => c.status === 'inactive').length,
      }
    case 'drivers':
      return {
        total: mockDrivers.length,
        active: mockDrivers.filter((d) => d.status === 'active').length,
        inactive: mockDrivers.filter((d) => d.status === 'inactive').length,
      }
    case 'vendors':
      return {
        total: mockVendors.length,
        active: mockVendors.filter((v) => v.status === 'active').length,
        inactive: mockVendors.filter((v) => v.status === 'inactive').length,
      }
    case 'routes':
      return {
        total: mockRoutes.length,
        active: mockRoutes.filter((r) => r.status === 'active').length,
        inactive: mockRoutes.filter((r) => r.status === 'inactive').length,
      }
    case 'vehicles':
      return {
        total: mockVehicles.length,
        active: mockVehicles.filter((v) => v.status === 'active').length,
        inactive: mockVehicles.filter((v) => v.status !== 'active').length,
      }
  }
})

// ------------------ Status badge helper ------------------
function statusBadge(s: Status | VehicleStatus): 'success' | 'destructive' | 'warning' {
  if (s === 'active') return 'success'
  if (s === 'maintenance') return 'warning'
  return 'destructive'
}

function statusLabel(s: Status | VehicleStatus): string {
  if (s === 'maintenance') return VEHICLE_STATUS_LABEL.maintenance
  if (s === 'active') return 'Hoạt động'
  return 'Ngưng'
}

// ------------------ Actions ------------------
function entityName(): string {
  switch (tab.value) {
    case 'customers': return 'khách hàng'
    case 'drivers': return 'tài xế'
    case 'vendors': return 'vendor'
    case 'routes': return 'tuyến'
    case 'vehicles': return 'đầu xe'
  }
}

function handleAdd() {
  toast.info(`Mở form thêm ${entityName()}`)
}
function handleEdit(code: string) {
  toast.info(`Mở form sửa ${entityName()}`, { description: `Mã: ${code}` })
}
function handleToggleStatus(code: string, current: Status | VehicleStatus) {
  toast.success('Đã cập nhật trạng thái', { description: `${code} → ${current === 'active' ? 'Ngưng' : 'Hoạt động'}` })
}
function handleDelete(code: string) {
  toast.warning(`Đã xóa ${entityName()}`, { description: `Mã: ${code}` })
}

// Display helpers
function vehicleCapacityLabel(c: Vehicle['capacity']): string {
  return c === 'mixed' ? '20\' / 40\'' : c + '\''
}
</script>

<template>
  <Tabs v-model="tab" class="space-y-4">
    <!-- Sub-tab bar -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <TabsList class="h-9 flex-wrap">
        <TabsTrigger value="customers" class="px-2.5 sm:px-3">
          <Users class="h-4 w-4" /> <span class="hidden sm:inline">Khách hàng</span><span class="sm:hidden">KH</span>
        </TabsTrigger>
        <TabsTrigger value="drivers" class="px-2.5 sm:px-3">
          <Truck class="h-4 w-4" /> <span class="hidden sm:inline">Tài xế</span><span class="sm:hidden">TX</span>
        </TabsTrigger>
        <TabsTrigger value="vendors" class="px-2.5 sm:px-3">
          <Building2 class="h-4 w-4" /> <span>Vendor</span>
        </TabsTrigger>
        <TabsTrigger value="routes" class="px-2.5 sm:px-3">
          <RouteIcon class="h-4 w-4" /> <span class="hidden sm:inline">Tuyến VC</span><span class="sm:hidden">Tuyến</span>
        </TabsTrigger>
        <TabsTrigger value="vehicles" class="px-2.5 sm:px-3">
          <Wrench class="h-4 w-4" /> <span class="hidden sm:inline">Đầu xe</span><span class="sm:hidden">Xe</span>
        </TabsTrigger>
      </TabsList>

      <Button size="sm" @click="handleAdd">
        <Plus class="h-4 w-4" /> Thêm mới
      </Button>
    </div>

    <!-- KPI strip (shared across tabs) -->
    <div class="grid grid-cols-3 gap-2 sm:gap-3">
      <Card>
        <CardContent class="p-3">
          <div class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Tổng</div>
          <div class="text-xl sm:text-2xl font-bold mt-1 tabular-nums">{{ tabStats.total }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-3">
          <div class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Hoạt động</div>
          <div class="text-xl sm:text-2xl font-bold mt-1 tabular-nums text-emerald-600 dark:text-emerald-300">{{ tabStats.active }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-3">
          <div class="text-[10px] sm:text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Ngưng / BD</div>
          <div class="text-xl sm:text-2xl font-bold mt-1 tabular-nums text-rose-600 dark:text-rose-300">{{ tabStats.inactive }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- Filter bar -->
    <div class="rounded-lg border bg-card p-3 flex items-center gap-2 flex-wrap">
      <div class="relative flex-1 min-w-[180px] max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input v-model="search" placeholder="Tìm theo mã, tên, số…" class="pl-9 h-9" />
      </div>

      <Select
        :model-value="status || ALL"
        @update:model-value="(v) => (status = v === ALL ? '' : (v as Status | VehicleStatus))"
      >
        <SelectTrigger class="h-9 w-[150px]"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
        <SelectContent>
          <SelectItem :value="ALL">Tất cả trạng thái</SelectItem>
          <SelectItem value="active">Hoạt động</SelectItem>
          <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
          <SelectItem v-if="tab === 'vehicles'" value="maintenance">Bảo dưỡng</SelectItem>
        </SelectContent>
      </Select>

      <Select
        v-if="tab === 'vendors'"
        :model-value="vendorType || ALL"
        @update:model-value="(v) => (vendorType = v === ALL ? '' : (v as VendorType))"
      >
        <SelectTrigger class="h-9 w-[160px]"><SelectValue placeholder="Loại vendor" /></SelectTrigger>
        <SelectContent>
          <SelectItem :value="ALL">Tất cả loại</SelectItem>
          <SelectItem v-for="(label, key) in VENDOR_TYPE_LABEL" :key="key" :value="key">{{ label }}</SelectItem>
        </SelectContent>
      </Select>

      <Button v-if="search || status || vendorType" variant="ghost" size="sm" class="h-9 px-2" @click="() => { search = ''; status = ''; vendorType = '' }">
        <X class="h-3.5 w-3.5" /> <span class="hidden sm:inline">Xóa lọc</span>
      </Button>

      <div class="ml-auto text-xs text-muted-foreground whitespace-nowrap">
        <span class="font-semibold text-foreground">{{ totalFiltered }}</span> / {{ totalAll }}
      </div>
    </div>

    <!-- ============ TAB: CUSTOMERS ============ -->
    <TabsContent value="customers" class="mt-0 space-y-2">
      <!-- Desktop table -->
      <div class="rounded-lg border bg-card overflow-hidden hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-muted/60 border-b">
              <tr>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Mã KH</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Tên khách hàng</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Liên hệ</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Địa chỉ / MST</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Trạng thái</th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pagedCustomers.length === 0">
                <td colspan="6" class="p-10 text-center text-sm text-muted-foreground">Không có khách hàng phù hợp.</td>
              </tr>
              <tr v-for="(c, idx) in pagedCustomers" :key="c.code" :class="['border-b hover:bg-muted/40', idx % 2 === 1 && 'bg-muted/20']">
                <td class="px-3 py-2 font-mono font-semibold text-primary">{{ c.code }}</td>
                <td class="px-3 py-2">
                  <div class="font-medium">{{ c.shortName }}</div>
                  <div class="text-xs text-muted-foreground">{{ c.name }}</div>
                </td>
                <td class="px-3 py-2">
                  <div class="text-sm">{{ c.contactPerson }}</div>
                  <div class="text-xs text-muted-foreground">{{ c.phone }} · {{ c.email }}</div>
                </td>
                <td class="px-3 py-2">
                  <div class="text-sm max-w-[280px] truncate" :title="c.address">{{ c.address }}</div>
                  <div class="text-xs text-muted-foreground font-mono">MST: {{ c.taxCode }}</div>
                </td>
                <td class="px-3 py-2">
                  <Badge :variant="statusBadge(c.status)" class="text-[10px]">{{ statusLabel(c.status) }}</Badge>
                </td>
                <td class="px-2 py-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="h-8 w-8"><MoreHorizontal class="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleEdit(c.code)"><Pencil class="h-4 w-4" /> Chỉnh sửa</DropdownMenuItem>
                      <DropdownMenuItem @click="handleToggleStatus(c.code, c.status)">
                        <component :is="c.status === 'active' ? PowerOff : Power" class="h-4 w-4" />
                        {{ c.status === 'active' ? 'Ngưng hoạt động' : 'Kích hoạt' }}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(c.code)"><Trash2 class="h-4 w-4" /> Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :page="page" :page-size="pageSize" :total="filteredCustomers.length" @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)" />
      </div>
      <!-- Mobile cards -->
      <div class="md:hidden space-y-2">
        <Card v-for="c in pagedCustomers" :key="c.code">
          <CardContent class="p-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <code class="text-[11px] font-bold text-primary">{{ c.code }}</code>
                  <Badge :variant="statusBadge(c.status)" class="text-[10px]">{{ statusLabel(c.status) }}</Badge>
                </div>
                <div class="font-semibold mt-0.5 truncate">{{ c.shortName }}</div>
                <div class="text-xs text-muted-foreground truncate">{{ c.name }}</div>
                <div class="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <div class="flex items-center gap-1.5"><Phone class="h-3 w-3 shrink-0" />{{ c.phone }}</div>
                  <div class="flex items-center gap-1.5"><Mail class="h-3 w-3 shrink-0" /><span class="truncate">{{ c.email }}</span></div>
                  <div class="flex items-start gap-1.5"><MapPin class="h-3 w-3 shrink-0 mt-0.5" /><span class="line-clamp-2">{{ c.address }}</span></div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="h-8 w-8 shrink-0"><MoreHorizontal class="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="handleEdit(c.code)"><Pencil class="h-4 w-4" /> Sửa</DropdownMenuItem>
                  <DropdownMenuItem @click="handleToggleStatus(c.code, c.status)">
                    <component :is="c.status === 'active' ? PowerOff : Power" class="h-4 w-4" />
                    {{ c.status === 'active' ? 'Ngưng' : 'Kích hoạt' }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(c.code)"><Trash2 class="h-4 w-4" /> Xóa</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
        <div class="rounded-lg border bg-card">
          <Pagination :page="page" :page-size="pageSize" :total="filteredCustomers.length" @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)" />
        </div>
      </div>
    </TabsContent>

    <!-- ============ TAB: DRIVERS ============ -->
    <TabsContent value="drivers" class="mt-0 space-y-2">
      <div class="rounded-lg border bg-card overflow-hidden hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-muted/60 border-b">
              <tr>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Mã</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Họ tên</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Liên hệ</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">CCCD</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Bằng lái</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Đầu xe</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Trạng thái</th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pagedDrivers.length === 0"><td colspan="8" class="p-10 text-center text-muted-foreground">Không có tài xế.</td></tr>
              <tr v-for="(d, idx) in pagedDrivers" :key="d.code" :class="['border-b hover:bg-muted/40', idx % 2 === 1 && 'bg-muted/20']">
                <td class="px-3 py-2 font-mono font-semibold text-primary">{{ d.code }}</td>
                <td class="px-3 py-2 font-medium">{{ d.name }}</td>
                <td class="px-3 py-2">
                  <div class="text-sm">{{ d.phone }}</div>
                  <div class="text-xs text-muted-foreground">{{ d.address }}</div>
                </td>
                <td class="px-3 py-2 font-mono text-xs">{{ d.cccd }}</td>
                <td class="px-3 py-2">
                  <div class="text-sm">
                    <Badge variant="outline" class="text-[10px] mr-1">{{ d.licenseClass }}</Badge>
                    <span class="font-mono text-xs">{{ d.license }}</span>
                  </div>
                  <div class="text-xs text-muted-foreground">Hết hạn: {{ d.licenseExpiry }}</div>
                </td>
                <td class="px-3 py-2 font-mono text-xs">{{ d.assignedVehicle || '—' }}</td>
                <td class="px-3 py-2"><Badge :variant="statusBadge(d.status)" class="text-[10px]">{{ statusLabel(d.status) }}</Badge></td>
                <td class="px-2 py-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="h-8 w-8"><MoreHorizontal class="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleEdit(d.code)"><Pencil class="h-4 w-4" /> Sửa</DropdownMenuItem>
                      <DropdownMenuItem @click="handleToggleStatus(d.code, d.status)">
                        <component :is="d.status === 'active' ? PowerOff : Power" class="h-4 w-4" />
                        {{ d.status === 'active' ? 'Ngưng' : 'Kích hoạt' }}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(d.code)"><Trash2 class="h-4 w-4" /> Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :page="page" :page-size="pageSize" :total="filteredDrivers.length" @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)" />
      </div>
      <!-- Mobile -->
      <div class="md:hidden space-y-2">
        <Card v-for="d in pagedDrivers" :key="d.code">
          <CardContent class="p-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <code class="text-[11px] font-bold text-primary">{{ d.code }}</code>
                  <Badge :variant="statusBadge(d.status)" class="text-[10px]">{{ statusLabel(d.status) }}</Badge>
                  <Badge variant="outline" class="text-[10px]">Hạng {{ d.licenseClass }}</Badge>
                </div>
                <div class="font-semibold mt-0.5 truncate">{{ d.name }}</div>
                <div class="text-xs text-muted-foreground space-y-0.5 mt-1">
                  <div>📱 {{ d.phone }}</div>
                  <div>🆔 {{ d.cccd }}</div>
                  <div>🚛 Đầu xe: <span class="font-mono">{{ d.assignedVehicle || '—' }}</span></div>
                  <div>📅 BL hết hạn: {{ d.licenseExpiry }}</div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="h-8 w-8 shrink-0"><MoreHorizontal class="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="handleEdit(d.code)"><Pencil class="h-4 w-4" /> Sửa</DropdownMenuItem>
                  <DropdownMenuItem @click="handleToggleStatus(d.code, d.status)">
                    <component :is="d.status === 'active' ? PowerOff : Power" class="h-4 w-4" />
                    {{ d.status === 'active' ? 'Ngưng' : 'Kích hoạt' }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(d.code)"><Trash2 class="h-4 w-4" /> Xóa</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
        <div class="rounded-lg border bg-card">
          <Pagination :page="page" :page-size="pageSize" :total="filteredDrivers.length" @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)" />
        </div>
      </div>
    </TabsContent>

    <!-- ============ TAB: VENDORS ============ -->
    <TabsContent value="vendors" class="mt-0 space-y-2">
      <div class="rounded-lg border bg-card overflow-hidden hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-muted/60 border-b">
              <tr>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Mã</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Tên</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Loại</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Liên hệ</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Địa chỉ / MST</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Trạng thái</th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pagedVendors.length === 0"><td colspan="7" class="p-10 text-center text-muted-foreground">Không có vendor.</td></tr>
              <tr v-for="(v, idx) in pagedVendors" :key="v.code" :class="['border-b hover:bg-muted/40', idx % 2 === 1 && 'bg-muted/20']">
                <td class="px-3 py-2 font-mono font-semibold text-primary">{{ v.code }}</td>
                <td class="px-3 py-2 font-medium">{{ v.name }}</td>
                <td class="px-3 py-2"><Badge variant="info" class="text-[10px]">{{ VENDOR_TYPE_LABEL[v.type] }}</Badge></td>
                <td class="px-3 py-2">
                  <div class="text-sm">{{ v.contactPerson }}</div>
                  <div class="text-xs text-muted-foreground">{{ v.phone }}</div>
                </td>
                <td class="px-3 py-2">
                  <div class="text-sm max-w-[260px] truncate" :title="v.address">{{ v.address }}</div>
                  <div class="text-xs text-muted-foreground font-mono">MST: {{ v.taxCode }}</div>
                </td>
                <td class="px-3 py-2"><Badge :variant="statusBadge(v.status)" class="text-[10px]">{{ statusLabel(v.status) }}</Badge></td>
                <td class="px-2 py-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="h-8 w-8"><MoreHorizontal class="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleEdit(v.code)"><Pencil class="h-4 w-4" /> Sửa</DropdownMenuItem>
                      <DropdownMenuItem @click="handleToggleStatus(v.code, v.status)">
                        <component :is="v.status === 'active' ? PowerOff : Power" class="h-4 w-4" />
                        {{ v.status === 'active' ? 'Ngưng' : 'Kích hoạt' }}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(v.code)"><Trash2 class="h-4 w-4" /> Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :page="page" :page-size="pageSize" :total="filteredVendors.length" @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)" />
      </div>
      <div class="md:hidden space-y-2">
        <Card v-for="v in pagedVendors" :key="v.code">
          <CardContent class="p-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <code class="text-[11px] font-bold text-primary">{{ v.code }}</code>
                  <Badge :variant="statusBadge(v.status)" class="text-[10px]">{{ statusLabel(v.status) }}</Badge>
                  <Badge variant="info" class="text-[10px]">{{ VENDOR_TYPE_LABEL[v.type] }}</Badge>
                </div>
                <div class="font-semibold mt-0.5">{{ v.name }}</div>
                <div class="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <div>👤 {{ v.contactPerson }}</div>
                  <div class="flex items-center gap-1.5"><Phone class="h-3 w-3 shrink-0" />{{ v.phone }}</div>
                  <div class="flex items-start gap-1.5"><MapPin class="h-3 w-3 shrink-0 mt-0.5" /><span class="line-clamp-2">{{ v.address }}</span></div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="h-8 w-8 shrink-0"><MoreHorizontal class="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="handleEdit(v.code)"><Pencil class="h-4 w-4" /> Sửa</DropdownMenuItem>
                  <DropdownMenuItem @click="handleToggleStatus(v.code, v.status)">
                    <component :is="v.status === 'active' ? PowerOff : Power" class="h-4 w-4" />
                    {{ v.status === 'active' ? 'Ngưng' : 'Kích hoạt' }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(v.code)"><Trash2 class="h-4 w-4" /> Xóa</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
        <div class="rounded-lg border bg-card">
          <Pagination :page="page" :page-size="pageSize" :total="filteredVendors.length" @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)" />
        </div>
      </div>
    </TabsContent>

    <!-- ============ TAB: ROUTES ============ -->
    <TabsContent value="routes" class="mt-0 space-y-2">
      <div class="rounded-lg border bg-card overflow-hidden hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-muted/60 border-b">
              <tr>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Mã</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Tuyến vận chuyển</th>
                <th class="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Khoảng cách</th>
                <th class="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Thời gian</th>
                <th class="text-right font-semibold px-3 py-2.5 whitespace-nowrap">Giá chuẩn</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Ghi chú</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Trạng thái</th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pagedRoutes.length === 0"><td colspan="8" class="p-10 text-center text-muted-foreground">Không có tuyến.</td></tr>
              <tr v-for="(r, idx) in pagedRoutes" :key="r.code" :class="['border-b hover:bg-muted/40', idx % 2 === 1 && 'bg-muted/20']">
                <td class="px-3 py-2 font-mono font-semibold text-primary">{{ r.code }}</td>
                <td class="px-3 py-2">
                  <div class="flex items-center gap-1.5 font-medium">
                    <span>{{ r.from }}</span>
                    <span class="text-muted-foreground">→</span>
                    <span>{{ r.to }}</span>
                  </div>
                </td>
                <td class="px-3 py-2 text-right tabular-nums">{{ r.distance }} km</td>
                <td class="px-3 py-2 text-right tabular-nums">{{ r.estimatedHours }} h</td>
                <td class="px-3 py-2 text-right tabular-nums font-medium">{{ formatVnd(r.standardPrice) }}</td>
                <td class="px-3 py-2 text-xs text-muted-foreground max-w-[220px] truncate" :title="r.note">{{ r.note || '—' }}</td>
                <td class="px-3 py-2"><Badge :variant="statusBadge(r.status)" class="text-[10px]">{{ statusLabel(r.status) }}</Badge></td>
                <td class="px-2 py-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="h-8 w-8"><MoreHorizontal class="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleEdit(r.code)"><Pencil class="h-4 w-4" /> Sửa</DropdownMenuItem>
                      <DropdownMenuItem @click="handleToggleStatus(r.code, r.status)">
                        <component :is="r.status === 'active' ? PowerOff : Power" class="h-4 w-4" />
                        {{ r.status === 'active' ? 'Ngưng' : 'Kích hoạt' }}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(r.code)"><Trash2 class="h-4 w-4" /> Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :page="page" :page-size="pageSize" :total="filteredRoutes.length" @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)" />
      </div>
      <div class="md:hidden space-y-2">
        <Card v-for="r in pagedRoutes" :key="r.code">
          <CardContent class="p-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <code class="text-[11px] font-bold text-primary">{{ r.code }}</code>
                  <Badge :variant="statusBadge(r.status)" class="text-[10px]">{{ statusLabel(r.status) }}</Badge>
                </div>
                <div class="font-semibold mt-0.5 text-sm">{{ r.from }} → {{ r.to }}</div>
                <div class="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div><div class="text-muted-foreground">Km</div><div class="font-semibold tabular-nums">{{ r.distance }}</div></div>
                  <div><div class="text-muted-foreground">Giờ</div><div class="font-semibold tabular-nums">{{ r.estimatedHours }}</div></div>
                  <div><div class="text-muted-foreground">Giá</div><div class="font-semibold tabular-nums">{{ formatVnd(r.standardPrice) }}</div></div>
                </div>
                <div v-if="r.note" class="text-xs text-muted-foreground mt-1.5 italic">{{ r.note }}</div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="h-8 w-8 shrink-0"><MoreHorizontal class="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="handleEdit(r.code)"><Pencil class="h-4 w-4" /> Sửa</DropdownMenuItem>
                  <DropdownMenuItem @click="handleToggleStatus(r.code, r.status)">
                    <component :is="r.status === 'active' ? PowerOff : Power" class="h-4 w-4" />
                    {{ r.status === 'active' ? 'Ngưng' : 'Kích hoạt' }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(r.code)"><Trash2 class="h-4 w-4" /> Xóa</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
        <div class="rounded-lg border bg-card">
          <Pagination :page="page" :page-size="pageSize" :total="filteredRoutes.length" @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)" />
        </div>
      </div>
    </TabsContent>

    <!-- ============ TAB: VEHICLES ============ -->
    <TabsContent value="vehicles" class="mt-0 space-y-2">
      <div class="rounded-lg border bg-card overflow-hidden hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-muted/60 border-b">
              <tr>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Mã</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Biển số</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Hãng / Model</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Loại</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Mooc</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Tài xế</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Đăng kiểm / BH</th>
                <th class="text-left font-semibold px-3 py-2.5 whitespace-nowrap">Trạng thái</th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="pagedVehicles.length === 0"><td colspan="9" class="p-10 text-center text-muted-foreground">Không có đầu xe.</td></tr>
              <tr v-for="(v, idx) in pagedVehicles" :key="v.code" :class="['border-b hover:bg-muted/40', idx % 2 === 1 && 'bg-muted/20']">
                <td class="px-3 py-2 font-mono font-semibold text-primary">{{ v.code }}</td>
                <td class="px-3 py-2 font-mono font-semibold">{{ v.plateNumber }}</td>
                <td class="px-3 py-2">
                  <div class="text-sm">{{ v.manufacturer }} {{ v.model }}</div>
                  <div class="text-xs text-muted-foreground">Đời {{ v.year }}</div>
                </td>
                <td class="px-3 py-2"><Badge variant="outline" class="text-[10px]">{{ vehicleCapacityLabel(v.capacity) }}</Badge></td>
                <td class="px-3 py-2 font-mono text-xs">{{ v.mooc }}</td>
                <td class="px-3 py-2 font-mono text-xs">{{ v.assignedDriver || '—' }}</td>
                <td class="px-3 py-2 text-xs">
                  <div>ĐK: {{ v.registrationExpiry }}</div>
                  <div class="text-muted-foreground">BH: {{ v.insuranceExpiry }}</div>
                </td>
                <td class="px-3 py-2"><Badge :variant="statusBadge(v.status)" class="text-[10px]">{{ statusLabel(v.status) }}</Badge></td>
                <td class="px-2 py-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="h-8 w-8"><MoreHorizontal class="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleEdit(v.code)"><Pencil class="h-4 w-4" /> Sửa</DropdownMenuItem>
                      <DropdownMenuItem @click="handleToggleStatus(v.code, v.status)">
                        <component :is="v.status === 'active' ? PowerOff : Power" class="h-4 w-4" />
                        {{ v.status === 'active' ? 'Ngưng' : 'Kích hoạt' }}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(v.code)"><Trash2 class="h-4 w-4" /> Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :page="page" :page-size="pageSize" :total="filteredVehicles.length" @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)" />
      </div>
      <div class="md:hidden space-y-2">
        <Card v-for="v in pagedVehicles" :key="v.code">
          <CardContent class="p-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <code class="text-[11px] font-bold text-primary">{{ v.code }}</code>
                  <Badge :variant="statusBadge(v.status)" class="text-[10px]">{{ statusLabel(v.status) }}</Badge>
                  <Badge variant="outline" class="text-[10px]">{{ vehicleCapacityLabel(v.capacity) }}</Badge>
                </div>
                <div class="font-mono font-bold mt-0.5">{{ v.plateNumber }}</div>
                <div class="text-sm text-muted-foreground">{{ v.manufacturer }} {{ v.model }} · {{ v.year }}</div>
                <div class="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <div>🚛 Mooc: <span class="font-mono">{{ v.mooc }}</span></div>
                  <div>👤 TX: <span class="font-mono">{{ v.assignedDriver || '—' }}</span></div>
                  <div>📅 ĐK: {{ v.registrationExpiry }} · BH: {{ v.insuranceExpiry }}</div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="h-8 w-8 shrink-0"><MoreHorizontal class="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="handleEdit(v.code)"><Pencil class="h-4 w-4" /> Sửa</DropdownMenuItem>
                  <DropdownMenuItem @click="handleToggleStatus(v.code, v.status)">
                    <component :is="v.status === 'active' ? PowerOff : Power" class="h-4 w-4" />
                    {{ v.status === 'active' ? 'Ngưng' : 'Kích hoạt' }}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleDelete(v.code)"><Trash2 class="h-4 w-4" /> Xóa</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
        <div class="rounded-lg border bg-card">
          <Pagination :page="page" :page-size="pageSize" :total="filteredVehicles.length" @update:page="(v) => (page = v)" @update:page-size="(v) => (pageSize = v)" />
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>
