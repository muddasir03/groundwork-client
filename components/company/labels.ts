import type { CompanySize } from "@/lib/api/types";

export const companySizeLabel: Record<CompanySize, string> = {
  "1-50": "1–50 employees",
  "51-200": "51–200 employees",
  "201-1000": "201–1,000 employees",
  "1000+": "1,000+ employees",
};
