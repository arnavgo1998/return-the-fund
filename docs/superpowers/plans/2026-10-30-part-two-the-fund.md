# Part two: the fund — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a second page (`#part-two`) to Return the Fund that teaches the fund side (LPs, fee, carry, what LPs need, the J-curve, paper vs cash) one variable at a time.

**Architecture:** Pure fund maths in `src/model/fund.ts`; a tiny hash hook picks Part one or Part two in `App`; Part two's models live in `src/part2/`, reusing Part one's UI kit (`Section`, `Prose`, `Wide`, `Rule`, `Aside`, `Slider`, `Blocks`, `Chip`, `Equation`) and `models.module.css`, with a small `fund.module.css` for the two time charts.

**Tech Stack:** Vite 7, React 19, TypeScript 5.9, Vitest 3 + Testing Library, CSS modules.

**Spec:** `docs/superpowers/specs/2026-10-30-part-two-the-fund-design.md`

## Global Constraints

- A $100M fund, 10-year life; one note = $1M. LPs commit $99M, the GP $1M.
- Fee 2% a year for 10 years by default (stops 1.5% / 2% / 2.5%); carry 20%; LPs get $100M back before carry.
- J-curve: calls 20 a year in years 1–5; distributions 15, 30, 60, 90, 105 in years 6–10. NAV 18, 42, 72, 110, 160, 190, 220, 190, 110, 0.
- Every number on screen shows the sum that made it. Multiples print with up to 2 decimals, trailing zeros trimmed ("1.38×", "3×", "2.81×").
- LPs use `--a` blue, the GP (you) `--you` rust, fees are `ghost` notes. New chip `R` = "R, what the fund's investments return".
- Voice: warm guide to "you", short rules (one line, rust square), Kupor credited in the intro and the source list only. No "block", no "napkin".
- Works at 375px with no sideways scroll; keyboard sliders; text equivalent for every chart.

## Review Focus

1. Back/forward between `#part-two` and no hash → the right part renders and the page scrolls to the top (test in Task 2).
2. An unrelated hash (e.g. `#model-3`) → Part one still renders (test in Task 2).
3. Calculator at target 1× and at fee 2.5% → no negative carry, no `Infinity`/`NaN` on screen (test in Task 6).
4. Year 1 in the paper/cash chart → DPI shows `0×`, TVPI `0.9×`, no divide-by-zero before money is called (test in Task 1).
5. Multiples format consistently: 1.375 → "1.38×", 4.375 → "4.38×", 3 → "3×" (test in Task 1).

---

### Task 1: Fund maths

**Files:** Create `src/model/fund.ts`, `src/model/fund.test.ts`; Modify `src/model/format.ts` (+ test)

**Interfaces — Produces:**
- `FUND = 100`, `YEARS = 10`, `GP_COMMIT = 0.01`, `CARRY = 0.2`
- `splitByCommitment(R: number): { lp: number; gp: number }`
- `feeBudget(feeRate: number, fund = FUND, years = YEARS): { fees: number; invested: number }`
- `carrySplit(R: number, fund = FUND, carry = CARRY): { profit: number; carry: number; lp: number }`
- `returnNeeded(netMultiple: number, fund = FUND, carry = CARRY): number`
- `CALLS: number[]`, `DISTRIBUTIONS: number[]`, `NAV: number[]` (length 10, years 1–10)
- `fundYear(year: number): { paidIn: number; back: number; net: number; dpi: number; tvpi: number }`
- `formatMultiple(x: number): string` in `format.ts`

- [ ] **Step 1: failing tests** — `splitByCommitment(300)` → `{lp: 297, gp: 3}`; `feeBudget(0.02)` → `{fees: 20, invested: 80}`, `feeBudget(0.025).invested` = 75; `carrySplit(300)` → `{profit: 200, carry: 40, lp: 260}`, `carrySplit(80)` → `{profit: 0, carry: 0, lp: 80}`; `returnNeeded(1|2|3)` → 100 / 225 / 350; `fundYear(1)` → paidIn 20, back 0, net −20, dpi 0, tvpi 0.9; `fundYear(4).tvpi` = 1.375; `fundYear(8)` → net 5, dpi 1.05, tvpi 2.95; `fundYear(10)` → net 200, dpi 3, tvpi 3; `formatMultiple(1.375)` = "1.38×", `(4.375)` = "4.38×", `(3)` = "3×", `(0)` = "0×", `(2.8125)` = "2.81×".
- [ ] **Step 2:** `npx vitest run src/model/fund.test.ts src/model/format.test.ts` → FAIL (missing exports).
- [ ] **Step 3:** implement. Round floating results to 1e-9 where the sums are exact (e.g. 0.15×100).
- [ ] **Step 4:** same command → PASS.
- [ ] **Step 5:** commit `feat(part2): fund maths`.

### Task 2: Two pages

**Files:** Create `src/ui/usePart.ts` (+ test), `src/part2/PartTwo.tsx`, `src/part2/P2Hero.tsx`; Modify `src/App.tsx`, `src/App.test.tsx`, `src/models/Finale.tsx`, `src/ui/Equation.tsx` (chip R)

