<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import {
  Truck, ArrowRight, Sparkles, CheckCircle2, ChevronDown,
  Menu, X, MapPin, Mail, Phone, Container, Anchor, ShieldCheck, Wallet, Smartphone,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme'

const router = useRouter()

const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const splineRef = ref<HTMLElement | null>(null)

// Landing chỉ light mode
const { theme, set } = useTheme()
let prevTheme: 'light' | 'dark' = 'light'

// Ẩn watermark "Built with Spline" — element nằm trong shadow DOM của <spline-viewer>
function hideSplineWatermark() {
  const viewer = splineRef.value
  if (!viewer) return

  const tryHide = (): boolean => {
    const root = (viewer as unknown as { shadowRoot: ShadowRoot | null }).shadowRoot
    if (!root) return false

    let hidden = false
    const selectors = ['#logo', 'a[href*="spline"]', 'a[aria-label*="Spline" i]', '[id*="logo" i]']
    for (const sel of selectors) {
      root.querySelectorAll(sel).forEach((el) => {
        (el as HTMLElement).style.display = 'none'
        hidden = true
      })
    }
    return hidden
  }

  if (tryHide()) return
  // Poll vì shadow DOM của Spline load async
  let attempts = 0
  const interval = setInterval(() => {
    attempts += 1
    if (tryHide() || attempts > 40) clearInterval(interval)
  }, 250)
}

onMounted(() => {
  prevTheme = theme.value
  if (theme.value === 'dark') set('light')
  const onScroll = () => { scrolled.value = window.scrollY > 24 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // Spline load async, đợi mount xong rồi hide watermark
  setTimeout(hideSplineWatermark, 500)
})

onBeforeUnmount(() => {
  if (prevTheme === 'dark') set('dark')
})

// ============ Images (Unsplash logistics) ============
const HERO_TRUCK     = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&auto=format&fit=crop&q=80'
const CONTAINER_STACK = 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1000&auto=format&fit=crop&q=80'
const PORT_CONT      = 'https://images.unsplash.com/photo-1577416412292-747c6607f055?w=1600&auto=format&fit=crop&q=80'

const SERVICE_IMG_1 = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
const SERVICE_IMG_2 = 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&auto=format&fit=crop&q=80'
const SERVICE_IMG_3 = 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&auto=format&fit=crop&q=80'

// ============ Content (slim) ============
const stats = [
  { value: '1.2K+', label: 'Container / tháng' },
  { value: '50+',   label: 'Đầu xe vận hành' },
  { value: '99%',   label: 'Giao đúng hẹn' },
  { value: '5 năm', label: 'Kinh nghiệm' },
]

const services = [
  {
    img: SERVICE_IMG_1,
    icon: Truck,
    title: 'Đầu kéo Container',
    desc: 'Đội xe FC chuyên tuyến cảng — kho — KCN. Giao nhận đúng giờ với mỗi chuyến.',
  },
  {
    img: SERVICE_IMG_2,
    icon: Container,
    title: 'Quản lý Container',
    desc: 'Theo dõi số cont · seal · tình trạng từng chặng. Ảnh + hóa đơn từ tài xế cập nhật thời gian thực.',
  },
  {
    img: SERVICE_IMG_3,
    icon: Anchor,
    title: 'Tích hợp cảng & E-port',
    desc: 'Hệ thống ghép thẳng vào Eport: khai báo, đóng phí, theo dõi cont nhập rỗng tự động.',
  },
]

const features = [
  { icon: Sparkles,    title: 'Điều độ realtime',  desc: 'Grid như Excel, nhưng nhanh gấp 3 lần.' },
  { icon: Smartphone,  title: 'Mobile cho tài xế', desc: 'Nhận lệnh, upload ảnh, nhập phiếu — trên điện thoại.' },
  { icon: ShieldCheck, title: 'Phân quyền linh hoạt', desc: 'Ai thấy gì, làm gì — cấu hình theo từng vai trò.' },
  { icon: Wallet,      title: 'Kế toán & công nợ', desc: 'Tự động ghép doanh thu, chi phí, công nợ theo lệnh.' },
]

function goLogin() { router.push('/login') }
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="bg-background text-foreground min-h-screen overflow-x-hidden">
    <!-- ============================================================== -->
    <!-- ============ HERO with Spline FULL-BLEED bg =================== -->
    <!-- ============================================================== -->
    <section id="top" class="relative bg-[#0a0e1a] text-white overflow-hidden min-h-screen">
      <!-- Spline 3D scene phủ toàn bộ hero -->
      <div class="absolute inset-0 z-0">
        <spline-viewer
          ref="splineRef"
          url="https://prod.spline.design/DpoaVsbo28LJQD4U/scene.splinecode"
          class="w-full h-full block"
        />
      </div>

      <!-- Background subtle grid (đẹp khi Spline đang load) -->
      <div class="absolute inset-0 kh-grid-bg opacity-15 pointer-events-none z-[1]" />

      <!-- Overlay đậm bên trái cho text dễ đọc, mờ dần sang phải để khoe Spline -->
      <div class="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#0a0e1a] via-[#0a0e1a]/70 to-[#0a0e1a]/5" />
      <!-- Fade cạnh dưới ăn vào section kế tiếp -->
      <div class="absolute inset-x-0 bottom-0 z-10 h-40 pointer-events-none bg-gradient-to-t from-[#0a0e1a] to-transparent" />

      <!-- Mask che watermark "Built with Spline" góc dưới phải -->
      <div class="spline-watermark-mask" />

      <!-- Navbar -->
      <header
        :class="[
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled ? 'bg-[#0a0e1a]/90 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-transparent',
        ]"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          <button class="flex items-center gap-2.5 shrink-0 text-white" @click="scrollTo('top')">
            <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/40">
              <span class="text-[#0a0e1a] font-black text-sm tracking-tight font-display">HK</span>
            </div>
            <div class="hidden sm:block text-left">
              <div class="font-display font-bold text-lg leading-tight tracking-tight">HoangKhang</div>
              <div class="text-[11px] text-amber-300/70 leading-tight uppercase tracking-[0.18em]">Logistics</div>
            </div>
          </button>

          <nav class="hidden lg:flex items-center gap-7 text-sm font-medium">
            <button @click="scrollTo('top')" class="text-amber-400">Home</button>
            <button @click="scrollTo('services')" class="text-white/70 hover:text-white transition-colors">Dịch vụ</button>
            <button @click="scrollTo('about')" class="text-white/70 hover:text-white transition-colors">Về chúng tôi</button>
            <button @click="scrollTo('features')" class="text-white/70 hover:text-white transition-colors">Hệ thống</button>
            <button @click="scrollTo('contact')" class="text-white/70 hover:text-white transition-colors">Liên hệ</button>
          </nav>

          <div class="flex items-center gap-2">
            <Button size="sm" variant="outline" class="h-9 hidden sm:inline-flex bg-transparent border-white/30 text-white hover:bg-white hover:text-[#0a0e1a]" @click="goLogin">
              Đăng nhập <ArrowRight class="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" class="h-9 w-9 lg:hidden text-white hover:bg-white/10" @click="mobileMenuOpen = !mobileMenuOpen">
              <X v-if="mobileMenuOpen" class="h-5 w-5" />
              <Menu v-else class="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div v-if="mobileMenuOpen" class="lg:hidden border-t border-white/10 bg-[#0a0e1a]/95 backdrop-blur-xl">
          <div class="px-4 py-3 space-y-1">
            <button @click="scrollTo('services')" class="block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-white/80 hover:bg-white/10">Dịch vụ</button>
            <button @click="scrollTo('about')" class="block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-white/80 hover:bg-white/10">Về chúng tôi</button>
            <button @click="scrollTo('features')" class="block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-white/80 hover:bg-white/10">Hệ thống</button>
            <button @click="scrollTo('contact')" class="block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-white/80 hover:bg-white/10">Liên hệ</button>
            <Button class="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold" @click="goLogin">Đăng nhập</Button>
          </div>
        </div>
      </header>

      <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 lg:pt-40 lg:pb-24 min-h-screen flex items-center">
        <div class="max-w-2xl space-y-7">
          <h1 class="font-display font-black tracking-tight leading-[0.92] kh-anim-fade-up">
            <span class="block text-5xl sm:text-7xl lg:text-[5.5rem] text-white">Logistics</span>
            <span class="block text-5xl sm:text-7xl lg:text-[5.5rem] kh-gold-text kh-anim-shine">tin cậy.</span>
          </h1>

          <p class="text-lg lg:text-xl text-white/80 max-w-xl leading-relaxed kh-anim-fade-up kh-delay-2">
            Quản lý đầu kéo · container · tài xế · kế toán — tất cả trên một hệ thống.
          </p>

          <div class="flex flex-wrap items-center gap-3 kh-anim-fade-up kh-delay-3">
            <Button
              size="lg"
              class="h-12 px-7 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-full shadow-xl shadow-amber-500/30"
              @click="goLogin"
            >
              Đăng ký demo <ArrowRight class="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" class="h-12 px-6 bg-white/5 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-[#0a0e1a] rounded-full" @click="scrollTo('services')">
              Xem dịch vụ
            </Button>
          </div>

          <div class="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs text-white/70 kh-anim-fade-up kh-delay-4">
            <div class="flex items-center gap-1.5"><CheckCircle2 class="h-3.5 w-3.5 text-emerald-400" /> Triển khai nhanh chóng</div>
            <div class="flex items-center gap-1.5"><CheckCircle2 class="h-3.5 w-3.5 text-emerald-400" /> Mobile + Web</div>
            <div class="flex items-center gap-1.5"><CheckCircle2 class="h-3.5 w-3.5 text-emerald-400" /> Bảo mật TLS 1.3</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- ============ FULL-BLEED TRUCK PHOTO + STATS =================== -->
    <!-- ============================================================== -->
    <section class="relative bg-[#0a0e1a]">
      <div class="relative aspect-[16/9] sm:aspect-[16/7] lg:aspect-[21/8] max-h-[600px] overflow-hidden">
        <img :src="HERO_TRUCK" alt="Container truck at sunset" class="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div class="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent" />
        <div class="absolute bottom-0 inset-x-0 px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          <div class="max-w-7xl mx-auto text-white">
            <div class="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-amber-300/90 font-medium mb-2">From port to warehouse</div>
            <div class="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl">
              Đầu kéo. Container. <span class="kh-gold-text">Đúng giờ.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats inline -->
      <div class="bg-[#0a0e1a] border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div v-for="s in stats" :key="s.label" class="text-center sm:text-left">
              <div class="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight tabular-nums text-white">{{ s.value }}</div>
              <div class="text-xs sm:text-sm text-white/60 mt-1">{{ s.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- ============ SERVICES (3 image cards) ========================= -->
    <!-- ============================================================== -->
    <section id="services" class="py-20 lg:py-28">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl mb-12 lg:mb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30 text-xs font-semibold uppercase tracking-wide mb-4">
            <Container class="h-3.5 w-3.5" /> Dịch vụ
          </div>
          <h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
            Toàn trình <span class="kh-gold-text">container.</span>
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-5 lg:gap-6">
          <div
            v-for="(s, i) in services"
            :key="s.title"
            :class="['group rounded-3xl overflow-hidden bg-card border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2', i === 1 && 'md:mt-8 lg:mt-12']"
          >
            <div class="aspect-[4/3] overflow-hidden bg-muted">
              <img :src="s.img" :alt="s.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div class="p-6">
              <div class="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <component :is="s.icon" class="h-5 w-5" />
              </div>
              <h3 class="font-display text-2xl font-bold tracking-tight">{{ s.title }}</h3>
              <p class="text-sm text-muted-foreground mt-2 leading-relaxed">{{ s.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- ============ BUILT ON TRUST (light split) ===================== -->
    <!-- ============================================================== -->
    <section id="about" class="py-20 lg:py-28 bg-muted/40 border-y">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div class="space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30 text-xs font-semibold uppercase tracking-wide">
              <Anchor class="h-3.5 w-3.5" /> Về HoangKhang
            </div>
            <h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
              Xây trên<br /><span class="kh-gold-text">nền tin cậy.</span>
            </h2>
            <p class="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl">
              5 năm vận hành đội xe container — kết hợp công nghệ với quy trình thực tế.
              Mỗi chuyến hàng đến đúng giờ, minh bạch chi phí, có chứng từ rõ ràng.
            </p>

            <div class="grid grid-cols-2 gap-3 pt-2 max-w-md">
              <div class="rounded-xl bg-card border p-3">
                <div class="text-xs text-muted-foreground">SLA cam kết</div>
                <div class="font-display text-2xl font-black text-emerald-600">99%</div>
              </div>
              <div class="rounded-xl bg-card border p-3">
                <div class="text-xs text-muted-foreground">Đội xe</div>
                <div class="font-display text-2xl font-black text-sky-600">50+</div>
              </div>
              <div class="rounded-xl bg-card border p-3">
                <div class="text-xs text-muted-foreground">Khách hàng</div>
                <div class="font-display text-2xl font-black text-amber-600">100+</div>
              </div>
              <div class="rounded-xl bg-card border p-3">
                <div class="text-xs text-muted-foreground">Năm kinh nghiệm</div>
                <div class="font-display text-2xl font-black text-violet-600">5</div>
              </div>
            </div>

            <Button
              size="lg"
              class="h-12 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-full shadow-lg shadow-amber-500/30"
              @click="goLogin"
            >
              Đăng nhập hệ thống <ArrowRight class="h-4 w-4" />
            </Button>
          </div>

          <div class="relative">
            <div class="rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[5/6] shadow-2xl">
              <img :src="CONTAINER_STACK" alt="Container stack at port" class="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- ============ FEATURES (compact, icon-led) ===================== -->
    <!-- ============================================================== -->
    <section id="features" class="py-20 lg:py-28">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl mb-12 lg:mb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30 text-xs font-semibold uppercase tracking-wide mb-4">
            <Sparkles class="h-3.5 w-3.5" /> Nền tảng
          </div>
          <h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
            Tất cả trong<br /><span class="kh-gold-text">một hệ thống.</span>
          </h2>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          <div
            v-for="f in features"
            :key="f.title"
            class="rounded-2xl border bg-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950/40 dark:to-amber-900/30 text-amber-600 flex items-center justify-center mb-5">
              <component :is="f.icon" class="h-6 w-6" />
            </div>
            <h3 class="font-display text-lg font-bold tracking-tight">{{ f.title }}</h3>
            <p class="text-sm text-muted-foreground mt-2 leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- ============ FINAL CTA (with port image) ====================== -->
    <!-- ============================================================== -->
    <section id="contact" class="relative py-24 lg:py-32 overflow-hidden bg-[#0a0e1a]">
      <img :src="PORT_CONT" alt="Port containers" class="absolute inset-0 w-full h-full object-cover opacity-30" loading="lazy" />
      <div class="absolute inset-0 bg-gradient-to-br from-[#0a0e1a]/95 via-[#0a0e1a]/85 to-[#0a0e1a]/95" />
      <div class="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl kh-anim-drift opacity-30"
           style="background: radial-gradient(circle, rgba(245, 158, 11, 0.5), transparent 70%);" />

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 class="font-display text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05]">
          Sẵn sàng tối ưu <span class="kh-gold-text kh-anim-shine">đội xe?</span>
        </h2>
        <p class="text-lg text-white/70 mt-6 max-w-xl mx-auto">
          Triển khai nhanh chóng · Đào tạo 2 buổi · Bảo hành 3 tháng.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Button
            size="lg"
            class="h-12 px-7 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-[#0a0e1a] font-bold rounded-full shadow-xl shadow-amber-500/40"
            @click="goLogin"
          >
            Đăng nhập ngay <ArrowRight class="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" class="h-12 px-6 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm rounded-full">
            Liên hệ tư vấn
          </Button>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12 text-sm text-white/60">
          <div class="flex items-center gap-2"><Phone class="h-4 w-4" /> 0903 456 789</div>
          <div class="flex items-center gap-2"><Mail class="h-4 w-4" /> contact@hoangkhang.vn</div>
          <div class="flex items-center gap-2"><MapPin class="h-4 w-4" /> KCN Cát Lái, Q.2, TP HCM</div>
        </div>
      </div>
    </section>

    <!-- ============================================================== -->
    <!-- ============ FOOTER (compact) ================================= -->
    <!-- ============================================================== -->
    <footer class="bg-card border-t">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex items-center justify-between gap-6 flex-wrap">
          <div class="flex items-center gap-2.5">
            <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/30">
              <span class="text-[#0a1635] font-black text-sm tracking-tight font-display">HK</span>
            </div>
            <div>
              <div class="font-display font-bold text-lg leading-tight">HoangKhang</div>
              <div class="text-[11px] text-muted-foreground leading-tight uppercase tracking-[0.18em]">Logistics</div>
            </div>
          </div>

          <div class="flex gap-6 text-sm text-muted-foreground">
            <a href="#services" class="hover:text-foreground">Dịch vụ</a>
            <a href="#about" class="hover:text-foreground">Về chúng tôi</a>
            <a href="#features" class="hover:text-foreground">Hệ thống</a>
            <a href="#contact" class="hover:text-foreground">Liên hệ</a>
          </div>

          <div class="text-xs text-muted-foreground">© 2026 HoangKhang Logistics JSC.</div>
        </div>
      </div>
    </footer>
  </div>
</template>
