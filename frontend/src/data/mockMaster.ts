export type Status = 'active' | 'inactive'

export const STATUS_LABEL: Record<Status, string> = {
  active: 'Đang hoạt động',
  inactive: 'Ngưng hoạt động',
}

// ====================== KHÁCH HÀNG ======================
export interface Customer {
  code: string          // 0001-9999
  name: string
  shortName: string
  address: string
  taxCode: string
  contactPerson: string
  phone: string
  email: string
  status: Status
  createdAt: string
}

export const mockCustomers: Customer[] = [
  {
    code: '0001', shortName: 'ACOM LB', name: 'Công ty TNHH ACOM Long Bình',
    address: 'Lô A4, KCN Long Bình, Biên Hòa, Đồng Nai',
    taxCode: '3600123456', contactPerson: 'Nguyễn Thị Hồng', phone: '0251-3987654',
    email: 'lb@acom.vn', status: 'active', createdAt: '2025-08-15',
  },
  {
    code: '0002', shortName: 'ACOM BL', name: 'Công ty TNHH ACOM Bảo Lộc',
    address: '128 Trần Phú, Bảo Lộc, Lâm Đồng',
    taxCode: '5800234567', contactPerson: 'Trần Văn Hùng', phone: '0263-3855123',
    email: 'bl@acom.vn', status: 'active', createdAt: '2025-09-10',
  },
  {
    code: '0003', shortName: 'OUTSPAN', name: 'Công ty OUTSPAN Việt Nam',
    address: 'KCN Thái Hòa, Đức Hòa, Long An',
    taxCode: '1100345678', contactPerson: 'James Carter', phone: '0272-3766789',
    email: 'vn@outspan.com', status: 'active', createdAt: '2025-09-20',
  },
  {
    code: '0004', shortName: 'KC HÀ TĨNH', name: 'Công ty CP Khoáng sản Hà Tĩnh',
    address: '15 Lê Lợi, TP Hà Tĩnh',
    taxCode: '3000456789', contactPerson: 'Lê Văn Đức', phone: '0239-3854789',
    email: 'kchatinh@kc.vn', status: 'active', createdAt: '2025-11-05',
  },
  {
    code: '0005', shortName: 'GOLDEN', name: 'Công ty TNHH Golden Trading',
    address: '88 Nguyễn Văn Linh, Q.7, TP HCM',
    taxCode: '0300567890', contactPerson: 'Phạm Thị Lan', phone: '028-37234567',
    email: 'sales@golden.vn', status: 'active', createdAt: '2026-01-12',
  },
  {
    code: '0006', shortName: 'TRANSIMEX', name: 'Công ty CP Transimex',
    address: 'KCN Sóng Thần, Dĩ An, Bình Dương',
    taxCode: '0301678901', contactPerson: 'Hoàng Minh Quân', phone: '0274-3789012',
    email: 'contact@transimex.com.vn', status: 'inactive', createdAt: '2025-06-20',
  },
  {
    code: '0007', shortName: 'NEW JB', name: 'New JB Logistics Co.',
    address: '256 Võ Văn Kiệt, Q.5, TP HCM',
    taxCode: '0302789012', contactPerson: 'Nguyễn Đức Anh', phone: '028-39876543',
    email: 'info@newjb.com', status: 'active', createdAt: '2026-02-18',
  },
]

// ====================== TÀI XẾ ======================
export type LicenseClass = 'B2' | 'C' | 'D' | 'E' | 'FC'

export interface Driver {
  code: string          // DR001-DR999
  name: string
  phone: string
  cccd: string
  license: string
  licenseClass: LicenseClass
  licenseExpiry: string
  address: string
  assignedVehicle: string  // mã đầu xe đang lái (XE001…)
  status: Status
  hiredAt: string
}

export const mockDrivers: Driver[] = [
  {
    code: 'DR001', name: 'Nguyễn Văn A', phone: '0901 222 333',
    cccd: '079091012345', license: 'B7-123456', licenseClass: 'FC',
    licenseExpiry: '2028-06-15', address: 'Q. Tân Phú, TP HCM',
    assignedVehicle: 'XE001', status: 'active', hiredAt: '2026-02-20',
  },
  {
    code: 'DR002', name: 'Nguyễn Văn B', phone: '0934 555 777',
    cccd: '079091023456', license: 'B7-234567', licenseClass: 'FC',
    licenseExpiry: '2027-11-20', address: 'Q. Bình Tân, TP HCM',
    assignedVehicle: 'XE002', status: 'active', hiredAt: '2026-03-01',
  },
  {
    code: 'DR003', name: 'Nguyễn Văn C', phone: '0938 444 555',
    cccd: '079091034567', license: 'B7-345678', licenseClass: 'FC',
    licenseExpiry: '2026-08-10', address: 'H. Bình Chánh, TP HCM',
    assignedVehicle: 'XE003', status: 'inactive', hiredAt: '2026-03-05',
  },
]

