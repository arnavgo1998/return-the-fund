import { useState } from "react";
import { ROUND_B } from "../model/company";
import { followOnCrossover, sharesFor } from "../model/followOn";
import { formatShare } from "../model/format";
import { Blocks } from "../ui/Blocks";
import { Chip, Equation } from "../ui/Equation";
import { Aside, Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import styles from "./models.module.css";

export const HIT_STOPS = [0.02, 0.05, 0.1, 0.125, 0.2, 0.25, 1 / 3, 0.5];
export const SURVIVAL_STOPS = [0.25, 0.5, 0.75, 1];
const SEED_PRICE = 0.1;
const oneIn = (p: number) => `1 in ${Math.round(1 / p)}`;
const round2 = (n: number) => Math.round(n * 100) / 100;

export function M5FollowOn() {
  const [h, setH] = useState(0.1);
  const [twoUnknowns, setTwoUnknowns] = useState(false);
  const [s, setS] = useState(1);
  const survival = twoUnknowns ? s : 1;
  const follow = sharesFor(1, ROUND_B.price);
  const fresh = sharesFor(1, SEED_PRICE);
  const followExpected = survival * follow;
  const freshExpected = h * fresh;
  const cross = followOnCrossover(SEED_PRICE, ROUND_B.price, survival);
  const verdict =
    Math.abs(followExpected - freshExpected) < 1e-9 ? "Dead equal. Either cheque buys the same squares, on average."
    : followExpected > freshExpected ? "Follow on: the company that's already working gives more squares, on average."
    : "Write the new cheque: cheap squares in a fresh bet win at these odds.";
  return (
    <Section n={5} title="More money into the winner, or a new bet?">
      <Prose>
        <p>
          Here's a decision Kupor spends a lot of time on, and one I'd never thought of as a decision at all. The
          company from Model 4 is raising its Series B. I have $1M left in the fund. Do I put it into Series B, or
          into a brand-new company at the seed price?
        </p>
        <p>
          At Series B a square costs $0.8M, so $1M buys 1.25 squares. At seed, a square costs $0.1M, so $1M buys 10,
          but of a company that may never get this far. Call that chance <Chip letter="h" />.
        </p>
        <p>
          To keep it to one variable, I'll assume the new company, if it works, ends up exactly like this one: same
          sale, same rounds after me. Then I'm only comparing squares.
        </p>
      </Prose>
      <Wide label="Follow on, or a new bet">
        <div className={styles.versus}>
          <div>
            <p className={styles.figLabel}>Follow on: $1M ÷ $0.8M a square</p>
            <Blocks count={follow} color="you" label={`${follow} squares`} size={18} />
            <p className={styles.versusNum}>= <span data-testid="follow-squares">{follow} squares</span></p>
            <p className={styles.versusSub}>{twoUnknowns ? `× ${formatShare(survival)} survives = ${round2(followExpected)} on average` : "in a company that already got this far"}</p>
          </div>
          <div>
            <p className={styles.figLabel}>New bet: $1M ÷ $0.1M a square</p>
            <span className={styles.stack}>
              <Blocks count={fresh} color="ghost" label="" size={18} />
              <span className={styles.stackOver}><Blocks count={freshExpected} color="a" label={`${round2(freshExpected)} squares on average`} size={18} /></span>
            </span>
            <p className={styles.versusNum}>= <span data-testid="seed-squares">{fresh} squares</span></p>
            <p className={styles.versusSub}>× {oneIn(h)} comes good = {round2(freshExpected)} on average</p>
          </div>
        </div>
        <Slider label="Chance a fresh bet gets this far" value={h} stops={HIT_STOPS} format={oneIn} onChange={setH} />
        {twoUnknowns && (
          <Slider label="Chance this company survives to a sale" value={s} stops={SURVIVAL_STOPS} format={formatShare} onChange={setS} />
        )}
        <Equation>
          <span data-testid="m5-equation">
            {twoUnknowns && <><Chip letter="s" /> × </>}1.25 = <Chip letter="h" /> × 10 → <Chip letter="h" /> ={" "}
            {twoUnknowns && `${formatShare(survival)} × `}1.25 ÷ 10 = <strong data-testid="crossover">{oneIn(cross)}</strong>
          </span>
        </Equation>
        <p className={styles.verdict} data-testid="m5-verdict" aria-live="polite">{verdict}</p>
        {!twoUnknowns && (
          <button type="button" className={styles.textButton} onClick={() => setTwoUnknowns(true)}>
            Add one more unknown: this company might still fail
          </button>
        )}
      </Wide>
      <Prose>
        <p>
          So 1.25 = h × 10, which means h = 1 in 8. If I honestly expect fewer than one in eight of my new seed bets to
          get as far as this company has, putting more money into this company buys more. And look at what 1 in 8 is:
          $0.1M ÷ $0.8M. The old price over the new price. Nothing else went into it.
        </p>
        <p>
          Then the second unknown. Reaching Series B isn't the same as selling well. If this company has only an even
          chance of getting to a sale, the follow-on is worth half as much, and the crossover halves too: one in sixteen.
        </p>
        <p>
          This is the "prepare widely, then commit" idea, done as arithmetic. Early on, when I know very little, cheap
          squares across many companies are the best odds I can buy. Once one company has shown me something the
          others haven't, the sum starts pushing money towards it. Buying enough of each new round to keep my share has
          a name: my <em>pro rata</em>.
        </p>
      </Prose>
      <Aside>
        <p>Funds plan for this. A large part of each fund is held back as reserves for follow-on cheques, rather than spent on first cheques.</p>
      </Aside>
      <Rule>Follow on when your odds on a fresh bet are worse than the old price ÷ the new price. Prepare widely, then concentrate on what's working.</Rule>
    </Section>
  );
}
