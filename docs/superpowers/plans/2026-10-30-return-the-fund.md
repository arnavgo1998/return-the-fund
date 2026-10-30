# Return the Fund Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single scrolling web page that builds the investor's model of venture capital one variable at a time, from one cheque to the napkin sum.

**Architecture:** All maths in pure, tested functions under `src/model/`. Small UI primitives (`src/ui/`) draw countable squares, equations with unknown-chips, and accessible sliders. Each model is one section component under `src/models/`, composed in `App.tsx`. No state outside components, no randomness, no storage.

**Tech Stack:** Vite 7, React 19, TypeScript 5.9, Vitest 3 + Testing Library + jsdom, plain CSS (tokens + CSS modules), @vercel/analytics.

**Spec:** `docs/superpowers/specs/2026-10-30-return-the-fund-design.md`

## Global Constraints

- Units: $M. One block = $1M. One square = one share. Fund $10M, cheques $1M.
- Players and colours used everywhere: You (rust), Founders (warm grey), Series A (blue), Series B (green). Text contrast ≥ 4.5:1.
- No F1 imagery or words (cars, tracks, tyres, laps, pit). F1 is the method only.
- No term (pre-money, post-money, pro rata, preference, dilution) appears in prose before the section that builds it; it arrives as a label.
- Each model section ends with exactly one **Rule** sentence, copied verbatim from the spec.
- First-person learner voice; prose column ~640px; works at 375px with no horizontal scroll; respects `prefers-reduced-motion`.
- Every interactive is keyboard-operable and has a text equivalent of its sum.
- Git author is the repo-local config (arnavgo1998). Do not push.

## Review Focus

1. **Phone width (375px):** 150-square company grids and 100-block return stacks must wrap inside the viewport — tested via the Blocks `perRow` prop and a manual 375px check in Task 9.
2. **Slider extremes:** E = 0, h = 0, share → 0 must not show `Infinity`/`NaN` — `exitNeeded` returns `Infinity` for share ≤ 0 and `formatMoney(Infinity)` renders "—" (tests in Tasks 2 and 5).
3. **Fractional squares** (1.25, 3.33, 0.833…) must be drawn as a partial square, not rounded — Blocks test in Task 5.
4. **Keyboard + text equivalent:** each Slider has a visible value and `aria-valuetext`; arrow keys change it (Slider test in Task 5).
5. **Money formatting across scales:** $0.385M, $35M, $1.5B, $1,000M must read naturally — `formatMoney` tests in Task 2.

---

### Task 1: Scaffold and page shell

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/test-setup.ts`, `src/vite-env.d.ts`, `src/styles/tokens.css`, `src/styles/global.css`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `App` (default page), CSS tokens `--paper --grid --ink --mute --line --you --founders --a --b --font-body --font-mono --font-sans --column`.

- [ ] **Step 1:** Copy `package.json`, `vite.config.ts` (including the `__SITE_URL__` plugin), the three tsconfigs, `src/test-setup.ts` and `src/vite-env.d.ts` from `../half-a-ship`, renaming the package to `return-the-fund`. `npm install`.
- [ ] **Step 2: Failing test** `src/App.test.tsx`: renders `<App/>`; expects heading level 1 with text "Return the Fund".
- [ ] **Step 3:** `index.html` (title "Return the Fund", description "Venture capital from the bare basics: one variable at a time, from one cheque to the napkin sum.", og tags with `__SITE_URL__`, Google Fonts: Newsreader, IBM Plex Mono, Instrument Sans). `tokens.css`: paper `#fbfaf6`, faint grid `#ece8de` at 24px, ink `#1c1b18`, mute ≤ `#6b675e`, you `#b0431c`, founders `#8a8478`, a `#2f5d8a`, b `#3f7a4a`. `global.css`: body is the graph-paper background via two `linear-gradient`s; reduced-motion rule disables transitions. `App.tsx` renders the hero (h1, subtitle, first-person opening) and `<Analytics/>`.
- [ ] **Step 4:** `npm test` → PASS; `npm run build` → succeeds.
- [ ] **Step 5:** Commit `feat: scaffold and page shell`.

