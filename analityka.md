# Instrukcja instalacji Umami (analityka strony mojiphone.pl)

Ten plik to instrukcja wykonawcza dla osoby/agenta administrującego serwerem (self-hosted). Cel: zainstalować Umami (analitykę bez cookies, zgodną z RODO bez bannera zgody) i wygenerować fragment kodu `<script>` do wpięcia na stronie mojiphone.pl.

Kontekst decyzji: `pomysły.md`, sekcja 5 — wybrano self-hosted Umami zamiast Google Analytics/GTM, bo klient ma własny serwer i chce uniknąć bannera zgody na cookie (Umami domyślnie nie używa cookies do śledzenia).

## Wymagania wstępne

- Docker + Docker Compose zainstalowane na serwerze.
- Dostęp do skonfigurowania subdomeny (rekomendowane: `analytics.mojiphone.pl`) wskazującej na ten serwer.
- Reverse proxy (nginx lub Caddy) z automatycznym certyfikatem SSL (np. Let's Encrypt/Certbot, lub Caddy, który robi to automatycznie).

## Krok 1: Katalog i pliki konfiguracyjne

Utwórz katalog `umami/` na serwerze i w nim plik `docker-compose.yml`:

```yaml
services:
  umami:
    image: docker.umami.is/umami-software/umami:postgresql-latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://umami:${DB_PASSWORD}@db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: ${APP_SECRET}
    depends_on:
      - db
    restart: always
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - umami-db-data:/var/lib/postgresql/data
    restart: always
volumes:
  umami-db-data:
```

W tym samym katalogu utwórz plik `.env` z **wygenerowanymi losowo** wartościami (nie używaj przykładowych/domyślnych):

```
DB_PASSWORD=<wygeneruj losowe silne hasło, min. 20 znaków>
APP_SECRET=<wygeneruj losowy ciąg, min. 32 znaki>
```

Do wygenerowania losowych wartości można użyć np. `openssl rand -hex 32`.

**Ważne:** plik `.env` nie powinien nigdy trafić do repozytorium Git ani zostać wysłany publicznie — zawiera sekrety dostępowe do bazy danych.

## Krok 2: Uruchomienie

```bash
cd umami
docker compose up -d
```

Sprawdź, czy oba kontenery działają: `docker compose ps` — status `running`/`healthy` dla obu usług (`umami`, `db`).

## Krok 3: Reverse proxy + HTTPS

Skonfiguruj subdomenę `analytics.mojiphone.pl` jako reverse proxy do `localhost:3000`, z ważnym certyfikatem SSL. Bez działającego HTTPS na tej subdomenie skrypt śledzący nie będzie mógł się poprawnie załadować na stronie głównej (która sama działa po HTTPS) — przeglądarki blokują tzw. mixed content.

Przykład konfiguracji dla Caddy (`Caddyfile`), jeśli jest dostępny na serwerze:

```
analytics.mojiphone.pl {
    reverse_proxy localhost:3000
}
```

Caddy automatycznie obsłuży certyfikat SSL. Jeśli na serwerze jest nginx zamiast Caddy, skonfiguruj analogiczny reverse proxy + certbot dla tej subdomeny.

## Krok 4: Pierwsze logowanie i zmiana hasła

1. Wejdź na `https://analytics.mojiphone.pl`.
2. Zaloguj się domyślnymi danymi: **login `admin`, hasło `umami`**.
3. **Natychmiast zmień hasło** — Ustawienia → Profil → zmiana hasła. Nie zostawiaj domyślnego hasła w żadnych okolicznościach, panel jest publicznie dostępny pod tym adresem.

## Krok 5: Dodanie strony i wygenerowanie kodu śledzącego

1. W panelu Umami: **Ustawienia → Strony internetowe → Dodaj stronę internetową**.
2. Nazwa: `MojIphone`, Domena: `mojiphone.pl`.
3. Zapisz — Umami wygeneruje gotowy fragment kodu, wygląda podobnie do:
   ```html
   <script defer src="https://analytics.mojiphone.pl/script.js" data-website-id="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"></script>
   ```

## Krok 6: Co przekazać dalej

Skopiuj **dokładnie ten fragment `<script>`** (cały tag, z pełnym adresem `src` i wartością `data-website-id`) i przekaż go do wklejenia w kodzie strony (repozytorium `tomtecki/Iphone`, plik `index.html` i `sprawdz-model-iphone.html`). To jedyna rzecz potrzebna do dokończenia integracji po stronie kodu strony — reszta (baza danych, panel, zbieranie statystyk) zostaje wyłącznie na serwerze klienta.

## Dodawanie kolejnych stron do tej samej instancji Umami

Jedna instalacja Umami obsługuje dowolną liczbę stron jednocześnie — nie trzeba stawiać osobnego serwera/kontenera dla każdej. Statystyki są w pełni rozdzielone: każda strona ma własny dashboard i własny `data-website-id`, mimo wspólnej bazy danych.

Aby dodać kolejną stronę:

1. W panelu Umami: **Ustawienia → Strony internetowe → Dodaj stronę internetową**.
2. Podaj nazwę i domenę nowej strony.
3. Umami wygeneruje nowy tag `<script>` z tym samym `src="https://analytics.mojiphone.pl/script.js"`, ale **innym** `data-website-id`.
4. Wklej ten tag w `<head>` nowej strony (bezpośrednio w jej kodzie/repo).

**Uwaga o zasobach serwera:** więcej podpiętych stron = więcej zapisów do bazy Postgres. Dla kilku stron wizytówkowych to pomijalne obciążenie, ale przy stronie z realnie dużym ruchem warto obserwować zużycie RAM/CPU kontenera `db` i w razie potrzeby zwiększyć zasoby.

## Kontrola bezpieczeństwa po instalacji

- [ ] Hasło administratora zmienione z domyślnego.
- [ ] `.env` nie jest publicznie dostępny (nie w katalogu serwowanym przez webserver, nie w Git).
- [ ] Subdomena `analytics.mojiphone.pl` działa po HTTPS z ważnym certyfikatem.
- [ ] Port `3000` nie jest wystawiony publicznie bezpośrednio, jeśli reverse proxy już go przykrywa (dla dodatkowego bezpieczeństwa można ograniczyć nasłuchiwanie do `127.0.0.1:3000` zamiast `0.0.0.0:3000` w `docker-compose.yml`, skoro dostęp ma iść tylko przez reverse proxy).
