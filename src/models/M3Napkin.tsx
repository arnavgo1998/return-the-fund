import { useState } from "react";
import { formatMoney, formatShare } from "../model/format";
import { exitNeeded } from "../model/napkin";
import { Chip, Equation, type Letter } from "../ui/Equation";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import styles from "./models.module.css";

export const FUND_STOPS = [10, 20, 50, 100, 200, 300, 500, 1000];
export const SHARE_STOPS = [0.02, 0.05, 1 / 15, 0.08, 0.1, 0.15, 0.2, 0.25];
/** Model 2's fund: ten equal cheques. */
const CHEQUES = 10;

const RULER_MAX = 100_000;

/** Where a company value sits on the ruler, as a percentage of its width ($1M to $100B, log scale). */
export const rulerPosition = (v: number) => (Math.log10(Math.min(Math.max(v, 1), RULER_MAX)) / Math.log10(RULER_MAX)) * 100;

/** A log ruler of company values, so $10M and $50B fit on one line. */
export function ValueRuler({ marks }: { marks: { value: number; label: string; letter?: Letter; strong?: boolean }[] }) {
  return (
    <div className={styles.ruler} aria-hidden>
      {[1, 10, 100, 1000, 10_000, RULER_MAX].map((v) => (
        <span key={v} className={styles.rulerTick} data-edge={v === 1 ? "start" : v === RULER_MAX ? "end" : undefined} style={{ left: `${rulerPosition(v)}%` }}>{formatMoney(v)}</span>
      ))}
      {marks.map((m) => (
        <span key={m.label} className={styles.rulerMark} data-strong={!!m.strong}
          data-anchor={rulerPosition(m.value) > 70 ? "end" : "start"} style={{ left: `${rulerPosition(m.value)}%` }}>{m.letter && <Chip letter={m.letter} />}{m.label}</span>
      ))}
    </div>
  );
}

export function M3Napkin() {
  const [fund, setFund] = useState(10);
  const [share, setShare] = useState(0.1);
  const needed = exitNeeded(fund, share);
  const cheque = fund / CHEQUES;
  const today = cheque / share;
  return (
    <Section n={3} title="The sale you need">
      <Prose>
        <p>
          Model 2 has a handy side effect. If the winner returned $22M and you own 10% of it, it must have sold for $220M. Flip that around and you get a question you can ask before you invest. How big does this company need to get for your slice alone to pay back the whole fund?
        </p>
        <p>
          Call the fund <Chip letter="F" /> and the sale <Chip letter="E" />. Your slice is your share × <Chip letter="E" />, same as Model 1. Set it equal to <Chip letter="F" />, divide by your share, and out comes the sale you need.
        </p>
      </Prose>
      <Wide label="The sale you need">
        <p className={styles.figLabel} data-testid="napkin-sets">These two set <Chip letter="E" /></p>
        <div className={`${styles.sliders} ${styles.inputs}`}>
          <Slider label="The fund" letter="F" value={fund} stops={FUND_STOPS} format={formatMoney} onChange={setFund} />
          <Slider label="Your share of the company" value={share} stops={SHARE_STOPS} format={formatShare} onChange={setShare} />
        </div>
        <div className={styles.derive}>
          <p className={styles.figLabel}>In words</p>
          <p className={styles.figLabel}>In numbers</p>
          <Equation><span data-testid="napkin-words-1">your share × <Chip letter="E" /> = <Chip letter="F" /></span></Equation>
          <Equation><span data-testid="napkin-numbers-1">{formatShare(share)} × <Chip letter="E" /> = {formatMoney(fund)}</span></Equation>
          <Equation><span data-testid="napkin-words-2"><Chip letter="E" /> = <Chip letter="F" /> ÷ your share</span></Equation>
          <Equation>
            <span data-testid="napkin-numbers-2">
              <Chip letter="E" /> = {formatMoney(fund)} ÷ {formatShare(share)} = <strong data-testid="exit-needed">{formatMoney(needed)}</strong>
            </span>
          </Equation>
        </div>
        <ValueRuler marks={[
          { value: today, label: `today ${formatMoney(today)}`, letter: "V" },
          { value: needed, label: `needed ${formatMoney(needed)}`, letter: "E", strong: true },
        ]} />
        <dl className={styles.facts}>
          <div>
            <dt>Your cheque, one of ten as in Model 2</dt>
            <dd data-testid="napkin-cheque"><span className={styles.muteInline}>{formatMoney(fund)} ÷ {CHEQUES} cheques = </span>{formatMoney(cheque)}</dd>
          </div>
          <div>
            <dt><Chip letter="V" /> The company today, at the price you pay</dt>
            <dd data-testid="napkin-today"><span className={styles.muteInline}>{formatMoney(cheque)} ÷ {formatShare(share)} = </span>{formatMoney(today)}</dd>
          </div>
          <div>
            <dt>Growth needed to return the fund once, <Chip letter="E" /> ÷ <Chip letter="V" /></dt>
            <dd data-testid="napkin-growth"><span className={styles.muteInline}>{formatMoney(needed)} ÷ {formatMoney(today)} = </span>{Math.round(needed / today)}×</dd>
          </div>
        </dl>
      </Wide>
      <Prose>
        <p>
          A $10M fund owning 10% needs a $100M sale. Check it backwards: 10% of $100M is $10M. Slide the fund up to $100M and the answer becomes $1B.
        </p>
        <p>
          That's where the famous question comes from. When an investor asks whether something can be a billion-dollar company, they're doing this division in their head. A smaller company can still be a great business. It just can't be the one that returns the fund.
        </p>
        <p>
          <Chip letter="V" /> is what your price says the company is worth today, your cheque ÷ your share. Notice that the growth you need, <Chip letter="E" /> ÷ <Chip letter="V" />, never moves. Write ten cheques and your winner has to grow tenfold, whatever price you paid.
        </p>
      </Prose>
      <Rule>Fund ÷ your share = the sale you need.</Rule>
    </Section>
  );
}
