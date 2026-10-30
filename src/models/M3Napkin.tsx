import { useState } from "react";
import { formatMoney, formatShare } from "../model/format";
import { exitNeeded } from "../model/napkin";
import { Chip, Equation } from "../ui/Equation";
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
export function ValueRuler({ marks }: { marks: { value: number; label: string; strong?: boolean }[] }) {
  return (
    <div className={styles.ruler} aria-hidden>
      {[1, 10, 100, 1000, 10_000, RULER_MAX].map((v) => (
        <span key={v} className={styles.rulerTick} data-edge={v === 1 ? "start" : v === RULER_MAX ? "end" : undefined} style={{ left: `${rulerPosition(v)}%` }}>{formatMoney(v)}</span>
      ))}
      {marks.map((m) => (
        <span key={m.label} className={styles.rulerMark} data-strong={!!m.strong}
          data-anchor={rulerPosition(m.value) > 70 ? "end" : "start"} style={{ left: `${rulerPosition(m.value)}%` }}>{m.label}</span>
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
    <Section n={3} title="The napkin sum">
      <Prose>
        <p>
          In Model 2 the winner had to return $22M for the fund to triple. You own 10% of that company, so it must have been sold for $220M. The same reasoning works in reverse, before you invest. How large does a company have to become for your share of it, on its own, to repay the whole fund?
        </p>
        <p>
          Call the fund <Chip letter="F" /> and the sale <Chip letter="E" />. Your part of the sale is your share × <Chip letter="E" />, the same sum as in Model 1. To repay the fund, it has to equal <Chip letter="F" />. Divide both sides by your share and you get the sale the company needs.
        </p>
      </Prose>
      <Wide label="The napkin sum">
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
          { value: today, label: `today ${formatMoney(today)}` },
          { value: needed, label: `E needed ${formatMoney(needed)}`, strong: true },
        ]} />
        <dl className={styles.facts}>
          <div>
            <dt>Your cheque, one of ten as in Model 2</dt>
            <dd data-testid="napkin-cheque"><span className={styles.muteInline}>{formatMoney(fund)} ÷ {CHEQUES} cheques = </span>{formatMoney(cheque)}</dd>
          </div>
          <div>
            <dt>The company today, at the price you pay</dt>
            <dd data-testid="napkin-today"><span className={styles.muteInline}>{formatMoney(cheque)} ÷ {formatShare(share)} = </span>{formatMoney(today)}</dd>
          </div>
          <div>
            <dt>Growth needed to return the fund once</dt>
            <dd data-testid="napkin-growth"><span className={styles.muteInline}>{formatMoney(needed)} ÷ {formatMoney(today)} = </span>{Math.round(needed / today)}×</dd>
          </div>
        </dl>
      </Wide>
      <Prose>
        <p>
          A $10M fund that owns 10% needs a $100M sale. To check it the other way, 10% of $100M is $10M. A $100M fund at 10% needs a $1B sale.
        </p>
        <p>
          This is the arithmetic behind a question investors ask early on: <em>can this become a billion-dollar company?</em> A company that cannot reach that number may still be a good business. It just cannot be the company that returns this fund.
        </p>
        <p>
          The growth needed does not move with either slider. Each cheque is a tenth of the fund, so the winner always has to grow ten times from the price paid. The price decides how large the company must become. The number of cheques decides how much it must grow.
        </p>
      </Prose>
      <Rule>Before you write the cheque, divide the fund by your share. If the company cannot plausibly sell for that much, it cannot return the fund.</Rule>
    </Section>
  );
}
