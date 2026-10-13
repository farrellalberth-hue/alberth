# Kentzo Honggo Limkajaya — Cloudflare Pages production setup

This file applies only to the Kentzo portfolio. It must not change or publish the original Alberth portfolio.

## Source of truth

- GitHub repository: `farrellalberth-hue/alberth`
- **Production branch: `kentzo-honggo-portfolio`** (NEVER `main`)
- Website type: static HTML / CSS / vanilla JavaScript
- Website files reside at the repository root: `index.html`, `cinematic-v4.css`, `cinematic-v4.js`, `atelier.css`, `knowledge-data.js`, `library/`.
- The latest VL cinematic intro duration is **5 seconds** and ends with **“Every great idea begins with curiosity.”**
- Logo: VL. Color palette: monochrome black, white and grayscale.
- Kentzo's About biography, birth date (17 November 2007), age 1–18 timeline, and WhatsApp contact are retained.

## Cloudflare dashboard — one-time Git integration

1. Open <https://dash.cloudflare.com/> and sign into the authorized Cloudflare account.
2. Go to **Workers & Pages** → **Create application** → **Pages** → **Import an existing Git repository / Connect to Git**.
3. Authorize GitHub if prompted. Select only the intended GitHub repository `farrellalberth-hue/alberth`.
4. Configure the Pages project:
   - Project name: `kentzo-honggo-portfolio` (or another available name if taken)
   - Framework preset: **None**
   - **Production branch: `kentzo-honggo-portfolio`**; do not select `main`
   - Build command: `exit 0` (or leave blank)
   - Build output directory: `.` (the repository root)
   - Root directory: repository root / blank (default)
   - No environment variables, paid services, or build secrets needed
5. Deploy and confirm that the deployment is **Success / Production**, and copy the **actual Pages URL** reported by the Cloudflare dashboard. Do not assume a `pages.dev` hostname before verification.
6. Open the actual published website and inspect the logo, 5-second introduction, closing sentence, 3D hero logo, About age timeline, WhatsApp button, and `/library/economics/`.
7. In Cloudflare **Settings → Builds → Branch control**, keep only the `kentzo-honggo-portfolio` branch for production and **disable automatic preview deployments** if the continuously changing `main` branch causes unwanted builds. This does not prevent production updates on Kentzo's branch.

## Future updates

Git integration automatically deploys the latest commit when `kentzo-honggo-portfolio` is updated. Continue to edit this branch alone. There is no need to deploy through Vercel or transfer the original owner's website. Preserve source code and existing Vercel hosting until Cloudflare production has been independently verified.

## Verifications

- [ ] Cloudflare Pages is linked to the correct GitHub repository
- [ ] Production branch is `kentzo-honggo-portfolio`
- [ ] Deployment state is successful
- [ ] Published Pages URL is confirmed
- [ ] Five-second VL introduction works
- [ ] Closing sentence displays before intro exits
- [ ] VL 3D background appears at lower-left of hero
- [ ] Name, birthday, six life chapters and WhatsApp are present
- [ ] `/library/economics/` opens
- [ ] The original Alberth project is untouched

**Note:** This setup guide alone does not connect Cloudflare or publish the site. Cloudflare account authorization and the initial Git integration are required.
