# Logistic-Hub — Hệ thống quản lý vận chuyển container đầu kéo

> **HoangKhang Logistics** · Quản lý điều độ · Đội xe · Tài xế · Kế toán — tất cả trên một hệ thống.

Demo full-stack cho doanh nghiệp vận tải container Việt Nam. Bao gồm landing page giới thiệu công khai + ứng dụng nội bộ 5 tab (Dashboard / Điều Độ / Tài Xế / Kế Toán / Setting).

---

## 🗂️ Cấu trúc thư mục

```
Logistic-Hub/
├── frontend/                     # Vue 3 SPA
│   ├── src/
│   │   ├── views/                # 7 page views
│   │   ├── components/           # UI primitives + business components
│   │   ├── layouts/              # AppLayout (sidebar + header)
│   │   ├── router/               # Vue Router (public + auth-guarded)
│   │   ├── stores/               # Pinia (auth)
│   │   ├── lib/                  # utils, theme, loading, date
│   │   └── data/                 # mock data (DieuDo, Users, Master)
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # NestJS API
│   ├── src/
│   │   ├── auth/                 # JWT login
│   │   ├── users/                # User CRUD
│   │   ├── customers/            # Sample master CRUD (template)
│   │   ├── prisma/               # PrismaService global
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma         # 12 models · 11 enums
│   │   └── seed.ts               # Demo user + permissions + sample data
│   ├── database/
│   │   └── schema.sql            # Raw SQL DDL (tham khảo, mirror Prisma schema)
│   ├── .env.example
│   ├── package.json
│   └── README.md                 # Hướng dẫn setup BE riêng
│
├── Logistics-Hub-BaoGia.xlsx     # File báo giá dự án (4 sheet)
└── README.md                     # ← bạn đang ở đây
```

---