**Interfaces — Produces:** `usePart(): "one" | "two"` (reads `location.hash === "#part-two"`, listens to `hashchange`, scrolls to top on change); `PART_TWO_HASH = "#part-two"`.

- [ ] **Step 1: failing tests** — App renders Part one's h1 "Return the Fund" with no hash; with `#part-two` (set before render and via a dispatched `hashchange`) renders h1 "The Fund" and kicker "Part two"; with `#model-3` renders Part one; Part one's finale has a link named /Part two/ to `#part-two`; Part two has a link named /Part one/ to `#` (href `#top` is fine).
- [ ] **Step 2:** run App tests → FAIL.
- [ ] **Step 3:** implement hook, `PartTwo` (renders `P2Hero` and, later, the models), hero copy (warm, short; credits Kupor once), links, chip `R`.
- [ ] **Step 4:** run → PASS. **Step 5:** commit `feat(part2): second page and links`.

### Task 3: Models 1–2 (other people's money, the fee)

**Files:** Create `src/part2/F1Money.tsx`, `src/part2/F2Fee.tsx` (+ tests)

- [ ] **Step 1: failing tests** — F1: 100 notes labelled 99 LP + 1 you; slider named /R, what the fund's investments return/ with stops `[0,50,100,150,200,300,350,500]`, default 300 shows testids `f1-lp` "$297M" and `f1-gp` "$3M", with working "99% × $300M" and "1% × $300M"; rule "It's mostly other people's money. On your own $1M, you earn like any LP." F2: fee slider stops `[0.015,0.02,0.025]`, default 2% shows `f2-fees` "$2M × 10 years = $20M", `f2-invested` "$100M − $20M = $80M", `f2-needed` "$100M ÷ $80M = 1.25×"; at 2.5% invested "$75M" and needed "1.33×"; rule "Fees come off the top, so $80M has to earn back $100M."
- [ ] **Step 2–4:** fail, implement (notes via `Blocks shape="note"`; fee notes `color="ghost"`), pass.
- [ ] **Step 5:** commit `feat(part2): LP money and the fee`.

### Task 4: Models 3–4 (carry, what LPs need)

**Files:** Create `src/part2/F3Carry.tsx`, `src/part2/F4Need.tsx` (+ tests)

- [ ] **Step 1: failing tests** — F3 slider R stops `[0,50,80,100,150,200,300,350,500]`, default 300: `f3-profit` "$300M − $100M = $200M", `f3-carry` "20% × $200M = $40M", `f3-lp` "$100M + $160M = $260M", `f3-net` "2.6×", `f3-gross` "$300M ÷ $80M = 3.75×"; at 80: carry "$0", lp "$80M", net "0.8×"; shows fees "$20M" next to carry. Rule "You get 20% of the profit, and only after the LPs are whole." F4 target stops `[1,2,3]` (format "1×"), default 3: `f4-R` "$100M + $200M ÷ 0.8 = $350M", `f4-gross` "$350M ÷ $80M = 4.38×", `f4-sale` "$350M ÷ 10% = $3.5B"; at 2: "$225M", "2.81×", "$2.25B". Rule "3× for LPs means turning $80M into $350M."
- [ ] **Step 2–4:** fail, implement, pass. **Step 5:** commit `feat(part2): carry and what LPs need`.

### Task 5: Models 5–6 (time, paper and cash)

**Files:** Create `src/part2/F5Time.tsx`, `src/part2/F6Paper.tsx`, `src/part2/fund.module.css` (+ tests)

- [ ] **Step 1: failing tests** — F5 year slider 1–10 default 10: one bar per year (role img with aria text per year), `f5-net` at year 5 "−$100M", year 8 "+$5M", year 10 "+$200M"; text names "paid in" and "back"; rule "A good fund looks like a bad one for its first five years." F6 year slider default 4: `f6-dpi` "$0 ÷ $80M = 0×", `f6-tvpi` "($0 + $110M) ÷ $80M = 1.38×"; year 8: dpi "1.05×", tvpi "2.95×"; year 1: dpi "0×", tvpi "0.9×"; labels DPI and TVPI appear; rule "You raise the next fund on paper. LPs judge you on cash."
- [ ] **Step 2–4:** fail, implement (bars from a zero line: calls down, distributions up, running total marker), pass. Check 375px. **Step 5:** commit `feat(part2): the J-curve and paper vs cash`.

### Task 6: Finale, polish, artifact

**Files:** Create `src/part2/P2Finale.tsx` (+ test); Modify `src/part2/PartTwo.tsx`

- [ ] **Step 1: failing tests** — sliders fund (stops `[10,50,100,200,500]`), fee (`[0.015,0.02,0.025]`), carry (`[0.15,0.2,0.25,0.3]`), target (`[1,2,3,5]`); default $100M/2%/20%/3× shows fees "$20M", invested "$80M", R needed "$350M", gross "4.38×", carry "$50M"; at target 1× carry "$0" and no "NaN"/"Infinity" in the figure; link back to Part one; rule-free close.
- [ ] **Step 2–4:** fail, implement, pass. Full suite, `tsc -b`, build, 375px containment check, artifact build and republish.
- [ ] **Step 5:** commit `feat(part2): your fund calculator and close`.
