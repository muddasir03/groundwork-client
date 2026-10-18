import type { Metadata } from "next";
import { getProfile, getProfileOptions } from "@/lib/api";
import { ProfileView } from "./ProfileView";

export const metadata: Metadata = { title: "Your profile" };

export default async function ProfilePage() {
  const [profile, options] = await Promise.all([getProfile(), getProfileOptions()]);
  return <ProfileView profile={profile} options={options} />;
}
