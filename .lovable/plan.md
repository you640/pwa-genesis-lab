
## Plán: Obnova Black Commerce OS + jednoduchá PWA

### 1. Obnova projektu zo zálohy
- Rozbalím `black-commerce-os-backup-20251125.zip`.
- Nahradím súbory v projekte obsahom backupu (src/, public/, package.json, tailwind/vite konfigy, index.html).
- Zachovám Lovable-špecifické súbory, ktoré nesmú byť prepísané (napr. `vite.config.ts` upravím selektívne, nie nahradím kompletne, ak by bola kolízia).
- Po rozbalení skontrolujem strukturu, doinštalujem chýbajúce závislosti zo zálohovaného `package.json`.
- Ak v zálohe existuje Supabase / Lovable Cloud konfigurácia, prepojím existujúci backend (alebo použijem existujúce env premenné).

### 2. Pridanie inštalovateľnej PWA vrstvy (bez service workera)
Žiadny `vite-plugin-pwa`, žiadny offline cache → bezpečné voči Lovable preview iframe.

**Manifest** `public/manifest.webmanifest`:
- name: „Black Commerce OS"
- short_name: „Black OS"
- start_url: `/`
- display: `standalone`
- background_color / theme_color: čierna (`#000000`)
- ikony: 192×192, 512×512 (maskable + any)

**Placeholder ikony** v `public/icons/`:
- `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon-180.png`
- Jednoduchá čierna dlaždica s bielym monogramom „BCOS".

**Meta tagy v `index.html`**:
- `<link rel="manifest" href="/manifest.webmanifest">`
- `<meta name="theme-color" content="#000000">`
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- `<meta name="apple-mobile-web-app-title" content="Black OS">`
- `<link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png">`
- viewport s `viewport-fit=cover` pre safe-area na iOS

**Favicon**: nahradím existujúci `public/favicon.ico` novým `favicon.png` z brandingu, aktualizujem odkaz v `index.html`.

### 3. Drobné mobil-friendly úpravy
- V `index.css` pridám podporu pre safe-area ins