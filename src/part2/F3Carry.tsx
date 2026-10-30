import { useState } from "react";
import { formatMoney, formatMultiple } from "../model/format";
import { CARRY, FUND, carrySplit, feeBudget } from "../model/fund";
import { Blocks } from "../ui/Blocks";
import { Chip } from "../ui/Equation";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import { useWide } from "../ui/useWide";
import styles from "../models/models.module.css";
import fund from "./fund.module.css";

export const R3_STOPS = [0, 50, 80, 100, 150, 200, 300, 350, 500];
const { fees, invested } = feeBudget(0.02);

export function F3Carry() {
  const [R, setR] = useState(300);
  const perRow = useWide() ? 20 : 10;
  const { profit, carry, lp } = carrySplit(R);
  const lpProfit = profit - carry;
  return (
    <Section n={3} title="Carry">
      <Prose>
        <p>
          Here's the other half of how you get paid. LPs get their whole $100M back first. Anything above that is
          profit, and you keep a share of it, usually 20%. That share is called carried interest, or carry.
        </p>
        <p>Drag <Chip letter="R" /> and watch the money split.</p>
      </Prose>
      <Wide label="Splitting what the fund returns">
        <Slider label="What the fund's investments return" letter="R" value={R} stops={R3_STOPS} format={formatMoney} onChange={setR} />
        <div className={styles.waterfall} aria-hidden>
          <span style={{ width: R > 0 ? `${(lp / R) * 100}%` : 0, background: "var(--a)" }} />
          <span style={{ width: R > 0 ? `${(carry / R) * 100}%` : 0, background: "var(--you)" }} />
        </div>
        <p className={fund.key}>
          <span><i style={{ background: "var(--a)" }} /> LPs</span>
          <span><i style={{ background: "var(--you)" }} /> your carry</span>
        </p>
        <dl className={styles.facts}>
          <div>
            <dt>Profit, after LPs get $100M back</dt>
            <dd data-testid="f3-profit">
              <span className={styles.muteInline}>
                {R >= FUND ? `${formatMoney(R)} − ${formatMoney(FUND)} = ` : `${formatMoney(R)} is less than ${formatMoney(FUND)}, so `}
              </span>{formatMoney(profit)}
            </dd>
          </div>
          <div>
            <dt>Your carry</dt>
            <dd data-testid="f3-carry"><span className={styles.muteInline}>{CARRY * 100}% × {formatMoney(profit)} = </span>{formatMoney(carry)}</dd>
          </div>
          <div>
            <dt>LPs get</dt>
            <dd data-testid="f3-lp">
              {profit > 0 && <span className={styles.muteInline}>{formatMoney(FUND)} + {formatMoney(lpProfit)} = </span>}{formatMoney(lp)}
            </dd>
          </div>
          <div>
            <dt>What LPs made, after fees and carry</dt>
            <dd data-testid="f3-net"><span className={styles.muteInline}>{formatMoney(lp)} ÷ {formatMoney(FUND)} = </span>{formatMultiple(lp / FUND)}</dd>
          </div>
          <div>
            <dt>What the companies made on the money invested</dt>
            <dd data-testid="f3-gross"><span className={styles.muteInline}>{formatMoney(R)} ÷ {formatMoney(invested)} = </span>{formatMultiple(R / invested)}</dd>
          </div>
        </dl>
        <div className={fund.paychecks}>
          <div>
            <p className={styles.figLabel}>Your fee: <span data-testid="f3-fees">{formatMoney(fees)}</span>, whatever happens</p>
            <Blocks count={fees} color="ghost" label={`${fees} notes of fees`} perRow={perRow} size={9} shape="note" />
          </div>
          <div>
            <p className={styles.figLabel}>Your carry: {formatMoney(carry)}, only if there's profit</p>
            <Blocks count={carry} color="you" label={`${carry} notes of carry`} perRow={perRow} size={9} shape="note" />
          </div>
        </div>
      </Wide>
      <Prose>
        <p>
          At $300M, LPs end up with 2.6 times their money and you take $40M of carry. Look at the gap between the two
          multiples. The companies turned $80M into $300M, which is 3.75×. LPs see 2.6×. Fees and carry live in that gap.
        </p>
        <p>
          Compare your two paycheques as well. The fee arrives whatever happens. Carry only shows up when the fund
          makes a profit, and it's where good GPs make their real money.
        </p>
      </Prose>
      <Rule>You get 20% of the profit, and only after the LPs are whole.</Rule>
    </Section>
  );
}
