import { useState } from "react";
import { formatMoney, formatMultiple } from "../model/format";
import { GP_COMMIT, splitByCommitment } from "../model/fund";
import { Chip } from "../ui/Equation";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import { FundGrid } from "./FundGrid";
import styles from "../models/models.module.css";

export const R_STOPS = [0, 50, 100, 150, 200, 300, 350, 500];

export function F1Money() {
  const [R, setR] = useState(300);
  const { lp, gp } = splitByCommitment(R);
  const verdict =
    R === 0 ? "Everyone loses everything, you included."
    : R < 100 ? "Everyone gets back less than they put in, you included."
    : `Your $1M became ${formatMoney(gp)}, the same ${formatMultiple(R / 100)} every LP got.`;
  return (
    <Section n={1} title="Other people's money">
      <Prose>
        <p>
          Who actually puts up the $100M? Mostly not you. LPs, things like pension funds, university endowments and
          wealthy families, promise $99M between them. You put in $1M of your own, which is about normal for a GP.
        </p>
        <p>
          Now say the fund's investments, all of them together, eventually return <Chip letter="R" />. With no fees and
          no profit share yet, everyone gets back in proportion to what they put in.
        </p>
      </Prose>
      <Wide label="Who owns the fund">
        <div className={styles.split}>
          <div>
            <p className={styles.figLabel}>The fund: 100 notes of $1M</p>
            <FundGrid label="99 notes from LPs and 1 note of yours"
              runs={[{ count: 99, color: "a" }, { count: 1, color: "you" }]} />
          </div>
          <div className={styles.grow}>
            <Slider label="What the fund's investments return" letter="R" value={R} stops={R_STOPS} format={formatMoney} onChange={setR} />
            <dl className={styles.facts}>
              <div>
                <dt>LPs put in $99M, so they get</dt>
                <dd data-testid="f1-lp"><span className={styles.muteInline}>{100 - GP_COMMIT * 100}% × {formatMoney(R)} = </span>{formatMoney(lp)}</dd>
              </div>
              <div>
                <dt>You put in $1M, so you get</dt>
                <dd data-testid="f1-gp"><span className={styles.muteInline}>{GP_COMMIT * 100}% × {formatMoney(R)} = </span>{formatMoney(gp)}</dd>
              </div>
            </dl>
            <p className={styles.verdict} aria-live="polite">{verdict}</p>
          </div>
        </div>
      </Wide>
      <Prose>
        <p>
          So far, running a $100M fund for ten years pays you exactly what your own $1M earns. That can't be the
          whole deal. Somebody has to pay for the office, the salaries and a decade of work, and somebody has to reward
          you for picking well. The next two models are how GPs actually get paid.
        </p>
      </Prose>
      <Rule>It's mostly other people's money. On your own $1M, you earn like any LP.</Rule>
    </Section>
  );
}
