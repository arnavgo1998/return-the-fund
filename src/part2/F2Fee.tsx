import { useState } from "react";
import { formatMoney, formatMultiple, formatShare } from "../model/format";
import { FUND, YEARS, feeBudget } from "../model/fund";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import { FundGrid } from "./FundGrid";
import styles from "../models/models.module.css";

export const FEE_STOPS = [0.015, 0.02, 0.025];

export function F2Fee() {
  const [fee, setFee] = useState(0.02);
  const { fees, invested } = feeBudget(fee);
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
            <Slider label="Management fee, per year" value={fee} stops={FEE_STOPS} format={formatShare} onChange={setFee} />
            <dl className={styles.facts}>
              <div>
                <dt>Fees over the fund's life</dt>
                <dd data-testid="f2-fees"><span className={styles.muteInline}>{formatMoney(FUND * fee)} × {YEARS} years = </span>{formatMoney(fees)}</dd>
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
          That 1.25× is a hurdle nobody mentions out loud. Before anyone makes a cent of profit, the companies you pick
          have to grow $80M into $100M just to cover the fee.
        </p>
        <p>From here on, your own $1M gets treated like any LP's, so we'll simply say LPs put in $100M.</p>
      </Prose>
      <Rule>Fees come off the top, so $80M has to earn back $100M.</Rule>
    </Section>
  );
}
