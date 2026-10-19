import type { Metadata } from "next";

// Every page under /admin (login and console) is kept out of search engines. Authentication is
// enforced per page and per action by the admin DAL (lib/admin/dal.ts), and again by the API.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · Groundwork" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
