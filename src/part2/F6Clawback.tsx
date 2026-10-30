import { useState } from "react";
import { formatMoney } from "../model/format";
import { CARRY, EARLY_COST, EARLY_SALE, FUND, clawback } from "../model/fund";
import { Aside, Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import { useWide } from "../ui/useWide";
import { FundGrid } from "./FundGrid";
import styles from "../models/models.module.css";
import fund from "./fund.module.css";

export const REST_STOPS = [0, 30, 50, 90, 100, 200];
const pct = `${CARRY * 100}%`;

export function F6Clawback() {
  const [rest, setRest] = useState(30);
  const { R, taken, owed, giveBack, stillDue } = clawback(rest);
  const perRow = useWide() ? 20 : 10;
  return (
    <Section n={6} title="Carry taken too early">
      <Prose>
        <p>
          So far carry has been paid at the end, on the whole fund: LPs get every dollar back, then you take 20% of
          what's left. Some funds pay carry earlier, company by company, as each one is sold. That's lovely for you,
          and a risk for LPs.
        </p>
        <p>
          Say that in year 6 one company that cost $10M sells for $150M. Paid company by company, your carry is 20%
          of that company's $140M profit, so you take $28M now. Then the rest of the fund comes in. Drag what the rest
          returns.
        </p>
      </Prose>
      <Wide label="Carry taken early, against carry owed on the whole fund">
        <Slider label="What the rest of the fund returns" value={rest} stops={REST_STOPS} format={formatMoney} onChange={setRest} />
        <dl className={styles.facts}>
          <div>
            <dt>Carry you took on the early sale</dt>
            <dd data-testid="f6c-taken"><span className={styles.muteInline}>{pct} × ({formatMoney(EARLY_SALE)} − {formatMoney(EARLY_COST)}) = </span>{formatMoney(taken)}</dd>
          </div>
          <div>
            <dt>What the whole fund returned</dt>
            <dd><span className={styles.muteInline}>{formatMoney(EARLY_SALE)} + {formatMoney(rest)} = </span>{formatMoney(R)}</dd>
          </div>
          <div>
            <dt>Carry you were owed on the whole fund</dt>
            <dd data-testid="f6c-owed">
              <span className={styles.muteInline}>
                {R >= FUND ? `${pct} × (${formatMoney(R)} − ${formatMoney(FUND)}) = ` : `${formatMoney(R)} is less than ${formatMoney(FUND)}, so `}
              </span>{formatMoney(owed)}
            </dd>
          </div>
          <div>
            <dt>You give back</dt>
            <dd data-testid="f6c-back">
              {giveBack > 0 && <span className={styles.muteInline}>{formatMoney(taken)} − {formatMoney(owed)} = </span>}{formatMoney(giveBack)}
            </dd>
          </div>
          <div>
            <dt>Still owed to you at the end</dt>
            <dd data-testid="f6c-due">
              {stillDue > 0 && <span className={styles.muteInline}>{formatMoney(owed)} − {formatMoney(taken)} = </span>}{formatMoney(stillDue)}
            </dd>
          </div>
        </dl>
        <div className={fund.paychecks}>
          <div>
            <p className={styles.figLabel}>Carry you took: {formatMoney(taken)}{giveBack > 0 ? `, dashed ones go back` : ""}</p>
            <FundGrid label={`${taken} notes of carry taken, ${giveBack} of them given back`} perRow={perRow} size={9}
              runs={[{ count: taken - giveBack, color: "you" }, { count: giveBack, color: "ghost" }]} />
          </div>
          <div>
            <p className={styles.figLabel}>Carry you were owed: {formatMoney(owed)}</p>
            <FundGrid label={`${owed} notes of carry owed`} perRow={perRow} size={9} runs={[{ count: owed, color: "you" }]} />
          </div>
        </div>
      </Wide>
      <Prose>
        <p>
          When the rest of the fund disappoints, you've taken more carry than the whole fund ever earned. The fund's
          agreement makes you pay the difference back, and that's called the clawback. If the rest returns $30M you give
          back $12M. If it returns nothing, you give back $18M.
        </p>
        <p>
          The catch is that by then the money may be spent, or taxed. So LPs often ask for part of early carry to sit
          in escrow until the fund is done, or they ask for the whole-fund version, where you're paid nothing until
          they're whole. People call the two versions deal by deal, or American, and whole fund, or European.
        </p>
      </Prose>
      <Aside>
        <p>Real deal-by-deal terms usually return each company's share of fees too before carry is paid. Leaving that out keeps the sum to one new idea.</p>
      </Aside>
      <Rule>Carry taken early is only borrowed until the LPs are whole.</Rule>
    </Section>
  );
}
