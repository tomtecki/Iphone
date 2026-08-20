# Pomysły i rekomendacje — strona MojIphone

Plik zbiorczy: wszystkie pomysły omawiane z zespołem ekspertów, wraz z rekomendacją i statusem. Aktualizowany na bieżąco.

Skład zespołu: SEO/GEO/AEO, Behawiorysta/CRO, Architekt, UX, Marketingowiec, Potencjalny klient, **Strateg biznesowy** (ocena, czy funkcjonalność w ogóle warto budować — koszt/ryzyko/zwrot).

---

## 1. Agent/bot odpowiadający na pytania klientów i zbierający leady

**Status: do przedyskutowania / niezaimplementowane.**

### Dyskusja zespołu

**Strateg biznesowy (nowy głos):** Zanim zdecydujemy o technologii, trzeba odpowiedzieć na pytanie biznesowe: *czy problem, który bot ma rozwiązać, jest wystarczająco duży?* To lokalny serwis mobilny — dominującym kanałem konwersji jest telefon (570 222 345), nie czat. Bot ma sens tam, gdzie realnie tracimy leady: głównie **poza godzinami pracy** (dziś pon–pt, zamknięte wieczorami/weekendami) oraz w momencie wahania klienta przed telefonem. Zanim zainwestujemy w cokolwiek więcej niż prosty formularz, warto **zmierzyć skalę problemu** (patrz rekomendacja niżej) — inwestowanie w bota bez danych o realnym wolumenie ruchu po godzinach to wydawanie budżetu na przypuszczenie, nie na fakt.

Koszt i ryzyko rosną mocno między dwoma wariantami:
- **Bot regułowy (formularz-kwalifikator)** — koszt bliski zeru (rozwinięcie tego, co już mamy: dane z cennika, FAQ), brak kosztów bieżących, brak ryzyka błędnej odpowiedzi.
- **Bot LLM (swobodna rozmowa)** — koszt wdrożenia + stały koszt API (miesięczny, skalujący się z ruchem) + ryzyko wizerunkowe (błędna odpowiedź o cenie/gwarancji budująca fałszywe oczekiwania) + konieczność monitorowania rozmów.

**Rekomendacja stratega:** nie inwestować od razu w wariant LLM. Zbudować wariant regułowy jako część już planowanego formularza kontaktowego (i tak wymaga podłączenia backendu), zmierzyć przez 4–8 tygodni: (a) % zgłoszeń poza godzinami pracy, (b) % użytkowników, którzy wchodzą w cennik, ale nie dzwonią ani nie wysyłają formularza. Dopiero te dane uzasadnią (albo nie) dalszą inwestycję w bota LLM.

**Behawiorysta/CRO:** Zgadza się z fazowaniem. Dobry kierunek — klient wchodzący wieczorem z pękniętym ekranem często nie zadzwoni od razu, ale odpowie na 2–3 pytania w czacie/formularzu. To "miękkie wejście" przed telefonem może podnieść liczbę leadów po godzinach.

**Architekt:** Rozróżnienie dwóch produktów jest kluczowe:
1. Prosty formularz-kwalifikator z regułami (jaki model? co się stało? → automatyczna wstępna diagnoza + zbiórka kontaktu) — tani, przewidywalny, wystarczy JS + webhook do e-maila/CRM. Naturalne rozszerzenie istniejącego `contact-form` i danych z `PRICE_DATA`.
2. Bot LLM — wymaga backendu, kosztów API, i pilnowania, żeby nie obiecywał rzeczy niezgodnych z ofertą (np. fałszywej ceny czy terminu).

**SEO/AEO:** Bot nie zastępuje treści SEO — Google/AI i tak najlepiej indeksują tekst w HTML. Bot to dodatek konwersyjny, nie źródło treści.

**Marketingowiec:** Ton bota (w każdej wersji) musi być zgodny z resztą strony — rzeczowy, bez pustych obietnic, żadnych fałszywych cen czy gwarancji czasowych bez zastrzeżenia dostępności części.

**Potencjalny klient:** Chcę szybkiej odpowiedzi. Jeśli bot tylko zbiera dane i obiecuje oddzwonienie — spoko. Jeśli udaje, że wie dokładnie ile będzie kosztować naprawa mojego modelu, wolę żeby po prostu pokazał mi tabelę cennika (którą już mamy).

### Rekomendacja zespołu (zaktualizowana)

✅ **Faza 1 (teraz, niski koszt):** formularz-kwalifikator z regułami, wpięty w istniejący formularz kontaktowy — klika objawy, dostaje wstępną diagnozę (nie instrukcję DIY), dane trafiają do backendu (i tak trzeba go podłączyć).

⏸ **Faza 2 (odłożona, warunkowa):** bot LLM — dopiero po zebraniu danych z Fazy 1 potwierdzających realny wolumen ruchu, który by go uzasadnił.

---

## 2. Dedykowane landing page per model + typ usterki (SEO)

**Status: pomysł, niezaimplementowany.**

Np. osobne strony "wymiana ekranu iPhone 13 Rybnik", "wymiana baterii iPhone 14 Rybnik" — pod długi ogon zapytań, z domyślnie dopasowaną treścią (nie przez parametr URL, tylko przez to, że to dedykowana strona).

**Strateg biznesowy:** Większy nakład contentowy (dużo stron do utrzymania), ale niski koszt techniczny (strona statyczna, ten sam wzorzec co `sprawdz-model-iphone.html`). Sensowne dopiero gdy podstawowe SEO (już wdrożone) zacznie przynosić mierzalny ruch — inaczej to praca "na zapas" bez potwierdzenia popytu.

**Zespół:** ✅ wart rozważenia, ale jako osobny projekt contentowy po ustabilizowaniu podstawowej wersji strony.

---

## 3. Widget Google Reviews zamiast statycznych opinii

**Status: opinie statyczne wdrożone (5 prawdziwych recenzji + `AggregateRating`), widget odłożony.**

**Strateg biznesowy:** Widgety (Elfsight/EmbedSocial/Trustmary) zwykle wymagają płatnego planu przy większym ruchu. Statyczne opinie (już wdrożone) są darmowe i w pełni wiarygodne (prawdziwe, nie fabrykowane), tylko wymagają ręcznej aktualizacji raz na jakiś czas — przy skali tej strony to rozsądny kompromis, nie priorytet do zmiany.

**Zespół:** ⏸ zostaje jak jest, do rewizji tylko jeśli klient zacznie zbierać dużo nowych opinii i ręczna aktualizacja stanie się uciążliwa.

---

## 4. Mechanizm `?model=` w URL (wybór modelu z linku)

**Status: ✅ wdrożone.**

Fundament pod przyszłe kampanie Google Ads per model + linki wewnętrzne (np. `sprawdz-model-iphone.html`). Nie da się tego zrobić dla ruchu organicznego z Google (przeglądarki nie przekazują treści zapytania), ale działa w pełni dla płatnego ruchu i linków własnych.

---

## Jak korzystać z tego pliku

Każdy nowy pomysł omawiany z zespołem trafia tu jako osobna sekcja: krótki opis, dyskusja poszczególnych ekspertów (w tym stratega biznesowego oceniającego zasadność), rekomendacja i status (✅ wdrożone / ⏸ odłożone / do przedyskutowania).