### Task 2: Company maths — squares, rounds, napkin, money format

**Files:**
- Create: `src/model/company.ts`, `src/model/napkin.ts`, `src/model/format.ts`
- Test: `src/model/company.test.ts`, `src/model/napkin.test.ts`, `src/model/format.test.ts`

**Interfaces:**
- Produces:
  - `type HolderId = "founders" | "you" | "a" | "b"`
  - `interface Holder { id: HolderId; shares: number; invested: number; preferred: boolean }`
  - `interface Round { investor: HolderId; shares: number; price: number }` (price = $M per share)
  - `const ROUND_A: Round = { investor: "a", shares: 25, price: 0.2 }`, `const ROUND_B: Round = { investor: "b", shares: 25, price: 0.8 }`
  - `seed(price = 0.1, cheque = 1): Holder[]` — you get `cheque / price` shares, founders `100 − that`, company is 100 shares.
  - `applyRound(holders: Holder[], r: Round): Holder[]` (pure; adds the investor with `invested = shares × price`, preferred)
  - `capTable(stage: "seed" | "a" | "b", seedPrice = 0.1, bPrice = 0.8): Holder[]`
  - `totalShares(h: Holder[]): number`, `shareOf(h: Holder[], id: HolderId): number`
  - `preMoney(h: Holder[], r: Round): number`, `postMoney(h: Holder[], r: Round): number`
  - `exitNeeded(fund: number, share: number): number` (`Infinity` if share ≤ 0)
  - `shareAtEnd(cheque: number, postMoney: number, dilutions: number[]): number` (each dilution a fraction 0–1 of the company sold in that round)
  - `formatMoney(m: number): string`, `formatShare(x: number): string`

- [ ] **Step 1: Failing tests** pinning the spec:
  - `shareOf(capTable("seed"), "you")` = 0.1; `"a"` stage = 0.08; `"b"` stage ≈ 1/15.
  - `totalShares(capTable("b"))` = 150; founders shares 90 throughout.
  - `preMoney(capTable("seed"), ROUND_A)` = 20, `postMoney` = 25; for B: 100 and 120.
  - `exitNeeded(10, 0.1)` = 100; `(100, 0.1)` = 1000; `(100, 0.08)` = 1250; `(100, 1/15)` ≈ 1500; `(10, 1/15)` ≈ 150; `(10, 0)` = Infinity.
  - Hot deal: `shareOf(capTable("b", 0.2), "you")` ≈ 1/30 and `exitNeeded(10, 1/30)` ≈ 300; founders hold 95 at seed.
  - `shareAtEnd(1, 10, [0.2, 1/6])` ≈ 1/15.
  - `formatMoney`: 0.385 → "$0.38M", 1 → "$1M", 3.2 → "$3.2M", 35 → "$35M", 1000 → "$1B", 1250 → "$1.25B", 1500 → "$1.5B", Infinity → "—". `formatShare(1/15)` → "6.7%", 0.1 → "10%".
