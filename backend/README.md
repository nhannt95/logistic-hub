# Logistics-Hub — Backend

NestJS + Prisma + MySQL backend cho hệ thống quản lý vận chuyển container Khải Hoàng Logistics.

## Stack

- **NestJS 11** — TypeScript framework với module/DI
- **Prisma 6** — ORM type-safe + migration
- **MySQL 8+** — Database
- **JWT + Passport** — Authentication
- **class-validator** — DTO validation
- **Swagger** — API docs auto generated

## Cấu trúc

```
backend/
├── prisma/
│   ├── schema.prisma         # Schema (source of truth khi dùng Prisma migrate)
│   └── seed.ts               # Seed permissions + role matrix + demo user
├── database/
│   └── schema.sql            # SQL raw (tham khảo nếu dùng MySQL CLI)
├── src/
│   ├── main.ts               # Bootstrap (CORS, validation, Swagger)
│   ├── app.module.ts
│   ├── prisma/               # PrismaService (global)
│   ├── auth/                 # JWT login + me
│   ├── users/                # User management
│   └── customers/            # Sample master CRUD (làm template cho 4 module còn lại)
├── .env.example
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

## Setup lần đầu

### 1. Tạo file `.env`

```bash
cp .env.example .env
```

Sửa `DATABASE_URL` cho phù hợp MySQL local:

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/logistics_hub"
```

### 2. Tạo database

```sql
CREATE DATABASE logistics_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Cài deps + sinh Prisma client

```bash
npm install
npm run prisma:generate
```

### 4. Tạo bảng — chọn 1 trong 2 cách:

**Cách A — Dùng Prisma migrate (khuyến nghị):**

```bash
npm run prisma:migrate -- --name init
```

Prisma sẽ tự tạo migration file + áp dụng lên DB.

**Cách B — Chạy schema.sql trực tiếp:**

```bash
mysql -u root -p logistics_hub < database/schema.sql
```

Sau đó cho Prisma biết schema đã sẵn sàng:

```bash
npm run prisma:push
```

### 5. Seed data (permissions + role matrix + shipping lines + 5 customers + demo user)

```bash
npm run db:seed
```

Demo account để FE login:

| Username | Password | Role |
|---|---|---|
| `demo` | `demo123` | Giám Đốc |

## Chạy dev server

```bash
npm run start:dev
```

- API: `http://localhost:3001/api`
- Swagger docs: `http://localhost:3001/docs`

## Endpoints đã sẵn sàng

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/auth/login` | — | Login lấy JWT |
| GET  | `/api/auth/me` | ✓ | Lấy thông tin user từ JWT |
| GET  | `/api/users` | ✓ | List user |
| GET  | `/api/users/:id` | ✓ | Chi tiết user |
| GET  | `/api/customers` | ✓ | List KH (phân trang + filter) |
| GET  | `/api/customers/:code` | ✓ | Chi tiết KH |
| POST | `/api/customers` | ✓ | Tạo KH |
| PUT  | `/api/customers/:code` | ✓ | Cập nhật KH |
| PATCH| `/api/customers/:code/toggle-status` | ✓ | Toggle active/inactive |
| DELETE| `/api/customers/:code` | ✓ | Xóa KH |

## Các module cần build tiếp (theo pattern customers)

- `drivers` — Master tài xế
- `vehicles` — Master đầu xe
- `vendors` — Master vendor
- `routes` — Master tuyến VC
- `shipping-lines` — Master hãng tàu
- `plans` — Kế hoạch điều độ (entity chính, kèm containers + evaluations)
- `permissions` — GET ma trận, PUT cập nhật role × permission

Mỗi module copy pattern từ `src/customers/` (DTO + Service + Controller + Module).

## Scripts chính

```bash
npm run start:dev       # Hot reload dev
npm run build           # Build production → dist/
npm run start:prod      # Chạy bản build
npm run prisma:studio   # GUI duyệt DB
npm run prisma:migrate  # Tạo + chạy migration mới
npm run db:seed         # Seed lại data
```

## Wire vào Frontend

Frontend (Vue) đã có sẵn auth store ở `frontend/src/stores/auth.ts`. Để gọi API thật:

1. Tạo `frontend/.env.local`:
   ```
   VITE_API_URL=http://localhost:3001/api
   ```
2. Tạo `frontend/src/lib/api.ts` axios wrapper bind JWT
3. Sửa `auth.login()` gọi `POST /api/auth/login` thật

(Sẽ làm tiếp ở pha integration FE/BE)
