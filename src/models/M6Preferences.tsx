import { useState } from "react";
import { type HolderId, capTable } from "../model/company";
import { formatMoney } from "../model/format";
import { switchPoint, waterfall } from "../model/waterfall";
import { Chip, Equation } from "../ui/Equation";
import { COLOR, NAMES, SHORT } from "../ui/players";
import { Aside, Prose, Rule, Section, Wide } from "../ui/Section";
import { Slider } from "../ui/Slider";
import { EXIT_STOPS } from "./stops";
import styles from "./models.module.css";

const TABLE = capTable("b");
const ORDER: HolderId[] = ["b", "a", "you", "founders"];
const holder = (id: HolderId) => TABLE.find((h) => h.id === id)!;
const pricePaid = (id: HolderId) => holder(id).invested / holder(id).shares;

/** Per-square values run from cents to millions; keep two significant figures below $0.1M so sums still check. */
const perSquare = (v: number) => (v > 0 && v < 0.1 ? `$${Number(v.toPrecision(2))}M` : formatMoney(v));

/** Log scale, $0.01M to $10M a square, so a $30M sale and a $1.2B sale fit on one line. */
const RULER_LO = 0.01, RULER_HI = 10;
const rulerAt = (v: number) =>
  v <= RULER_LO ? 0 : v >= RULER_HI ? 100 : (Math.log10(v / RULER_LO) / Math.log10(RULER_HI / RULER_LO)) * 100;

