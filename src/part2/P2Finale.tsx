import { useState } from "react";
import { formatMoney, formatMultiple, formatShare } from "../model/format";
import { YEARS, carrySplit, feeBudget, returnNeeded } from "../model/fund";
import { Prose, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import styles from "../models/models.module.css";
import fund from "./fund.module.css";

export const FUND_STOPS_2 = [10, 50, 100, 200, 500];
export const FEE_STOPS_2 = [0.015, 0.02, 0.025];
export const CARRY_STOPS = [0.15, 0.2, 0.25, 0.3];
export const TARGET_STOPS_2 = [1, 2, 3, 5];

export function P2Finale() {
  const [size, setSize] = useState(100);
  const [fee, setFee] = useState(0.02);
  const [carryRate, setCarryRate] = useState(0.2);
  const [target, setTarget] = useState(3);
  const { fees, invested } = feeBudget(fee, size);
  const R = returnNeeded(target, size, carryRate);
  const { profit, carry } = carrySplit(R, size, carryRate);
  const keep = Number((1 - carryRate).toFixed(2));
  return (
    <Section title="Your fund">
      <Prose>
        <p>Here's the whole fund side in one place. Set up your own fund and see what it has to do.</p>
      </Prose>
      <Wide label="Your fund, worked out">
        <div className={styles.napkin}>
          <div className={`${styles.sliders} ${fund.twoByTwo}`}>
            <Slider label="The fund" letter="F" value={size} stops={FUND_STOPS_2} format={formatMoney} onChange={setSize} />
            <Slider label="Management fee, per year" value={fee} stops={FEE_STOPS_2} format={formatShare} onChange={setFee} />
            <Slider label="Your carry, as a share of the profit" value={carryRate} stops={CARRY_STOPS} format={formatShare} onChange={setCarryRate} />
            <Slider label="What LPs want back" value={target} stops={TARGET_STOPS_2} format={(v) => `${v}×`} onChange={setTarget} />
          </div>
          <div className={styles.napkinSum} aria-live="polite">
            <p>Fees: <span data-testid="p2-fees">{formatMoney(size)} × {formatShare(fee)} × {YEARS} years = <strong>{formatMoney(fees)}</strong></span></p>
            <p>Invested: <span data-testid="p2-invested">{formatMoney(size)} − {formatMoney(fees)} = <strong>{formatMoney(invested)}</strong></span></p>
            <p>Must return: <span data-testid="p2-R">{formatMoney(size)} + {formatMoney(size * target - size)} ÷ {keep} = <strong>{formatMoney(R)}</strong></span></p>
            <p className={styles.napkinBottom}><span data-testid="p2-gross">{formatMoney(R)} ÷ {formatMoney(invested)} = <strong>{formatMultiple(R / invested)}</strong></span></p>
            <p className={styles.versusSub}>
              What the companies have to make on every dollar you invest, for LPs to get {target}× after fees and carry.
              Your carry if they do: <span data-testid="p2-carry">{formatShare(carryRate)} × {formatMoney(profit)} = {formatMoney(carry)}</span>.
            </p>
          </div>
        </div>
      </Wide>
      <Prose>
        <p>
          That's the fund side. LPs hand you money that is mostly theirs, you take a fee to run it, and you share in the
          profit only once they're whole. To give them 3×, $80M has to become $350M, which in part one meant one company
          selling for billions. And for most of the fund's life, the only sign you're on track is paper.
        </p>
        <p>
          Both parts come down to the same habit: do the division before you commit. How big the company has to get,
          how much the fund has to make, how long until anyone sees cash. You can work all of it out on day one.
        </p>
      </Prose>
      <a className={styles.nextPart} href="#">
        <span className={styles.figLabel}>Back to</span>
        <span className={styles.nextTitle}>Part one: the startup side</span>
        <span className={styles.nextDek}>One cheque, one company, and what it has to become.</span>
      </a>
      <div className={styles.reading}>
        <p className={styles.figLabel}>Where this comes from</p>
        <ul>
          <li>Scott Kupor, <em>Secrets of Sand Hill Road</em>, especially the chapters on how funds raise money and how GPs get paid.</li>
          <li>
            Chain Bear, <a href="https://www.youtube.com/watch?v=TNQuUZYHJdE"><em>Building an F1 Strategy from the Bare Basics</em></a>.
            The method used here: start small and add one variable at a time.
          </li>
        </ul>
      </div>
    </Section>
  );
}
