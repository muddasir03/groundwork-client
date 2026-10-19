import type { Metadata } from "next";
import { TwoFactorManage, TwoFactorSetup } from "@/components/admin/TwoFactorSetup";
import { Container, PageHeader } from "@/components/layout/Page";
import { getTwoFactorStatus } from "@/lib/admin/dal";

export const metadata: Metadata = { title: "Security" };

// Reachable before two-factor is set up (it's where admins are sent to set it up).
export default async function TwoFactorPage() {
  const status = await getTwoFactorStatus(); // verifies the admin session first
  return (
    <Container>
      <PageHeader title="Security" description={status.enabled ? "How you log in to the admin area." : "One step before you can use the admin area."} />
      {status.enabled ? <TwoFactorManage status={status} /> : <TwoFactorSetup />}
    </Container>
  );
}
