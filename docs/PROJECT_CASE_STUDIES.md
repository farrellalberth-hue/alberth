# Project case studies — evidence-first edition

Updated: 21 November 2026

These notes distinguish **observable behavior**, **inferred implementation** and **unverified properties**. They are not formal test results. Screenshots, code links, measured metrics and the owner's explanation should be attached to each case before using it in applications.

## 01 — Alberth Experiment
**Problem / intent:** Explore how an interactive product presentation can offer direct user control rather than only linear marketing content.

**Reviewer-visible scope:** Product visualization, orbit/lighting controls and interactive display.

**What this demonstrates:** UI composition, interaction design, prototyping iteration and user-facing control systems.

**Evidence still required:** Source tree, rendering architecture, input state model, loading/fallback strategy, WebGL/device compatibility, profiling and measured accessibility.

**Trade-off to explain in interview:** Visual fidelity vs device performance; progressive enhancement when 3D rendering is unavailable.

**Live:** https://alberth-experiment.floot.app/

## 02 — NOCTIS Cosmic Observatory
**Problem / intent:** Present exploratory astronomy content through a visual interface.

**Reviewer-visible scope:** Interactive celestial exploration and simulation controls.

**What this demonstrates:** Visual storytelling and interactive information presentation.

**Evidence still required:** Data provenance, simulation accuracy disclaimer, performance budget, rendering strategy, keyboard navigation and graceful fallback on low-power devices.

**Trade-off:** Scientific accuracy and honest labeling of simulations vs cinematic presentation.

**Live:** https://noctis-cosmic-observatory.vercel.app/

## 03 — Alberth ERP
**Problem / intent:** Organize a business workflow across customers, products, purchases and sales.

**Observed underlying data models (Base44 app):** Customer, Supplier, Product, Sale, Purchase, Expense, Employee and User.

**What this demonstrates:** Domain modeling and a multi-module app prototype, subject to examining the actual UI and code.

**Evidence still required:** Public guest demo, transactional updates, protection against overselling, authorization/RLS verification, traceable invoice relationships, tests and operating documentation.

**Trade-off:** Business flexibility vs consistency, public demo accessibility vs private real-user data.

**Live:** https://alberth-erp-6ec0e7d5.base44.app/

**Important:** A data schema by itself is not evidence that sales, inventory and invoicing are linked transactionally.

## 04 — Learning Journey
**Problem / intent:** Organize many learning topics with discoverability and navigation.

**Reviewer-visible scope:** Hierarchical information architecture, learning routes and subject discovery.

**What this demonstrates:** Content structuring and interface navigation.

**Evidence still required:** Schema definition, search correctness, navigation tests, content ownership/sourcing, accessibility and long-list performance.

**Trade-off:** Breadth of content vs curation and information accuracy.

**Live:** https://farrellalberth-hue.github.io/alberth/journey/

## 05 — Experiment Studio
**Problem / intent:** Explore visual identity and services for a conceptual creative-technology studio.

**What it demonstrates:** Brand positioning, creative prototyping and presentation.

**Critical disclosure:** The studio is a **concept**; do not imply a staffed agency, real clients or delivered engagements without evidence.

**Evidence still required:** Its unique URL, complete source, decision record, usability test, and actual third-party client work if claimed.

## Interview-ready structure for any project

1. **Problem:** What user or business requirement did the prototype address?
2. **Ownership:** Which parts did I design, implement, adapt or generate with assistance?
3. **Architecture:** Frontend stack, backend, storage, dependencies and deployment.
4. **Demo:** One runnable, reproducible user journey.
5. **Failure mode:** What happens when the input, API, network or database fails?
6. **Verification:** Actual test commands, screenshots, log references and measured results.
7. **Limitations:** Security/performance/product constraints that remain unresolved.
8. **Next step:** Most important engineering improvement, and why.
