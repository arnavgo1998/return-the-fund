import { useState } from "react";
import { formatMoney, formatMultiple, formatShare } from "../model/format";
import { FUND, feeSchedule } from "../model/fund";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import { FundGrid } from "./FundGrid";
import styles from "../models/models.module.css";
import fund from "./fund.module.css";

export const FEE_STOPS = [0.015, 0.02, 0.025];

export function F2Fee() {
  const [fee, setFee] = useState(0.02);
  const [stepDown, setStepDown] = useState(false);
  const schedule = feeSchedule(fee, stepDown);
  const fees = schedule.reduce((a, b) => a + b, 0);
  const invested = FUND - fees;
  const feesWorking = stepDown
    ? `${formatMoney(schedule[0])} × 5 years + ${formatMoney(schedule[5])} × 5 years`
    : `${formatMoney(schedule[0])} × ${schedule.length} years`;
  return (
    <Section n={2} title="The fee">
      <Prose>
        <p>
          Running a fund costs money: salaries, an office, lawyers, flights to go and meet founders. LPs pay for it
          with a yearly management fee, usually 2% of the fund.
        </p>
        <p>
          2% of $100M is $2M a year. Over ten years that's $20M, and it comes out of the fund itself. So of the $100M,
          only $80M ever gets invested in companies.
        </p>
      </Prose>
      <Wide label="Where the fee comes from">
        <div className={styles.split}>
          <div>
            <p className={styles.figLabel}>The fund, after fees</p>
            <FundGrid label={`${invested} notes invested and ${fees} notes of fees`}
              runs={[{ count: invested, color: "a" }, { count: fees, color: "ghost" }]} />
          </div>
          <div className={styles.grow}>
            <div className={styles.segmented} role="group" aria-label="How the fee runs">
              <button type="button" aria-pressed={!stepDown} onClick={() => setStepDown(false)}>Flat for 10 years</button>
              <button type="button" aria-pressed={stepDown} onClick={() => setStepDown(true)}>Steps down after year 5</button>
            </div>
            <Slider label="Management fee, per year" value={fee} stops={FEE_STOPS} format={formatShare} onChange={setFee} />
            <div className={fund.feeYears} aria-label="The fee each year">
              {schedule.map((f, i) => (
                <div key={i}><span data-testid="fee-year">{formatMoney(f)}</span><small>Y{i + 1}</small></div>
              ))}
            </div>
            <dl className={styles.facts}>
              <div>
                <dt>Fees over the fund's life</dt>
                <dd data-testid="f2-fees"><span className={styles.muteInline}>{feesWorking} = </span>{formatMoney(fees)}</dd>
              </div>
              <div>
                <dt>Left to invest</dt>
                <dd data-testid="f2-invested"><span className={styles.muteInline}>{formatMoney(FUND)} − {formatMoney(fees)} = </span>{formatMoney(invested)}</dd>
              </div>
              <div>
                <dt>What the investments must return just to give LPs their money back</dt>
                <dd data-testid="f2-needed"><span className={styles.muteInline}>{formatMoney(FUND)} ÷ {formatMoney(invested)} = </span>{formatMultiple(FUND / invested)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Wide>
      <Prose>
        <p>
          That 1.25× is the first bar your companies have to clear. Before anyone makes a cent of profit, they have to
          grow $80M into $100M just to cover the fee.
        </p>
        <p>
          Many funds lower the fee once the investing years are over, because the fund has stopped backing new
          companies and is helping the ones it has. One simple version drops it to 1% a year from year 6. We'll stick with the flat
          2% from here, and your own $1M gets treated like any LP's, so LPs put in $100M.
        </p>
      </Prose>
      <Rule>Fees come off the top, so $80M has to earn back $100M.</Rule>
    </Section>
  );
}