## 🏛️ Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Vue 3 SPA)                     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ LandingPage  │  │  LoginView   │  │  AppLayout       │  │
│  │   (public)   │  │   (public)   │  │  + 5 sub-views   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                             │
│   Pinia (auth)  ·  Vue Router  ·  Tailwind + shadcn-vue    │
└─────────────────────────────────────────────────────────────┘
                            │ JWT
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (NestJS 11 + TS)                   │
│                                                             │
│  ┌─────────┐ ┌────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │  Auth   │ │ Users  │ │Customers │ │ ... (8 modules)  │  │
│  └─────────┘ └────────┘ └──────────┘ └──────────────────┘  │
│                                                             │
│       JWT + Passport · class-validator · Swagger           │
│                            │                                │
│                            ▼                                │
│                    PrismaClient (ORM)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                      MySQL 8 (utf8mb4)
```

---

## 🧩 Tech Stack & Skills

### Frontend (`frontend/`)

| Tầng | Công nghệ | Mục đích |
|------|-----------|----------|
| **Framework** | Vue 3.5 + `<script setup>` + TypeScript strict | Component composition, type-safe |
| **Build** | Vite 8 | Hot reload, ESM, fast HMR |
| **Routing** | Vue Router 5 | History mode, route guards, lazy load |
| **State** | Pinia 2 | Auth store, reactive global state |
| **Styling** | Tailwind CSS 3 + CSS variables | Utility-first, dark mode tokens |
| **UI primitives** | shadcn-vue pattern + reka-ui (radix port) | Button, Dialog, Select, Popover, Tabs, DropdownMenu, Calendar, … |
| **Forms & validation** | Native + custom (inline) | DTO-shaped local refs |
| **Date** | `@internationalized/date` | Calendar / DateTimePicker |
| **Charts** | Chart.js 4 + vue-chartjs | Line / Bar / Doughnut + theme-aware |
| **Tables** | Custom (sticky cols + group headers + sort + pagination) | Grid 30+ cột giống Excel |
| **Notifications** | `vue-sonner` (Sonner toast) | Success / error / warning toasts |
| **Icons** | `lucide-vue-next` | 1000+ icons |
| **Animations** | CSS keyframes + Vue Transition | Fade-up, drift, shine, goo-loader |

### Backend (`backend/`)

| Tầng | Công nghệ | Mục đích |
|------|-----------|----------|
| **Framework** | NestJS 11 + TypeScript | Module / DI / decorators |
| **ORM** | Prisma 6 | Type-safe queries, auto migration |
| **DB** | MySQL 8 (InnoDB, utf8mb4) | Production-ready, supports FK + enums |
| **Auth** | `@nestjs/jwt` + Passport JWT | Bearer token authentication |
| **Validation** | `class-validator` + `class-transformer` | DTO validation pipes |
| **Docs** | `@nestjs/swagger` | OpenAPI auto-generated at `/docs` |
| **Hashing** | `bcrypt` | Password hash |
| **Config** | `@nestjs/config` + `dotenv` | Env-based config |

### Skills học được khi build dự án

- **Component architecture** — chia primitives (Button, Input...) vs business (PlanFormDialog, EvaluationDialog...)
- **Type-safe forms** — sync giữa form state local và DTO API
- **shadcn-vue pattern** — port của shadcn/ui (React) sang Vue dùng reka-ui
- **Tailwind dark mode** — CSS variables + `dark:` variant cho responsive theme
- **`defineModel` (Vue 3.4+)** — two-way binding gọn cho v-model trên component
- **Route guards** — public vs auth-required, redirect with `?redirect=`
- **Prisma schema mapping** — enum `@map`, table `@@map`, index, FK ON DELETE
- **JWT flow** — login → server sign JWT → client send Bearer → guard verify
- **Mock-first dev** — frontend chạy hoàn toàn với mock data, BE chỉ implement sau khi UX ổn
- **Mobile-first** — dual layout pattern (`hidden md:block` table + `md:hidden` card list)

---

## 🚦 Tính năng theo module

### 1. Landing page (`/`)
- Hero section dark navy + 3D SVG container stack (5 cont isometric)
- Stats bar (1.2K+ cont/tháng, 50+ xe, 99% đúng hẹn, 5 năm)
- Services 3 card với ảnh logistics thật
- Built on Trust split section
- Final CTA + port photo background
- Compact footer
- Luôn light mode (auto-restore preference khi rời)

### 2. Login (`/login`)
- Demo account: **`demo` / `demo123`**
- Goo dots loader xuất hiện khi login → dashboard
- Hero brand với gradient gold "HOANG / KHANG"

### 3. Dashboard (`/app/dashboard`)
- Gradient blue/navy hero banner với period selector (Hôm nay/Tuần/Tháng/Quý/Năm)
- 4 KPI cards với **sparkline SVG inline** (doanh thu/lệnh/cont/đúng hẹn)
- Line area chart 7 ngày + Doughnut với center label
- Top hãng tàu (stacked bar) + Top khách hàng (progress bar)
- Recent activity feed + Alerts với badge count
- Fleet status grid (5 xe theo trạng thái)

### 4. Điều Độ (`/app/dieu-do`)
- **Grid 40 cột** với sticky 2 cột đầu + sticky cột Actions phải
- Group headers màu: Vận hành (indigo) · Cược cont (rose) · Khai Eport (sky) · Công nợ (emerald) · Trọng lượng (violet) · Ghi chú (amber) · Đánh giá (fuchsia)
- **Filter bar compact**: search + date range pickers + popover advanced (KH/Hãng tàu/Tình trạng) + **Làm mới** (trigger LoadingScreen)
- Sort 6 cột + pagination
- 5 KPI cards modern với accent strip + tỷ lệ %
- **PlanFormDialog** (Add/Edit): 4 section (Thông tin / Container / Vận hành / Ghi chú) với DatePicker + DateTimePicker shadcn + dynamic container list (soCont + seal)
- **EvaluationDialog**: tabs ảnh / hóa đơn / remark, **lightbox xem ảnh full-size** với prev/next

### 5. Tài Xế (`/app/tai-xe`)
- Driver selector demo (switch giữa 3 tài xế mock)
- Job card mobile-first: route timeline + container detail + vehicle + thời gian (Cut off + Hoàn thành dự kiến)
- 4 nút action grid + nút **Nhập phiếu vận chuyển** (gold, full width)
- **TransportSlipDialog** — phiếu vận chuyển nhập chi phí 10 dòng (Hóa/Tạm ứng/Nâng hạ/Cầu đường/Bốc xếp/Căn cont/Khoán/Neo xe/Hàn mooc/Gửi cont) + tổng tự cộng + auto-fill từ job
- Footer card gọi điều độ trực

### 6. Kế Toán (`/app/ke-toan`)
- 4 KPI: Doanh thu / Chi phí / Lợi nhuận (margin %) / Công nợ
- Bar chart doanh thu vs chi phí theo khách hàng
- Filter + table financial 9 cột (responsive: card mobile)
- Pagination + Export Excel (mock)

### 7. Setting (`/app/settings?group=...`)
Gộp 2 tab top-level:
- **Master Data** (5 sub-tab):
  - Khách hàng (mã 0001-9999)
  - Tài xế (DR001+ với CCCD + bằng lái)
  - Vendor (6 loại: Cảng/Depot/Hãng tàu/Xăng dầu/Sửa chữa/Đối tác)
  - Tuyến VC (km + giờ + giá chuẩn)
  - Đầu xe (BKS + Mooc + tài xế gán)
- **User & Phân quyền**:
  - Danh sách user (avatar + role badge + status)
  - Ma trận role × 18 permission (toggle checkbox, save/reset)

---

## ⚙️ Quick start

### Prerequisites
- Node.js ≥ 20
- MySQL ≥ 8 (cho backend)
- Git

### 1. Frontend (mock data, không cần BE)

```powershell
cd frontend
npm install
npm run dev
# → http://localhost:5173 (hoặc 5174 nếu port chiếm)
```

Đăng nhập: **`demo` / `demo123`**

### 2. Backend (cần MySQL chạy local)

```powershell
cd backend
cp .env.example .env
# Sửa DATABASE_URL trong .env theo MySQL của bạn
# Tạo database:  CREATE DATABASE logistics_hub CHARACTER SET utf8mb4;

