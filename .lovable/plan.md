# Mega-produkčný plán – dokončenie Black Commerce OS na 100%

Cieľ: dotiahnuť eshop z aktuálnych ~50% (backend + router + SEO hotové) na plnohodnotnú produkčnú úroveň. Plán pokrýva 6 fáz, ktoré idú za sebou v jednej veľkej iterácii.

---

## Phase 2 — Authentication & Účty (must-have)

**Frontend**
- Nahradiť mock `AuthModal.tsx` reálnym Supabase auth flow (email + heslo, Google OAuth cez `lovable.auth.signInWithOAuth`).
- Nová stránka `/auth` (login + signup tabs) + `/reset-password` (povinná pre password recovery).
- `useAuth()` hook + `AuthProvider` v `src/contexts/AuthContext.tsx` — `session`, `user`, `loading`, `signOut`. Listener `onAuthStateChange` PRED `getSession()`.
- `ProtectedRoute` wrapper pre `/dashboard`, `/my-orders`, `/wishlist`.
- `Header.tsx` — zobraziť avatar + dropdown (Profile, Orders, Wishlist, Logout) keď je user prihlásený.
- `DashboardPage.tsx` — editovateľný profil (display_name, avatar upload do storage).

**Backend**
- Konfigurácia auth: `auto_confirm_email: false`, `password_hibp_enabled: true`, `disable_signup: false`.
- Google OAuth cez `configure_social_auth` (managed).
- Storage bucket `avatars` (public read, owner write) — migrácia.

---

## Phase 4 — Cart & Checkout backend (must-have)

**Cart persistence**
- Migrácia: tabuľka `cart_items` (user_id, product_id, quantity, unique(user_id, product_id)) s RLS.
- `useCart()` hook — pre prihlásených syncuje s DB, pre hostí localStorage; pri logine merge.
- Realtime sync naprieč zariadeniami (postgres_changes na cart_items).

**Checkout**
- Rozšíriť `orders` o štruktúrované polia: `shipping_name`, `shipping_street`, `shipping_city`, `shipping_zip`, `shipping_country`, `shipping_phone`, `payment_method`, `payment_status`, `tracking_number`, `shipping_method`, `subtotal`, `shipping_cost`, `tax_amount`.
- Nová stránka `/checkout` — multi-step (Address → Shipping → Payment → Review).
- Edge function `create-order` — server-side výpočet totalu (anti-tampering), validácia stocku, atomická tvorba order + order_items, decrement `stock_quantity`, increment `discount_codes.uses_count`.
- Edge function `validate-discount` — server-side overenie (chrání pred manipuláciou).

**Platby (globálny trh, demo katalóg)**
- Integrácia Stripe (Lovable built-in `enable_stripe_payments`) — Stripe Checkout session cez edge function `create-payment`.
- Webhook `stripe-webhook` (verify_jwt=false) — aktualizuje `payment_status` a `status` order.
- Stránky `/payment-success` a `/payment-cancelled`.

**Stock management**
- Trigger po insert order_item → decrement `products.stock_quantity`, ak <= 0 nastav `in_stock=false`.
- Notify-when-back-in-stock — trigger pri `in_stock` true → email cez `notify_requests`.

---

## Phase 5 — Admin panel (must-have pre prevádzku)

- Stránka `/admin` chránená `has_role('admin')`.
- CRUD: produkty (create/edit/delete + image upload do `product-images` bucket), kategórie, manufacturers, discount codes.
- Order management: zoznam, filter podľa statusu, detail, zmena statusu, pridanie tracking_number.
- Dashboard widgety: tržby (7/30 dní), počet objednávok, top produkty, low-stock alert.
- User management: zoznam, prideľovanie role (`user`, `moderator`, `admin`).

---

## Phase 6 — Emaily, notifikácie, compliance

**Emaily** (Lovable email infra + Resend domain)
- Setup email infra + verified domain.
- Auth emaily (confirmation, password reset, magic link).
- Transakčné: order confirmation, order shipped (tracking link), back-in-stock notification, abandoned cart (cron edge function).

**Compliance (globálne)**
- Cookie consent banner (analytics opt-in).
- GDPR: stránka `/privacy`, `/terms`, `/refund-policy`, `/shipping`. Export osobných dát + Delete account v Dashboarde (edge function `delete-user-data`).
- Newsletter opt-in pri signup (separátny súhlas).

---

## Phase 7 — Performance, PWA, Quality

**Performance**
- Code-splitting cez `React.lazy()` + `Suspense` pre všetky route komponenty.
- Image optimization: lazy `loading="lazy"`, `srcset`, fallback skeleton, WebP cez Supabase storage transformations.
- React Query (`@tanstack/react-query` už je) — prepísať `eShopService` volania na `useQuery` s cache, prefetch produktov pri hover na kartu.
- Pagination / infinite scroll pre `ProductListPage` (aktuálne loaduje 1000).

**PWA upgrade**
- Service worker (Workbox) — offline cache pre statické assety + product listy.
- `navigateFallbackDenylist: [/^\/~oauth/]` (kritické pre Google login).
- Background sync pre wishlist.

**Quality**
- Error boundary + Sentry-style logging cez edge function.
- Vitest testy pre `routing.ts`, `useCart`, `validate-discount`.
- Accessibility audit: aria-labels, focus traps v modaloch, kontrast.
- i18n príprava — `react-i18next`, EN default + SK preklady (globálny trh = EN primárny).

---

## Technické detaily

**Nové migrácie**
- `cart_items` table + RLS
- `orders` ALTER (rozšírené stĺpce)
- `products` trigger na stock decrement
- Storage buckets: `avatars`, `product-images`
- `audit_log` table pre admin akcie

**Nové edge functions**
- `create-order`, `validate-discount`, `create-payment`, `stripe-webhook`, `delete-user-data`, `abandoned-cart-cron`, `send-order-email`

**Nové secrets** (vyžiadame od usera v správny moment)
- Stripe sa rieši cez `enable_stripe_payments` (žiadny manuálny key)
- Email domain setup → Resend (cez tool)

**Nové súbory (frontend)**
- `src/contexts/AuthContext.tsx`, `src/hooks/useAuth.ts`, `src/hooks/useCart.ts`
- `src/pages/Auth.tsx`, `src/pages/ResetPassword.tsx`, `src/pages/Checkout.tsx`, `src/pages/PaymentSuccess.tsx`, `src/pages/Admin/*` (Dashboard, Products, Orders, Users, Discounts)
- `src/components/ProtectedRoute.tsx`, `src/components/CookieConsent.tsx`

---

## Poradie implementácie (1 spustenie = celých 50%)

```
1. Phase 2  Auth + Google OAuth + Profiles
2. Phase 4a Cart persistence + checkout UI
3. Phase 4b Stripe payments + edge functions
4. Phase 5  Admin panel
5. Phase 6  Emaily + compliance stránky + cookie banner
6. Phase 7  Lazy load + React Query + PWA SW + i18n
```

Po dokončení = 100% produkčný eshop pripravený na publish.

---

## Otázky pred štartom (zodpovedz a začínam)

1. **Stripe** — môžem hneď spustiť `enable_stripe_payments` (vyplníš formulár)?
2. **Email domain** — máš vlastnú doménu pre transakčné emaily, alebo použijeme Lovable default?
3. **i18n** — EN only, alebo EN + SK od začiatku?
4. **Admin user** — po dokončení Phase 2 ti pridelím rolu `admin` (potrebujem tvoj email po signupe).