import type { Metadata } from "next";
import { listComparisons } from "@/lib/api";
import { CompareView } from "./CompareView";

export const metadata: Metadata = { title: "Compare" };

export default async function ComparePage() {
  return <CompareView companies={await listComparisons()} />;
}