npm install
npm run prisma:generate
npm run prisma:migrate -- --name init   # Tạo schema
npm run db:seed                          # Seed permissions + demo user + sample data
npm run start:dev                        # → http://localhost:3001/api
# Swagger docs: http://localhost:3001/docs
```

### 3. Build production

```powershell
# Frontend
cd frontend
npm run build       # → dist/
npm run preview     # Test bản build

# Backend
cd backend
npm run build       # → dist/
npm run start:prod
```

---

## 🎨 Design system

### Color palette
- **Primary brand**: Gold/Amber (`from-amber-300 to-amber-700`) — logo HK, CTA chính
- **Surface light**: `bg-background` (white/near-white)
- **Surface dark**: `bg-card` + `#0a0e1a` cho hero sections
- **Accent tones (KPI cards, badges)**:
  - sky (xanh dương) — XUẤT lệnh, info
  - emerald — NHẬP, success, doanh thu
  - amber — chuyển tải, warning, brand
  - rose — destructive, chi phí, alerts
  - violet — Cont 20/40, dashboard
  - indigo — vận hành group

### Typography
- **Display font**: `Space Grotesk` (Google Fonts) — `.font-display` class
- **Body font**: `DM Sans` — body default
- Tracking: tight cho display, normal cho body
- Tabular nums cho số liệu thống kê

### Animations (`style.css` `kh-*` prefix)
- `kh-anim-fade-up` — entrance fade + slide-up (có `kh-delay-1..5` để stagger)
- `kh-anim-drift` — blob gradient di chuyển chậm
- `kh-anim-shine` — gradient gold quét chữ
- `kh-anim-float` — lơ lửng nhẹ
- `kh-anim-pulse-glow` — halo nhịp
- `kh-anim-grid-pan` — grid pattern trôi
- `prefers-reduced-motion` → tự tắt mọi animation

### Loading
- **LoadingScreen** dùng SVG **goo filter** + 3 dots morphing (Uiverse-inspired)
- Min duration 600ms để loader luôn hiện đủ thấy animation
- Chỉ trigger khi vào dashboard hoặc bấm "Làm mới" thủ công

---

## 🔐 Demo credentials

| Username | Password | Role     | Tên       |
|----------|----------|----------|-----------|
| `demo`   | `demo123`| Giám Đốc | Khải Hoàng|

Sau khi login → redirect `/app/dashboard`.

---

## 📚 Reference

- **shadcn-vue**: https://www.shadcn-vue.com
- **reka-ui (radix port)**: https://reka-ui.com
- **Tailwind**: https://tailwindcss.com
- **Vue 3**: https://vuejs.org
- **NestJS**: https://nestjs.com
- **Prisma**: https://www.prisma.io
- **Lucide icons**: https://lucide.dev
- **Landing page guide V2**: https://github.com/bear2u/my-skills/blob/master/skills/landing-page-guide-v2/SKILL.md
- **Goo loader**: Uiverse.io by Sourcesketch

---

## 🚧 Roadmap

- [ ] Wire FE → BE thật (axios wrapper + thay mock data bằng API call)
- [ ] Build các module BE còn thiếu: `drivers`, `vehicles`, `vendors`, `routes`, `shipping-lines`, `permissions`, `plans` (kèm containers + evaluations)
- [ ] Upload ảnh thật (multer + cloud storage S3/Cloudinary)
- [ ] Push notification cho tài xế khi điều độ assign
- [ ] PWA + offline support cho tài xế ở vùng yếu sóng
- [ ] Tích hợp GPS realtime tracking
- [ ] Native iOS/Android app (Capacitor wrapping)
- [ ] Tích hợp ERP Misa/Fast qua API
- [ ] Báo cáo PDF export

---

## 📄 License

Internal project for HoangKhang Logistics demo. © 2026.
