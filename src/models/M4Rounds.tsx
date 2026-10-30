import { useState } from "react";
import { ROUND_A, ROUND_B, capTable, postMoney, preMoney, shareOf, totalShares } from "../model/company";
import { formatMoney, formatShare } from "../model/format";
import { exitNeeded } from "../model/napkin";
import { Blocks } from "../ui/Blocks";
import { COLOR, NAMES } from "../ui/players";
import { Aside, Prose, Rule, Section, Wide } from "../ui/Section";
import { useWide } from "../ui/useWide";
import styles from "./models.module.css";

type Stage = "seed" | "a" | "b";
const STAGES: { id: Stage; name: string }[] = [{ id: "seed", name: "Seed" }, { id: "a", name: "Series A" }, { id: "b", name: "Series B" }];

export function M4Rounds() {
  const [stage, setStage] = useState<Stage>("seed");
  const wide = useWide();
  const table = capTable(stage);
  const total = totalShares(table);
  const share = shareOf(table, "you");
  const before = stage === "seed" ? null : capTable(stage === "a" ? "seed" : "a");
  const round = stage === "a" ? ROUND_A : ROUND_B;
  const perRow = wide ? 25 : 10;
  return (
    <Section n={4} title="Other investors arrive">
      <Prose>
        <p>
          So far your 10% has stayed at 10%. In practice it shrinks every time the company raises money.
        </p>
        <p>
          When a company raises a new round, the new investor does not buy squares from you or from the founders. The company creates new squares and sells those. In Series A, Alex pays $5M for 25 new squares: $5M ÷ 25 = $0.2M a square, twice the $0.1M you paid. In Series B, Blake pays $20M for 25 more: $20M ÷ 25 = $0.8M a square.
        </p>
      </Prose>
      <Wide label="The company through three rounds">
        <div className={styles.segmented} role="group" aria-label="Round">
          {STAGES.map((s) => (
            <button key={s.id} type="button" aria-pressed={stage === s.id} onClick={() => setStage(s.id)}>{s.name}</button>
          ))}
        </div>
        <div className={styles.split}>
          <span role="img" className={styles.capGrid} style={{ gridTemplateColumns: `repeat(${perRow}, 13px)` }}
            aria-label={`${total} squares: ${table.map((h) => `${h.shares} ${NAMES[h.id]}`).join(", ")}`}>
            {table.map((h) => <Blocks key={h.id} count={h.shares} color={h.id} label="" />)}
          </span>
          <table className={styles.capTable}>
            <caption className={styles.srOnly}>Who owns the company after {STAGES.find((s) => s.id === stage)!.name}</caption>
            <thead>
              <tr><th scope="col">Who</th><th scope="col">Paid</th><th scope="col">÷ Price of a square</th><th scope="col">= Squares</th><th scope="col">Share</th></tr>
            </thead>
            <tbody>
              {table.map((h) => (
                <tr key={h.id}>
                  <th scope="row"><span className={styles.swatchInline} style={{ background: COLOR[h.id] }} />{NAMES[h.id]}</th>
                  {h.invested > 0 ? (
                    <>
                      <td data-testid={`cap-paid-${h.id}`}>{formatMoney(h.invested)}</td>
                      <td data-testid={`cap-price-${h.id}`}>{formatMoney(h.invested / h.shares)}</td>
                    </>
                  ) : (
                    <td colSpan={2} className={styles.capNote}>started the company</td>
                  )}
                  <td data-testid={`cap-squares-${h.id}`}>{h.shares}</td>
                  <td>
                    <span className={styles.capWorking}>{h.shares} ÷ {total} = </span>
                    <span data-testid={h.id === "you" ? "your-share" : `cap-share-${h.id}`}>{formatShare(shareOf(table, h.id))}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">All</th>
                <td data-testid="cap-paid-total">{formatMoney(table.reduce((m, h) => m + h.invested, 0))}</td>
                <td />
                <td data-testid="total-squares">{total}</td>
                <td>100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
        {before && (
          <dl className={`${styles.facts} ${styles.factsWide}`}>
            <div>
              <dt>Before the money <span className={styles.term}>pre-money</span></dt>
              <dd><span className={styles.muteInline}>{totalShares(before)} squares × {formatMoney(round.price)} = </span><span data-testid="pre-money">{formatMoney(preMoney(before, round))}</span></dd>
            </div>
            <div>
              <dt>After the money <span className={styles.term}>post-money</span></dt>
              <dd><span className={styles.muteInline}>{total} squares × {formatMoney(round.price)} = </span><span data-testid="post-money">{formatMoney(postMoney(before, round))}</span></dd>
            </div>
          </dl>
        )}
        <div className={styles.napkinStrip}>
          <p className={styles.figLabel}>The napkin sum, with your share after this round</p>
          <p className={styles.napkinLine}>$10M fund ÷ {formatShare(share)} = <strong data-testid="exit-small">{formatMoney(exitNeeded(10, share))}</strong></p>
          <p className={styles.napkinLine}>$100M fund ÷ {formatShare(share)} = <strong data-testid="exit-big">{formatMoney(exitNeeded(100, share))}</strong></p>
        </div>
      </Wide>
      <Prose>
        <p>
          Step through the rounds. Your 10 squares stay the same, but the company grows from 100 squares to 125 and then 150, so each square is a smaller part of it. This is called dilution. Nothing is taken from you. The company is simply cut into more squares.
        </p>
        <p>
          The table also defines two common terms. The price of a square in a round, times the squares that existed before the round, is the <em>pre-money</em> value. The same price times all the squares after the round is the <em>post-money</em>{" "}value. Your $1M at $0.1M a square in Model 1 set a post-money value of $10M.
        </p>
        <p>
          Dilution changes the napkin sum. The right share to divide by is the one you will still hold when the company is sold. For a $100M fund, the $1B target becomes $1.25B after Series A and $1.5B after Series B.
        </p>
      </Prose>
      <Aside>
        <p>
          Real companies also set aside squares for employees, called an option pool, which dilutes everyone a little more. It is left out here so that each model adds only one new variable.
        </p>
      </Aside>
      <Rule>Every round adds squares and never removes yours. Use the share you'll have at the end.</Rule>
    </Section>
  );
}
