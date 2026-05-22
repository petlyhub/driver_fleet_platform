export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
  app: {
    name: 'Alam Express',
    description: 'Premium Logistics & Fleet Management Platform',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

export const CITIES = [
  'الرياض',
  'جدة',
  'مكة',
  'المدينة',
  'الدمام',
  'الخبر',
  'الطائف',
  'أبها',
  'القصيم',
  'تبوك',
] as const;

export const VEHICLE_TYPES = [
  'سيارة',
  'دباب',
  'فان',
  'شاحنة صغيرة',
] as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد المراجعة',
  under_review: 'تحت المراجعة',
  approved: 'مقبول',
  rejected: 'مرفوض',
};

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};
