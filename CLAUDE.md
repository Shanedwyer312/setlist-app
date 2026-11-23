# CLAUDE.md — setlist-app (public)

Code for the Setlist home-screen web app (iPad on a mic stand), hosted on GitHub Pages. See README.md.

- Song data and charting rules live in the private repo `Shanedwyer312/setlist-data`. Read its CLAUDE.md before any chart work.
- Never put lyrics or personal data in this repo. It's public.
- Must work fully offline. Bump `VERSION` in `sw.js` on every release so installed copies pick up the change.
- The Sheet page is shown as "Chart" in the UI (since 1.12.0). The data key is still `sheet`.
- Keep explanations plain. The owner isn't a developer.
