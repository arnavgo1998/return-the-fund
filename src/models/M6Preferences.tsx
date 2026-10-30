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

export function M6Preferences() {
  const [everyone, setEveryone] = useState(false);
  const [sale, setSale] = useState(60);
  const prefs: HolderId[] | undefined = everyone ? undefined : ["b"];
  const { paid, switched } = waterfall(sale, TABLE, prefs);
  const has = (id: HolderId) => (everyone ? id !== "founders" : id === "b");
  const how = (id: HolderId) => {
    if (!has(id) || switched.includes(id)) return "share";
    const invested = TABLE.find((h) => h.id === id)!.invested;
    return paid[id] < invested - 1e-9 ? "part of the money back" : "money back";
  };
  // The sum behind each payout, in squares and money the reader can recount.
  const takers = TABLE.filter((h) => has(h.id) && !switched.includes(h.id));
  const owed = takers.reduce((m, h) => m + h.invested, 0);
  const sharing = TABLE.filter((h) => !takers.includes(h)).reduce((n, h) => n + h.shares, 0);
  const pool = Math.max(sale - owed, 0);
  const poolLine =
    sale === 0 ? "Nothing to split."
    : sale < owed ? `${formatMoney(sale)} sale is less than the ${formatMoney(owed)} put in: the investors split it by what they put in`
    : owed === 0 ? `Nobody takes money back: the ${formatMoney(sale)} sale is split over all ${sharing} squares`
    : `${formatMoney(sale)} sale − ${formatMoney(owed)} taken back first = ${formatMoney(pool)} left, split over ${sharing} squares`;
  const work = (id: HolderId) => {
    const h = TABLE.find((x) => x.id === id)!;
    if (sale === 0) return "nothing to split";
    if (takers.includes(h)) {
      if (sale >= owed) return `the ${formatMoney(h.invested)} put in`;
      return h.invested === owed ? `all of the ${formatMoney(sale)} sale` : `${h.invested}/${owed} of the ${formatMoney(sale)} sale`;
    }
    if (pool === 0) return "nothing left";
    if (h.shares === sharing) return `all of the ${formatMoney(pool)} left`;
    return owed === 0 ? `${h.shares}/${sharing} of the ${formatMoney(sale)} sale` : `${h.shares}/${sharing} of the ${formatMoney(pool)} left`;
  };
  return (
    <Section n={6} title="Who gets paid first">
      <Prose>
        <p>
          There's one more thing other investors bring, and it only shows up when things go badly. Investors usually
          don't buy plain squares. Their squares come with a promise: when the company sells, they can take their money
          back first, <em>instead of</em> their share. Not both. Whichever is bigger.
        </p>
        <p>
          Start with only Series B holding that promise. B paid $20M for 25 of the 150 squares. If the company sells
          for <Chip letter="E" />, B can take $20M, or 25/150 of <Chip letter="E" />.
        </p>
      </Prose>
      <Wide label="Splitting the sale">
        <div className={styles.segmented} role="group" aria-label="Who holds the promise">
          <button type="button" aria-pressed={!everyone} onClick={() => setEveryone(false)}>Only Series B</button>
          <button type="button" aria-pressed={everyone} onClick={() => setEveryone(true)}>Every investor</button>
        </div>
        {!everyone ? (
          <Equation>
            $20M = 25/150 × <Chip letter="E" /> → <Chip letter="E" /> = <strong data-testid="switch-b">{formatMoney(switchPoint(TABLE, "b", ["b"]))}</strong>
          </Equation>
        ) : (
          <p className={styles.switches}>
            Switch to share at: You <b>{formatMoney(switchPoint(TABLE, "you"))}</b> · Series A <b>{formatMoney(switchPoint(TABLE, "a"))}</b> ·
            Series B <b>{formatMoney(switchPoint(TABLE, "b"))}</b>
          </p>
        )}
        <Slider label="What the company sells for" letter="E" value={sale} stops={EXIT_STOPS} format={formatMoney} onChange={setSale} />
        <div className={styles.waterfall} aria-hidden>
          {ORDER.map((id) => (
            <span key={id} style={{ width: sale > 0 ? `${(paid[id] / sale) * 100}%` : 0, background: COLOR[id] }} />
          ))}
        </div>
        <p className={styles.poolLine} data-testid="m6-pool">{poolLine}</p>
        <table className={styles.payTable}>
          <caption className={styles.srOnly}>How a {formatMoney(sale)} sale is split</caption>
          <tbody>
            {ORDER.map((id) => (
              <tr key={id}>
                <th scope="row"><span className={styles.swatchInline} style={{ background: COLOR[id] }} />{NAMES[id]}</th>
                <td className={styles.how}>
                  <span data-testid={`how-${id}`}>{how(id)}</span>
                  <span className={styles.work} data-testid={`work-${id}`}>{work(id)}</span>
                </td>
                <td data-testid={`paid-${id}`}>{formatMoney(paid[id])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Wide>
      <Prose>
        <p>
          With only B holding the promise, B takes its $20M until the sale passes $120M. That number isn't a
          coincidence. $120M is what B's price said the whole company was worth. Below the price B paid, B gets its
          money back. Above it, B is better off with its share.
        </p>
        <p>
          Now give every investor the promise. Drag the sale down to $30M, a company that raised $26M and sold for
          barely more. Series B takes $20M, A takes $5M, I take my $1M. The founders, who spent years on it, share $4M.
          Below $26M there isn't enough to give every investor their money back, so the investors split the sale in
          proportion to what they put in, and the founders get nothing.
        </p>
        <p>
          Drag it up past $120M and everyone switches to their share. The promises stop mattering, and at $1.2B I get
          $80M for my $1M.
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
