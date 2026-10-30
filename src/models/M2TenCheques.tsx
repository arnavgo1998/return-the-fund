import { useState } from "react";
import { useWide } from "../ui/useWide";
import { OTHERS, fundReturn } from "../model/portfolio";
import { Blocks } from "../ui/Blocks";
import { Equation } from "../ui/Equation";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import styles from "./models.module.css";

const SCALE = 50;
/** The columns read left to right in these groups; `span` is how many columns each covers. */
const GROUPS = [{ name: "lost", span: 5 }, { name: "money back", span: 2 }, { name: "3×", span: 2 }, { name: "winner", span: 1 }];

export function M2TenCheques() {
  const [winner, setWinner] = useState(0);
  const wide = useWide();
  const total = fundReturn(winner);
  const verdict =
    total < 10 ? `$${total}M back for $10M put in. The fund loses.`
    : total < 30 ? `$${total}M back for $10M put in. The fund is back${total === 10 ? "" : `, plus $${total - 10}M`}. Not much for ten years of other people's money.`
    : `$${total}M back for $10M put in. The fund comes back ${Math.floor((total / 10) * 10) / 10}×.`;
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
      <Wide label="Ten cheques from a $10M fund">
        <p className={styles.figLabel}>Money back from each company, in $M · each note is $1M</p>
        <div className={styles.columns} role="img"
          aria-label={`$M back from each company: ${returns.join(", ")}. Total $${total}M of $10M put in.`}>
          {returns.map((r, i) => (
            <div key={i} className={styles.column} data-winner={i === 9}>
              <Blocks count={r} color={i === 9 ? "you" : "ink"} label="" perRow={wide ? 2 : 1} size={wide ? 8 : 7} shape="note" />
              <span className={styles.colBase} />
              <span className={styles.colLabel} data-testid={i === 9 ? "winner-label" : undefined}>{r}</span>
            </div>
          ))}
        </div>
        <div className={styles.groups} aria-hidden>
          {GROUPS.map((g) => (
            <span key={g.name} style={{ gridColumn: `span ${g.span}` }} data-winner={g.name === "winner"}>{g.name}</span>
          ))}
        </div>
        <Slider label="What the winner returns, $M" value={winner} min={0} max={40} step={1}
          format={(v) => `$${v}M`} onChange={setWinner} />
        <Equation>
          <span className={styles.unitTag}>$M</span>
          <span data-testid="m2-sum">
            {OTHERS.join(" + ")} + <span className={styles.youInline}>{winner}</span> ={" "}
            <strong data-testid="fund-total">{total}</strong>
          </span>
        </Equation>
        <div className={styles.track} aria-hidden>
          <div className={styles.trackFill} style={{ width: `${(Math.min(total, SCALE) / SCALE) * 100}%` }} />
          <span className={styles.trackMark} style={{ left: `${(10 / SCALE) * 100}%` }}><b>$10M</b> fund back</span>
          <span className={styles.trackMark} style={{ left: `${(30 / SCALE) * 100}%` }}><b>$30M</b> 3× the fund</span>
        </div>
        <p className={styles.verdict} aria-live="polite">{verdict}</p>
      </Wide>
      <Prose>
        <p>
          Push the winner to $2M and the fund gets its money back: $8M + $2M = $10M. Push it to $22M and the fund
          triples: $8M + $22M = $30M.
        </p>
        <p>
          Now look at the other nine. If the two good ones had only given the money back, the total would drop by $4M.
          The winner moves it by $20M. Peter Thiel puts it as a law in <em>Zero to One</em>: the best
          investment in a good fund returns as much as all the others put together.
        </p>
        <p>This is where I first felt it. Nine of these ten decisions barely matter. One of them is the whole fund.</p>
      </Prose>
      <Rule>One company has to carry the fund. The rest barely matter.</Rule>
    </Section>
  );
}
