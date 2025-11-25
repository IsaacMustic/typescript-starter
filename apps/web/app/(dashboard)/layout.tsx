"use client";

import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 w-full min-w-0">
        <BreadcrumbNav />
        {children}
      </main>
    </div>
  );
}
