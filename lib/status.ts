// Labels and badge tones for statuses. One mapping, used on every screen (see docs/DESIGN.md).
import type { BadgeTone } from "@/components/ui/Badge";
import type { AdminCompanyStatus, ShortlistStatus } from "@/lib/api/types";

export const shortlistStatuses: ShortlistStatus[] = ["researching", "contacted", "applied", "interviewing"];

export const shortlistStatusLabel: Record<ShortlistStatus, string> = {
  researching: "Researching",
  contacted: "Contacted",
  applied: "Applied",
  interviewing: "Interviewing",
};

export const shortlistStatusTone: Record<ShortlistStatus, BadgeTone> = {
  researching: "neutral",
  contacted: "primary",
  applied: "warning",
  interviewing: "success",
};

export const adminStatusLabel: Record<AdminCompanyStatus, string> = {
  draft: "Draft",
  researching: "Researching",
  in_review: "In review",
  published: "Published",
};

export const adminStatusTone: Record<AdminCompanyStatus, BadgeTone> = {
  draft: "neutral",
  researching: "primary",
  in_review: "warning",
  published: "success",
};
