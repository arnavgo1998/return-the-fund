import { Legend } from "../ui/Legend";
import { Blocks } from "../ui/Blocks";
import styles from "./models.module.css";

export function Hero() {
  return (
    <header className={styles.hero}>
      <p className={styles.kicker}>A notebook on <em>Secrets of Sand Hill Road</em></p>
      <h1 className={styles.title}>Return the Fund</h1>
      <p className={styles.dek}>Venture capital from the bare basics, one variable at a time.</p>
      <div className={styles.heroProse}>
        <p>
          I knew the words. Ownership, dilution, follow-ons, preferences, the one company that returns the fund.
          I could have told you each of them mattered. What I couldn't do was hold them together. Every time I tried,
          the sum arrived with ten unknowns at once, and I fell back on the feel of it.
        </p>
        <p>
          Then I watched Chain Bear build a Formula 1 race strategy out of little coloured squares. Ten laps, two tyres,
          count the blocks. One new variable at a time, each step ending in a sum simple enough to say out loud. By the
          end I could see why teams stop when they stop.
        </p>
        <p>
          So this is me doing that with Scott Kupor's <em>Secrets of Sand Hill Road</em>. I sit in the investor's chair.
          I start with one cheque into one company and add one thing at a time, until the sum every investor does on a
          napkin makes sense.
        </p>
      </div>
      <dl className={styles.units}>
        <div><dt><Blocks count={1} color="ink" label="one block" size={16} /></dt><dd>One block is a million dollars.</dd></div>
        <div><dt><Blocks count={1} color="founders" label="one square" size={16} /></dt><dd>One square is one share of a company.</dd></div>
      </dl>
      <Legend ids={["you", "founders", "a", "b"]} />
      <p className={styles.unitsNote}>Everything on this page can be counted.</p>
    </header>
  );
}
