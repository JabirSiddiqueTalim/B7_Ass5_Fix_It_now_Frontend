import { getRole } from "@/lib/api";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = (await getRole()) ?? "CUSTOMER";

  return <DashboardShell role={role}>{children}</DashboardShell>;
}
