import { AdminShell } from "@/components/layout/AdminShell";

// The frame only. It deliberately does no auth check: layouts don't re-run on navigation, so every
// page and server action verifies the session itself (verifyAdmin in lib/admin/dal.ts).
export default function AdminConsoleLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
