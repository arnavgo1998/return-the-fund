import type { HolderId } from "../model/company";

export const NAMES: Record<HolderId, string> = { you: "You", founders: "Founders", a: "Series A", b: "Series B" };
export const COLOR: Record<HolderId | "ink", string> = {
  you: "var(--you)", founders: "var(--founders)", a: "var(--a)", b: "var(--b)", ink: "var(--ink)",
};
