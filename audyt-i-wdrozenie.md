# Audyt i wdrożenie strony MojIphone

## Stan początkowy

- Projekt zawierał pusty plik `wymagania.md`, więc nie było istniejącej strony do przebudowy.
- W `wymagania.md` wskazano aktualną stronę `https://mojiphone.pl/` oraz oczekiwanie, aby dane i cennik pochodziły z obecnej strony klienta.
- Na obecnej stronie znaleziono numer telefonu `570 222 345`, informację o mobilnym serwisie i darmowym dojeździe na terenie Rybnika.
- Nadal brakuje potwierdzonego adresu rozliczeniowego, e-maila, godzin pracy, profilu Google Business Profile i realnych opinii.

## Użyte lokalne skille

- `seo-audit`: techniczne SEO, tytuł, meta description, H1, crawlability, sitemap, robots.
- `schema-markup`: JSON-LD dla `LocalBusiness`, `WebSite` i `FAQPage`.
- `landing-page`: struktura hero, problem, usługi, proces, FAQ, CTA.
- `frontend-design`: jasna, zaufana kolorystyka i charakterystyczny obraz stanowiska serwisowego.
- `page-cro`: pojedynczy główny cel konwersji, CTA przy kluczowych decyzjach, redukcja obaw.
- `copywriting`: prosty język klienta, bez pustych obietnic i fałszywych opinii.
- `analytics-tracking`: lekki `dataLayer` dla kliknięć w CTA i numer telefonu.
- `content-strategy`: treści odpowiadające na realne pytania klientów i zapytania lokalne.

## Co jest już wdrożone

- Strona główna w `index.html`.
- Responsywny styl w `styles.css`.
- Menu mobilne, klikalny cennik po modelu i tracking kliknięć CTA w `script.js`.
- Własny obraz hero w `assets/iphone-repair-workstation.png`.
- `robots.txt` z odwołaniem do sitemap.
- `sitemap.xml`.
- `llms.txt` jako pomocniczy plik informacyjny dla narzędzi AI, z zastrzeżeniem że Google nie wymaga takiego pliku.
- Wszystkie widoczne numery telefonu mają `href="tel:+48570222345"`, więc na telefonie kliknięcie numeru otwiera wybieranie połączenia.
- Dodano sekcję zapowiadającą kolejny etap: rezerwację terminów i bota odpowiadającego na pytania.

## SEO, GEO i AEO

- SEO: unikalny title, meta description, jeden H1, logiczne H2/H3, tekstowe sekcje usług, FAQ i wewnętrzne kotwice.
- Lokalne SEO/GEO: Rybnik, obszar dojazdu, frazy lokalne, `LocalBusiness` schema i miejsce na spójne NAP.
- AEO/GEO dla AI: jasne odpowiedzi w FAQ, treść w HTML, opis procesu, usługi nazwane językiem klienta, structured data zgodne z widoczną treścią.

## Do uzupełnienia przed publikacją

1. Potwierdź, czy docelowa domena zostaje `https://mojiphone.pl/`.
2. Potwierdź adres rozliczeniowy lub zakres danych adresowych do schema.
3. Uzupełnij prawdziwe godziny pracy.
4. Potwierdź pełny obszar dojazdu poza Rybnikiem.
5. Podłącz formularz do realnego backendu, CRM, bota albo systemu rezerwacji. Obecnie jest przygotowany wizualnie i nie wysyła danych.
6. Po publikacji zweryfikuj stronę w Google Search Console i dodaj lub zaktualizuj Google Business Profile.

## Rzeczy, których celowo nie dodałem

- Fałszywych opinii klientów.
- Gwarancji czasu naprawy bez warunku dostępności części.
- Twierdzeń o autoryzacji Apple.
- Agresywnego upychania słów kluczowych.