- [ ] **Step 2:** `npx vitest run src/model` → FAIL (modules missing).
- [ ] **Step 3:** Implement. `formatMoney`: ≥1000 → `$x.xxB` with trailing zeros trimmed; ≥10 → whole $M; else up to 2 decimals trimmed.
- [ ] **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: company maths, napkin sum, formatting`.

### Task 3: Portfolio and follow-on maths

**Files:**
- Create: `src/model/portfolio.ts`, `src/model/followOn.ts`
- Test: `src/model/portfolio.test.ts`, `src/model/followOn.test.ts`

**Interfaces:**
- Produces:
  - `const OTHERS: number[] = [0, 0, 0, 0, 0, 1, 1, 3, 3]` (multiples of $1M on the nine non-winners)
  - `fundReturn(winner: number): number` (blocks) and `winnerNeeded(targetMultiple: number, fund = 10): number`
  - `sharesFor(cheque: number, price: number): number`
  - `followOnCrossover(seedPrice: number, roundPrice: number, survival = 1): number` → the h at which both options give equal expected squares.
- [ ] **Step 1: Failing tests:** `fundReturn(0)` = 8; `fundReturn(22)` = 30; `winnerNeeded(1)` = 2; `winnerNeeded(3)` = 22; `sharesFor(1, 0.8)` = 1.25; `sharesFor(1, 0.1)` = 10; `sharesFor(1, 0.3)` ≈ 3.333; `followOnCrossover(0.1, 0.8)` = 0.125; `followOnCrossover(0.1, 0.8, 0.5)` = 0.0625; `followOnCrossover(0.1, 0.3)` ≈ 1/3.
- [ ] **Step 2:** FAIL. **Step 3:** implement. **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: portfolio and follow-on maths`.

### Task 4: The waterfall (who gets paid first)

**Files:**
- Create: `src/model/waterfall.ts`
- Test: `src/model/waterfall.test.ts`

**Interfaces:**
- Consumes: `Holder`, `HolderId`, `capTable` from Task 2.
- Produces:
  - `interface Payout { paid: Record<HolderId, number>; switched: HolderId[] }` (switched = preferred holders taking their share instead of money back)
  - `waterfall(exit: number, holders: Holder[], preferredIds?: HolderId[]): Payout` — `preferredIds` limits who has a preference (Model 6 step 1 passes `["b"]`); default: every holder with `preferred: true`.
  - `switchPoint(holders: Holder[], id: HolderId, preferredIds?: HolderId[]): number` — smallest exit at which `id` takes its share.
- Algorithm (1×, non-participating, all preferred equal in line):
```
switched = {}
loop:
  candidates = preferred not in switched, sorted by invested/shares ascending
  for c in candidates:
    pool = exit − Σ invested of preferred not in switched, excluding c
    perShare = max(pool, 0) / (common shares + Σ shares of switched + c.shares)
    if perShare × c.shares > c.invested: switched.add(c); restart loop
  break
prefs = Σ invested of preferred not switched
if exit < prefs: each non-switched gets exit × invested/prefs; everyone else 0
else: non-switched get invested; remainder split per share among founders + switched
```
  `switchPoint` = bisection on `exit` in [0, 10 000] to 1e-6.
- [ ] **Step 1: Failing tests** with `capTable("b")`:
  - exit 30 → you 1, a 5, b 20, founders 4.
  - exit 60 → you 3.2, a 8, b 20, founders 28.8; switched contains you and a.
  - exit 1200 → you 80, a 200, b 200, founders 720.
  - exit 10 → you ≈ 10/26, a ≈ 50/26, b ≈ 200/26, founders 0.
  - exit 0 → all 0. Sum of payouts equals exit for 0, 10, 30, 60, 120, 1200.
  - `switchPoint(.., "you")` ≈ 35, `"a"` ≈ 45, `"b"` ≈ 120; with `preferredIds = ["b"]`, `switchPoint(.., "b")` ≈ 120 and exit 60 gives b 20, everyone else per share of the remaining 40 over 125 shares (you 3.2).
