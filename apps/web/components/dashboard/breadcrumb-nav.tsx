"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  todos: "Todos",
  usage: "Usage",
  profile: "Profile",
  billing: "Billing",
  settings: "Settings",
  plans: "Plans",
  checkout: "Checkout",
  portal: "Portal",
  invoices: "Invoices",
};

export function BreadcrumbNav() {
  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return null; // Don't show breadcrumb on main dashboard
  }

  const segments = pathname.split("/").filter(Boolean);
  const items = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, href: index < segments.length - 1 ? href : undefined };
  });

  return <Breadcrumb items={items} className="mb-4" />;
}

