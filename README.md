# Alberth Farrell Hartimin

**Independent Web Developer · Creative Technologist · UI Engineering**

I build interactive digital products, explore software architecture and use hands-on prototypes to learn frontend and application engineering. This repository holds my **personal portfolio and learning website**. Other projects listed below live in separate hosting environments; their source code is **not** automatically part of this repository.

> Open to junior frontend, creative development, UI development and technical internship opportunities.

## Open the work

| Project | What a reviewer can inspect | Live link |
| --- | --- | --- |
| **Personal Portfolio** | Responsive editorial interface, project presentation and browser interactions | [Portfolio](https://alberth-portfolio-one.vercel.app/) |
| **Alberth Experiment** | Interactive product exploration and configurable visuals | [Experience](https://alberth-experiment.floot.app/) |
| **NOCTIS Observatory** | Astronomy-themed interactive exploration | [NOCTIS](https://noctis-cosmic-observatory.vercel.app/) |
| **Alberth ERP** | Business management prototype with customer, product, sales and related models; access may require sign-in | [ERP](https://alberth-erp-6ec0e7d5.base44.app/) |
| **Learning Journey** | Structured learning and navigation experience | [Journey](https://farrellalberth-hue.github.io/alberth/journey/) |

**Distinguishing a prototype from production:** An interactive demo demonstrates a visible workflow; it does **not** automatically prove security, scalability, testing coverage or production readiness. I document those gaps rather than claim metrics I have not measured.

## Repository map

This is primarily a **static web project**, not a conventional React or Next.js monorepo.

```text
.
├── index.html              # Main portfolio entry point
├── about/                  # About content and pages
├── journey/                # Learning Journey pages
├── learning-data/          # Learning content / datasets
├── library/                # Library interface
├── tools/                  # Supporting web tools
├── yellow-book/            # Notes and learning section
├── youtube/                # Video-related content
├── .github/workflows/      # Repository automation
├── *.css                   # Stylesheet iterations
├── *.js                    # JavaScript feature modules
├── PORTFOLIO.md            # Portfolio scope and guardrails
└── docs/                   # Recruiter-oriented technical notes
```

This repository contains several historical CSS/JS versions while designs were iterated. **That is technical debt, not deliberate architecture**. A future refactor will consolidate them into stable modules and remove unused assets.

## Run locally

No package installation is required for the static pages:

```bash
git clone https://github.com/farrellalberth-hue/alberth.git
cd alberth
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Alternatively, open `index.html` in a browser; a local server is preferred if a page fetches local JSON assets.

## Technical notes

- **Frontend:** HTML, CSS and JavaScript for this repository. Individual external prototypes may use different stacks.
- **Deployment:** GitHub Pages for the learning route; Vercel for the portfolio and NOCTIS projects; Floot and Base44 for selected app prototypes.
- **Accessibility:** Responsive layouts and keyboard interaction are design goals. Automated WCAG audits have **not** been established for every project.
- **Testing:** Do not infer a full automated test suite from the presence of an interactive demo. Tests, failure cases and measured performance need project-specific evidence.
- **Security:** Do not put API secrets, customer records or private documents in repository code or public demo datasets.
- **AI-assistance:** AI-supported iteration may accelerate implementation; it is not evidence that I independently authored or understand every generated line. My goal is to be able to explain and modify the code under review.

## Case studies & engineering priorities

- [Project case studies and honest limitations](docs/PROJECT_CASE_STUDIES.md)
- [Technical improvement plan and reviewer test checklist](docs/ENGINEERING_EVIDENCE.md)
- [Portfolio scope, sourcing and guardrails](PORTFOLIO.md)

## What I'm learning next

1. **Data consistency:** atomic sales order → inventory deduction → invoice → audit log, with an isolated public demo.
2. **Testing:** unit tests for business rules, integration tests for persistence and end-to-end browser checks.
3. **Backend engineering:** validation, authenticated access, authorization and API error contracts.
4. **Observability:** measured performance, reproducible bug reports and deployment reliability.
5. **AI systems:** retrieval with verifiable citations, abstention when evidence is missing and human escalation.

## Contact

- **GitHub:** https://github.com/farrellalberth-hue
- **Portfolio:** https://alberth-portfolio-one.vercel.app/

---

Built as a learning and engineering portfolio. Claims are intentionally limited to what reviewers can verify.
