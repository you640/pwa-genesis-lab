
# Plán: Black Commerce OS → produkčný e-shop

Aktuálny stav je **prototyp / demo**: dáta sú hardcoded v `eShopService.ts`, košík/wishlist/objednávky žijú len v `localStorage`, neexistuje reálny backend, autentifikácia, platby, ani checkout. Na to, aby sme to mohli nazvať plnohodnotný e-shop, treba doplniť nasledovné okruhy.

> Upozornenie (legal): produktový katalóg (anabolické steroidy, HGH, peptidy, Xanax, Viagra…) je vo väčšine krajín EU regulovaný / zakázaný na voľný predaj a porušuje aj acceptable-use policy všetkých payment providerov (Stripe, Paddle, Shopify Payments, PayPal). Bez zmeny katalógu **nedostaneme schválené reálne platby**. Toto musíme vyriešiť predtým, než sa pustíme do platobnej integrácie.

---

## 1. Backend & dáta (Lovable Cloud)
Aktuálne: všetko v JS poli + localStorage.
Treba:
- Zapnúť **Lovable Cloud** (DB + auth + storage + edge functions).
- DB schéma: `products`, `product_variants`, `categories`, `manufacturers`, `inventory`, `orders`, `order_items`, `addresses`, `discount_codes`, `wishlist`, `reviews`, `blog_posts`, `notify_requests`, `audit_log`.
- Migrácia hardcoded katalógu z `eShopService.ts` do DB.
- Nahradiť mock fetch funkcie reálnymi DB volaniami.
- Cache obrázkov do Storage (teraz hotlinkujeme `isteroidi.it` – nestabilné, autorské).
- RLS policies na všetky tabuľky.

## 2. Autentifikácia & používatelia
Aktuálne: `AuthModal` je kozmetický, user sa „prihlási" lokálne.
Treba:
- Reálny signup / login (email+heslo + Google).
- `profiles` tabuľka, trigger pre auto-create profilu, role (`user`, `admin`) v samostatnej `user_roles` tabuľke.
- Reset hesla + `/reset-password` stránka.
- Email verifikácia.
- **Age-gate / overenie veku 18+** (legálna povinnosť pre tento sortiment).

## 3. Košík, checkout a objednávky
Aktuálne: localStorage košík, „checkout" cez chatbota, mock objednávky.
Treba:
- Server-side košík viazaný na usera (sync s localStorage pre guest).
- Reálny multi-step checkout: adresa → doprava → platba → potvrdenie.
- Validácia skladových zásob pri checkout-e (rezervácia stocku).
- Generovanie čísla objednávky, e-mail potvrdenie (edge function + Resend).
- Stránka detailu objednávky, faktúra v PDF.
- Stavy objednávky + admin možnosť ich meniť.

## 4. Platby
Aktuálne: žiadne.
Treba:
- Integrácia platobnej brány (Stripe / Paddle) — **podmienené zmenou katalógu** (viď legal poznámka).
- Webhook handler na potvrdenie platby → vytvorenie objednávky.
- Refund flow.
- Daňové sadzby / VAT podľa krajiny zákazníka.
- Voliteľne: dobierka, bankový prevod.

## 5. Doprava a dane
- Tabuľka shipping zón a sadzieb.
- Výpočet DPH (EU OSS).
- Integrácia s prepravcom (Packeta / DPD / GLS) – generovanie štítkov, tracking number.
- Tracking link v e-maile.

## 6. Admin panel
Aktuálne: `DashboardPage` je prázdny shell.
Treba:
- CRUD pre produkty, kategórie, výrobcov, blog posty, discount kódy.
- Prehľad a správa objednávok (zmena stavu, refund, poznámky).
- Správa používateľov a rolí.
- Sklady / inventory management, low-stock alerty.
- Upload obrázkov do Storage.
- Reporty (predaj, top produkty, conversion).

## 7. Funkcie e-shopu, ktoré chýbajú alebo sú demo
- **Vyhľadávanie**: full-text search na DB úrovni (Postgres FTS), nie filter v poli.
- **Recenzie produktov** (s overením kúpy).
- **Varianty produktu** (balenie, dávkovanie) – aktuálne len 1 cena/produkt.
- **Notify-when-in-stock**: `NotifyModal` existuje, ale e-mail sa nikam neposiela.
- **Wishlist** viazaný na účet, nie len localStorage.
- **Súvisiace produkty / cross-sell / upsell**.
- **Discount kódy** v DB (teraz hardcoded `FORGE10` v chatbote).
- **Vernostný program / kredity** (voliteľné).
- **Multi-jazyk** (i18n) a multi-mena – aktuálne len EN/USD-mix.

