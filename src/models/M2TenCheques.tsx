import { useState } from "react";
import { OTHERS, fundReturn } from "../model/portfolio";
import { Blocks } from "../ui/Blocks";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import styles from "./models.module.css";

const SCALE = 50;

export function M2TenCheques() {
  const [winner, setWinner] = useState(0);
  const total = fundReturn(winner);
  const verdict =
    total < 10 ? `The fund loses: ${total} blocks back for 10 put in.`
    : total < 30 ? `The fund is back${total === 10 ? "" : `, plus ${total - 10}`}. Not much for ten years of other people's money.`
    : `The fund comes back ${Math.floor((total / 10) * 10) / 10}×.`;
  const returns = [...OTHERS, winner];
  return (
    <Section n={2} title="Ten cheques">
      <Prose>
        <p>
          One cheque is a coin I wouldn't flip on purpose. So take the next step: a $10M fund, ten cheques of $1M,
          each buying 10% of a different company.
        </p>
        <p>
          Kupor is blunt that most of them won't work. Here is a simplified version of the usual spread: five go to
          zero, two give the money back, two return three times what went in. The tenth is the one I haven't decided yet.
        </p>
      </Prose>
      <Wide label="Ten cheques from a ten-block fund">
        <div className={styles.columns} role="img"
          aria-label={`Blocks back from each company: ${returns.join(", ")}. Total ${total} of 10 put in.`}>
          {returns.map((r, i) => (
            <div key={i} className={styles.column} data-winner={i === 9}>
              <Blocks count={r} color={i === 9 ? "you" : "ink"} label="" perRow={2} size={11} />
              <span className={styles.colBase} />
              <span className={styles.colLabel}>{i === 9 ? "?" : r}</span>
            </div>
          ))}
        </div>
        <Slider label="What the winner returns, in blocks" value={winner} min={0} max={40} step={1}
          format={(v) => `${v}`} onChange={setWinner} />
        <div className={styles.track} aria-hidden>
          <div className={styles.trackFill} style={{ width: `${(Math.min(total, SCALE) / SCALE) * 100}%` }} />
          <span className={styles.trackMark} style={{ left: `${(10 / SCALE) * 100}%` }}><b>10</b> the fund back</span>
          <span className={styles.trackMark} style={{ left: `${(30 / SCALE) * 100}%` }}><b>30</b> three times the fund</span>
        </div>
        <p className={styles.verdict}>
          Fund total: <span className={styles.big} data-testid="fund-total">{total}</span> blocks.{" "}
          <span aria-live="polite">{verdict}</span>
        </p>
      </Wide>
      <Prose>
        <p>
          Push the winner to 2 blocks and the fund gets its money back. Push it to 22 and the fund triples.
        </p>
        <p>
          Now look at the other nine. If the two good ones had only given the money back, the total would drop by four
          blocks. The winner moves it by twenty. Peter Thiel puts it as a law in <em>Zero to One</em>: the best
          investment in a good fund returns as much as all the others put together.
        </p>
        <p>This is where I first felt it. Nine of these ten decisions barely matter. One of them is the whole fund.</p>
      </Prose>
      <Rule>One company has to carry the fund. The rest barely matter.</Rule>
    </Section>
  );
}
