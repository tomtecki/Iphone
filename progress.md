# Progress — strona MojIphone

Ostatnia aktualizacja: 2026-08-22 (poprawka mobilna czatu, mniejsze nagłówki, wykryta rozbieżność wdrożenia na showflow.pl)

## ✅ Zrobione

- Struktura strony `index.html`: hero, trust-strip, intro (ze zdjęciem technika), usługi, proces, cennik, lokalizacje, opinie, FAQ, formularz kontaktowy, stopka.
- SEO/GEO/AEO: unikalny title/description, jeden H1, JSON-LD (`LocalBusiness`, `WebSite`, `FAQPage`, `AggregateRating`, `Review`), `robots.txt`, `sitemap.xml`, `llms.txt`.
- Cennik interaktywny w `script.js` — dane przeniesione z `mojiphone.pl` dla modeli iPhone 4s–15 Pro Max.
- Dodane najnowsze modele (17 Pro Max, 17 Pro, Air, 17, 17e, 16 Pro Max, 16 Pro, 16 Plus, 16, 16e) — **bez cen**, pokazują "Na zapytanie" do czasu przesłania cennika przez klienta.
- Skróty "Popularne modele" nad pełnym wyborem.
- Wybór dokładnego modelu przez dwa rozwijane selecty: **Generacja → Wariant** (zastąpiły wcześniejszą siatkę przycisków — po opinii UX, że była za bardzo "hałaśliwa" i łatwo się w niej zgubić). Wyszukiwarka tekstowa domyślnie zwinięta pod przyciskiem "Szukaj po nazwie modelu", żeby nie zajmowała miejsca na starcie.
- Mechanizm `?model=` w URL — automatyczne otwarcie cennika z wybranym modelem (fundament pod przyszłe kampanie Google Ads per model).
- Sekcja opinii z 5 prawdziwymi recenzjami z Google (dostarczone przez klienta jako zrzuty ekranu) + plakietka 4,9/5 (164 opinie) w hero.
- Nowa podstrona SEO `sprawdz-model-iphone.html` — poradnik "jak sprawdzić model iPhone" z linkami do cennika per model, mini-FAQ w schema.
- Zdjęcie "technik przy pracy" wygenerowane przez klienta, wpięte w sekcję intro.
- Plik `zdjeciaprompt.md` z gotowymi promptami do wygenerowania kolejnych zdjęć.
- Repozytorium GitHub podłączone: https://github.com/tomtecki/Iphone.git
- Analityka: self-hosted **Umami** (bez cookies, bez bannera zgody RODO) na własnym serwerze klienta (`analytics.mojiphone.pl`), skrypt wpięty w `index.html` i `sprawdz-model-iphone.html`. Instrukcja instalacji w `analityka.md`, decyzja i alternatywy w `pomysły.md`.
- Miejsce na zdjęcie modelu w panelu cennika (placeholder 📱 do czasu wyboru źródła zdjęć — **nie** wolno używać zdjęć z apple.com, prawa autorskie).
- `pomysły.md` — zbiorczy log koncepcji dyskutowanych z zespołem (bot/agent leadowy, landing page per model, widget opinii, analityka) z rekomendacjami i statusami.
- **Asystent-bot (Faza 1, regułowy, bez LLM)** na `index.html`: auto-otwarcie 3 s po wejściu na stronę (chyba że klient sam wcześniej wejdzie w interakcję), prowadzona ścieżka startowa generacja → wariant → objaw (przyciski), rozpoznawanie skrótów bez słowa "iPhone" (np. "13 pro max", "16e"), dopytywanie o wariant przy niejednoznacznej generacji (np. samo "13"), pamięć modelu w rozmowie, normalizacja tekstu bez polskich znaków, odpowiedzi dokładnie per usterka (nie tylko ekran+bateria) z linkami/przyciskami do materiałów. Dokumentacja: `bot-baza-pytan.md`.
- **`polityka-prywatnosci.html`** — nowa podstrona RODO: administrator danych, cele/podstawy prawne/okresy przechowywania (tabela), analityka (Umami bez cookies), prawa osoby (dostęp/sprostowanie/usunięcie/skarga do UODO). Link w stopce wszystkich stron. **Nie jest to porada prawna** — wymaga przeglądu przez prawnika przed publikacją, brakuje NIP-u firmy (oznaczone w treści jako do uzupełnienia).
- Formularz kontaktowy: dodana informacja o dobrowolności podania danych + link do polityki, oraz osobny, odznaczony domyślnie **checkbox zgody marketingowej** (opcjonalny, nie blokuje wysyłki formularza).
- Ikony kontaktu (WhatsApp + telefon) — pływający dok w prawym dolnym rogu na `index.html` i `sprawdz-model-iphone.html`.
- Faza 2 bota (zbieranie leadów + integracja z systemem obsługującym naprawy) — zaplanowana w `pomysły.md`, jeszcze niezaimplementowana.
- **`problemy-z-iphone.html`** — poradnik "co zrobić, gdy..." dla 11 najczęstszych problemów (bateria, przegrzewanie, ghost touch, ostrzeżenie o cieczy, wolne działanie, brak sieci, restart co kilka minut/panic-full, brak głosu 12/12 Pro, Touch Disease 6 Plus, Audio IC Disease 7/7 Plus, zielony/biały ekran 13 Pro), źródło: `usterki.md` od klienta. Bezpieczne kroki programowe zostały, ale treści DIY dotyczące otwierania telefonu/lutowania zastąpiono kierowaniem do kontaktu z MojIphone (zgodnie z wcześniejszą zasadą zespołu: diagnoza, nie instrukcja majsterkowania). FAQPage schema dla AEO/AI. Link w nawigacji ("Pomoc") na `index.html` i `sprawdz-model-iphone.html`.
- Bot rozpoznaje teraz też pytania objawowe bez podanego modelu (np. "iPhone się grzeje") i kieruje do właściwej sekcji `problemy-z-iphone.html` (`BOT_PROBLEM_TOPICS` w `script.js`) — sprawdzane przed pytaniem o model/cenę, żeby klient dostał diagnozę zamiast od razu być pytanym o model.
- **Naprawiony realny błąd: okienko czatu otwierało się poza ekranem na mobile.** Przyczyna była głębsza niż pierwsza poprawka: bezwarunkowe reguły `.chat-widget`/`.chat-panel`/`.contact-dock` były w pliku `styles.css` **fizycznie później** niż `@media (max-width: 620px)` z ich mobilnymi wariantami — przez to override mobilny nigdy się nie stosował (kaskada CSS liczy się według kolejności w pliku przy tej samej specyficzności). Cały blok bezwarunkowy przeniesiony przed obie media queries; do `.chat-panel` na mobile dodano `position: fixed` (żeby `left`/`right` liczyły się względem całego ekranu, nie względem 58-pikselowego przycisku) i `max-height: 65vh`. Zweryfikowane przez wymuszenie reguł mobilnych na żywej stronie w przeglądarce (Chrome przez rozszerzenie "Claude in Chrome") — panel poprawnie rozciąga się przy krawędziach ekranu.
- **Zmniejszone nagłówki globalnie** (h1/h2/h3) na całej stronie, w tym hero na stronie głównej — na wyraźną prośbę klienta. h1: z clamp do 6,5rem (kolumna 11 znaków) → clamp do 3,4rem (kolumna 22 znaki). h2: z clamp do 3,4rem → clamp do 2,4rem. Usunięty też węższy mobilny override h1 (12 znaków), sensowny tylko przy starej, dużej czcionce.
- Strona "Pomoc" (`problemy-z-iphone.html`) doprowadzona do porządku: naprawiono przewijanie do sekcji (chowało się pod sticky nagłówkiem — `scroll-margin-top` był na złym elemencie), dodano widoczny nagłówek spisu treści (był ukryty `sr-only`), dodano disclaimer "na własną odpowiedzialność" z numerem telefonu do każdej z 11 sekcji z krokami.
- Rozszerzone zdarzenia analityczne w Umami: `model_selected` (z polem `source`: select/popular/search/bot/url_param), `contact_form_started`, `contact_form_submitted` (bez treści pól — dane osobowe), oraz kliknięcia `tel:`/WhatsApp/czat przekierowane też do Umami (wcześniej szły tylko do nieużywanego `window.dataLayer`).
- **Testowanie w przeglądarce działa** — po zainstalowaniu przez klienta rozszerzenia "Claude for Chrome" mogę realnie otwierać stronę, klikać, robić zrzuty ekranu i wymuszać reguły CSS do weryfikacji (np. testu mobilnego bez realnej zmiany rozmiaru okna, które w tym środowisku jest zablokowane).

