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
    Math.abs(followExpected - freshExpected) < 1e-9
      ? `Your guess, ${oneIn(h)}, is exactly break-even. Dead equal: either cheque buys ${round2(freshExpected)} squares on average.`
    : followExpected > freshExpected
      ? `Your guess, ${oneIn(h)}, is a longer shot than break-even, ${oneIn(cross)}. Follow on: ${round2(followExpected)} squares beats ${round2(freshExpected)} on average.`
    : `Your guess, ${oneIn(h)}, is better odds than break-even, ${oneIn(cross)}. Write the new cheque: ${round2(freshExpected)} squares beats ${round2(followExpected)} on average.`;
  return (
    <Section n={5} title="More money into the winner, or a new bet?">
      <Prose>
        <p>
          Kupor spends a lot of time on a decision that comes after the first cheque. The company from Model 4 is raising its Series B, and the fund has $1M left. You can put it into Series B, or into a new company at the seed price.
        </p>
        <p>
          At Series B a square costs $0.8M, so $1M buys 1.25 squares. At seed a square costs $0.1M, so $1M buys 10, but in a company that may never get this far. Call the chance that it does <Chip letter="h" />.
        </p>
        <p>
          To keep to one variable, assume the new company, if it succeeds, ends up exactly like this one, with the same sale and the same later rounds. Then the two choices can be compared in squares alone.
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
        <Slider label="Chance a fresh bet gets this far: your guess" letter="h" value={h} stops={HIT_STOPS} format={oneIn} onChange={setH} />
        {twoUnknowns && (
          <Slider label="Chance this company survives to a sale" letter="s" value={s} stops={SURVIVAL_STOPS} format={formatShare} onChange={setS} />
        )}
        <p className={styles.figLabel}>Break-even odds</p>
        <p className={styles.versusSub}>
          Where both cheques buy the same squares on average. The prices{twoUnknowns ? " and s" : ""} set it, so
          moving your guess for <Chip letter="h" /> doesn't move it.
        </p>
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
          Setting 1.25 = h × 10 gives h = 1 in 8. If fewer than one in eight new seed bets reach this stage, the follow-on buys more. The break-even is just $0.1M ÷ $0.8M, the old price divided by the new one.
        </p>
        <p>
          The second unknown is that reaching Series B does not guarantee a good sale. If this company has an even chance of getting to one, the follow-on is worth half as much, and the break-even halves as well, to one in sixteen.
        </p>
        <p>
          Early on, when little is known, cheap squares spread across many companies give the best odds. Once one company has shown more than the others, the same sum starts to favour putting more money into it. Buying enough of each new round to keep your share is called taking your <em>pro rata</em>.
        </p>
      </Prose>
      <Aside>
        <p>
          Funds plan for this by holding back a large part of each fund as reserves for follow-on cheques, instead of spending it all on first cheques.
        </p>
      </Aside>
      <Rule>Follow on when a fresh bet's chance of getting this far is lower than the old price ÷ the new price.</Rule>
    </Section>
  );
}
