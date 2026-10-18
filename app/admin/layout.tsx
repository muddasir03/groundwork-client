import type { Metadata } from "next";
import { AdminShell } from "@/components/layout/AdminShell";

// TODO(auth): the admin area must require an admin login before it shows real data.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · Groundwork" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
