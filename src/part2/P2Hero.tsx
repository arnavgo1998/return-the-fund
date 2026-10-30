import { Blocks } from "../ui/Blocks";
import styles from "../models/models.module.css";

export function P2Hero() {
  return (
    <header className={styles.hero}>
      <p className={styles.backLink}><a href="#">← Part one: the startup side</a></p>
      <p className={styles.kicker}>Part two</p>
      <h1 className={styles.title}>The Fund</h1>
      <p className={styles.dek}>Where the money comes from, and what it has to do.</p>
      <div className={styles.heroProse}>
        <p>
          In part one you had a fund and spent it. You never asked where the money came from, or what the people who
          gave it to you expect back. Let's ask now.
        </p>
        <p>
          Investors raise their funds from other investors, called limited partners, or LPs. The person who runs the
          fund is the general partner, the GP. That's you. Same method as before: one thing at a time, every number
          countable, using the standard terms Scott Kupor describes in <em>Secrets of Sand Hill Road</em>.
        </p>
        <p>This time it's a $100M fund. Let's see what you've signed up for.</p>
      </div>
      <dl className={styles.units}>
        <div><dt><Blocks count={1} color="a" label="an LP's note" size={16} shape="note" /></dt><dd>One note is $1M. Blue notes belong to LPs.</dd></div>
        <div><dt><Blocks count={1} color="you" label="your note" size={16} shape="note" /></dt><dd>Rust notes are yours, the GP's.</dd></div>
        <div><dt><Blocks count={1} color="ghost" label="a fee note" size={16} shape="note" /></dt><dd>Dashed notes are fees: money that never gets invested.</dd></div>
      </dl>
    </header>
  );
}
