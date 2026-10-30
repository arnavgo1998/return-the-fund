import { useState } from "react";
import { type HolderId, capTable } from "../model/company";
import { formatMoney } from "../model/format";
import { switchPoint, waterfall } from "../model/waterfall";
import { Chip, Equation } from "../ui/Equation";
import { COLOR, NAMES } from "../ui/players";
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
          There's one more thing other investors bring, and it only shows up when things go badly. Investors usually
          don't buy plain squares. Their squares come with a promise: when the company sells, they can take their money
          back first, <em>instead of</em> their share. Not both. Whichever is bigger.
        </p>
        <p>
          Which is bigger comes down to one comparison. Take what an investor paid for one square. Then take what one
          square is worth in the sale. If a square is now worth more than they paid, they take their share. If it's
          worth less, they take their money back.
        </p>
        <p>
          From Model 4, I paid $0.1M a square, Series A paid $0.2M and Series B paid $0.8M. Start with only Series B
          holding the promise, then give it to everyone. Drag the sale, <Chip letter="E" />, and watch what a square
          is worth move past each price.
        </p>
      </Prose>
      <Wide label="Splitting the sale">
        <div className={styles.segmented} role="group" aria-label="Who holds the promise">
          <button type="button" aria-pressed={!everyone} onClick={() => setEveryone(false)}>Only Series B</button>
          <button type="button" aria-pressed={everyone} onClick={() => setEveryone(true)}>Every investor</button>
        </div>
        {!everyone ? (
          <>
            <p className={styles.figLabel}>B switches to its share once a square is worth the $0.8M B paid</p>
            <Equation>
              150 squares × $0.8M = <strong data-testid="switch-b">{formatMoney(switchPoint(TABLE, "b", ["b"]))}</strong>
            </Equation>
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
              {id === "you" ? "You" : NAMES[id].replace("Series ", "")}
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
                <th scope="row"><span className={styles.swatchInline} style={{ background: COLOR[id] }} />{NAMES[id]}</th>
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
          With only B holding the promise, at $60M B takes its $20M back first. The other $40M is shared over the
          remaining 125 squares: $0.32M a square, less than the $0.8M B paid, so B is right to take the money. B keeps
          doing that until a square is worth $0.8M. That happens at $120M, which is exactly what B's price said the
          whole company was worth.
        </p>
        <p>
          Now give every investor the promise. My squares were the cheapest, so I'm the first to switch. At $35M, B and
          A take $25M back, and $10M is left for 100 squares: $0.1M each, my price. Series A switches at $45M, when a
          square reaches its $0.2M. Series B switches last, at $120M.
        </p>
        <p>
          Drag the sale down to $30M, a company that raised $26M and sold for barely more. Every investor takes their
          money back, and the founders, who spent years on it, share the $4M left. Below $26M there isn't enough to give
          every investor their money back, so the investors split the sale in proportion to what they put in, and the
          founders get nothing.
        </p>
        <p>
          Drag it past $120M and a square is worth more than anyone paid, so everyone takes their share. At $1.2B a
          square is worth $8M, and my 10 squares get $80M for my $1M.
        </p>
        <p>
          So the promise protects me in the bad sales: it gets my $1M back. But Model 2 already told me the fund isn't
          made in the bad sales. It's made in the one sale where the promise doesn't matter at all. My downside
          protection is $1M. My upside is $80M. The promise has a name, by the way: a <em>liquidation preference</em>.
        </p>
      </Prose>
      <Aside>
        <p>
          I've used the simplest version: one times the money, take it or the share but not both, every investor equal
          in line. Real terms can put later investors ahead of earlier ones, or let them take the money back and their
          share. Kupor walks through those. The shape stays the same: they matter below the last price, not above it.
        </p>
      </Aside>
      <Rule>Below the last round's price, preferences decide who gets paid. Above it, only shares matter — and above it is where a fund is made.</Rule>
    </Section>
  );
}
