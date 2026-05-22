'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Truck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-black mb-6 tracking-tight">
              مستقبل الخدمات اللوجستية
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              منصة Alam Express المتقدمة لإدارة الأساطيل والنقل الاحترافي في المملكة العربية السعودية
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="rounded-2xl px-8">
                  انضم كسائق
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="rounded-2xl px-8">
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">ميزات استثنائية</h2>
            <p className="text-gray-600 text-lg">تصميم مستوحى من Apple بأداء لا مثيل له</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'إدارة متقدمة',
                description: 'لوحة تحكم شاملة لإدارة السائقين والطلبات',
                icon: '📊',
              },
              {
                title: 'تتبع فوري',
                description: 'متابعة حية لجميع عمليات التسليم',
                icon: '📍',
              },
              {
                title: 'أمان عالي',
                description: 'حماية كاملة للبيانات والمعاملات',
                icon: '🔒',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-black text-white p-12 rounded-3xl"
          >
            <h2 className="text-4xl font-bold mb-4">ابدأ رحلتك اليوم</h2>
            <p className="text-gray-300 mb-8 text-lg">انضم إلى أكبر منصة لوجستية في المملكة</p>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="rounded-2xl px-8">
                سجل الآن مجاناً
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
