<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Lock, User, Loader2, Truck, Container, Anchor, ShieldCheck, ArrowRight } from 'lucide-vue-next'
import { toast } from '@/components/ui/sonner'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const remember = ref(true)
const submitting = ref(false)

async function onSubmit(e: Event) {
  e.preventDefault()
  if (!username.value.trim() || !password.value) {
    toast.error('Thiếu thông tin', {
      description: 'Vui lòng nhập tên đăng nhập và mật khẩu.',
    })
    return
  }
  submitting.value = true
  try {
    const ok = await auth.login(username.value.trim(), password.value)
    if (!ok) {
      toast.error('Đăng nhập thất bại', { description: 'Tên đăng nhập hoặc mật khẩu không đúng.' })
      return
    }
    toast.success('Đăng nhập thành công', {
      description: `Chào mừng quay lại, ${username.value.trim()}!`,
    })
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.replace(redirect)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#070d1f] flex items-center justify-center p-4">
    <!-- Background gradient + grid -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#0a1635] via-[#0d1d4a] to-[#0a1635]" />
    <div class="absolute inset-0 kh-grid-bg kh-anim-grid-pan opacity-40" />

    <!-- Floating gradient blobs -->
    <div
      class="absolute top-[-12%] left-[-8%] w-[480px] h-[480px] rounded-full blur-3xl kh-anim-drift"
      style="background: radial-gradient(circle, rgba(251, 191, 36, 0.35), transparent 70%);"
    />
    <div
      class="absolute bottom-[-15%] right-[-10%] w-[560px] h-[560px] rounded-full blur-3xl kh-anim-drift kh-delay-3"
      style="background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%);"
    />
    <div
      class="absolute top-[40%] right-[15%] w-[300px] h-[300px] rounded-full blur-3xl kh-anim-drift kh-delay-2"
      style="background: radial-gradient(circle, rgba(168, 85, 247, 0.25), transparent 70%);"
    />

    <!-- Moving truck silhouettes (decorative) -->
    <div class="absolute top-[24%] left-0 text-amber-300/10 kh-anim-truck pointer-events-none">
      <Truck class="h-16 w-16" />
    </div>
    <div class="absolute bottom-[18%] left-0 text-blue-300/10 kh-anim-truck kh-delay-4 pointer-events-none">
      <Truck class="h-10 w-10" />
    </div>
    <div class="absolute top-[68%] left-0 text-amber-200/10 kh-anim-truck kh-delay-2 pointer-events-none" style="animation-duration: 32s;">
      <Container class="h-12 w-12" />
    </div>

    <!-- Top bar brand mark -->
    <div class="absolute top-6 left-6 flex items-center gap-3 z-10 kh-anim-fade-up">
      <div class="relative">
        <div class="absolute inset-0 rounded-full bg-amber-400/30 blur-xl kh-anim-pulse-glow" />
        <div class="relative h-10 w-10 rounded-lg bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <span class="text-[#0a1635] font-black text-base tracking-tight">KH</span>
        </div>
      </div>
      <div class="text-white">
        <div class="text-sm font-bold tracking-wide leading-tight">KHẢI HOÀNG</div>
        <div class="text-[10px] text-amber-200/70 leading-tight uppercase tracking-[0.2em]">Logistics</div>
      </div>
    </div>

    <!-- Main content split -->
    <div class="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
      <!-- LEFT: Hero brand -->
      <div class="hidden lg:block text-white space-y-6">
        <div class="kh-anim-fade-up">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-6 backdrop-blur-sm">
            <ShieldCheck class="h-3.5 w-3.5" />
            Hệ thống quản trị nội bộ
          </div>
          <h1 class="text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight">
            <span class="block text-white">KHẢI</span>
            <span class="block kh-gold-text kh-anim-shine">HOÀNG</span>
          </h1>
          <div class="text-xl font-semibold text-blue-100/90 mt-3">LOGISTICS HUB</div>
        </div>

        <p class="text-base text-blue-100/70 max-w-md leading-relaxed kh-anim-fade-up kh-delay-1">
          Quản lý vận chuyển Container — Điều độ thông minh, theo dõi thời gian thực,
          tối ưu chi phí và hiệu suất đội xe.
        </p>

        <div class="grid grid-cols-3 gap-3 max-w-md pt-4">
          <div class="kh-anim-fade-up kh-delay-2 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-3">
            <Truck class="h-5 w-5 text-amber-300 mb-2" />
            <div class="text-xs text-blue-100/60 font-medium">Điều độ</div>
            <div class="text-sm font-semibold mt-0.5">Realtime</div>
          </div>
          <div class="kh-anim-fade-up kh-delay-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-3">
            <Container class="h-5 w-5 text-amber-300 mb-2" />
            <div class="text-xs text-blue-100/60 font-medium">Cont</div>
            <div class="text-sm font-semibold mt-0.5">Tracking</div>
          </div>
          <div class="kh-anim-fade-up kh-delay-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-3">
            <Anchor class="h-5 w-5 text-amber-300 mb-2" />
            <div class="text-xs text-blue-100/60 font-medium">Cảng</div>
            <div class="text-sm font-semibold mt-0.5">E-port</div>
          </div>
        </div>

        <div class="flex items-center gap-4 pt-6 text-blue-200/40 text-xs kh-anim-fade-up kh-delay-5">
          <span class="font-mono">v1.0.0</span>
          <span>·</span>
          <span>© 2026 Khải Hoàng Logistics JSC</span>
        </div>
      </div>

      <!-- RIGHT: Login card -->
      <div class="kh-anim-fade-up kh-delay-2 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
        <div class="relative">
          <!-- Glow halo behind the card -->
          <div class="absolute -inset-0.5 bg-gradient-to-br from-amber-400/40 via-blue-500/20 to-amber-400/40 rounded-2xl blur-xl opacity-60 kh-anim-pulse-glow" />

          <!-- Glass card -->
          <div class="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
            <!-- Top accent bar -->
            <div class="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

            <div class="p-8">
              <div class="mb-6">
                <div class="flex items-center gap-2 mb-1">
                  <div class="h-1 w-6 rounded-full bg-amber-500" />
                  <span class="text-xs font-semibold uppercase tracking-widest text-amber-700">Đăng nhập</span>
                </div>
                <h2 class="text-2xl font-bold tracking-tight text-slate-900">Chào mừng trở lại</h2>
                <p class="text-sm text-slate-500 mt-1">Hệ thống logistic Khải Hoàng</p>
              </div>

              <form @submit="onSubmit" class="space-y-4">
                <div class="space-y-1.5">
                  <Label for="username" class="text-slate-700">Tên đăng nhập</Label>
                  <div class="relative group">
                    <User class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-600 transition-colors pointer-events-none" />
                    <Input
                      id="username"
                      v-model="username"
                      autocomplete="username"
                      placeholder="demo"
                      class="pl-9 h-11 border-slate-200 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                    />
                  </div>
                </div>

                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <Label for="password" class="text-slate-700">Mật khẩu</Label>
                    <a href="#" class="text-xs text-amber-700 hover:text-amber-800 font-medium hover:underline">Quên mật khẩu?</a>
                  </div>
                  <div class="relative group">
                    <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-600 transition-colors pointer-events-none" />
                    <Input
                      id="password"
                      v-model="password"
                      type="password"
                      autocomplete="current-password"
                      placeholder="••••••••"
                      class="pl-9 h-11 border-slate-200 focus-visible:ring-amber-500 focus-visible:border-amber-500"
                    />
                  </div>
                </div>

                <label class="flex items-center gap-2 text-sm select-none cursor-pointer">
                  <input v-model="remember" type="checkbox" class="h-4 w-4 rounded border-slate-300 accent-amber-600" />
                  <span class="text-slate-600">Ghi nhớ đăng nhập trên thiết bị này</span>
                </label>

                <Button
                  type="submit"
                  class="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-lg shadow-amber-500/30 transition-all"
                  :disabled="submitting"
                >
                  <Loader2 v-if="submitting" class="animate-spin" />
                  <span>{{ submitting ? 'Đang đăng nhập…' : 'Đăng nhập' }}</span>
                  <ArrowRight v-if="!submitting" class="h-4 w-4" />
                </Button>

                <div class="relative my-2">
                  <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200" /></div>
                  <div class="relative flex justify-center text-xs"><span class="bg-white px-2 text-slate-400">hoặc</span></div>
                </div>

                <div class="rounded-md bg-amber-50 border border-amber-200 px-3 py-2.5 text-center">
                  <div class="text-[11px] uppercase tracking-wide text-amber-700 font-semibold mb-0.5">Tài khoản demo</div>
                  <div class="text-xs text-slate-700">
                    Account: <code class="font-mono font-semibold text-amber-800">demo</code> ·
                    Password: <code class="font-mono font-semibold text-amber-800">demo123</code>
                  </div>
                </div>
              </form>
            </div>

            <div class="px-8 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 text-center">
              Bằng việc đăng nhập, bạn đồng ý với
              <a href="#" class="text-amber-700 hover:underline font-medium">Điều khoản sử dụng</a>
              của Khải Hoàng Logistics.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
