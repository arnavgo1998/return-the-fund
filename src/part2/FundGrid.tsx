import { Blocks, type BlocksProps } from "../ui/Blocks";
import styles from "./fund.module.css";

/** The fund drawn as notes of $1M, ten to a row, each run of notes in its own colour. */
export function FundGrid({ runs, label }: { runs: { count: number; color: BlocksProps["color"] }[]; label: string }) {
  return (
    <span role="img" aria-label={label} className={styles.fundGrid}>
      {runs.map((r, i) => <Blocks key={i} count={r.count} color={r.color} label="" perRow={10} size={12} shape="note" />)}
    </span>
  );
}
