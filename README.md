# MojIphone — strona serwisu

Statyczna strona (czysty HTML/CSS/JS, bez frameworka i bez kroku budowania) dla mobilnego serwisu iPhone w Rybniku. Repozytorium: [github.com/tomtecki/Iphone](https://github.com/tomtecki/Iphone).

## Struktura projektu

- `index.html` — strona główna: hero, usługi, proces, cennik, opinie, FAQ, formularz kontaktowy, asystent-bot.
- `sprawdz-model-iphone.html` — poradnik SEO "jak sprawdzić model iPhone", z linkami do cennika per model.
- `problemy-z-iphone.html` — poradnik "co zrobić, gdy..." dla najczęstszych usterek, zintegrowany z botem.
- `polityka-prywatnosci.html` — polityka prywatności (RODO).
- `styles.css`, `script.js` — wspólne style i logika (cennik, wybór modelu, bot, analityka, nawigacja).
- `robots.txt`, `sitemap.xml`, `llms.txt` — pliki techniczne SEO/AEO.
- `progress.md` — bieżący status: co zrobione, co blokuje publikację, jakie decyzje czekają na klienta.
- `pomysły.md` — log koncepcji dyskutowanych z zespołem (SEO/UX/CRO/architekt/strateg biznesowy), z rekomendacjami i statusami.
- `bot.md` — jak działa asystent-bot na stronie (dane, dopasowanie, ścieżka startowa, śledzenie skuteczności).
- `bot-baza-pytan.md` — baza pytań/przykładowe dialogi bota.
- `analityka.md` — instrukcja instalacji self-hosted Umami, docelowa konfiguracja serwera i lista śledzonych zdarzeń.
- `zdjeciaprompt.md` — gotowe prompty do generowania zdjęć.

## Infrastruktura i serwer — stan docelowy (dla agenta administrującego)

Ta sekcja jest punktem odniesienia dla osoby/agenta, który konfiguruje serwer (Umami, DNS, reverse proxy) — "jak to powinno wyglądać", niezależnie od tego, kto ostatnio to zmieniał.

| Element | Stan obecny | Uwaga |
|---|---|---|
| Domena, pod którą strona jest faktycznie serwowana | `iphone.showflow.pl` (platforma hostingowa showflow) | Docelowa domena klienta to `mojiphone.pl`, ale jeszcze nie jest pod nią wdrożona — nie konfiguruj niczego pod `mojiphone.pl`, dopóki to się nie zmieni. |
| Adres skryptu Umami wpięty w kod (`<script defer src="...">`) | `https://analytics.iphone.showflow.pl/script.js` | Wpięty w **wszystkie 4** pliki HTML: `index.html`, `sprawdz-model-iphone.html`, `problemy-z-iphone.html`, `polityka-prywatnosci.html`. `analytics.mojiphone.pl` (starsza wersja) **nie rozwiązuje się w DNS** — nie przywracać. |
| `data-website-id` w tagu skryptu | `72b84c69-a97a-42fa-a1d1-c10e87437836` | Ten sam identyfikator w każdym z 4 plików — jedna strona w Umami, wiele podstron. |
| Domena strony w panelu Umami (Ustawienia → Strony internetowe) | powinna być `iphone.showflow.pl` | Musi odpowiadać domenie, z której faktycznie ładuje się strona — inaczej Umami odrzuca zdarzenia mimo poprawnie działającego skryptu. |
| Reverse proxy dla `analytics.iphone.showflow.pl` | działa, zwraca `200` na `/script.js` (zweryfikowane `curl -I`, 2026-08-25) | Pełna instrukcja instalacji Umami (Docker Compose, reverse proxy, pierwsze logowanie): `analityka.md`. |
| Synchronizacja `iphone.showflow.pl` z GitHub | **wymaga sprawdzenia** — w przeszłości platforma showflow nie miała najnowszego commita z `main` (opóźnione/ręczne wdrożenie) | Przed każdą weryfikacją "czy poprawka działa na żywo" upewnij się, że showflow wdrożyło aktualny commit z `main` (może wymagać ręcznego "Redeploy" w panelu tej platformy). Szczegóły: `progress.md`. |

Gdy klient docelowo podłączy `mojiphone.pl`, trzeba **ponownie zmienić** zarówno `src` skryptu we wszystkich 4 plikach HTML, jak i domenę strony w panelu Umami — ta tabela opisuje stan tymczasowy dopasowany do obecnego hostingu, nie stan finalny.

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

### v6 — Poprawa czatbota i naprawa analityki (2026-08-25)

Bot: rozpoznawanie powitań/podziękowań/pytania "czy jesteś botem", rozbudowany fallback (podpowiada z czym może pomóc), nowy temat "zamiennik vs oryginał" (dodany też jako FAQ na stronie — jedno źródło treści), zdarzenia Umami opisujące skuteczność bota (`bot_rule_matched`, `bot_fallback`, `bot_part_asked` i inne, bez treści wiadomości klienta). Analityka: naprawiono błędną domenę skryptu Umami (`analytics.mojiphone.pl` nie rozwiązywała się w DNS) — przełączono na `analytics.iphone.showflow.pl`, zgodną z domeną, pod którą strona jest faktycznie serwowana. Pełny opis: [bot.md](bot.md), [analityka.md](analityka.md).

## Blokery przed publikacją produkcyjną

Pełna, aktualna lista w [progress.md](progress.md) — najważniejsze: formularz kontaktowy nie wysyła jeszcze danych (brak backendu), część danych firmowych (godziny pracy, adres, NIP) czeka na potwierdzenie przez klienta, cennik dla najnowszych modeli (iPhone 17/Air/16) czeka na przesłanie przez klienta.

## Jak pracujemy nad tym repo

Każda funkcjonalność powstaje na osobnym branchu (np. `bot/...`, `analityka/...`, `prawne/...`), z lokalnymi commitami do czasu, aż zostanie potwierdzone wypchnięcie na GitHub i scalenie z `main`. Pomysły i decyzje zespołu (SEO, UX, CRO, architektura, strateg biznesowy) są dokumentowane na bieżąco w `pomysły.md`, żeby żadna dyskusja się nie zgubiła.
