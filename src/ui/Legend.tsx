import type { HolderId } from "../model/company";
import { COLOR, NAMES } from "./players";
import styles from "./ui.module.css";

export function Legend({ ids }: { ids: HolderId[] }) {
  return (
    <ul className={styles.legend}>
      {ids.map((id) => (
        <li key={id}><span className={styles.swatch} style={{ background: COLOR[id] }} aria-hidden />{NAMES[id]}</li>
      ))}
    </ul>
  );
}
