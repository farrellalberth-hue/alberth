(() => {
  'use strict';
  const roles = {
    frontend: { number: '01', title: 'Frontend Developer',
      summary: 'Interactive interfaces backed by clear JavaScript state, input validation and reproducible UI behavior.',
      evidence: ['Working order/inventory browser demo', 'Interaction-led UI experiments in separately hosted projects', 'Native Node.js tests for core JavaScript business rules'],
      url: 'demo/', cta: 'TRY THE JAVASCRIPT DEMO ↗' },
    fullstack: { number: '02', title: 'Full-Stack Intern',
      summary: 'Exploring how product interfaces connect to business-domain rules, APIs, relational data and safe transactions.',
      evidence: ['Separate PostgreSQL-backed ERP prototype in development', 'Public browser demo with visible business rules', 'Documented gaps: authentication, authorization and integration testing'],
      url: 'https://github.com/farrellalberth-hue/alberth/blob/main/docs/ENGINEERING_EVIDENCE.md',
      cta: 'REVIEW THE ENGINEERING CHECKLIST ↗' },
    creative: { number: '03', title: 'Creative Developer',
      summary: 'Design-led experiments that investigate 3D interaction, product storytelling and immersive interfaces.',
      evidence: ['Alberth Experiment: interactive viewing and visual control', 'NOCTIS: astronomy-inspired visual experience', 'Performance profiling and device-fallback evidence remain next steps'],
      url: 'https://alberth-experiment.floot.app', cta: 'EXPLORE ALBERTH EXPERIMENT ↗' },
  };
  const roleButtons = [...document.querySelectorAll('[data-role]')];
  const $ = (id) => document.getElementById(id);
  for (const button of roleButtons) {
    button.addEventListener('click', () => {
      const role = roles[button.dataset.role];
      if (!role) return;
      roleButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      $('role-panel').querySelector('.label').textContent = `SELECTED HIRING LENS / ${role.number}`;
      $('role-heading').textContent = role.title;
      $('role-summary').textContent = role.summary;
      const list = $('role-evidence');
      list.replaceChildren();
      for (const evidence of role.evidence) {
        const li = document.createElement('li');
        li.textContent = evidence;
        list.appendChild(li);
      }
      $('role-link').setAttribute('href', role.url);
      $('role-link').textContent = role.cta;
      $('role-link').setAttribute('target', role.url.startsWith('https://') ? '_blank' : '_self');
      $('role-link').setAttribute('rel', 'noopener noreferrer');
    });
  }
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-kind]')];
  for (const filter of filters) {
    filter.addEventListener('click', () => {
      const selected = filter.dataset.filter;
      filters.forEach((btn) => btn.setAttribute('aria-pressed', String(btn === filter)));
      const visible = projects.filter((project) => selected === 'all' || project.dataset.kind === selected);
      projects.forEach((project) => { project.hidden = !visible.includes(project); });
      $('result-count').textContent = `${visible.length} PROJECT${visible.length === 1 ? '' : 'S'}`;
    });
  }
  $('copy-summary').addEventListener('click', async () => {
    const summary = 'Alberth Farrell Hartimin — independent web developer & creative technologist. Portfolio: https://alberth-portfolio-one.vercel.app/hire/ | GitHub: https://github.com/farrellalberth-hue/alberth | Inspect the transaction lab, tests, business rules, and project case studies. Open to junior developer and internship opportunities.';
    try {
      await navigator.clipboard.writeText(summary);
      $('copy-message').textContent = 'Candidate summary copied.';
    } catch {
      $('copy-message').textContent = 'Clipboard unavailable here. Use the page URL to share the portfolio.';
    }
  });
})();