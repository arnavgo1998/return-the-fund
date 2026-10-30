import { useState } from "react";
import { formatMoney } from "../model/format";
import { Blocks } from "../ui/Blocks";
import { Chip, Equation } from "../ui/Equation";
import { Legend } from "../ui/Legend";
import { Aside, Prose, Rule, Section, Wide } from "../ui/Section";
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
          Start with one company cut into 100 squares. The founders own 90 of them. You pay $1M for the other 10.
        </p>
        <p>
          That price also puts a value on the whole company. If 10 squares cost $1M, one square costs $0.1M, and all 100 squares are worth $10M.
        </p>
        <p>
          Some years later the company is sold, or it shuts down. Call the sale price <Chip letter="E" />. Nobody knows it when the cheque is written. Whatever it turns out to be, your 10 squares get 10% of it.
        </p>
      </Prose>
      <Wide label="One cheque into one company">
        <div className={styles.split}>
          <div>
            <p className={styles.figLabel}>The company: 100 squares, one share each</p>
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
          Drag the sale down to $0 and you lose the $1M. No position of the slider costs more than that.
        </p>
        <p>
          Drag it up and there is no limit. A $100M sale pays back $10M, ten notes. A $1B sale pays back a hundred notes, and the picture has to grow to hold them. The loss stops at the cheque and the gain has no ceiling. Every later model builds on that difference.
        </p>
      </Prose>
      <Aside>
        <p>
          Peter Bernstein comes back to this asymmetry throughout <em>Against the Gods</em>. The possible loss is known before the bet is made. The possible gain is not.
        </p>
      </Aside>
      <Rule>The most you can lose is the cheque. What you can win is your share × the sale, with no ceiling.</Rule>
    </Section>
  );
}

export const formatNotes = (n: number) => `${Math.round(n * 100) / 100} note${n === 1 ? "" : "s"} of $1M`;
