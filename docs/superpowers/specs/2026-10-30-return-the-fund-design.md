# Return the Fund — design

*Venture capital from the bare basics. A Feynman exercise on* Secrets of Sand Hill Road.

## Intent

Arnav knew which things matter in venture capital (ownership, dilution, follow-ons, preferences, the one winner) the way he knew tyres and pit stops matter in F1, but could never hold them as a model: every attempt arrived with too many variables at once. Chain Bear's *Building an F1 Strategy from the Bare Basics* fixed that for F1 by starting with a model small enough to count, adding one variable per step, and ending each step with a sum that becomes a rule. This piece does the same for the investor's side of VC.

It is framed as Arnav's own Feynman exercise in public: *I read the book; this is me explaining it to myself, one variable at a time.* The reader is anyone who wants the model in their head, not VC professionals.

It sits alongside *Half a Ship Sinks*. That piece makes you feel the risk; this one makes you able to work it out. Same three ideas underneath (loss capped, gain uncapped; prepare, then commit; risk as reasoned, not gambled), but here they must come out of the arithmetic, never be staged.

## Goals

- A reader finishes able to do **the napkin sum**: *the exit a company needs = fund size ÷ the share you'll own at the end*, and knows why the share at the end is smaller than the share at the start, and who gets paid before them in a small sale.
- Every number on screen can be counted or checked by hand.
- Each model adds exactly one variable to the last and ends with a rule in one plain sentence.
- Other investors are the "other cars": they set prices, dilute you, and stand ahead of you in a sale.

## Non-goals

- Founder-side negotiation, term-sheet clause-by-clause tours, fund economics (fees, carry), taxes, option pools, participating preferences, anti-dilution formulas. Mention at most in a side note.
- Randomness, simulation, games, scores, persistence. Everything is deterministic.

## Anti-goals (failure even if it works)

- **Looks like F1.** No cars, tracks, tyres, laps, chequered flags. F1 is the method only.
- **Too many variables at once.** If a model introduces two new ideas, split it.
- **Jargon before numbers.** No term (pre-money, pro rata, liquidation preference, dilution) appears before the reader has built it with blocks. The term arrives as a label on something they already understand.
- **Expert voice.** It is a learner's notebook, honest about what was confusing.
- **Unverifiable visuals.** No chart whose numbers the reader can't recount.

## Form and look

A single scrolling web page. Each model is a numbered section — "Model 1: one cheque" — echoing Chain Bear's structure in type only.