## 8. Právne & compliance (povinné pre EU e-shop)
- Obchodné podmienky, reklamačný poriadok, odstúpenie od zmluvy (14 dní).
- Cookies banner (CMP) + GDPR consent log.
- Privacy policy, processing agreement.
- Impressum / kontaktné údaje predajcu, IČO/DIČ.
- Faktúry s náležitosťami zákona.
- **Re-evaluácia katalógu** vzhľadom na legalitu predaja.

## 9. Bezpečnosť
- RLS na všetkých tabuľkách + audit prístupov k admin endpointom.
- Rate-limiting na auth a checkout endpointy.
- CSRF / origin check vo webhookoch.
- Sanitácia user-inputu (recenzie, blog komenty).
- Odstrániť `PrestaShopApiTester` z produkcie (debug nástroj).
- Pravidelný `security_scan`.

## 10. Performance, SEO, monitoring
- Code-splitting a lazy load stránok (`React.lazy` + `Suspense`).
- Optimalizácia obrázkov (WebP, responsive `srcset`, lazy-load – aktuálne hot-link na cudziu doménu).
- SEO meta na produkty (title, description, OG, JSON-LD `Product`/`Offer`/`BreadcrumbList`).
- Sitemap.xml, robots.txt (existuje, doplniť).
- Real router (React Router) namiesto vlastného `page` reduceru – kvôli URL, zdieľaniu, SSR/sitemap.
- Analytics (GA4 / Plausible) + e-commerce events.
- Error tracking (Sentry).
- Uptime monitoring.

## 11. PWA dotiahnutie
- Service worker (offline fallback, cache statiky) – teraz máme len manifest.
- Push notifikácie (objednávka odoslaná, akcie).
- Vlastné branding ikony namiesto placeholderov.

## 12. Chatbot do produkcie
- `GEMINI_API_KEY` presunúť do edge function (teraz volaný z FE → kľúč by bol verejný).
- Rate-limit per user/IP, logovanie konverzácií.
- Server-side execution `executeShopFunction` (košík úpravy musia ísť cez DB, nie cez FE state).

## 13. Testovanie & CI
- Unit testy služieb a redukcie (vitest – už nakonfigurované, treba pokrytie).
- E2E testy kritických flowov (Playwright): registrácia → košík → checkout → platba → potvrdenie.
- Lighthouse CI pre perf/SEO regress.

---

## Odporúčané poradie implementácie (fáza po fáze)

1. **Phase 0 – Legal**: rozhodnutie o katalógu (zmeniť sortiment alebo akceptovať, že nepôjde nasadiť reálne platby).
2. **Phase 1 – Backend základ**: Lovable Cloud, DB schéma, migrácia produktov, RLS.
3. **Phase 2 – Auth**: signup/login/Google, profile, age-gate, reset hesla.
4. **Phase 3 – Real router + SEO základ**: React Router, lazy load, meta tagy, sitemap.
5. **Phase 4 – Košík & checkout**: server-side cart, multi-step checkout, e-mail potvrdenia.
6. **Phase 5 – Platby & doprava**: Stripe/Paddle, VAT, prepravca.
7. **Phase 6 – Admin panel**: produkty, objednávky, používatelia, sklady.
8. **Phase 7 – Doplnkové features**: recenzie, varianty, notify-in-stock, súvisiace produkty, discount kódy v DB.
9. **Phase 8 – Compliance**: GDPR, cookies, OP, faktúry.
10. **Phase 9 – Performance, PWA, monitoring, testy**.

---

## Otázky pred implementáciou
- Ide reálne o predaj týchto produktov, alebo je to len portfolio/demo? (rozhoduje Phase 0)
- Cieľový trh (SK/EU/USA)? – ovplyvní DPH, jazyky, dopravcov.
- Chceš ísť cestou **Lovable Cloud + custom checkout (Stripe/Paddle)**, alebo radšej **Shopify** integráciu (rieši katalóg, dane, dopravu, platby out-of-the-box)?
- Aké payment metódy musia byť (karta, Apple/Google Pay, dobierka, prevod)?

Po odsúhlasení smeru pripravím už konkrétny implementačný plán pre prvú fázu.