### ⚠️ Ważne odkrycie: `iphone.showflow.pl` nie jest zsynchronizowane z GitHub

Porównanie `styles.css` z serwera (przez czyste `curl`, bez cache przeglądarki) z lokalnym plikiem pokazało, że **żywa strona na showflow.pl nie ma najnowszego commita** (`36257bf` — poprawka czatu na mobile). Ma już zmniejszone nagłówki i większość wcześniejszych funkcji, ale brakuje `position: fixed` i `max-height` w mobilnym `.chat-panel` — **błąd z czatem wyskakującym poza ekran prawdopodobnie nadal występuje na żywo**, mimo że w repozytorium jest naprawiony.

`showflow.pl` to najwyraźniej zewnętrzna platforma hostingowa/wdrożeniowa (ślady frameworku Angular w warstwie serwującej), nie zwykły serwer plików — prawdopodobnie synchronizuje się z GitHub automatycznie, ale z opóźnieniem, albo wymaga ręcznego wyzwolenia wdrożenia. **Wymaga sprawdzenia przez klienta w panelu tej platformy** (przycisk "Redeploy"/"Sync" albo ponowne wgranie z brancha `main`).

## ⚠️ Brakuje / blokuje publikację

1. **Formularz kontaktowy nie wysyła danych** — dziś tylko UI (`action="#"`, JS podmienia komunikat, ale nic nie leci do klienta/CRM/e-maila). Trzeba podłączyć realny backend (Formspree, własny endpoint, webhook) przed publikacją.
2. **Godziny pracy — rozbieżność do wyjaśnienia z klientem.** W kodzie: pon–pt 9:00–18:00, sob 10:00–14:00. Źródła zewnętrzne (wyszukiwarka) sugerowały pon–pt 8:00–16:00, bez weekendów. Nie potwierdzone przez klienta.
3. **Adres w schema `LocalBusiness`** ma tylko miasto (Rybnik). Klient podał adres `Jana III Sobieskiego 20, 44-200 Rybnik` w rozmowie — czeka na potwierdzenie, czy to adres do publikacji na stronie (czy tylko punkt kontaktowy/odbioru).
4. **Cennik dla nowych modeli** (17 Pro Max, 17 Pro, Air, 17, 17e, 16 Pro Max, 16 Pro, 16 Plus, 16, 16e) — brak realnych cen, pokazują "Na zapytanie". Klient ma przesłać cennik.
5. **Dane z `mojiphone.pl`** — strona ma ochronę antybotową (ekran "Proszę czekać na weryfikację żądania…"), niedostępna dla automatycznego pobierania (ani przeglądarka narzędziowa, ani WebFetch). Czeka na ręczne przesłanie treści/zrzutów przez klienta, jeśli potrzebne są dodatkowe dane.
6. **Google Search Console** — pominięte na prośbę klienta (brak dostępu bez podawania danych logowania). Dane firmowe potwierdzane ręcznie przez klienta zamiast przez GSC.
7. **Kompresja/`srcset`/WebP** dla zdjęć — nadal nie zrobione (zdjęcie hero jest ciężkim PNG ~1,7 MB).
8. **Docelowy widget Google** zamiast statycznych opinii — opcjonalne, wymaga wyboru narzędzia (Elfsight/EmbedSocial/Trustmary) i prawdopodobnie płatnego planu.
9. **NIP firmy** brakuje w `polityka-prywatnosci.html` (oznaczone w treści jako do uzupełnienia) — potrzebny przed publikacją.
10. **Polityka prywatności wymaga przeglądu prawnego** — napisana na podstawie standardowych wymogów RODO, ale to nie jest porada prawna.
11. **`iphone.showflow.pl` nie jest zsynchronizowane z najnowszym commitem `main`** (patrz sekcja wyżej) — brakuje poprawki czatu na mobile. Klient musi wymusić ponowne wdrożenie na tej platformie.

