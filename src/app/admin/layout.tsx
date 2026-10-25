import React from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export const instant = false;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminShell>{children}</AdminShell>;
}
