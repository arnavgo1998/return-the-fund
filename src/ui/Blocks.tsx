import type { CSSProperties } from "react";
import type { HolderId } from "../model/company";
import { COLOR } from "./players";
import styles from "./ui.module.css";

export interface BlocksProps {
  count: number;
  color: HolderId | "ink" | "ghost";
  perRow?: number;
  size?: number;
  label: string;
}

/** Literal squares: one per block or share, with any fraction drawn as a partial square. */
export function Blocks({ count, color, perRow = 10, size = 14, label }: BlocksProps) {
  const whole = Math.floor(count + 1e-9);
  const fraction = Math.round((count - whole) * 100) / 100;
  const fill = color === "ghost" ? "transparent" : COLOR[color];
  const style = { "--size": `${size}px`, "--per-row": perRow, "--fill": fill } as CSSProperties;
  return (
    <span role="img" aria-label={label} className={styles.blocks} data-ghost={color === "ghost"} style={style}>
      {Array.from({ length: whole }, (_, i) => <span key={i} data-square className={styles.square} />)}
      {fraction > 0 && (
        <span data-square data-fraction={String(fraction)} className={styles.square}
          style={{ width: `calc(var(--size) * ${fraction})` }} />
      )}
    </span>
  );
}
