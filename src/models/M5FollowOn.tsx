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
      ? `Your guess, ${oneIn(h)}, is a longer shot than break-even, ${oneIn(cross)}. Follow on in Orbit: ${round2(followExpected)} squares beats ${round2(freshExpected)} on average.`
    : `Your guess, ${oneIn(h)}, is better odds than break-even, ${oneIn(cross)}. Write the new cheque to Nova: ${round2(freshExpected)} squares beats ${round2(followExpected)} on average.`;
  return (
    <Section n={5} title="More money into the winner, or a new bet?">
      <Prose>
        <p>
          Here's a decision that sneaks up on you. Orbit is raising its Series B and you have $1M left. Do you put it into Orbit, or into Nova, a brand-new company raising its seed round?
        </p>
        <p>
          In Orbit, a square now costs $0.8M, so $1M buys 1.25 of them. In Nova, a square costs $0.1M, so $1M buys 10. The catch is that Nova might never get as far as Orbit has. Call that chance <Chip letter="h" />.
        </p>
        <p>
          To keep it to one new variable, assume Nova, if it makes it, turns out exactly like Orbit. Then you're just comparing squares.
        </p>
      </Prose>
      <Wide label="Follow on, or a new bet">
        <div className={styles.versus}>
          <div>
            <p className={styles.figLabel}>Follow on in Orbit: $1M ÷ $0.8M a square</p>
            <Blocks count={follow} color="you" label={`${follow} squares`} size={18} />
            <p className={styles.versusNum}>= <span data-testid="follow-squares">{follow} squares</span></p>
            <p className={styles.versusSub}>{twoUnknowns ? `× ${formatShare(survival)} chance Orbit survives = ${round2(followExpected)} on average` : "Orbit has already reached Series B"}</p>
          </div>
          <div>
            <p className={styles.figLabel}>New bet in Nova: $1M ÷ $0.1M a square</p>
            <span className={styles.stack}>
              <Blocks count={fresh} color="ghost" label="" size={18} />
              <span className={styles.stackOver}><Blocks count={freshExpected} color="a" label={`${round2(freshExpected)} squares on average`} size={18} /></span>
            </span>
            <p className={styles.versusNum}>= <span data-testid="seed-squares">{fresh} squares</span></p>
            <p className={styles.versusSub}>× {oneIn(h)} chance Nova gets that far = {round2(freshExpected)} on average</p>
          </div>
        </div>
        <Slider label="Chance Nova gets as far as Orbit (Series B): your guess" letter="h" value={h} stops={HIT_STOPS} format={oneIn} onChange={setH} />
        {twoUnknowns && (
          <Slider label="Chance Orbit survives to a sale" letter="s" value={s} stops={SURVIVAL_STOPS} format={formatShare} onChange={setS} />
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
            Add one more unknown: Orbit might still fail before it is sold
          </button>
        )}
      </Wide>
      <Prose>
        <p>
          Solve 1.25 = h × 10 and you get h = 1 in 8. If fewer than one in eight companies like Nova make it to Series B, Orbit is the better buy. And 1 in 8 is simply $0.1M ÷ $0.8M, the old price over the new one.
        </p>
        <p>
          Now add the second unknown. Getting to Series B doesn't guarantee a good sale. If Orbit only has an even chance, the follow-on is worth half as much and the break-even halves too, to 1 in 16.
        </p>
        <p>
          This is why funds spread small bets early and concentrate later. When you know nothing, cheap squares everywhere is the smart play. Once one company pulls ahead, the same maths starts pushing money towards it. Buying enough of each new round to keep your share is called your <em>pro rata</em>.
        </p>
      </Prose>
      <Aside>
        <p>
          Funds plan for this by keeping a big part of the fund back as reserves for follow-ons.
        </p>
      </Aside>
      <Rule>Follow on when a new bet's odds are worse than old price ÷ new price.</Rule>
    </Section>
  );
}
