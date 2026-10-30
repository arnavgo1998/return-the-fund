import { useState } from "react";
import { formatMoney } from "../model/format";
import { Blocks } from "../ui/Blocks";
import { Chip, Equation } from "../ui/Equation";
import { Legend } from "../ui/Legend";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import { EXIT_STOPS } from "./stops";
import styles from "./models.module.css";

const SHARE = 0.1;

export function CompanyGrid({ you = 10, label }: { you?: number; label: string }) {
  return (
    <span role="img" aria-label={label} className={styles.company}>
      <Blocks count={100 - you} color="founders" label="" perRow={10} size={13} />
      <Blocks count={you} color="you" label="" perRow={10} size={13} />
    </span>
  );
}

export function M1OneCheque() {
  const [sale, setSale] = useState(100);
  const back = SHARE * sale;
  const verdict =
    back === 0 ? "The $1M is gone. That is the worst case, and it never costs more than the $1M."
    : back < 1 ? "Less than you put in, but never less than $0."
    : back === 1 ? "Your money back, with nothing extra for the years it was tied up."
    : `${Math.round(back * 10) / 10} times your money.`;
  return (
    <Section n={1} title="One cheque">
      <Prose>
        <p>
          Let's start as small as we can. One company, Orbit, cut into 100 squares. The founders own 90. You pay $1M for the other 10.
        </p>
        <p>
          Notice what just happened. Your cheque priced the whole company. Ten squares for $1M means one square costs $0.1M, so all 100 are worth $10M.
        </p>
        <p>
          One day Orbit gets sold, or it quietly shuts down. Call the sale price <Chip letter="E" />. Nobody knows it yet, and that's the whole game. Your 10 squares get 10% of whatever it turns out to be.
        </p>
      </Prose>
      <Wide label="One cheque into one company">
        <div className={styles.split}>
          <div>
            <p className={styles.figLabel}>Orbit: 100 squares, one share each</p>
            <CompanyGrid label="A company of 100 squares: 90 founders', 10 yours" />
            <Legend ids={["you", "founders"]} />
            <dl className={styles.facts}>
              <div><dt>Your squares</dt><dd data-testid="m1-squares"><span className={styles.muteInline}>$1M ÷ $0.1M = </span>10</dd></div>
              <div><dt>Your share</dt><dd data-testid="m1-share"><span className={styles.muteInline}>10 ÷ 100 = </span>10%</dd></div>
              <div><dt>The company, at this price</dt><dd data-testid="m1-worth"><span className={styles.muteInline}>100 × $0.1M = </span>$10M</dd></div>
            </dl>
          </div>
          <div className={styles.grow}>
            <Slider label="What the company sells for" letter="E" value={sale} stops={EXIT_STOPS} format={formatMoney} onChange={setSale} />
            <Equation>10% × <Chip letter="E" /> = 10% × {formatMoney(sale)} = {formatMoney(back)}</Equation>
            <div className={styles.compare}>
              <div>
                <p className={styles.figLabel}>Put in: $1M</p>
                <Blocks count={1} color="ink" label="$1M put in: one note" size={13} shape="note" />
              </div>
              <div>
                <p className={styles.figLabel} aria-live="polite">Back: <span data-testid="m1-back">{formatMoney(back)}</span></p>
                <Blocks count={back} color="you" label={`${formatMoney(back)} back: ${formatNotes(back)}`} perRow={10} size={13} shape="note" />
              </div>
            </div>
            <p className={styles.verdict}>{verdict}</p>
          </div>
        </div>
      </Wide>
      <Prose>
        <p>
          Drag the sale to zero. You lose your $1M, and that's as bad as it gets. No setting on that slider costs you more.
        </p>
        <p>
          Now drag it the other way and keep going. A $100M sale gives you ten notes back. A $1B sale gives you a hundred, and the picture has to stretch to fit them. The downside has a floor and the upside has no ceiling. Almost everything in venture follows from that lopsided shape.
        </p>
      </Prose>
      <Rule>You can lose the cheque. What you can win has no ceiling.</Rule>
    </Section>
  );
}

export const formatNotes = (n: number) => `${Math.round(n * 100) / 100} note${n === 1 ? "" : "s"} of $1M`;
