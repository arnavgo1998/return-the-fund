import { useState } from "react";
import { formatMoney, formatShare } from "../model/format";
import { exitNeeded } from "../model/napkin";
import { Chip, Equation } from "../ui/Equation";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import styles from "./models.module.css";

export const FUND_STOPS = [10, 20, 50, 100, 200, 300, 500, 1000];
export const SHARE_STOPS = [0.02, 0.05, 1 / 15, 0.08, 0.1, 0.15, 0.2, 0.25];
const CHEQUE = 1;

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
  const today = CHEQUE / share;
  return (
    <Section n={3} title="The napkin sum">
      <Prose>
        <p>
          Model 2 said the winner has to return 22 blocks for the fund to triple. I own 10% of it, so the company must
          have sold for $220M. Turn that around and it becomes a question I can ask <em>before</em> I invest: how big
          does this company have to get for my share of it, alone, to pay back the whole fund?
        </p>
        <p>
          Call the fund <Chip letter="F" />. My share of the sale is share × <Chip letter="E" />. Set them equal and
          divide.
        </p>
      </Prose>
      <Wide label="The napkin sum">
        <Equation><Chip letter="E" /> = <Chip letter="F" /> ÷ share</Equation>
        <Equation>
          {formatMoney(fund)} ÷ {formatShare(share)} = <strong data-testid="exit-needed">{formatMoney(needed)}</strong>
        </Equation>
        <div className={styles.sliders}>
          <Slider label="The fund" value={fund} stops={FUND_STOPS} format={formatMoney} onChange={setFund} />
          <Slider label="My share of the company" value={share} stops={SHARE_STOPS} format={formatShare} onChange={setShare} />
        </div>
        <ValueRuler marks={[
          { value: today, label: `today ${formatMoney(today)}` },
          { value: needed, label: `needed ${formatMoney(needed)}`, strong: true },
        ]} />
        <p className={styles.verdict}>
          The company has to grow {Math.round(needed / today)}× from the price I paid, just to give the fund back once.
        </p>
      </Wide>
      <Prose>
        <p>
          That's the napkin. A $10M fund that owns 10% needs a $100M company. Slide the fund to $100M: at 10%, it needs
          a $1B company.
        </p>
        <p>
          This is why every investor asks some version of the same question in the first meeting: <em>can this be a
          billion-dollar company?</em> I used to hear that as greed. It's division. A smaller answer doesn't make the
          company bad. It just means it can't be the one that carries this fund.
        </p>
        <p>
          One thing surprised me. Move my share and the "grow" line doesn't change. With ten $1M cheques from a $10M
          fund, whatever price I pay, the winner has to grow tenfold from there. The price changes how big the company
          must end up. The growth it needs is set by how many cheques I write.
        </p>
      </Prose>
      <Rule>Before you write the cheque, divide the fund by your share. If the company can't plausibly be worth that, the cheque can't matter.</Rule>
    </Section>
  );
}
