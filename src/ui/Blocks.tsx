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
  /** "note" draws money: a $1M banknote, twice as wide as tall, so it can't be mistaken for a share. */
  shape?: "square" | "note";
}

/** Literal squares (shares) or notes (money), with any fraction drawn as a partial one. */
export function Blocks({ count, color, perRow = 10, size = 14, label, shape = "square" }: BlocksProps) {
  const whole = Math.floor(count + 1e-9);
  const fraction = Math.round((count - whole) * 100) / 100;
  const fill = color === "ghost" ? "transparent" : COLOR[color];
  const style = { "--size": `${size}px`, "--w": `${shape === "note" ? size * 2 : size}px`, "--per-row": Math.max(1, Math.min(perRow, Math.ceil(count))), "--fill": fill } as CSSProperties;
  return (
    <span role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true} className={styles.blocks} data-ghost={color === "ghost"} data-shape={shape} style={style}>
      {Array.from({ length: whole }, (_, i) => <span key={i} data-square className={styles.square} />)}
      {fraction > 0 && (
        <span data-square data-fraction={String(fraction)} className={styles.square}
          style={{ width: `calc(var(--w) * ${fraction})` }} />
      )}
    </span>
  );
}