**Look (Claude's call): a clean graph-paper notebook.** Warm off-white paper with a very faint square grid (the grid *is* the unit), ink-black type, flat colour blocks, no textures, no skeuomorphism. Modern and calm. Motion only to show a sum changing.

- One block = one million dollars ($1M). One square in a company = one share. Both are drawn as literal squares on the grid.
- Players have fixed colours used everywhere: **You** (rust), **Founders** (warm grey), **Series A investor** (blue), **Series B investor** (green). Check contrast.
- Unknowns are small round chips in equations, like Chain Bear's pit-stop "P": **E** (exit value), **h** (hit rate), **s** (survival).
- Equations are set large, one line each, e.g. `1 block × 10% … ` with the chip inline; the rule sits under it in plain words.
- Prose: first person, short paragraphs, column ~640px; instruments may go wider.
- Fonts (Claude's call): Newsreader for prose (shared lineage with *Half a Ship*), a mono for numbers and equations, a clean sans for labels.

## The ladder (all numbers verified)

Units: $M. One company is followed throughout ("the company"). The reader is a seed investor with a **$10M fund** writing **$1M cheques**.

### Model 1 — One cheque
- The company is cut into **100 squares**. Founders hold 90. You pay $1M for 10 → **one square costs $0.1M**, the whole company is "priced" at **$10M after your money** (post-money; pre-money $9M arrives as a label later, Model 4).
- Drag **E** (what the company sells for). Your return = 10% × E, drawn as blocks to scale against your one block.
  - E = 0 → 0 blocks (lose 1). E = $10M → 1. E = $100M → 10. E = $1B → 100 blocks.
- **Rule:** *The most you can lose is the cheque. What you can win is your share × the sale, with no ceiling.*

### Model 2 — Ten cheques
- Fund = 10 blocks, ten $1M cheques, each 10% of its company.
- Outcomes (Kupor's shape, simplified): 5 return 0, 2 return 1×, 2 return 3×, 1 is the winner. Without the winner the fund returns 8 of 10 — it loses.
- Drag the winner's return. Fund total bar vs the "fund returned" line and a "3× fund" line (30).
- Winner needs 2 blocks to return the fund, 22 to triple it.
- **Rule:** *One company has to carry the fund. The rest barely matter.*

### Model 3 — The napkin sum
- The winner returning 22 blocks with 10% means it sold for $220M. Generalise: **exit needed = fund ÷ your share**.
  - $10M fund, 10% → $100M to return the fund once.
  - Show the scale-up line: a $100M fund at 10% needs a **$1B** exit — the reason VCs ask "can this be a billion-dollar company?"
- Interactive: fund size and share sliders → exit needed.
- **Rule:** *Before you write the cheque, divide the fund by your share. If the company can't plausibly be worth that, the cheque can't matter.*

### Model 4 — Other investors arrive (dilution)
- **Series A:** a new investor pays $5M for **25 new squares** ($0.2M each). The company now has 125 squares. Your 10 squares are untouched; your share is 10/125 = **8%**.
- **Series B:** another investor pays $20M for **25 new squares** ($0.8M each). 150 squares. Your share **6.67%** (1/15).
- Visual: the company grid grows; your squares stay 10. Step buttons Seed → A → B.
- Labels arrive now: price per square × all squares before the round = **pre-money**; after = **post-money** (A: $20M → $25M; B: $100M → $120M).
- Napkin updated: share at the end, not the start. $10M fund ÷ 6.67% = **$150M** (vs $100M). $100M fund: $1B → $1.25B → **$1.5B**.
- **Rule:** *Every round adds squares and never removes yours. Use the share you'll have at the end.*

### Model 5 — More money into the winner, or a new bet? (follow-on)
- You have $1M left. Option 1: buy into Series B at $0.8M a square → **1.25 squares**. Option 2: a new seed cheque in a different company at $0.1M a square → 10 squares, which only pay if that company gets this far (chance **h**).
- Assume both companies end up equally valuable and are equally diluted from here; compare squares: `1.25 = h × 10` → **h = 1/8**. The crossover is just seed price ÷ round price.
- Second unknown, added afterwards (one variable at a time): the Series B company may still fail, survival **s**: `s × 1.25 = h × 10` → follow on if **h < s/8**.
- Interactive: h slider (and then s); two square stacks; crossover marker.
- Label arrives: keeping your share in a new round is your **pro rata**. Real funds hold back roughly half for this (Kupor) — side note.
- **Rule:** *Follow on when your odds on a fresh bet are worse than the old price ÷ the new price. Prepare widely, then concentrate on what's working.*

### Model 6 — Who gets paid first (preferences)
- Investors bought **preferred** squares: in a sale they may take their money back first *instead of* their share (1×, non-participating, all preferred equal in line — Claude's simplification, stated in a side note).
- Step 1 (one variable): only Series B has it. B paid $20M for 25 of 150 squares. B takes the larger of $20M or 25/150 × E. Crossover **E = $120M** — exactly the price B paid for the company.
- Step 2: everyone's preference. Drag E; a horizontal waterfall bar splits the sale among You, A, B, Founders.
  - E = $30M → B 20, A 5, You 1, Founders 4.
  - E = $60M → B 20, A 8, You 3.2, Founders 28.8 (You and A have switched to their share).
  - E = $120M+ → everyone takes their share; E = $1.2B → You 80, A 200, B 200, Founders 720.
  - Below $26M investors share the sale in proportion to what they put in and founders get nothing.
- Conversion rule per holder: take the larger of money back or share; solved jointly (lowest price per share switches first). Thresholds: You switch at $35M, A at $45M, B at $120M.
- **Rule:** *Below the last round's price, preferences decide who gets paid. Above it, only shares matter — and above it is where a fund is made. Your downside protection is your $1M back; your upside is the 80.*

### Model 7 — Other investors set the price
- **Hot deal:** a rival fund offers to back the company at $20M after the money. To win, you pay $0.2M a square → 5 squares, share at the end 1/30 → exit needed for the $10M fund doubles to **$300M**.
- **Cold market** (the "safety car" moment, in VC terms only): Series B happens in a downturn at $0.3M a square instead of $0.8M. Your $1M of reserves buys 3.33 squares instead of 1.25; the follow-on crossover becomes h = 1/3.
- **Rule:** *Paying up halves your squares and doubles the exit you need. Money held back is worth most when everyone else is scared.*

### Finale — The napkin
- A small calculator in the notebook's own style: fund size, price you pay per share (or post-money and cheque), expected rounds of dilution → share at the end → exit needed; and a line naming who stands ahead of you in a sale below the last price.
- Closing paragraph ties back to the three ideas: the loss was always one block; the gain was the 80; and every step of preparation happened *before* the cheque — after it, you concentrate.
- Short reading list: Kupor; *Against the Gods* (Bernstein) on the asymmetry; *Zero to One* (Thiel) on the power law.

## Voice

First person learner, Arnav's notebook. Claude drafts all prose; Arnav will rewrite it in his voice before sharing. Allowed asides: "This is where I got lost the first time…". Kupor, Bernstein, Thiel quoted sparingly and attributed.

## Constraints

- Stack (Claude's call, same as *Half a Ship*): Vite + React + TypeScript, Vitest + Testing Library, plain CSS with tokens and CSS modules, @vercel/analytics. Deployed by Arnav on Vercel.
- All maths lives in pure, tested functions (`src/model/`): price per share, rounds/dilution, napkin exit, portfolio totals, follow-on crossover, waterfall with joint conversion. Tests pin every number in this document.
- Accessible: every interactive has keyboard control and a text equivalent of its sum; contrast AA; works at 375px with no sideways scroll; respects reduced motion.
- No randomness, no storage.

## Left to the builder

Exact component breakdown, palette values within the direction above, slider vs drag handle per instrument, animation details, the hero, favicon and share image.
