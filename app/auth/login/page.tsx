"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, Lock, User, AlertCircle, Eye, EyeOff, Shield, UserPlus } from "lucide-react";
import Image from "next/image";
import { Input } from "@/app/components/Input";

// Orange and Dark Blue Theme
const themeColors = {
  darkBlue: "#082f49",
  orange: "#f97316",
  orange2: "#fb923c",
  lightOrange: "#fed7aa",
};

type FormFields = "username" | "password";

type FieldErrors = Partial<Record<FormFields, string>>;

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/super-admin/login");
  }, [router]);
  return null;
}
