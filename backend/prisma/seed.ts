import 'dotenv/config'
import { PrismaClient, UserRole } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const PERMISSIONS: Array<{ key: string; group: string; label: string }> = [
  { key: 'plan.view',       group: 'Kế hoạch',  label: 'Xem danh sách kế hoạch' },
  { key: 'plan.create',     group: 'Kế hoạch',  label: 'Tạo / chỉnh sửa kế hoạch' },
  { key: 'plan.assign',     group: 'Kế hoạch',  label: 'Điều phối tài xế cho lệnh' },
  { key: 'plan.delete',     group: 'Kế hoạch',  label: 'Xóa kế hoạch' },

  { key: 'cont.view',       group: 'Container', label: 'Xem trạng thái Cont' },
  { key: 'cont.update',     group: 'Container', label: 'Cập nhật ngoại quan + phương án' },
  { key: 'cont.cost',       group: 'Container', label: 'Quản lý chi phí vận hành Cont' },

  { key: 'driver.work',     group: 'Tài xế',    label: 'Xem công việc được giao' },
  { key: 'driver.update',   group: 'Tài xế',    label: 'Cập nhật trạng thái chuyến' },
  { key: 'driver.upload',   group: 'Tài xế',    label: 'Upload chứng từ + ảnh' },

  { key: 'fin.view',        group: 'Kế toán',   label: 'Xem tổng hợp chi phí / doanh thu' },
  { key: 'fin.edit',        group: 'Kế toán',   label: 'Chỉnh sửa chi phí + đối chiếu' },
  { key: 'fin.export',      group: 'Kế toán',   label: 'Export báo cáo kế toán' },

  { key: 'dashboard.view',  group: 'Báo cáo',   label: 'Xem dashboard tổng quan' },
  { key: 'report.detail',   group: 'Báo cáo',   label: 'Xem báo cáo chi tiết' },
  { key: 'report.export',   group: 'Báo cáo',   label: 'Export Excel báo cáo' },

  { key: 'user.manage',     group: 'Hệ thống',  label: 'Quản lý user' },
  { key: 'user.role',       group: 'Hệ thống',  label: 'Cấu hình phân quyền' },
]

// Note: Prisma enum uses TS-side identifiers (DieuDo, TaiXe...), not DB-mapped values
const ROLE_MATRIX: Record<UserRole, string[]> = {
  [UserRole.DieuDo]:  ['plan.view', 'plan.create', 'plan.assign', 'cont.view', 'cont.update', 'cont.cost', 'driver.work', 'dashboard.view'],
  [UserRole.TaiXe]:   ['driver.work', 'driver.update', 'driver.upload', 'cont.view'],
  [UserRole.KeToan]:  ['plan.view', 'cont.view', 'cont.cost', 'fin.view', 'fin.edit', 'fin.export', 'dashboard.view', 'report.detail', 'report.export'],
  [UserRole.GiamDoc]: PERMISSIONS.map((p) => p.key),
}

const SHIPPING_LINES = [
  'ANL', 'COSCO', 'MSC', 'OOCL', 'EBKG', 'YANG', 'HAPLOY', 'MAERSK', 'ONE',
]

const SAMPLE_CUSTOMERS = [
  { code: '0001', shortName: 'ACOM LB', name: 'Công ty TNHH ACOM Long Bình',
    address: 'Lô A4, KCN Long Bình, Biên Hòa, Đồng Nai', taxCode: '3600123456',
    contactPerson: 'Nguyễn Thị Hồng', phone: '0251-3987654', email: 'lb@acom.vn' },
  { code: '0002', shortName: 'ACOM BL', name: 'Công ty TNHH ACOM Bảo Lộc',
    address: '128 Trần Phú, Bảo Lộc, Lâm Đồng', taxCode: '5800234567',
    contactPerson: 'Trần Văn Hùng', phone: '0263-3855123', email: 'bl@acom.vn' },
  { code: '0003', shortName: 'OUTSPAN', name: 'Công ty OUTSPAN Việt Nam',
    address: 'KCN Thái Hòa, Đức Hòa, Long An', taxCode: '1100345678',
    contactPerson: 'James Carter', phone: '0272-3766789', email: 'vn@outspan.com' },
  { code: '0004', shortName: 'KC HÀ TĨNH', name: 'Công ty CP Khoáng sản Hà Tĩnh',
    address: '15 Lê Lợi, TP Hà Tĩnh', taxCode: '3000456789',
    contactPerson: 'Lê Văn Đức', phone: '0239-3854789', email: 'kchatinh@kc.vn' },
  { code: '0005', shortName: 'GOLDEN', name: 'Công ty TNHH Golden Trading',
    address: '88 Nguyễn Văn Linh, Q.7, TP HCM', taxCode: '0300567890',
    contactPerson: 'Phạm Thị Lan', phone: '028-37234567', email: 'sales@golden.vn' },
]

async function main() {
  console.log('🌱 Seeding database...')

  // 1) Permissions
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: { groupName: p.group, label: p.label },
      create: { key: p.key, groupName: p.group, label: p.label },
    })
  }
  console.log(`  ✓ ${PERMISSIONS.length} permissions`)

  // 2) Role × Permission matrix
  for (const role of Object.keys(ROLE_MATRIX) as UserRole[]) {
    for (const key of ROLE_MATRIX[role]) {
      await prisma.rolePermission.upsert({
        where: { role_permissionKey: { role, permissionKey: key } },
        update: { granted: true },
        create: { role, permissionKey: key, granted: true },
      })
    }
  }
  console.log(`  ✓ Role matrix`)

  // 3) Shipping lines
  for (const code of SHIPPING_LINES) {
    await prisma.shippingLine.upsert({
      where: { code },
      update: {},
      create: { code, name: code },
    })
  }
  console.log(`  ✓ ${SHIPPING_LINES.length} shipping lines`)

  // 4) Sample customers
  for (const c of SAMPLE_CUSTOMERS) {
    await prisma.customer.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    })
  }
  console.log(`  ✓ ${SAMPLE_CUSTOMERS.length} sample customers`)

  // 5) Demo user (matches FE login: demo / demo123)
  const demoUsername = process.env.DEMO_USERNAME ?? 'demo'
  const demoPassword = process.env.DEMO_PASSWORD ?? 'demo123'
  const hash = await bcrypt.hash(demoPassword, 10)

  await prisma.user.upsert({
    where: { username: demoUsername },
    update: { passwordHash: hash },
    create: {
      username: demoUsername,
      name: 'Khải Hoàng',
      email: 'khaihoang@logistics-hub.vn',
      phone: '0903 456 789',
      passwordHash: hash,
      role: UserRole.GiamDoc,
      status: 'active',
    },
  })
  console.log(`  ✓ Demo user: ${demoUsername} / ${demoPassword}`)

  console.log('✅ Seed completed.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
