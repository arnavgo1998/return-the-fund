import { useState } from "react";
import { formatMoney, formatMultiple } from "../model/format";
import { NAV, YEARS, fundYear } from "../model/fund";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import styles from "../models/models.module.css";
import fund from "./fund.module.css";

const YEAR_LIST = Array.from({ length: YEARS }, (_, i) => i + 1);
const TOP = 3.6; // just above the paper score's peak, 3.11×

export function F7Paper() {
  const [year, setYear] = useState(4);
  const now = fundYear(year);
  const nav = NAV[year - 1];
  return (
    <Section n={7} title="Paper and cash">
      <Prose>
        <p>
          If LPs see nothing for years, how do they know whether you're any good? They look at two scores. The first is
          simple: the cash they've got back, divided by the cash they've paid in. The second adds the paper value of the
          companies you still hold, what they'd be worth at the price of their latest round.
        </p>
      </Prose>
      <Wide label="Two scores, year by year">
        <Slider label="Year" value={year} min={1} max={YEARS} step={1} format={(v) => `Year ${v}`} onChange={setYear} />
        <div className={fund.chart} role="img"
          aria-label={`Cash score and paper score by year: ${YEAR_LIST.map((y) => `year ${y} cash ${formatMultiple(fundYear(y).dpi)}, paper ${formatMultiple(fundYear(y).tvpi)}`).join("; ")}.`}>
          {YEAR_LIST.map((y) => {
            const s = fundYear(y);
            return (
              <div key={y} className={fund.col} data-future={y > year} data-now={y === year}>
                <div className={fund.plot}>
                  <span className={fund.paperBar} style={{ height: `${(s.tvpi / TOP) * 100}%` }} />
                  <span className={fund.cashBar} style={{ height: `${(s.dpi / TOP) * 100}%` }} />
                </div>
                <span className={fund.colYear}>{y}</span>
              </div>
            );
          })}
        </div>
        <p className={fund.key}>
          <span><i className={fund.keyPaper} /> paper and cash</span>
          <span><i className={fund.keyCash} /> cash only</span>
        </p>
        <dl className={styles.facts}>
          <div>
            <dt>Paper value of the companies still held</dt>
            <dd>{formatMoney(nav)}</dd>
          </div>
          <div>
            <dt>Cash back ÷ paid in <span className={styles.term}>DPI</span></dt>
            <dd data-testid="f6-dpi"><span className={styles.muteInline}>{formatMoney(now.back)} ÷ {formatMoney(now.paidIn)} = </span>{formatMultiple(now.dpi)}</dd>
          </div>
          <div>
            <dt>(Cash back + paper value) ÷ paid in <span className={styles.term}>TVPI</span></dt>
            <dd data-testid="f6-tvpi"><span className={styles.muteInline}>({formatMoney(now.back)} + {formatMoney(nav)}) ÷ {formatMoney(now.paidIn)} = </span>{formatMultiple(now.tvpi)}</dd>
          </div>
        </dl>
      </Wide>
      <Prose>
        <p>
          Start at year 1. The paper score is 0.89×, below 1× before a single company has moved, because LPs have paid
          a year of fees that never got invested. Now look at year 4. Cash back is still zero, but on paper the fund is
          at 1.33×. Year 4 is also about when you go out to raise your next fund, because a GP can't wait ten years
          between funds. So you raise fund two on paper.
        </p>
        <p>
          Paper isn't cash, though. Companies get marked up at every new round, and some of those marks never turn into
          a sale. In this fund the paper score peaks at 3.11× in year 9 and lands at 3× once all the cash is in. LPs know
          this, so in the end they judge you on the cash. The industry has names for both: the cash score is DPI,
          distributions over paid-in, and the paper score is TVPI, total value over paid-in.
        </p>
      </Prose>
      <Rule>You raise the next fund on paper. LPs judge you on cash.</Rule>
    </Section>
  );
}
