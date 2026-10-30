import type { ReactNode } from "react";
import styles from "./ui.module.css";

const CHIPS = {
  E: { name: "E, the sale price", color: "var(--ink)" },
  F: { name: "F, the fund", color: "var(--you)" },
  h: { name: "h, the chance a fresh bet comes good", color: "var(--a)" },
  s: { name: "s, the chance the company survives", color: "var(--b)" },
} as const;

export type Letter = keyof typeof CHIPS;

/** One unknown, drawn as a round chip so it stands out from the numbers around it. */
export function Chip({ letter }: { letter: Letter }) {
  return <span className={styles.chip} style={{ background: CHIPS[letter].color }} role="img" aria-label={CHIPS[letter].name}>{letter}</span>;
}

export function Equation({ children }: { children: ReactNode }) {
  return <p className={styles.equation}>{children}</p>;
}
