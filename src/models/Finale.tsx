import { useState } from "react";
import { formatMoney, formatShare } from "../model/format";
import { exitNeeded, shareAtEnd } from "../model/napkin";
import { Prose, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import { FUND_STOPS } from "./M3Napkin";
import styles from "./models.module.css";

export const CHEQUE_STOPS = [0.25, 0.5, 1, 2, 3, 5, 10];
const POST_STOPS = [2, 5, 10, 15, 20, 30, 50, 100];
/** The company after your money is always worth more than your money: the founders keep something. */
const postStopsFor = (cheque: number) => POST_STOPS.filter((p) => p > cheque);
const SOLD_STOPS = [0.1, 0.15, 1 / 6, 0.2, 0.25, 0.3];
const MAX_ROUNDS = 4;

export function Finale() {
  const [fund, setFund] = useState(10);
  const [cheque, setCheque] = useState(1);
  const [post, setPost] = useState(10);
  const [rounds, setRounds] = useState<number[]>([0.2, 1 / 6]);
  const start = cheque / post;
  const end = shareAtEnd(cheque, post, rounds);
  const chooseCheque = (c: number) => {
    setCheque(c);
    if (post <= c) setPost(postStopsFor(c)[0]);
  };
  const needed = exitNeeded(fund, end);
  const setRound = (i: number, v: number) => setRounds((r) => r.map((x, j) => (j === i ? v : x)));
  return (
    <Section title="The napkin">
      <Prose>
        <p>
          The calculator below combines every model into one sum an investor can do before writing a cheque: the share you buy, the share left after later rounds, and the sale that share needs.
        </p>
      </Prose>
      <Wide label="The napkin calculator">
        <div className={styles.napkin}>
          <div className={styles.sliders}>
            <Slider label="The fund" letter="F" value={fund} stops={FUND_STOPS} format={formatMoney} onChange={setFund} />
            <Slider label="Your cheque" value={cheque} stops={CHEQUE_STOPS} format={formatMoney} onChange={chooseCheque} />
            <Slider label="The company after your money" value={post} stops={postStopsFor(cheque)} format={formatMoney} onChange={setPost} />
          </div>
          <p className={styles.figLabel}>Rounds after yours, and how much of the company each sells</p>
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
            <p>You buy {formatMoney(cheque)} ÷ {formatMoney(post)} = <strong>{formatShare(start)}</strong></p>
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
              The sale this company needs for your share alone to return the whole fund.
              {rounds.length > 0 && " Below the last round's price, every investor takes their money back before the founders' squares are paid."}
            </p>
          </div>
        </div>
      </Wide>
      <Prose>
        <p>
          The models started with a $1M cheque that could only be lost once, against a sale with no upper limit. Each step added one unknown: ten cheques and the one that carries them, the napkin sum, dilution, follow-on cheques, liquidation preferences and the price itself.
        </p>
        <p>
          Most of the work happens before the cheque. The price, the share you will keep, the size the company has to reach and the investors ahead of you can all be worked out in advance. After the cheque, the main decision left is whether to put more money into the company that starts to look like the winner.
        </p>
      </Prose>
      <div className={styles.reading}>
        <p className={styles.figLabel}>Further reading</p>
        <ul>
          <li>Scott Kupor, <em>Secrets of Sand Hill Road</em>. The source for every model on this page.</li>
          <li>Peter L. Bernstein, <em>Against the Gods</em>. On why a known downside and an unknown upside are different things.</li>
          <li>Peter Thiel with Blake Masters, <em>Zero to One</em>. On the power law: one company carrying the fund.</li>
          <li>
            Chain Bear, <a href="https://www.youtube.com/watch?v=TNQuUZYHJdE"><em>Building an F1 Strategy from the Bare Basics</em></a>.
            The method used here: start small and add one variable at a time.
          </li>
        </ul>
      </div>
    </Section>
  );
}