// ====================== VENDOR ======================
export type VendorType = 'port' | 'depot' | 'shipping' | 'fuel' | 'maintenance' | 'partner'

export const VENDOR_TYPE_LABEL: Record<VendorType, string> = {
  port: 'Cảng / Terminal',
  depot: 'Depot Cont rỗng',
  shipping: 'Hãng tàu',
  fuel: 'Xăng dầu',
  maintenance: 'Sửa chữa - Bảo dưỡng',
  partner: 'Đối tác vận tải',
}

export interface Vendor {
  code: string          // VD001
  name: string
  type: VendorType
  contactPerson: string
  phone: string
  email: string
  address: string
  taxCode: string
  status: Status
  createdAt: string
}

export const mockVendors: Vendor[] = [
  {
    code: 'VD001', name: 'Cảng Cát Lái', type: 'port',
    contactPerson: 'Phòng Khai thác', phone: '028-37422222', email: 'catlai@saigonport.vn',
    address: '1295B Nguyễn Thị Định, Q.2, TP HCM',
    taxCode: '0300123456', status: 'active', createdAt: '2025-08-01',
  },
  {
    code: 'VD002', name: 'Cảng SP-ITC', type: 'port',
    contactPerson: 'Phòng KD', phone: '028-37425555', email: 'info@spitc.vn',
    address: '1080 Đường Liên cảng A5, Q.7, TP HCM',
    taxCode: '0301234567', status: 'active', createdAt: '2025-08-01',
  },
  {
    code: 'VD003', name: 'Depot Tân Cảng', type: 'depot',
    contactPerson: 'Anh Tuấn', phone: '028-37666999', email: 'depot@tancang.vn',
    address: 'KCN Cát Lái, Q.2, TP HCM',
    taxCode: '0302345678', status: 'active', createdAt: '2025-09-15',
  },
  {
    code: 'VD004', name: 'ANL Container Line', type: 'shipping',
    contactPerson: 'Sales VN', phone: '028-39115555', email: 'sales.vn@anl.com',
    address: 'Saigon Centre, Q.1, TP HCM',
    taxCode: '0303456789', status: 'active', createdAt: '2025-09-20',
  },
  {
    code: 'VD005', name: 'Petrolimex Tân Thuận', type: 'fuel',
    contactPerson: 'Trạm trưởng', phone: '028-37226677', email: 'tt@petrolimex.vn',
    address: '180 Huỳnh Tấn Phát, Q.7, TP HCM',
    taxCode: '0304567890', status: 'active', createdAt: '2025-10-05',
  },
  {
    code: 'VD006', name: 'Garage Trường Thành', type: 'maintenance',
    contactPerson: 'Anh Bình', phone: '0938 123 456', email: 'truongthanh@gmail.com',
    address: 'KCN Cát Lái, Q.2, TP HCM',
    taxCode: '0305678901', status: 'active', createdAt: '2026-01-10',
  },
  {
    code: 'VD007', name: 'Vận tải Hoàng Anh', type: 'partner',
    contactPerson: 'Anh Sơn', phone: '0908 777 888', email: 'hoanganh.tr@gmail.com',
    address: 'KCN Sóng Thần, Bình Dương',
    taxCode: '0306789012', status: 'inactive', createdAt: '2026-02-15',
  },
]

// ====================== TUYẾN VẬN CHUYỂN ======================
export interface Route {
  code: string          // RT001
  from: string
  to: string
  distance: number      // km
  estimatedHours: number
  standardPrice: number // VND chuẩn 1 chuyến
  note: string
  status: Status
}

