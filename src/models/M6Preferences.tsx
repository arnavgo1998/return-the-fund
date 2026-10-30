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
          Other investors also affect who gets paid when a company sells for less than hoped. They usually buy preferred squares, which come with a promise. In a sale, they can take their money back first <em>instead of</em> their share. They get one or the other, whichever is larger.
        </p>
        <p>
          Which is larger comes down to one comparison. Divide what an investor paid by the squares they bought to get the price of one square. Then work out what one square is worth in the sale. If a square is now worth more than they paid, they take their share. If it is worth less, they take their money back.
        </p>
        <p>
          The company is Orbit, from Model 4. You hold 10 squares bought for $1M, at $0.1M each. Alex holds 25 bought for $5M, at $0.2M each. Blake holds 25 bought for $20M, at $0.8M each. The founders hold 90. Start with only Blake holding the promise, then give it to every investor, and move the sale <Chip letter="E" /> to see what a square is worth.
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
          With only Blake holding the promise, at $60M Blake takes $20M back first. The remaining $40M is shared across the other 125 squares at $0.32M each. That is less than the $0.8M Blake paid, so taking the money back is the better choice. It stays the better choice until a square is worth $0.8M, at a $120M sale, which is the value Blake's own price put on the company.
        </p>
        <p>
          With every investor holding the promise, your squares were the cheapest, so you switch first. At $35M, Blake and Alex take $25M back and $10M is left for 100 squares, which is $0.1M each, your price. Alex switches at $45M, when a square reaches $0.2M. Blake switches last, at $120M.
        </p>
        <p>
          At $30M, for a company that raised $26M, every investor takes their money back and the founders' 90 squares share the $4M left. Below $26M there is not enough to repay every investor, so the investors split the sale in proportion to what they put in and the founders receive nothing.
        </p>
        <p>
          Above $120M a square is worth more than anyone paid, so everyone takes their share. At $1.2B a square is worth $8M, and your 10 squares return $80M on a $1M cheque.
        </p>
        <p>
          The promise protects investors in poor sales, and at best it returns your $1M. Model 2 showed that funds are not made in poor sales. They are made in the rare large sale, where the promise plays no part. The protection is worth $1M and the upside is $80M. This promise is called a <em>liquidation preference</em>.
        </p>
      </Prose>
      <Aside>
        <p>
          This is the simplest form: one times the money, the money or the share but not both, and every investor equal in line. Real terms can put later investors ahead of earlier ones, or let them take both the money and the share. Kupor covers these variations. They change the split below the last round's price, and make no difference above it.
        </p>
      </Aside>
      <Rule>Below the last round's price, preferences decide who gets paid. Above it, only squares count, and that is where a fund makes its money.</Rule>
    </Section>
  );
}