## 🤔 Decyzje do podjęcia przez klienta

- Czy godziny pracy w kodzie są aktualne, czy trzeba je poprawić (patrz punkt 2 wyżej).
- Czy adres `Jana III Sobieskiego 20` ma się pojawić publicznie na stronie / w schema.
- Czy i kiedy przesłać cennik dla nowych modeli (17/Air/16).
- Czy inwestować w widget Google Reviews (koszt/narzędzie) czy zostać przy statycznych opiniach.
- Priorytet: formularz kontaktowy (backend) — bez tego strona traci leady mimo ruchu.
- **Pilne:** sprawdzić i wymusić redeploy na `iphone.showflow.pl` — brakuje ostatniej poprawki (czat na mobile).

## 💡 Pomysły omówione, jeszcze niezaimplementowane

- **Bot/formularz kwalifikujący usterkę** — klient klika objawy zamiast pisać tekst, dostaje wstępną diagnozę (nie instrukcję DIY). Zespół rekomenduje wersję opartą o reguły, nie pełny LLM, na start.
- **Landing page'e per model + typ usterki** (np. "wymiana ekranu iPhone 13 Rybnik") dla lepszego SEO na konkretne zapytania — większy projekt contentowy, do zaplanowania osobno.
- Model wyboru na podstawie wyszukiwania Google — **niewykonalne dla ruchu organicznego** (Google nie przekazuje treści zapytania), ale zaimplementowany mechanizm `?model=` obsłuży to dla płatnych kampanii Google Ads.