- [ ] **Step 2:** FAIL. **Step 3:** implement. **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: payout waterfall with joint switching`.

### Task 5: UI primitives

**Files:**
- Create: `src/ui/Section.tsx`, `src/ui/Equation.tsx`, `src/ui/Blocks.tsx`, `src/ui/Slider.tsx`, `src/ui/Legend.tsx`, `src/ui/ui.module.css`
- Test: `src/ui/Blocks.test.tsx`, `src/ui/Slider.test.tsx`

**Interfaces:**
- Produces:
  - `Section({ n?: number; title: string; children })` — renders "Model n" eyebrow + h2; `Prose`, `Wide` (instrument width up to 960px), `Rule({ children })` (the rule sentence, styled), `Aside({ children })` (side note).
  - `Equation({ children })` and `Chip({ letter: "E" | "h" | "s" | "F" })` — chips are round, coloured, `aria-label` with the unknown's name.
  - `Blocks({ count: number; color: HolderId | "ink" | "ghost"; perRow?: number; size?: number; label: string })` — draws `floor(count)` full squares plus one partial square of width `count % 1`; `role="img"` and `aria-label` = label. Square size defaults to 14px; wraps at `perRow` (default 10).
  - `Slider({ label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; format: (v: number) => string; scale?: "linear" | "log" })` — native range input (styled), visible formatted value, `aria-valuetext` = formatted value. Log scale maps slider position to value exponentially.
  - `Legend({ ids: HolderId[] })`.
- [ ] **Step 1: Failing tests:**
  - Blocks count 1.25 → 2 rendered squares, the last has `data-fraction="0.25"`; count 0 → 0 squares; aria-label passes through.
  - Slider: shows `format(value)`; `aria-valuetext` equals it; firing change to a new value calls `onChange` with that value (log scale: position → value mapping round-trips within 1%).
- [ ] **Step 2:** FAIL. **Step 3:** implement with CSS modules; squares are `<span>`s in a CSS grid (`grid-template-columns: repeat(perRow, size)`), so they wrap honestly; partial square uses `width: calc(size * fraction)`. **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: squares, equations, sliders`.

### Task 6: Hero, Model 1 and Model 2

**Files:**
- Create: `src/models/Hero.tsx`, `src/models/M1OneCheque.tsx`, `src/models/M2TenCheques.tsx`, `src/models/models.module.css`
- Modify: `src/App.tsx`
- Test: `src/models/M1OneCheque.test.tsx`, `src/models/M2TenCheques.test.tsx`

**Interfaces:**
- Consumes: Tasks 2, 3, 5.

- [ ] **Step 1: Failing tests:**
  - M1: default exit slider at $100M shows "10 blocks back" text; setting exit to 1000 shows "100"; setting to 0 shows "0". The Rule text is present: "The most you can lose is the cheque. What you can win is your share × the sale, with no ceiling."
  - M2: default winner 0 shows fund total "8" and "loses"; winner 22 shows "30" and "3×"; Rule "One company has to carry the fund. The rest barely matter." present.
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** Implement.
  - Hero: h1, subtitle, first-person paragraphs: I knew the pieces, couldn't hold the model; a video about racing strategy built its model from little squares; this is me doing that for *Secrets of Sand Hill Road*. State the units (block = $1M).
  - M1: the company as a 10×10 grid (90 founders, 10 you); exit slider (log, $0–$2B with a stop at 0; values 0, 10, 100, 1000 reachable by keyboard step); equation `10% × [E] = return`; return drawn as Blocks next to your single block (perRow 10, so 100 blocks = a 10×10 square).
  - M2: ten columns, each a company's return in blocks from `OTHERS` plus the winner (slider 0–40 blocks); fund total bar against lines at 10 (returned) and 30 (3×); verdict text.
