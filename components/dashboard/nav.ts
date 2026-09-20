export interface NavLink {
  href: string;
  label: string;
}

export const navByRole: Record<string, NavLink[]> = {
  CUSTOMER: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/bookings", label: "Bookings" },
    { href: "/dashboard/payments", label: "Payments" },
  ],
  TECHNICIAN: [
    { href: "/technician-dashboard", label: "Overview" },
    { href: "/technician-dashboard/profile", label: "Profile" },
    { href: "/technician-dashboard/availability", label: "Availability" },
    { href: "/technician-dashboard/services", label: "Services" },
    { href: "/technician-dashboard/bookings", label: "Bookings" },
  ],
  ADMIN: [
    { href: "/admin-dashboard", label: "Overview" },
    { href: "/admin-dashboard/profile", label: "Profile" },
    { href: "/admin-dashboard/users", label: "Users" },
    { href: "/admin-dashboard/bookings", label: "Bookings" },
    { href: "/admin-dashboard/categories", label: "Categories" },
  ],
};

export const sectionLabel: Record<string, string> = {
  CUSTOMER: "My book",
  TECHNICIAN: "Workshop",
  ADMIN: "Operations",
};

const titles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/bookings": "Bookings",
  "/dashboard/payments": "Payments",
  "/technician-dashboard": "Overview",
  "/technician-dashboard/profile": "Profile",
  "/technician-dashboard/availability": "Availability",
  "/technician-dashboard/services": "Services",
  "/technician-dashboard/bookings": "Bookings",
  "/admin-dashboard": "Overview",
  "/admin-dashboard/users": "Users",
  "/admin-dashboard/bookings": "Bookings",
  "/admin-dashboard/categories": "Categories",
};

export function sectionTitle(pathname: string): string {
  return titles[pathname] ?? "Workspace";
}

export function breadcrumb(pathname: string): string {
  if (pathname.startsWith("/technician-dashboard")) return "WS · TECH";
  if (pathname.startsWith("/admin-dashboard")) return "WS · ADMIN";
  return "WS · CLIENT";
}
