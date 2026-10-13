# Knowledge Atlas: Atomic Topic Count — 14 October 2026

**Data scope:** Nine Google Drive study-note archives, parsed and indexed in the Kentzo portfolio branch. The audit concerns the **currently indexed study labels**, not a claim that every line of every source note has been manually reconciled.

## Audited count
- **2,018 distinct indexed subtopic labels** after resolving explicit compound titles and selected synonyms.
- **3,144 dated study records** (a repeated lesson is a new record, not a new distinct subject).
- **1,988 dated REVIEW-marked records**.
- Date-level duplicates collapsed: **13**.
- Non-subject fragments removed: **20** (primarily the literal label `Detail`, not a lesson).
- Explicit additional child topics: **21**.
- Retitled/normalized subject labels: **107**.

| Discipline | Unique indexed topics | Study records |
|---|---:|---:|
| Economics | 730 | 1090 |
| Finance (incl. Mathematics, Statistics, Econometrics, Accounting) | 896 | 1626 |
| Crypto | 269 | 283 |
| Others | 123 | 145 |
| **Total** | **2018** | **3144** |

## How the count works
1. Each source label that clearly enumerates independent concepts is split, while preserving its original dated source record and REVIEW marker.
2. Standard integrated mathematical models or institution names are not arbitrarily split (e.g., IS–LM, AD–AS). Institution names containing grammatical conjunctions become single canonical institution labels.
3. Exact English title variants, capitalization, common punctuation and selected financial abbreviations are normalized.
4. **Unique Topics** deduplicates by the normalized subject label across dates.
5. **Study Timeline** shows the dated records, including repeated study and REVIEW sessions. Identical day/title mentions are consolidated and their REVIEW flag retained.
6. The date picker counts unique titles *inside the selected date window* in Unique mode, so monthly totals can add up to more than the global count when concepts recur across months.

## Explicit compound corrections
Dollar-Cost Averaging / Lump-Sum Investing; Jensen’s Alpha / Treynor Ratio; Aptos / NEAR Protocol; Ethereum / Geth; Political Economy / Taxation; Mergers / Acquisitions; Cash / Cash Equivalents; Research Expenditure Recognition / Development Cost Capitalization; FEER / BEER; Aggregate Supply / Aggregate Demand; Covered Call / Cash-Secured Put; rental yield / homeowner yield; Isocost; and related source-specific combinations.

## Confidence and remaining limitations
- **No explicit comma, ampersand, 'vs', 'with', or 'and' multi-subject display title remains** in the indexed user-facing subject list. This is a structural validation, not proof of 100% semantic atomization.
- Some different English labels may still denote the same subject; conversely, some generically named source entries may not uniquely identify a full study topic. Hence the number is an **exact deterministic count of the current normalized index**, not a fully audited lifetime count of all knowledge acquired.
- The earlier source-completeness audit documents unresolved historical ZIP parsing and translation caveats. Certifying full source coverage requires manual line-by-line comparison against all nine original archives.
- Do not conflate review frequency with number of unique subjects.
