# Return the Fund

Venture capital from the bare basics. A single-page explorable notebook that builds the investor's model one variable at a time, from one cheque to the sum every investor does on a napkin: **the sale a company needs = fund ÷ the share you'll own at the end.**

Seven models, each ending in one rule:

1. One cheque: loss capped at the cheque, gain uncapped.
2. Ten cheques: one company carries the fund.
3. The napkin sum.
4. Other investors arrive (dilution, pre/post-money).
5. Follow on, or a new bet? (crossover = old price ÷ new price)
6. Who gets paid first (1× non-participating preferences).
7. Other investors set the price (hot deals, cold markets).

Then a napkin calculator.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # every number on the page is pinned by a test
npm run build    # static site in dist/
```

## Deploy

Vercel: import the repo, framework "Vite", no settings needed. Link previews use `VERCEL_PROJECT_PRODUCTION_URL` automatically; elsewhere set `VITE_SITE_URL` to the site's origin.

## Where things live

- `src/model/` — all the maths, pure and tested (squares, rounds, napkin, follow-on, payout waterfall).
- `src/ui/` — squares, equations with unknown-chips, sliders.
- `src/models/` — one component per section of the page.
- `docs/superpowers/` — the design and the build plan.