## 📂 Struktura plików

- `README.md` — przegląd projektu i historia wersji
- `index.html` — strona główna
- `sprawdz-model-iphone.html` — poradnik SEO + wybór modelu
- `polityka-prywatnosci.html` — polityka prywatności RODO
- `problemy-z-iphone.html` — poradnik "co zrobić, gdy..." dla 11 najczęstszych problemów, zintegrowany z botem
- `usterki.md` — materiał źródłowy poradnika problemów, dostarczony przez klienta
- `analityka.md` — instrukcja instalacji self-hosted Umami i lista śledzonych zdarzeń
- `styles.css`, `script.js` — style i logika (cennik, drzewo modeli, formularz, nav, bot, analityka)
- `bot.md` — jak zbudowany jest asystent-bot (dane, dopasowanie, ścieżka startowa)
- `bot-baza-pytan.md` — baza pytań/przykładowe dialogi bota
- `zdjeciaprompt.md` — prompty do generowania zdjęć
- `assets/` — obrazy użyte na stronie
- `zdjęcia/` — oryginalne pliki przesłane przez klienta (źródło dla `assets/`)
- `robots.txt`, `sitemap.xml`, `llms.txt` — pliki techniczne SEO
- `wymagania.md` — pierwotne wymagania i inspiracje od klienta
- `audyt-i-wdrozenie.md` — log pierwszego wdrożenia
