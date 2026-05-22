"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Truck className="h-8 w-8" />
            <span className="text-xl font-bold">Alam Express</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
              المميزات
            </Link>
            <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              كيف يعمل
            </Link>
            <Link href="/#coverage" className="text-muted-foreground hover:text-foreground transition-colors">
              التغطية
            </Link>
            <Link href="/auth/register">
              <Button variant="default" size="sm">
                انضم كسائق
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                دخول
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t"
            >
              <div className="flex flex-col space-y-4">
                <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  المميزات
                </Link>
                <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  كيف يعمل
                </Link>
                <Link href="/#coverage" className="text-muted-foreground hover:text-foreground transition-colors">
                  التغطية
                </Link>
                <Link href="/auth/register">
                  <Button variant="default" className="w-full">
                    انضم كسائق
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    تسجيل الدخول
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
