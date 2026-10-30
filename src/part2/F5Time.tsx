import { useState } from "react";
import { formatMoney } from "../model/format";
import { CALLS, DISTRIBUTIONS, YEARS, fundYear } from "../model/fund";
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
  const callYears = CALLS.slice(0, year).filter((c) => c > 0);
  const backs = DISTRIBUTIONS.slice(0, year).filter((d) => d > 0);
  return (
    <Section n={5} title="Time">
      <Prose>
        <p>
          Here's something the earlier models skipped. LPs don't hand over $100M on day one. You call the money as you
          need it, a bit each year while you're making investments, roughly over the first five years. The money comes
          back much later, when companies get sold.
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
        <dl className={styles.facts}>
          <div>
            <dt>LPs have paid in</dt>
            <dd data-testid="f5-paid"><span className={styles.muteInline}>$20M × {callYears.length} year{callYears.length === 1 ? "" : "s"} = </span>{formatMoney(now.paidIn)}</dd>
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
          For five years the bars only go down. LPs have paid in $100M and seen nothing back, even though, as you'll
          see next, the fund may be doing well. It isn't until year 8 that they're above zero, and most of the money
          arrives in the last two years. People call this shape the J-curve, for obvious reasons.
        </p>
      </Prose>
      <Rule>A good fund looks like a bad one for its first five years.</Rule>
    </Section>
  );
}
