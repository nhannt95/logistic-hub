export type UserRole = 'Điều Độ' | 'Tài Xế' | 'Kế Toán' | 'Giám Đốc'
export type UserStatus = 'active' | 'locked'

export interface AppUser {
  id: string
  name: string
  username: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  lastLoginAt: string | null
  createdAt: string
}

export const ROLE_LIST: UserRole[] = ['Điều Độ', 'Tài Xế', 'Kế Toán', 'Giám Đốc']

export const mockUsers: AppUser[] = [
  {
    id: '1',
    name: 'Hoàng Khang',
    username: 'hoangkhang',
    email: 'hoangkhang@logistics-hub.vn',
    phone: '0903 456 789',
    role: 'Giám Đốc',
    status: 'active',
    lastLoginAt: '2026-05-12T08:42:00',
    createdAt: '2025-12-01',
  },
  {
    id: '2',
    name: 'Trần Thị Mai',
    username: 'mai.tt',
    email: 'mai.tt@logistics-hub.vn',
    phone: '0912 345 678',
    role: 'Điều Độ',
    status: 'active',
    lastLoginAt: '2026-05-12T09:15:00',
    createdAt: '2026-01-10',
  },
  {
    id: '3',
    name: 'Lê Quốc Bình',
    username: 'binh.lq',
    email: 'binh.lq@logistics-hub.vn',
    phone: '0987 654 321',
    role: 'Điều Độ',
    status: 'active',
    lastLoginAt: '2026-05-11T16:20:00',
    createdAt: '2026-01-15',
  },
  {
    id: '4',
    name: 'Nguyễn Văn A',
    username: 'nguyen.a',
    email: 'nguyen.a@logistics-hub.vn',
    phone: '0901 222 333',
    role: 'Tài Xế',
    status: 'active',
    lastLoginAt: '2026-05-12T06:30:00',
    createdAt: '2026-02-20',
  },
  {
    id: '5',
    name: 'Nguyễn Văn B',
    username: 'nguyen.b',
    email: 'nguyen.b@logistics-hub.vn',
    phone: '0934 555 777',
    role: 'Tài Xế',
    status: 'active',
    lastLoginAt: '2026-05-11T20:10:00',
    createdAt: '2026-03-01',
  },
  {
    id: '6',
    name: 'Nguyễn Văn C',
    username: 'nguyen.c',
    email: 'nguyen.c@logistics-hub.vn',
    phone: '0938 444 555',
    role: 'Tài Xế',
    status: 'locked',
    lastLoginAt: '2026-04-28T10:00:00',
    createdAt: '2026-03-05',
  },
]

export interface Permission {
  key: string
  group: string
  label: string
  description?: string
}

export const PERMISSIONS: Permission[] = [
  { key: 'plan.view', group: 'Kế hoạch', label: 'Xem danh sách kế hoạch' },
  { key: 'plan.create', group: 'Kế hoạch', label: 'Tạo / chỉnh sửa kế hoạch' },
  { key: 'plan.assign', group: 'Kế hoạch', label: 'Điều phối tài xế cho lệnh' },
  { key: 'plan.delete', group: 'Kế hoạch', label: 'Xóa kế hoạch' },

  { key: 'cont.view', group: 'Container', label: 'Xem trạng thái Cont' },
  { key: 'cont.update', group: 'Container', label: 'Cập nhật ngoại quan + phương án' },
  { key: 'cont.cost', group: 'Container', label: 'Quản lý chi phí vận hành Cont' },

  { key: 'driver.work', group: 'Tài xế', label: 'Xem công việc được giao' },
  { key: 'driver.update', group: 'Tài xế', label: 'Cập nhật trạng thái chuyến' },
  { key: 'driver.upload', group: 'Tài xế', label: 'Upload chứng từ + ảnh' },

  { key: 'fin.view', group: 'Kế toán', label: 'Xem tổng hợp chi phí / doanh thu' },
  { key: 'fin.edit', group: 'Kế toán', label: 'Chỉnh sửa chi phí + đối chiếu' },
  { key: 'fin.export', group: 'Kế toán', label: 'Export báo cáo kế toán' },

  { key: 'dashboard.view', group: 'Báo cáo', label: 'Xem dashboard tổng quan' },
  { key: 'report.detail', group: 'Báo cáo', label: 'Xem báo cáo chi tiết' },
  { key: 'report.export', group: 'Báo cáo', label: 'Export Excel báo cáo' },

  { key: 'user.manage', group: 'Hệ thống', label: 'Quản lý user' },
  { key: 'user.role', group: 'Hệ thống', label: 'Cấu hình phân quyền' },
]

export const PERMISSION_MATRIX: Record<UserRole, Set<string>> = {
  'Điều Độ': new Set([
    'plan.view', 'plan.create', 'plan.assign',
    'cont.view', 'cont.update', 'cont.cost',
    'driver.work',
    'dashboard.view',
  ]),
  'Tài Xế': new Set([
    'driver.work', 'driver.update', 'driver.upload',
    'cont.view',
  ]),
  'Kế Toán': new Set([
    'plan.view',
    'cont.view', 'cont.cost',
    'fin.view', 'fin.edit', 'fin.export',
    'dashboard.view', 'report.detail', 'report.export',
  ]),
  'Giám Đốc': new Set(PERMISSIONS.map((p) => p.key)),
}
