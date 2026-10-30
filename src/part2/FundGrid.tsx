import type { CSSProperties } from "react";
import { Blocks, type BlocksProps } from "../ui/Blocks";
import styles from "./fund.module.css";

/** Money drawn as notes of $1M, `perRow` to a row, each run of notes in its own colour. */
export function FundGrid({ runs, label, perRow = 10, size = 12 }: {
  runs: { count: number; color: BlocksProps["color"] }[]; label: string; perRow?: number; size?: number;
}) {
  const style = { gridTemplateColumns: `repeat(${perRow}, ${size * 2}px)` } as CSSProperties;
  return (
    <span role="img" aria-label={label} className={styles.fundGrid} style={style}>
      {runs.map((r, i) => <Blocks key={i} count={r.count} color={r.color} label="" perRow={perRow} size={size} shape="note" />)}
    </span>
  );
}
