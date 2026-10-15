# Knowledge Atlas parent → subtopic naming — 15 October 2026

## Presentation standard
All seven Knowledge Atlas route files now load `topic-parents.js` **after** atomization and taxonomy and **before** rendering. Every indexed subject receives an explanatory parent topic where possible, and the card displays **Parent Topic (Subtopic)**.

- `Ledger` → **Accounting (Ledger)**
- `General Ledger` → **Accounting (General Ledger)**
- `Indifference Curve` → **Consumer Theory (Indifference Curve)**
- `Nash Equilibrium` → **Game Theory (Nash Equilibrium)**
- `Key Partnerships` → **Business Model Canvas (Key Partnerships)**
- `Variance` → **Statistics (Variance)**
- `Capital Asset Pricing Model (CAPM)` → **Portfolio Theory (Capital Asset Pricing Model (CAPM))**

Parent topics follow subject-specific ordered rules in economics, finance, cryptocurrency and other disciplines. A parent/root title itself remains standalone (e.g. **Accounting**, **Game Theory**, **Ethereum**). If an archived title is too ambiguous to infer a technical parent defensibly, it receives only its broader discipline's parent.

## Exact counts preserved

- **2,018 unique subjects** in the same canonical distinct-title index.
- **3,144 dated study records** in the same chronological record index.
- **1,988 dated REVIEW records**.
- **1,987 distinct indexed titles now show a parent heading.**
- **31** root/master titles remain standalone.

| Discipline | Unique topics | Indexed titles with parent |
| --- | ---: | ---: |
| economics | 730 | 725 |
| finance | 896 | 885 |
| crypto | 269 | 263 |
| others | 123 | 114 |

## Safeguards
- No changes to the original title `t`, `d` study date, `s` archive origin, `f` discipline, `review` status or `uniqueCount`.
- The same parent is displayed in both the default **Study Timeline** and the optional **Unique Topics** view.
- Search matches either parent title, original subtopic title or study date.
- Sorting (newest/oldest), year/month filters, and 100-card pagination remain intact.
- Parent placement is an editorial taxonomy, **not** an exhaustive manual certification of nine original archives. Ambiguous and mistitled raw notes still require source review.
