<script setup lang="ts">
import { ref, watch } from 'vue'
import { AlertTriangle, Loader2 } from 'lucide-vue-next'
import { toast } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import type { AppUser } from '@/data/mockUsers'

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ user: AppUser | null }>()

const submitting = ref(false)

watch(open, (v) => { if (!v) submitting.value = false })

async function confirm() {
  if (!props.user) return
  submitting.value = true
  try {
    await new Promise((r) => setTimeout(r, 500))
    toast.success(`Đã xóa user @${props.user.username}`, {
      description: 'Thao tác này không thể hoàn tác.',
    })
    open.value = false
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-[440px]">
      <DialogHeader>
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle class="h-5 w-5" />
          </div>
          <div>
            <DialogTitle>Xóa user?</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa
              <span v-if="user" class="font-medium text-foreground">{{ user.name }}</span>?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogFooter class="mt-2">
        <Button type="button" variant="outline" :disabled="submitting" @click="open = false">Hủy</Button>
        <Button variant="destructive" :disabled="submitting" @click="confirm">
          <Loader2 v-if="submitting" class="animate-spin" />
          {{ submitting ? 'Đang xóa…' : 'Xóa user' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
