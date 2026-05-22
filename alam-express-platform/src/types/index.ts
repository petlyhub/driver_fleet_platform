export interface Driver {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  city: string;
  region: string;
  district?: string;
  vehicleType: 'سيارة' | 'دباب' | 'فان' | 'شاحنة صغيرة';
  vehicleModel: string;
  vehiclePlateNumber: string;
  vehicleYear: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  createdAt: string;
}

export interface DashboardStats {
  totalDrivers: number;
  pendingCount: number;
  underReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    role: 'admin' | 'driver';
  } | null;
}

export type City = 'الرياض' | 'جدة' | 'مكة' | 'المدينة' | 'الدمام' | 'الخبر' | 'الطائف' | 'أبها' | 'القصيم' | 'تبوك';
export type VehicleType = 'سيارة' | 'دباب' | 'فان' | 'شاحنة صغيرة';
