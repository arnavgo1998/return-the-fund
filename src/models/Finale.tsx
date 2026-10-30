import { useState } from "react";
import { formatMoney, formatShare } from "../model/format";
import { exitNeeded, shareAtEnd } from "../model/napkin";
import { Prose, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import { FUND_STOPS } from "./M3Napkin";
import styles from "./models.module.css";

const CHEQUE_STOPS = [0.25, 0.5, 1, 2, 3, 5, 10];
const POST_STOPS = [2, 5, 10, 15, 20, 30, 50, 100];
const SOLD_STOPS = [0.1, 0.15, 1 / 6, 0.2, 0.25, 0.3];
const MAX_ROUNDS = 4;

export function Finale() {
  const [fund, setFund] = useState(10);
  const [cheque, setCheque] = useState(1);
  const [post, setPost] = useState(10);
  const [rounds, setRounds] = useState<number[]>([0.2, 1 / 6]);
  const start = Math.min(cheque / post, 1);
  const end = shareAtEnd(Math.min(cheque, post), post, rounds);
  const needed = exitNeeded(fund, end);
  const setRound = (i: number, v: number) => setRounds((r) => r.map((x, j) => (j === i ? v : x)));
  return (
    <Section title="The napkin">
      <Prose>
        <p>
          Here is everything above, folded into the sum I can now do on a napkin before any cheque: what I buy, what
          I'll still own when the company sells, and what that sale has to be.
        </p>
      </Prose>
      <Wide label="The napkin calculator">
        <div className={styles.napkin}>
          <div className={styles.sliders}>
            <Slider label="The fund" value={fund} stops={FUND_STOPS} format={formatMoney} onChange={setFund} />
            <Slider label="My cheque" value={cheque} stops={CHEQUE_STOPS} format={formatMoney} onChange={setCheque} />
            <Slider label="The company after my money" value={post} stops={POST_STOPS} format={formatMoney} onChange={setPost} />
          </div>
          <p className={styles.figLabel}>Rounds after mine, and how much of the company each sells</p>
          {rounds.map((r, i) => (
            <Slider key={i} label={`Round ${i + 1} sells`} value={r} stops={SOLD_STOPS} format={formatShare} onChange={(v) => setRound(i, v)} />
          ))}
          <div className={styles.roundButtons}>
            <button type="button" className={styles.textButton} disabled={rounds.length >= MAX_ROUNDS}
              onClick={() => setRounds((r) => [...r, 0.2])}>Add a round</button>
            <button type="button" className={styles.textButton} disabled={rounds.length === 0}
              onClick={() => setRounds((r) => r.slice(0, -1))}>Remove a round</button>
          </div>
          <div className={styles.napkinSum} aria-live="polite">
            <p>I buy {formatMoney(cheque)} ÷ {formatMoney(post)} = <strong>{formatShare(start)}</strong></p>
            {rounds.length > 0 && (
              <p>
                × {rounds.map((r) => `(1 − ${formatShare(r)})`).join(" × ")} ={" "}
                <strong data-testid="share-at-end">{formatShare(end)}</strong> at the end
              </p>
            )}
            {rounds.length === 0 && <p>No later rounds: <strong data-testid="share-at-end">{formatShare(end)}</strong> at the end</p>}
            <p className={styles.napkinBottom}>
              {formatMoney(fund)} ÷ {formatShare(end)} = <strong data-testid="napkin-exit">{formatMoney(needed)}</strong>
            </p>
            <p className={styles.versusSub}>
              The sale this company needs for my share alone to give the whole fund back.
              {rounds.length > 0 && " Below the last round's price, the later investors' money comes out first."}
            </p>
          </div>
        </div>
      </Wide>
      <Prose>
        <p>
          That's the model. It started with one block that could only ever be lost once, against a sale with no
          ceiling. Every step after that added one unknown: ten cheques and the one that carries them, the napkin, more
          squares, more money into the winner, who gets paid first, what the price does.
        </p>
        <p>
          What surprised me most is where the work sits. Almost all of it happens before the cheque: the price, the
          share I'll keep, what the company has to become, who stands in front of me. After the cheque, the sum only
          cares about one more decision: when one company starts to look like <em>the</em> one, put more in. Prepare
          widely. Then commit.
        </p>
        <p>
          I wrote this to check that I'd understood the book. If I've got something wrong, I'd like to know.
        </p>
      </Prose>
      <div className={styles.reading}>
        <p className={styles.figLabel}>Read these</p>
        <ul>
          <li>Scott Kupor, <em>Secrets of Sand Hill Road</em>. The book this notebook works through.</li>
          <li>Peter L. Bernstein, <em>Against the Gods</em>. On why a known downside and an unknown upside are different things.</li>
          <li>Peter Thiel with Blake Masters, <em>Zero to One</em>. On the power law: one company carrying the fund.</li>
          <li>
            Chain Bear, <a href="https://www.youtube.com/watch?v=TNQuUZYHJdE"><em>Building an F1 Strategy from the Bare Basics</em></a>.
            The method: start tiny, add one variable at a time.
          </li>
        </ul>
      </div>
    </Section>
  );
}
