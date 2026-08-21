# MojIphone — strona serwisu

Statyczna strona (czysty HTML/CSS/JS, bez frameworka i bez kroku budowania) dla mobilnego serwisu iPhone w Rybniku. Repozytorium: [github.com/tomtecki/Iphone](https://github.com/tomtecki/Iphone).

## Struktura projektu

- `index.html` — strona główna: hero, usługi, proces, cennik, opinie, FAQ, formularz kontaktowy, asystent-bot.
- `sprawdz-model-iphone.html` — poradnik SEO "jak sprawdzić model iPhone", z linkami do cennika per model.
- `polityka-prywatnosci.html` — polityka prywatności (RODO).
- `styles.css`, `script.js` — wspólne style i logika (cennik, wybór modelu, bot, analityka, nawigacja).
- `robots.txt`, `sitemap.xml`, `llms.txt` — pliki techniczne SEO/AEO.
- `progress.md` — bieżący status: co zrobione, co blokuje publikację, jakie decyzje czekają na klienta.
- `pomysły.md` — log koncepcji dyskutowanych z zespołem (SEO/UX/CRO/architekt/strateg biznesowy), z rekomendacjami i statusami.
- `bot.md` — jak działa asystent-bot na stronie.
- `analityka.md` — instrukcja instalacji self-hosted Umami i lista śledzonych zdarzeń.
- `zdjeciaprompt.md` — gotowe prompty do generowania zdjęć.

## Historia wersji

### v1 — Pierwsza wersja robocza (2026-08-19)

Fundament strony: hero, sekcje usług i procesu, interaktywny cennik (dane przeniesione z `mojiphone.pl`) z dwupoziomowym wyborem modelu (drzewo przycisków generacja→wariant), sekcja opinii z prawdziwymi recenzjami Google, JSON-LD (`LocalBusiness`, `WebSite`, `FAQPage`), podstrona-poradnik `sprawdz-model-iphone.html`. Repozytorium Git zainicjalizowane i podłączone do GitHub.

### v2 — Redesign wyboru modelu (2026-08-20)

Siatka przycisków generacja→wariant zastąpiona dwoma rozwijanymi listami (select), po opinii UX że siatka była zbyt "hałaśliwa". Wyszukiwarka domyślnie zwinięta. Naprawiono błąd, przez który strona przy starcie od razu pokazywała krok 2 (warianty) zamiast listy generacji.

### v3 — Analityka: self-hosted Umami (2026-08-20)

Zamiast Google Analytics/GTM (wymagałby bannera zgody na cookie) — self-hosted Umami na serwerze klienta: bez cookies, bez wymogu zgody RODO. Miejsce na zdjęcie modelu w panelu cennika (placeholder, bez użycia zdjęć z apple.com — prawa autorskie).

### v4 — Asystent-bot, Faza 1 (2026-08-20)

Bot regułowy (bez LLM, bez kosztów API) odpowiadający na pytania klientów: rozpoznawanie modelu ze skrótowych zapytań ("13 pro max", "16e"), dopytywanie o wariant przy niejednoznacznej generacji, pamięć modelu w rozmowie, normalizacja tekstu bez polskich znaków, odpowiedzi dokładnie per usterka (nie tylko ekran+bateria), auto-otwarcie 3 s po wejściu na stronę, prowadzona ścieżka startowa (generacja→wariant→objaw), ikony kontaktu WhatsApp/telefon. Pełny opis: [bot.md](bot.md).

### v5 — Poprawki mobile (2026-08-21)

Naprawiono błąd CSS, przez który przycisk "Wyślij" w czacie rozjeżdżał się na wąskich ekranach (globalna reguła pełnej szerokości obejmowała też przyciski w wierszach flex).

### W toku (branch, jeszcze niescalone z `main`)

- Rozszerzone zdarzenia analityczne w Umami: wybór modelu/ceny (i skąd), start/wysłanie formularza kontaktowego, kliknięcia telefon/WhatsApp/czat — bez zbierania treści wiadomości (branch `analityka/wiecej-zdarzen-umami`).
- `polityka-prywatnosci.html` — polityka prywatności RODO, zgoda marketingowa (checkbox, opcjonalna) w formularzu kontaktowym. Wymaga przeglądu prawnego przed publikacją (branch `prawne/polityka-prywatnosci`).

## Blokery przed publikacją produkcyjną

Pełna, aktualna lista w [progress.md](progress.md) — najważniejsze: formularz kontaktowy nie wysyła jeszcze danych (brak backendu), część danych firmowych (godziny pracy, adres, NIP) czeka na potwierdzenie przez klienta, cennik dla najnowszych modeli (iPhone 17/Air/16) czeka na przesłanie przez klienta.

## Jak pracujemy nad tym repo

Każda funkcjonalność powstaje na osobnym branchu (np. `bot/...`, `analityka/...`, `prawne/...`), z lokalnymi commitami do czasu, aż zostanie potwierdzone wypchnięcie na GitHub i scalenie z `main`. Pomysły i decyzje zespołu (SEO, UX, CRO, architektura, strateg biznesowy) są dokumentowane na bieżąco w `pomysły.md`, żeby żadna dyskusja się nie zgubiła.
