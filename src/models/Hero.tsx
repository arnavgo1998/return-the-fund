import { Legend } from "../ui/Legend";
import { Blocks } from "../ui/Blocks";
import styles from "./models.module.css";

export function Hero() {
  return (
    <header className={styles.hero}>
      <p className={styles.kicker}>Notes on <em>Secrets of Sand Hill Road</em></p>
      <h1 className={styles.title}>Return the Fund</h1>
      <p className={styles.dek}>Venture capital from the bare basics, one variable at a time.</p>
      <div className={styles.heroProse}>
        <p>
          Venture capital runs on a few words everyone nods along to: ownership, dilution, follow-ons, preferences.
          Each one is easy on its own. The trouble starts when you try to hold them all at once.
        </p>
        <p>
          Chain Bear has a lovely way around this for Formula 1 strategy: start with a race so simple you can count
          it, then add one thing at a time. This page does the same for the investor's side of a startup, using the
          numbers in Scott Kupor's <em>Secrets of Sand Hill Road</em>.
        </p>
        <p>You're the investor. You have a $10M fund. Let's spend it.</p>
      </div>
      <dl className={styles.units}>
        <div><dt><Blocks count={1} color="ink" label="one note" size={16} shape="note" /></dt><dd>One note is $1M of money.</dd></div>
        <div><dt><Blocks count={1} color="founders" label="one square" size={16} /></dt><dd>One square is one share of a company. What a square costs changes from round to round.</dd></div>
      </dl>
      <Legend ids={["you", "founders", "a", "b"]} />
      <p className={styles.unitsNote}>Everything on this page can be counted.</p>
    </header>
  );
}
