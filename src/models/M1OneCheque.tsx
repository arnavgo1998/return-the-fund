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
    back === 0 ? "The $1M is gone. That is the worst case, and it is only ever the $1M."
    : back < 1 ? "Less than I put in. Still never less than nothing."
    : back === 1 ? "My money back, and nothing for the years it was locked up."
    : `${Math.round(back * 10) / 10} times my money.`;
  return (
    <Section n={1} title="One cheque">
      <Prose>
        <p>
          Start with the smallest version I can think of. One company, cut into 100 squares. The founders own 90.
          I pay $1M for the other 10.
        </p>
        <p>
          So one square costs $0.1M, and without anyone saying it out loud, my cheque has just decided what the whole
          company is worth: 100 squares at $0.1M is $10M.
        </p>
        <p>
          Years later the company sells, or it dies. Call the sale <Chip letter="E" />. I don't know it yet. That's
          the whole point. My 10 squares get 10% of whatever it is.
        </p>
      </Prose>
      <Wide label="One cheque into one company">
        <div className={styles.split}>
          <div>
            <p className={styles.figLabel}>The company: 100 squares, one share each</p>
            <CompanyGrid label="A company of 100 squares: 90 founders', 10 yours" />
            <Legend ids={["you", "founders"]} />
            <dl className={styles.facts}>
              <div><dt>My squares</dt><dd data-testid="m1-squares"><span className={styles.muteInline}>$1M ÷ $0.1M = </span>10</dd></div>
              <div><dt>My share</dt><dd data-testid="m1-share"><span className={styles.muteInline}>10 ÷ 100 = </span>10%</dd></div>
              <div><dt>The company, at my price</dt><dd data-testid="m1-worth"><span className={styles.muteInline}>100 × $0.1M = </span>$10M</dd></div>
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
          Drag the sale all the way down. The worst that can happen is that my $1M is gone. There is no setting
          that takes more than the $1M.
        </p>
        <p>
          Now drag it up. At $100M I get $10M back, ten notes. At $1B I get a hundred notes, and the picture has to
          grow to hold them.
          One side of this has a floor. The other side has no ceiling. Everything after this is built on that.
        </p>
      </Prose>
      <Aside>
        <p>This is the asymmetry Peter Bernstein keeps circling in <em>Against the Gods</em>: what you can lose is known in advance, what you can win isn't.</p>
      </Aside>
      <Rule>The most you can lose is the cheque. What you can win is your share × the sale, with no ceiling.</Rule>
    </Section>
  );
}

export const formatNotes = (n: number) => `${Math.round(n * 100) / 100} note${n === 1 ? "" : "s"} of $1M`;
