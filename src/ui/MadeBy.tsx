import styles from "../models/models.module.css";

export const HANDLE = "arnavgoel_";

export function MadeBy() {
  return (
    <p className={styles.madeBy}>
      Made with love by <a href={`https://x.com/${HANDLE}`} target="_blank" rel="noopener noreferrer">@{HANDLE}</a>
    </p>
  );
}
