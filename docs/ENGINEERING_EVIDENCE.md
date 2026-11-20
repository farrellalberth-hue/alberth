# Engineering evidence checklist

Purpose: move from **attractive prototypes** to **reviewable junior developer work**. Completion requires observable evidence, not a subjective design score.

## P0 — A transactional public demo

Acceptance scenario (use fictional data only):

- [ ] Reviewer opens a guest-safe demo without a private personal account.
- [ ] Reviewer selects a product and a positive integer quantity.
- [ ] The backend validates input; invalid quantity / unknown product returns a non-2xx error with a clear message.
- [ ] An order is persisted, with items and a reproducible amount.
- [ ] Inventory decreases by exactly the sold quantity; insufficient stock is blocked.
- [ ] The order and inventory update are atomic, including when simultaneous requests compete for stock.
- [ ] An invoice can be generated once for the order; repeated clicks do not generate duplicate invoices.
- [ ] Audit events identify order creation, stock movement and invoice generation.
- [ ] Different demo visitors do not share each other's mutable inventory or orders.
- [ ] Demo requests have basic anti-abuse limits and cannot access real personal/business data.

**Evidence to attach:** database schema, backend transaction code, minimal happy-path and failure-path API tests, links to interactive demo.

## P0 — README and reproducible setup

- [x] Explain repo purpose, local setup and deployment locations without falsely claiming all project code is in one repo.
- [x] Provide links to project case notes and technical limitations.
- [ ] Publish source for the flagship ERP demo (or explicitly state the code is held in a managed low-code platform).
- [ ] Record architecture diagram and main data flows.
- [ ] Include exact test/run commands for the flagship app source.

## P1 — Test evidence

Run tests and save commands/results. Minimum cases:
- Valid order with multiple SKUs calculates the right amount.
- Zero, negative, fractional and excessive quantities are rejected.
- Duplicate SKU lines are rejected.
- Inventory cannot fall below zero; concurrent requests do not oversell.
- Cross-workspace resource access is rejected.
- Invoice is linked to a real order and is idempotent.
- UI keyboard interaction and mobile layout work.
- Network errors and slow requests display a useful state.

Suggested tools where compatible: Vitest/Jest, Playwright, GitHub Actions. **Do not claim these are configured until they really run.**

## P1 — AI customer support

- [ ] Upload or curate clearly identified documents/FAQ records.
- [ ] Search/retrieve matching evidence and show exact source IDs.
- [ ] Refuse unsupported questions rather than inventing a policy or price.
- [ ] Support a structured human-handoff record for unanswered questions.
- [ ] Test a representative question set with expected source or abstention.
- [ ] Limit abuse and protect private document content.

## P2 — Measured production quality

- [ ] Capture real Lighthouse mobile performance, accessibility, SEO and best-practice reports with date/URL.
- [ ] Audit keyboard tab order, visible focus, contrast, semantic headings and screen-reader labels.
- [ ] Validate layout at 360px, 393px, 768px, 1024px and desktop.
- [ ] Set an image/3D payload performance budget.
- [ ] Monitor deployment errors and 404s.
- [ ] Record personal contribution honestly, including AI-assisted portions.

## Reviewer walkthrough (3 minutes)

**0:00–0:30** — Who is the candidate, which role, where are GitHub and live links?

**0:30–1:30** — Create an order and verify stock changes.

**1:30–2:00** — Generate invoice and view audit log.

**2:00–2:30** — Try invalid input and read the error.

**2:30–3:00** — Open source, schema, tests and technical trade-offs.

## Cautions

A database exists ≠ the application is transactional. A 'test passed' message ≠ comprehensive coverage. A fast-looking UI ≠ Lighthouse performance. A generated response ≠ grounded AI. Keep the distinction visible to reviewers.
