# iXTalent publiceren op GitHub Pages

Deze versie is aangepast voor GitHub Pages:

- `vite.config.ts` bevat `base: './'`, zodat assets relatief worden geladen.
- `.github/workflows/deploy-pages.yml` bouwt de Vite/React-app en publiceert de map `dist`.

## Stappen

1. Upload alle bestanden uit deze map naar je GitHub-repository.
2. Ga in GitHub naar **Settings → Pages**.
3. Kies bij **Source**: **GitHub Actions**.
4. Commit/push naar de `main` branch.
5. Ga naar **Actions** en wacht tot de workflow **Deploy to GitHub Pages** klaar is.
6. Open daarna de link die GitHub Pages toont.

## Wit scherm?

Een wit scherm ontstaat vaak wanneer GitHub Pages de broncode probeert te openen in plaats van de gebouwde app, of wanneer asset-paden zoals `/assets/...` verkeerd staan. Deze versie gebruikt relatieve paden en een GitHub Actions workflow die automatisch de juiste `dist`-map publiceert.
