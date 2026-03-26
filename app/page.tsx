"use client";

import Link from "next/link";
import { LogIn, UserPlus, Shield } from "lucide-react";
import { colors } from "@/app/config/colors";
import Navbar from "./components/Navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: colors.secondary[500] }}
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Super Admin Portal
          </h1>
          <p className="text-lg text-neutral-600 mb-2">
            Secure Authentication System
          </p>
          <p className="text-neutral-500">
            Professional login and signup experience
          </p>
        </div>

        {/* Auth Cards Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Login Card */}
          <Link href="/auth/login">
            <div
              className="group cursor-pointer rounded-2xl shadow-lazy p-8 bg-white border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              style={{ borderColor: colors.primary[200] }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: colors.primary[100] }}
              >
                <LogIn className="w-6 h-6" style={{ color: colors.primary[600] }} />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Log In
              </h2>
              <p className="text-neutral-600 mb-4">
                Access your super admin account with secure credentials
              </p>
              <div
                className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all"
                style={{ color: colors.primary[600] }}
              >
                Get Started
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Signup Card */}
          <Link href="/super-admin/signup">
            <div
              className="group cursor-pointer rounded-2xl shadow-lazy p-8 bg-white border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              style={{ borderColor: colors.secondary[400] }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: colors.secondary[50] }}
              >
                <UserPlus className="w-6 h-6" style={{ color: colors.secondary[600] }} />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Create Account
              </h2>
              <p className="text-neutral-600 mb-4">
                Register a new super admin account with validation
              </p>
              <div
                className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all"
                style={{ color: colors.secondary[600] }}
              >
                Sign Up Now
                <span>→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-neutral-100">
          <h3 className="text-xl font-bold text-neutral-900 mb-6">Features</h3>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: colors.primary[100] }}
              >
                <span style={{ color: colors.primary[600] }}>✓</span>
              </div>
              <span className="text-neutral-700">
                <strong>Secure Authentication:</strong> Password validation and confirmation
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: colors.primary[100] }}
              >
                <span style={{ color: colors.primary[600] }}>✓</span>
              </div>
              <span className="text-neutral-700">
                <strong>Modern UI Design:</strong> Built with shadcn/ui and Tailwind CSS
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: colors.primary[100] }}
              >
                <span style={{ color: colors.primary[600] }}>✓</span>
              </div>
              <span className="text-neutral-700">
                <strong>Icon Integration:</strong> Lucide React icons for better UX
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: colors.primary[100] }}
              >
                <span style={{ color: colors.primary[600] }}>✓</span>
              </div>
              <span className="text-neutral-700">
                <strong>Responsive Design:</strong> Works perfectly on all devices
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: colors.primary[100] }}
              >
                <span style={{ color: colors.primary[600] }}>✓</span>
              </div>
              <span className="text-neutral-700">
                <strong>Custom Color Palette:</strong> Professional color scheme
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-neutral-600">
          <p>© 2024 Super Admin Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
