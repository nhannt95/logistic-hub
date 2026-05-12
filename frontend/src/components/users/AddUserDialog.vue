<script setup lang="ts">
import { ref, watch } from 'vue'
import { UserPlus, Loader2 } from 'lucide-vue-next'
import { toast } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ROLE_LIST, type UserRole } from '@/data/mockUsers'

const open = ref(false)
const submitting = ref(false)

const form = ref({
  name: '',
  username: '',
  email: '',
  phone: '',
  role: 'Tài Xế' as UserRole,
})

const errors = ref<Record<string, string>>({})

watch(open, (v) => {
  if (!v) {
    form.value = { name: '', username: '', email: '', phone: '', role: 'Tài Xế' }
    errors.value = {}
  }
})

function validate() {
  const e: Record<string, string> = {}
  if (!form.value.name.trim()) e.name = 'Vui lòng nhập họ tên'
  if (!form.value.username.trim()) e.username = 'Vui lòng nhập username'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) e.email = 'Email không hợp lệ'
  errors.value = e
  return Object.keys(e).length === 0
}

async function onSubmit(ev: Event) {
  ev.preventDefault()
  if (!validate()) return
  submitting.value = true
  try {
    await new Promise((r) => setTimeout(r, 600))
    toast.success('Đã thêm user mới', {
      description: `${form.value.name} (@${form.value.username}) · ${form.value.role}`,
    })
    open.value = false
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button size="sm">
        <UserPlus class="h-4 w-4" /> Thêm user
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle>Thêm user mới</DialogTitle>
        <DialogDescription>Tạo tài khoản và gán vai trò cho người dùng mới.</DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="grid gap-4">
        <div class="grid gap-1.5">
          <Label for="add-name">Họ và tên</Label>
          <Input id="add-name" v-model="form.name" placeholder="Nguyễn Văn A" />
          <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="grid gap-1.5">
            <Label for="add-username">Username</Label>
            <Input id="add-username" v-model="form.username" placeholder="vd: hung.nv" />
            <p v-if="errors.username" class="text-xs text-destructive">{{ errors.username }}</p>
          </div>
          <div class="grid gap-1.5">
            <Label>Vai trò</Label>
            <Select v-model="form.role">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="r in ROLE_LIST" :key="r" :value="r">{{ r }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="grid gap-1.5">
          <Label for="add-email">Email</Label>
          <Input id="add-email" v-model="form.email" type="email" placeholder="name@logistics-hub.vn" />
          <p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
        </div>

        <div class="grid gap-1.5">
          <Label for="add-phone">Số điện thoại</Label>
          <Input id="add-phone" v-model="form.phone" placeholder="0xxxxxxxxx" />
        </div>

        <DialogFooter class="mt-2">
          <Button type="button" variant="outline" :disabled="submitting" @click="open = false">Hủy</Button>
          <Button type="submit" :disabled="submitting">
            <Loader2 v-if="submitting" class="animate-spin" />
            {{ submitting ? 'Đang lưu…' : 'Thêm user' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
