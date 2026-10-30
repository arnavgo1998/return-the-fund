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
          Venture investors talk about ownership, dilution, follow-on cheques, liquidation preferences and the one
          company that returns the fund. Each idea is simple on its own. They are hard to hold together because they
          all act on the same sum, and most explanations bring them in all at once.
        </p>
        <p>
          This page builds that sum one variable at a time, the way Chain Bear builds a Formula 1 race strategy in{" "}
          <em>Building an F1 Strategy from the Bare Basics</em>: start with a model small enough to count, add one thing,
          and end each step with a rule short enough to say out loud. The numbers follow Scott Kupor's{" "}
          <em>Secrets of Sand Hill Road</em>, simplified so that every one of them can be checked by hand.
        </p>
        <p>
          You sit in the investor's seat, with a $10M fund. Later in the page two more investors join the same company:
          Alex, who leads Series A, and Blake, who leads Series B.
        </p>
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
