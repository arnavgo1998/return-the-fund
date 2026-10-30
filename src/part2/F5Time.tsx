import { useState } from "react";
import { formatMoney } from "../model/format";
import { DISTRIBUTIONS, FEE_CALLS, INVESTED_CALLS, YEARS, fundYear } from "../model/fund";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import styles from "../models/models.module.css";
import fund from "./fund.module.css";

/** "−$100M", "+$5M": the running total always carries its sign. */
export const signedMoney = (n: number) => `${n < 0 ? "−" : "+"}${formatMoney(Math.abs(n))}`;

const YEAR_LIST = Array.from({ length: YEARS }, (_, i) => i + 1);
const UP = 200, DOWN = 100; // the chart's range: the best and worst running totals
const PLOT = 180; // px, matches .plot in fund.module.css

export function F5Time() {
  const [year, setYear] = useState(10);
  const now = fundYear(year);
  // Years 1–5 call investing money plus the fee; after that, only the fee.
  const investing = Math.min(year, INVESTED_CALLS.filter((c) => c > 0).length);
  const feeOnly = year - investing;
  const years = (n: number) => `${n} year${n === 1 ? "" : "s"}`;
  const invested = INVESTED_CALLS[0] * investing;
  const fees = FEE_CALLS[0] * (investing + feeOnly);
  const backs = DISTRIBUTIONS.slice(0, year).filter((d) => d > 0);
  return (
    <Section n={5} title="Time">
      <Prose>
        <p>
          Here's something the earlier models skipped. LPs don't hand over $100M on day one. You call the money as you
          need it. For the first five years, while you're making investments, that's $16M to invest plus the year's
          $2M fee, so $18M a year. After that it's just the $2M fee. The money comes back much later, when companies
          get sold.
        </p>
        <p>
          Let's follow one made-up but typical fund that ends up giving LPs 3×. Slide through the years and watch the
          running total: everything LPs have got back, minus everything they've paid in.
        </p>
      </Prose>
      <Wide label="LPs' running total, year by year">
        <Slider label="Year" value={year} min={1} max={YEARS} step={1} format={(v) => `Year ${v}`} onChange={setYear} />
        <div className={fund.chart} role="img"
          aria-label={`LPs' running total: ${YEAR_LIST.map((y) => `year ${y} ${signedMoney(fundYear(y).net)}`).join(", ")}.`}>
          {YEAR_LIST.map((y) => {
            const net = fundYear(y).net;
            return (
              <div key={y} className={fund.col} data-future={y > year} data-now={y === year}>
                <div className={fund.plot}>
                  <span className={fund.jBar} data-up={net >= 0}
                    style={net >= 0
                      ? { bottom: `${(DOWN / (UP + DOWN)) * 100}%`, height: `${(net / (UP + DOWN)) * 100}%` }
                      : { top: `${(UP / (UP + DOWN)) * 100}%`, height: `${(-net / (UP + DOWN)) * 100}%` }} />
                </div>
                <span className={fund.colYear}>{y}</span>
              </div>
            );
          })}
          <span className={fund.zero} style={{ top: `${(UP / (UP + DOWN)) * PLOT}px` }} />
        </div>
        <p className={styles.figLabel}>The fee, taken every year</p>
        <div className={fund.feeRow} aria-label={`The fee: ${formatMoney(FEE_CALLS[0])} taken in each of years 1 to ${year} so far`}>
          {FEE_CALLS.map((f, i) => (
            <span key={i} data-testid="f5-fee-year" data-taken={i < year}>{formatMoney(f)}</span>
          ))}
        </div>
        <dl className={styles.facts}>
          <div>
            <dt>Invested in companies so far</dt>
            <dd data-testid="f5-invested"><span className={styles.muteInline}>{formatMoney(INVESTED_CALLS[0])} × {years(investing)} = </span>{formatMoney(invested)}</dd>
          </div>
          <div>
            <dt>Fees taken so far</dt>
            <dd data-testid="f5-fees"><span className={styles.muteInline}>{formatMoney(FEE_CALLS[0])} × {years(year)} = </span>{formatMoney(fees)}</dd>
          </div>
          <div>
            <dt>LPs have paid in</dt>
            <dd data-testid="f5-paid"><span className={styles.muteInline}>{formatMoney(invested)} + {formatMoney(fees)} = </span>{formatMoney(now.paidIn)}</dd>
          </div>
          <div>
            <dt>LPs have got back</dt>
            <dd data-testid="f5-back">
              {backs.length > 1 && <span className={styles.muteInline}>{backs.map(formatMoney).join(" + ")} = </span>}{formatMoney(now.back)}
            </dd>
          </div>
          <div>
            <dt>Running total</dt>
            <dd><span className={styles.muteInline}>{formatMoney(now.back)} − {formatMoney(now.paidIn)} = </span><span data-testid="f5-net">{signedMoney(now.net)}</span></dd>
          </div>
        </dl>
      </Wide>
      <Prose>
        <p>
          For five years the bars only go down. LPs have paid in $90M and seen nothing back, even though, as you'll
          see shortly, the fund may be doing well. It isn't until year 8 that they're above zero, and most of the money
          arrives in the last two years. People call this shape the J-curve, for obvious reasons.
        </p>
        <p>
          Now watch the fee line under the chart. It fills in every single year, whether the fund is doing well or
          badly, and it keeps going after the investing stops in year 5. From year 6 to year 10 the only thing LPs are
          still paying for is you. By the end that's $20M, a fifth of everything they put in.
        </p>
      </Prose>
      <Rule>A good fund looks like a bad one for its first five years.</Rule>
    </Section>
  );
}