export function M6Preferences() {
  const [everyone, setEveryone] = useState(false);
  const [sale, setSale] = useState(60);
  const prefs: HolderId[] | undefined = everyone ? undefined : ["b"];
  const { paid, switched } = waterfall(sale, TABLE, prefs);
  const has = (id: HolderId) => (everyone ? id !== "founders" : id === "b");

  // Investors still taking their money back are paid first; every other square shares what's left.
  const takers = TABLE.filter((h) => has(h.id) && !switched.includes(h.id));
  const owed = takers.reduce((m, h) => m + h.invested, 0);
  const sharing = TABLE.filter((h) => !takers.includes(h)).reduce((n, h) => n + h.shares, 0);
  const pool = Math.max(sale - owed, 0);
  const square = sale >= owed && sharing > 0 ? pool / sharing : 0;

  const how = (id: HolderId) => {
    if (!has(id) || switched.includes(id)) return "share";
    return paid[id] < holder(id).invested - 1e-9 ? "part of the money back" : "money back";
  };
  const why = (id: HolderId) => {
    if (!has(id)) return "no promise to choose";
    if (sale === 0) return "nothing to split";
    if (sale < owed) return everyone ? "not enough to pay every investor back" : "not enough to pay B back in full";
    const price = pricePaid(id);
    if (switched.includes(id)) return `a square's ${perSquare(square)} beats the ${perSquare(price)} paid`;
    return Math.abs(square - price) < 1e-9
      ? `a square's ${perSquare(square)} equals the ${perSquare(price)} paid`
      : `a square's ${perSquare(square)} is less than the ${perSquare(price)} paid`;
  };
  const work = (id: HolderId) => {
    const h = holder(id);
    if (sale === 0) return "nothing to split";
    if (takers.includes(h)) {
      if (sale >= owed) return `the ${formatMoney(h.invested)} put in`;
      return h.invested === owed ? `all of the ${formatMoney(sale)} sale` : `${h.invested}/${owed} of the ${formatMoney(sale)} sale`;
    }
    if (pool === 0) return "nothing left";
    if (h.shares === sharing) return `all of the ${formatMoney(pool)} left`;
    return `${h.shares} squares × ${perSquare(square)}`;
  };
  const poolLine =
    sale === 0 ? "Nothing to split."
    : sale < owed ? `${formatMoney(sale)} sale is less than the ${formatMoney(owed)} put in: the investors split it by what they put in`
    : owed === 0 ? `Nobody takes money back: ${formatMoney(sale)} ÷ ${sharing} squares = ${perSquare(square)} a square`
    : `${formatMoney(sale)} sale − ${formatMoney(owed)} taken back first = ${formatMoney(pool)} left ÷ ${sharing} squares = ${perSquare(square)} a square`;

  const investors = (["you", "a", "b"] as HolderId[]).filter(has);
  const markAt = rulerAt(square);
  return (
    <Section n={6} title="Who gets paid first">
      <Prose>
        <p>
          Now for the part that only matters when things go badly. Investors usually buy preferred squares, which come with a promise. When the company sells, they can take their money back first instead of their share. One or the other, whichever is bigger.
        </p>
        <p>
          There's a neat way to tell which. Take what an investor paid for one square and compare it with what a square is worth in the sale. If a square is worth more, they take the share. If it's worth less, they take the money back.
        </p>
        <p>
          Here's Orbit's table from Model 4. You have 10 squares that cost $1M, so $0.1M each. Alex has 25 for $5M, $0.2M each. Blake has 25 for $20M, $0.8M each. The founders have 90. Start with only Blake holding the promise, then hand it to everyone, and drag the sale <Chip letter="E" />.
        </p>
      </Prose>
      <Wide label="Splitting the sale">
        <div className={styles.segmented} role="group" aria-label="Who holds the promise">
          <button type="button" aria-pressed={!everyone} onClick={() => setEveryone(false)}>Only Blake</button>
          <button type="button" aria-pressed={everyone} onClick={() => setEveryone(true)}>Every investor</button>
        </div>
        {!everyone ? (
          <>
            <p className={styles.figLabel}>The sale at which Blake switches to the share</p>
            <Equation>
              <Chip letter="E" /> = 150 squares × $0.8M = <strong data-testid="switch-b">{formatMoney(switchPoint(TABLE, "b", ["b"]))}</strong>
            </Equation>
            <p className={`${styles.versusSub} ${styles.switchWhy}`} data-testid="switch-b-why">
              At a $120M sale every one of Orbit's 150 squares is worth $0.8M, the price Blake paid. Blake's share is then
              25 squares × $0.8M = $20M, exactly the money Blake put in. Below $120M the $20M back is larger, so Blake
              takes it. Above $120M the share is larger.
            </p>
          </>
        ) : (
          <p className={styles.switches}>
            Each switches to their share once a square is worth what they paid: You at{" "}
            <b>{formatMoney(switchPoint(TABLE, "you"))}</b> · Series A at <b>{formatMoney(switchPoint(TABLE, "a"))}</b> ·
            Series B at <b>{formatMoney(switchPoint(TABLE, "b"))}</b>
          </p>
        )}
        <Slider label="What the company sells for" letter="E" value={sale} stops={EXIT_STOPS} format={formatMoney} onChange={setSale} />

        <p className={styles.figLabel}>What one square is worth in this sale, against what each investor paid for one</p>
        <div className={styles.sqRuler} role="img"
          aria-label={`A square is worth ${perSquare(square)}. ${investors.map((id) => `${NAMES[id]} paid ${perSquare(pricePaid(id))}`).join(", ")}.`}>
          <span className={styles.sqMark} data-anchor={markAt > 60 ? "end" : "start"} style={{ left: `${markAt}%` }}>
            a square is worth <b data-testid="m6-square">{perSquare(square)}</b>{square > RULER_HI ? " →" : ""}
          </span>
          {investors.map((id) => (
            <span key={id} className={styles.sqTick} style={{ left: `${rulerAt(pricePaid(id))}%`, color: COLOR[id], borderColor: COLOR[id] }}>
              {SHORT[id]}
            </span>
          ))}
          <span className={styles.sqEnd} data-edge="start">$0.01M</span>
          <span className={styles.sqEnd} data-edge="end">$10M</span>
        </div>

        <p className={styles.poolLine} data-testid="m6-pool">{poolLine}</p>
        <div className={styles.waterfall} aria-hidden>
          {ORDER.map((id) => (
            <span key={id} style={{ width: sale > 0 ? `${(paid[id] / sale) * 100}%` : 0, background: COLOR[id] }} />
          ))}
        </div>
        <table className={styles.payTable}>
          <caption className={styles.srOnly}>How a {formatMoney(sale)} sale is split</caption>
          <thead>
            <tr><th scope="col">Who</th><th scope="col">Paid a square</th><th scope="col">Takes</th><th scope="col">Gets</th></tr>
          </thead>
          <tbody>
            {ORDER.map((id) => (
              <tr key={id}>
                <th scope="row">
                  <span className={styles.swatchInline} style={{ background: COLOR[id] }} />{NAMES[id]}
                  <span className={styles.work} data-testid={`holds-${id}`}>
                    {holder(id).shares} squares{holder(id).invested > 0 ? ` for ${formatMoney(holder(id).invested)}` : ""}
                  </span>
                </th>
                <td className={styles.priceCell} data-testid={`price-${id}`}>{id === "founders" ? "—" : perSquare(pricePaid(id))}</td>
                <td className={styles.how}>
                  <span data-testid={`how-${id}`}>{how(id)}</span>
                  <span className={styles.work} data-testid={`why-${id}`}>{why(id)}</span>
                </td>
                <td>
                  <span data-testid={`paid-${id}`}>{formatMoney(paid[id])}</span>
                  <span className={styles.work} data-testid={`work-${id}`}>{work(id)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Wide>
      <Prose>
        <p>
          With just Blake holding the promise, a $60M sale goes like this. Blake takes $20M back first. The other $40M is spread over 125 squares at $0.32M each, less than Blake paid. So Blake keeps taking the money until a square is worth $0.8M, which happens at $120M, exactly what Blake's price said Orbit was worth.
        </p>
        <p>
          Give everyone the promise and they switch one by one, cheapest squares first. You switch at $35M, Alex at $45M and Blake at $120M.
        </p>
        <p>
          Drag down to $30M, a company that raised $26M and sold for barely more. Every investor gets their money back, and the founders, after years of work, split $4M. Below $26M the investors split whatever there is and the founders get nothing. That's the uncomfortable side of this promise.
        </p>
        <p>
          Above $120M everyone takes their share. At $1.2B a square is worth $8M, and your 10 squares bring back $80M.
        </p>
        <p>
          So the promise is real protection, but what it protects is your $1M. The fund gets made in the sale where the promise doesn't matter at all. The promise is called a <em>liquidation preference</em>.
        </p>
      </Prose>
      <Aside>
        <p>
          This is the simplest version: 1× the money, money or share but not both, everyone equal in line. Real term sheets get fancier, but the picture holds. Preferences matter below the last round's price and fade away above it.
        </p>
      </Aside>
      <Rule>Preferences decide the small sales. Big sales are all squares.</Rule>
    </Section>
  );
}
