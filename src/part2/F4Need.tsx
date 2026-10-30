import { useState } from "react";
import { formatMoney, formatMultiple } from "../model/format";
import { CARRY, FUND, feeBudget, returnNeeded } from "../model/fund";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import styles from "../models/models.module.css";
import fund from "./fund.module.css";

export const TARGET_STOPS = [1, 2, 3];
const { invested } = feeBudget(0.02);
const OWNERSHIP = 0.1;

export function F4Need() {
  const [target, setTarget] = useState(3);
  const R = returnNeeded(target);
  const lpProfit = FUND * target - FUND;
  const scale = Math.max(R, invested);
  return (
    <Section n={4} title="What LPs need">
      <Prose>
        <p>
          So what do LPs actually want? They're locking money away for ten years in something risky, so they want a lot
          more than the stock market would give them. A common bar is about 3× their money, after fees and carry.
        </p>
        <p>
          Work backwards. For LPs to get $300M they need $200M of profit after your carry. They keep 80% of the profit,
          so the fund needs $200M ÷ 0.8 = $250M of profit, and the investments have to return $350M.
        </p>
      </Prose>
      <Wide label="Working back from what LPs want">
        <Slider label="What LPs want back, after fees and carry" value={target} stops={TARGET_STOPS} format={(v) => `${v}×`} onChange={setTarget} />
        <div className={fund.bars} role="img" aria-label={`${formatMoney(invested)} invested has to become ${formatMoney(R)}`}>
          <div><span className={fund.barLabel}>Invested</span><span className={fund.bar} style={{ width: `${(invested / scale) * 100}%`, background: "var(--a)" }} /><b>{formatMoney(invested)}</b></div>
          <div><span className={fund.barLabel}>Must become</span><span className={fund.bar} style={{ width: `${(R / scale) * 100}%`, background: "var(--ink)" }} /><b>{formatMoney(R)}</b></div>
        </div>
        <dl className={styles.facts}>
          <div>
            <dt>What the investments must return</dt>
            <dd data-testid="f4-R"><span className={styles.muteInline}>{formatMoney(FUND)} + {formatMoney(lpProfit)} ÷ {1 - CARRY} = </span>{formatMoney(R)}</dd>
          </div>
          <div>
            <dt>On the money actually invested</dt>
            <dd data-testid="f4-gross"><span className={styles.muteInline}>{formatMoney(R)} ÷ {formatMoney(invested)} = </span>{formatMultiple(R / invested)}</dd>
          </div>
          <div>
            <dt>If one company carries it and you own 10% at the sale, it sells for</dt>
            <dd data-testid="f4-sale"><span className={styles.muteInline}>{formatMoney(R)} ÷ {OWNERSHIP * 100}% = </span>{formatMoney(R / OWNERSHIP)}</dd>
          </div>
        </dl>
      </Wide>
      <Prose>
        <p>
          This is where the two parts meet. In part one, one company had to carry the fund. If one company produces
          most of that $350M and you own 10% of it when it sells, it has to sell for $3.5B. That's why investors keep
          asking whether something can become a multi-billion-dollar company.
        </p>
      </Prose>
      <Rule>3× for LPs means turning $80M into $350M.</Rule>
    </Section>
  );
}
