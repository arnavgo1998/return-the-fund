import { useState } from "react";
import { capTable, shareOf, totalShares } from "../model/company";
import { followOnCrossover, sharesFor } from "../model/followOn";
import { formatMoney, formatShare } from "../model/format";
import { exitNeeded } from "../model/napkin";
import { Blocks } from "../ui/Blocks";
import { Prose, Rule, Section, Wide } from "../ui/Section";
import styles from "./models.module.css";

type Market = "normal" | "hot" | "cold";
const MARKETS: { id: Market; name: string; seed: number; b: number }[] = [
  { id: "normal", name: "As before", seed: 0.1, b: 0.8 },
  { id: "hot", name: "Hot deal", seed: 0.2, b: 0.8 },
  { id: "cold", name: "Cold market", seed: 0.1, b: 0.3 },
];
const oneIn = (p: number) => `1 in ${Math.round(1 / p)}`;
const squares = (n: number) => `${Math.round(n * 100) / 100} squares`;

export function M7Price() {
  const [market, setMarket] = useState<Market>("normal");
  const m = MARKETS.find((x) => x.id === market)!;
  const first = sharesFor(1, m.seed);
  const end = capTable("b", m.seed, m.b);
  const shareEnd = shareOf(end, "you");
  const follow = sharesFor(1, m.b);
  return (
    <Section n={7} title="Other investors set the price">
      <Prose>
        <p>
          Every model so far handed me the price. Nobody hands you the price. Other investors want the same companies,
          and the price moves with how many of them want in, and how brave they're feeling.
        </p>
        <p>
          Two cases. In a <strong>hot deal</strong>, a rival fund offers the founders $0.2M a square at seed, and to win
          I have to match it. In a <strong>cold market</strong>, Series B happens in a downturn, when most investors are
          scared, and prices at $0.3M a square instead of $0.8M.
        </p>
      </Prose>
      <Wide label="What the price does">
        <div className={styles.segmented} role="group" aria-label="Market">
          {MARKETS.map((x) => (
            <button key={x.id} type="button" aria-pressed={market === x.id} onClick={() => setMarket(x.id)}>{x.name}</button>
          ))}
        </div>
        <div className={styles.versus}>
          <div>
            <p className={styles.figLabel}>My first $1M, at {formatMoney(m.seed)} a square</p>
            <Blocks count={first} color="you" label={squares(first)} size={18} />
            <p className={styles.versusNum}>
              <span className={styles.muteInline} data-testid="first-working-7">$1M ÷ {formatMoney(m.seed)} =</span>{" "}
              <span data-testid="first-squares">{squares(first)}</span>
            </p>
            <p className={styles.versusSub}>
              share at the end, after Series A and B:{" "}
              <span data-testid="share-end-7">{Math.round(first * 100) / 100} ÷ {totalShares(end)} = {formatShare(shareEnd)}</span>
            </p>
            <p className={styles.versusSub}>
              sale the $10M fund needs:{" "}
              <span data-testid="napkin-7">$10M ÷ {formatShare(shareEnd)} ={" "}
                <strong data-testid="exit-needed-7" className={styles.inkStrong}>{formatMoney(exitNeeded(10, shareEnd))}</strong></span>
            </p>
          </div>
          <div>
            <p className={styles.figLabel}>My reserve $1M, at {formatMoney(m.b)} a square</p>
            <Blocks count={follow} color="you" label={squares(follow)} size={18} />
            <p className={styles.versusNum}>
              <span className={styles.muteInline} data-testid="follow-working-7">$1M ÷ {formatMoney(m.b)} =</span>{" "}
              <span data-testid="follow-squares-7">{squares(follow)}</span>
            </p>
            <p className={styles.versusSub}>
              follow on unless a fresh bet beats the old price ÷ the new price:{" "}
              <span data-testid="crossover-working-7">$0.1M ÷ {formatMoney(m.b)} ={" "}
                <strong data-testid="crossover-7" className={styles.inkStrong}>{oneIn(followOnCrossover(0.1, m.b))}</strong></span>
            </p>
          </div>
        </div>
      </Wide>
      <Prose>
        <p>
          In the hot deal my $1M buys 5 squares instead of 10. Every round after that dilutes those 5 exactly as before,
          so I end up with half the share, and the napkin doubles: the company now has to sell for $300M to give my fund
          back, not $150M. Paying up isn't wrong. It just has to be paid for by a bigger company.
        </p>
        <p>
          In the cold market it runs the other way. My reserve $1M buys 3.33 squares instead of 1.25, and the
          follow-on break-even jumps from 1 in 8 to 1 in 3. I don't believe one in three of my fresh bets get this far,
          so the follow-on wins easily. The money I held back is worth most exactly when nobody else wants to spend theirs.
        </p>
        <p>
          This is where "risk without gambling" finally became concrete for me. A gambler asks whether this one will win.
          The questions here are different: what does a square cost, how many will I still have, what must the company
          be worth, who is ahead of me? Every one of them can be answered before the cheque. Only <em>E</em> can't.
        </p>
      </Prose>
      <Rule>Paying up halves your squares and doubles the exit you need. Money held back is worth most when everyone else is scared.</Rule>
    </Section>
  );
}
