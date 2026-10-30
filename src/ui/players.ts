import type { HolderId } from "../model/company";

/** Alex leads Series A and Blake leads Series B; the round stays in the name so nobody has to remember which. */
export const NAMES: Record<HolderId, string> = { you: "You", founders: "Founders", a: "Alex (Series A)", b: "Blake (Series B)" };
export const SHORT: Record<HolderId, string> = { you: "You", founders: "Founders", a: "Alex", b: "Blake" };
export const COLOR: Record<HolderId | "ink", string> = {
  you: "var(--you)", founders: "var(--founders)", a: "var(--a)", b: "var(--b)", ink: "var(--ink)",
};
