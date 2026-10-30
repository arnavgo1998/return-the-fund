# Return the Fund, part two: the fund — design

*Part one put you in the investor's seat and asked what one company has to become. Part two turns around and asks where the investor's money comes from, and what the investor has to deliver.*

## Intent

Part one taught the startup side one variable at a time and Arnav liked how it landed ("you have gotten what I want from this project"). Part two keeps that feeling exactly — Chain Bear's method, countable squares and notes, warm guide voice — and applies it to the fund itself: limited partners (LPs), the general partner's (GP's) fee and carry, how the money goes out over time, and the pressure to show returns. Arnav opted out of questions and asked Claude to finish it "on that feeling"; everything below is Claude's call unless it repeats Part one.

The one thing a reader should get: **a fund has to turn $80M into $350M for its LPs to make 3×, and it won't know whether it has for about eight years — so a GP raises the next fund on paper and is judged on cash.** That is the fund-side version of "one company carries the fund".

## Goals

- Same method as Part one: each model adds exactly one variable to the last, the numbers are small and checkable, and each model ends in one short line.
- Every number on screen comes with the sum that made it (Part one's lesson from review).
- The page ends by linking the two parts: the money a fund needs (Part two) becomes the sale a company needs (Part one).

## Non-goals

- Tax, legal structure, recycling of fees, fee step-downs, GP commitment financing, secondaries, continuation funds, hurdle rates and catch-up mechanics. At most a short note.
- Randomness, simulation, persistence. Everything is deterministic.

## Anti-goals

- F1 visuals; jargon before numbers (LP, GP, carry, DPI, TVPI each arrive as a label on something already built); a diary voice; a textbook voice; heavy rules or book callouts (Part one's final review).
- Implying the illustrative fund (Models 5–6) is real data. It is labelled "one made-up but typical fund".

## Form and look

A second page in the same app, reached from a link at the bottom of Part one and linking back at the top. It reuses Part one's look and components exactly: graph-paper sheets, notes for money ($1M each), the chip letters, sliders with chips, short rust-square rules, warm second-person copy.

Routing (Claude's call): the page lives at `#part-two` on the same page URL, so it ships in the same bundle, works on Vercel with no config, and works inside the claude.ai artifact (which only passes a plain `#name` hash). Opening it scrolls to the top.

New player colours: **LPs** use Part one's blue (`--a`) and **you, the GP**, keep rust (`--you`). Fees are drawn as ghost notes (dashed outline), money not invested.

New chip: **R**, what the fund's investments return in total.

## The ladder (all numbers verified in `fund_ladder.py`)

A **$100M fund**, 10-year life. One note = $1M, so the fund is 100 notes.

### Model 1 — Other people's money
- LPs (pension funds, university endowments, families) commit $99M; you, the GP, commit $1M. 100 notes: 99 blue, 1 rust.
- Slider **R** (what the investments return): $0, $50M, $100M, $150M, $200M, $300M, $350M, $500M.
- With no fees or carry, R splits by what went in: LPs 99%, you 1%. R = $300M → LPs $297M, you $3M.
- Rule: *It's mostly other people's money. On your own $1M, you earn like any LP.*

### Model 2 — The fee
- Running the firm costs money: 2% of the fund a year for 10 years = $20M. Only $80M gets invested.
- Fee stops 1.5% / 2% / 2.5% → fees $15M / $20M / $25M, invested $85M / $80M / $75M.
- To give LPs their money back the investments must return $100M: $100M ÷ $80M = 1.25× on what was invested.
- From here on your $1M commitment is folded in with the LPs (side note).
- Rule: *Fees come off the top, so $80M has to earn back $100M.*

### Model 3 — Carry
- LPs get their $100M back first. Of the profit above that, you keep 20% (carried interest, "carry") and LPs keep 80%.
- Slider R: $0, $50M, $80M, $100M, $150M, $200M, $300M, $350M, $500M.
- R = $300M → profit $200M, carry $40M, LPs $260M = 2.6× net; gross on invested $300M ÷ $80M = 3.75×. R = $80M → no carry, LPs 0.8×.
- Shows fees ($20M, paid whatever happens) next to carry (paid only on profit).
- Rule: *You get 20% of the profit, and only after the LPs are whole.*

### Model 4 — What LPs need
- LPs take years of risk and want around 3× net. Target stops 1× / 2× / 3× net.
- R needed: $100M + (target − 1) × $100M ÷ 0.8 → $100M / $225M / $350M; gross on invested 1.25× / 2.81× / 4.38×.
- Link to Part one: if one company carries the fund and you own 10% at the sale, that company sells for R ÷ 10% → $1B / $2.25B / $3.5B.
- Rule: *3× for LPs means turning $80M into $350M.*

### Model 5 — Time (the J-curve)
- Money is called as it's needed: $20M a year for years 1–5. Cash comes back late: $15M, $30M, $60M, $90M, $105M in years 6–10 (total $300M, 3× net).
- Year slider 1–10; bars per year (calls down, distributions up) and the running total: −20, −40, −60, −80, −100, −85, −55, +5, +95, +200. Breaks even in year 8.
- Rule: *A good fund looks like a bad one for its first five years.*

### Model 6 — Paper and cash
- Each year the companies still held have a value on paper (NAV): 18, 42, 72, 110, 160, 190, 220, 190, 110, 0.
- Two scores per year: cash back ÷ paid in (DPI) and (cash back + paper value) ÷ paid in (TVPI).
  - Year 4: DPI 0, TVPI $110M ÷ $80M = 1.38×. Year 8: DPI 1.05, TVPI 2.95×. Year 10: both 3.0×.
- Funds raise the next fund around year 4, so the only evidence is paper. Paper can shrink when it turns to cash (TVPI peaks at 3.05× in year 9 and ends at 3.0×).
- The terms DPI and TVPI arrive as labels after the reader has seen both scores.
- Rule: *You raise the next fund on paper. LPs judge you on cash.*

### Finale — Your fund
- Calculator: fund size, fee %, carry %, target net multiple → fees, invested, R needed, gross multiple on invested, GP carry at that target.
- Short warm close; link back to Part one ("Part one: the startup side").
- Source list: Kupor (fund economics chapters), Chain Bear.

## Voice

Warm guide talking to "you", as in Part one after review: "let's", light wit, short. Kupor credited once in the intro and once in the source list.

## Constraints

- Same stack and repo as Part one (`return-the-fund`, Vite + React + TypeScript, Vitest + Testing Library, CSS modules). Pure, tested maths in `src/model/fund.ts`.
- Accessible: keyboard sliders, text equivalent of every chart, works at 375px with no sideways scroll, reduced motion respected.
- The artifact copy is built with `--mode artifact` and packed into one HTML file as for Part one.

## Left to the builder

Component breakdown, chart details for the J-curve and paper/cash charts, exact copy within the voice.