- [ ] **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: hero, one cheque, ten cheques`.

### Task 7: Model 3 (napkin) and Model 4 (rounds)

**Files:**
- Create: `src/models/M3Napkin.tsx`, `src/models/M4Rounds.tsx`
- Modify: `src/App.tsx`
- Test: `src/models/M3Napkin.test.tsx`, `src/models/M4Rounds.test.tsx`

- [ ] **Step 1: Failing tests:**
  - M3: defaults (fund $10M, share 10%) show "$100M"; setting fund to 100 shows "$1B". Rule "Before you write the cheque, divide the fund by your share. If the company can't plausibly be worth that, the cheque can't matter."
  - M4: buttons "Seed", "Series A", "Series B" (`aria-pressed`); Seed shows 100 squares and "10%"; Series A shows 125 and "8%"; Series B shows 150, "6.7%", "pre-money $100M", "post-money $120M" and exit needed "$150M" (and "$1.5B" for a $100M fund). Rule "Every round adds squares and never removes yours. Use the share you'll have at the end."
- [ ] **Step 2:** FAIL. **Step 3:** Implement. M4's grid shows squares coloured by holder, perRow 10 on phones / 25 on wide screens (CSS-only via container width; `perRow` chosen by a `useWide()` hook on `matchMedia("(min-width: 720px)")`). Terms *pre-money* / *post-money* appear only here, as labels. **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: napkin sum and funding rounds`.

### Task 8: Model 5 (follow-on) and Model 6 (who gets paid first)

**Files:**
- Create: `src/models/M5FollowOn.tsx`, `src/models/M6Preferences.tsx`
- Modify: `src/App.tsx`
- Test: `src/models/M5FollowOn.test.tsx`, `src/models/M6Preferences.test.tsx`

- [ ] **Step 1: Failing tests:**
  - M5: shows "1.25 squares" and "10 squares"; h slider at 1/8 shows "equal"; at 0.05 shows follow-on wins; after enabling the survival step and setting s = 0.5, crossover text reads "1 in 16". Rule "Follow on when your odds on a fresh bet are worse than the old price ÷ the new price. Prepare widely, then concentrate on what's working."
  - M6: step 1 (only B) shows switch point "$120M"; step 2 at exit $30M shows You $1M, Series A $5M, Series B $20M, Founders $4M; at $1.2B shows You $80M. Rule "Below the last round's price, preferences decide who gets paid. Above it, only shares matter — and above it is where a fund is made."
- [ ] **Step 2:** FAIL. **Step 3:** Implement. M5: two square stacks (1.25 vs h × 10 expected), h slider 0–0.5, then a revealed second slider for s with its own sentence ("one more unknown"). The label *pro rata* arrives here; Aside on reserves (Kupor: funds often hold back about half). M6: horizontal stacked bar scaled to the exit, segments coloured per holder with labels; markers for 35, 45, 120; exit slider (log, $0–$2B). Aside stating the simplification (1×, non-participating, equal in line). **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: follow-on crossover and the payout waterfall`.

### Task 9: Model 7, the napkin finale, and launch polish

**Files:**
- Create: `src/models/M7Price.tsx`, `src/models/Finale.tsx`, `public/favicon.svg`, `public/og-image.png`, `public/robots.txt`, `README.md`
- Modify: `src/App.tsx`
- Test: `src/models/M7Price.test.tsx`, `src/models/Finale.test.tsx`

- [ ] **Step 1: Failing tests:**
  - M7: toggle "Hot deal" shows "5 squares" and "$300M"; toggle "Cold market" shows "3.33 squares" and "1 in 3". Rule "Paying up halves your squares and doubles the exit you need. Money held back is worth most when everyone else is scared."
  - Finale: defaults (fund 10, cheque 1, post-money 10, two later rounds selling 20% and 1/6) show share at end "6.7%" and exit needed "$150M"; changing fund to 100 shows "$1.5B".
- [ ] **Step 2:** FAIL. **Step 3:** Implement; closing paragraph and reading list per spec. **Step 4:** PASS.
- [ ] **Step 5:** Verify: `npm test`, `npm run build`; browser at 375px — `document.documentElement.scrollWidth <= innerWidth`; Lighthouse accessibility/SEO ≥ 95; prose scan for banned F1 words (`grep -rniwE "tyres?|tires?|laps?|pit|pitstop|race|racing|cars?|track" src/models --exclude=Hero.tsx` returns nothing; the hero may name the video that inspired the method).
- [ ] **Step 6:** Commit `feat: price of a deal, the napkin, launch polish`.