export const mockRoutes: Route[] = [
  {
    code: 'RT001', from: 'LONG BÌNH', to: 'ĐỒNG NAI',
    distance: 35, estimatedHours: 2, standardPrice: 1800000,
    note: 'Tuyến nội tỉnh, đường tốt', status: 'active',
  },
  {
    code: 'RT002', from: 'CÁT LÁI', to: 'OUT SPAN (THÁI HÒA)',
    distance: 65, estimatedHours: 3.5, standardPrice: 2800000,
    note: 'Qua cao tốc TP HCM - Trung Lương', status: 'active',
  },
  {
    code: 'RT003', from: 'SP ITC', to: 'OUTSPAN',
    distance: 70, estimatedHours: 4, standardPrice: 3000000,
    note: '', status: 'active',
  },
  {
    code: 'RT004', from: 'BẢO LỘC', to: 'CÁT LÁI',
    distance: 195, estimatedHours: 6, standardPrice: 5500000,
    note: 'Đường đèo, tài xế hạng FC kinh nghiệm', status: 'active',
  },
  {
    code: 'RT005', from: 'BẢO LỘC', to: 'TRANSIMEX',
    distance: 205, estimatedHours: 6.5, standardPrice: 5800000,
    note: '', status: 'active',
  },
  {
    code: 'RT006', from: 'LONG BÌNH', to: 'CÁT LÁI GIANG NAM',
    distance: 28, estimatedHours: 1.5, standardPrice: 1500000,
    note: '', status: 'active',
  },
  {
    code: 'RT007', from: 'CÁT LÁI', to: 'LÂM ĐỒNG',
    distance: 250, estimatedHours: 8, standardPrice: 6500000,
    note: 'Tuyến dài, có khả năng tăng giá theo mùa', status: 'active',
  },
  {
    code: 'RT008', from: 'CÁT LÁI', to: 'RẠCH BẮP',
    distance: 45, estimatedHours: 2.5, standardPrice: 2200000,
    note: '', status: 'active',
  },
  {
    code: 'RT009', from: 'LONG BÌNH', to: 'GIA LAI',
    distance: 480, estimatedHours: 14, standardPrice: 12500000,
    note: 'Tuyến đêm, 2 tài xế thay phiên', status: 'active',
  },
  {
    code: 'RT010', from: 'BẢO LỘC', to: 'OUTSPAN',
    distance: 220, estimatedHours: 7, standardPrice: 6000000,
    note: '', status: 'inactive',
  },
]

// ====================== ĐẦU XE ======================
export type VehicleStatus = 'active' | 'inactive' | 'maintenance'

export const VEHICLE_STATUS_LABEL: Record<VehicleStatus, string> = {
  active: 'Đang hoạt động',
  inactive: 'Ngưng hoạt động',
  maintenance: 'Đang bảo dưỡng',
}

export interface Vehicle {
  code: string         // XE001
  plateNumber: string  // 51C-12345
  manufacturer: string
  model: string
  year: number
  capacity: '20' | '40' | 'mixed'
  mooc: string         // mooc gắn cố định
  assignedDriver: string  // mã tài xế đang lái
  insuranceExpiry: string
  registrationExpiry: string
  status: VehicleStatus
  registeredAt: string
}

export const mockVehicles: Vehicle[] = [
  {
    code: 'XE001', plateNumber: '51C-12345', manufacturer: 'Hino', model: 'SS1EKVA',
    year: 2022, capacity: 'mixed', mooc: 'R-9876',
    assignedDriver: 'DR001',
    insuranceExpiry: '2027-03-15', registrationExpiry: '2026-08-20',
    status: 'active', registeredAt: '2022-01-10',
  },
  {
    code: 'XE002', plateNumber: '51C-67890', manufacturer: 'Hyundai', model: 'HD700',
    year: 2021, capacity: '40', mooc: 'R-1122',
    assignedDriver: 'DR002',
    insuranceExpiry: '2027-01-08', registrationExpiry: '2026-11-15',
    status: 'active', registeredAt: '2021-05-22',
  },
  {
    code: 'XE003', plateNumber: '51C-22334', manufacturer: 'Howo', model: 'A7',
    year: 2020, capacity: 'mixed', mooc: 'R-5566',
    assignedDriver: 'DR003',
    insuranceExpiry: '2026-12-30', registrationExpiry: '2027-04-10',
    status: 'maintenance', registeredAt: '2020-08-15',
  },
  {
    code: 'XE004', plateNumber: '51C-55667', manufacturer: 'Hino', model: 'SS2P',
    year: 2023, capacity: '40', mooc: 'R-7788',
    assignedDriver: '',
    insuranceExpiry: '2028-02-20', registrationExpiry: '2027-09-15',
    status: 'active', registeredAt: '2023-03-12',
  },
  {
    code: 'XE005', plateNumber: '51C-99001', manufacturer: 'Isuzu', model: 'EXR',
    year: 2019, capacity: '20', mooc: 'R-3344',
    assignedDriver: '',
    insuranceExpiry: '2026-09-15', registrationExpiry: '2026-06-30',
    status: 'inactive', registeredAt: '2019-11-08',
  },
]
