# Deploy frontend lên GitHub Pages

Workflow tự động build + deploy frontend lên GitHub Pages mỗi khi push lên branch `main`.

URL khi triển khai xong: **https://nhannt95.github.io/logistic-hub/**

---

## Lần đầu setup (làm 1 lần)

### 1. Enable GitHub Pages trong repo settings

1. Vào https://github.com/nhannt95/logistic-hub/settings/pages
2. Mục **Build and deployment** → **Source** → chọn **GitHub Actions**
3. Lưu (Save)

### 2. Push code lên main

```powershell
cd d:\Project\Logistic-Hub
git add .
git commit -m "feat: setup GitHub Pages deployment"
git push origin main
```

Workflow `.github/workflows/deploy.yml` sẽ tự chạy. Theo dõi tại:
https://github.com/nhannt95/logistic-hub/actions

Sau ~2-3 phút build + deploy xong, site sẽ live tại:
**https://nhannt95.github.io/logistic-hub/**

---

## Cách hoạt động

### Vite base path
[vite.config.ts](frontend/vite.config.ts) đọc env `GITHUB_PAGES`:
- Build với `GITHUB_PAGES=true` → `base: '/logistic-hub/'` (cho GitHub Pages)
- Dev local → `base: '/'` (như cũ)

### Vue Router base
[router/index.ts](frontend/src/router/index.ts) dùng `import.meta.env.BASE_URL` để tự match base path Vite. Routes tự thêm prefix `/logistic-hub/` khi deploy.

### SPA fallback
GitHub Pages không biết về SPA routes (`/app/dashboard`, `/login`…). Workflow copy `dist/index.html` → `dist/404.html` để mọi route trả về 404 đều render SPA, vue-router xử lý.

---

## Lưu ý

### Backend không deploy lên Pages
- GitHub Pages chỉ host **static files** — không chạy được NestJS
- Frontend hiện chạy hoàn toàn với **mock data** (`src/data/*`) — không gọi API
- Khi cần BE thật, deploy NestJS lên Railway/Render/Fly.io, sửa `auth.ts` + tạo axios wrapper gọi API thật

### Limit của GitHub Pages
- Repo public hoặc Pro plan
- Bandwidth 100 GB/tháng
- Build time 10 phút/lần
- Quy mô file 1 GB

Với app này (~250 KB gzip), thừa sức free tier.

### Branch protection
Workflow chỉ trigger khi push thay đổi vào `frontend/**` hoặc `.github/workflows/deploy.yml`. Push thay đổi ở `backend/` hoặc `README.md` sẽ KHÔNG re-deploy → tiết kiệm Actions minutes.

### Trigger thủ công
Vào **Actions** tab → chọn workflow "Deploy frontend to GitHub Pages" → bấm **Run workflow** (workflow_dispatch).

---

## Kiểm tra local trước khi push

```powershell
cd frontend
$env:GITHUB_PAGES = "true"
npm run build
npm run preview
# Preview tại http://localhost:4173/logistic-hub/
```

Test xem:
- Landing page render đúng
- Click "Đăng nhập" → URL chuyển sang `/logistic-hub/login`
- Login `demo/demo123` → vào `/logistic-hub/app/dashboard`
- Refresh trang trong app → vẫn ở đúng route (nhờ 404.html fallback)

Nếu OK local, push lên main là done.

---

## Troubleshooting

### "404 — File not found" sau khi deploy
- Check Settings → Pages → Source phải là **GitHub Actions** (không phải Deploy from branch)
- Check workflow logs xem có lỗi không

### Assets không load (404 cho JS/CSS)
- Có nghĩa `base` Vite chưa đúng
- Kiểm tra `GITHUB_PAGES=true` env có set trong workflow không
- Hard refresh browser (Ctrl + Shift + R) để clear cache

### Route bị 404 khi refresh
- `dist/404.html` chưa được copy → check step "SPA 404 fallback" trong workflow

### Spline 3D không hiện
- CDN Spline có thể block bởi mạng nội bộ → check Console F12
- Hard refresh sau khi deploy lần đầu (cache)
