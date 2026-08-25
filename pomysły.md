# Pomysły i rekomendacje — strona MojIphone

Plik zbiorczy: wszystkie pomysły omawiane z zespołem ekspertów, wraz z rekomendacją i statusem. Aktualizowany na bieżąco.

Skład zespołu: SEO/GEO/AEO, Behawiorysta/CRO, Architekt, UX, Marketingowiec, Potencjalny klient, **Strateg biznesowy** (ocena, czy funkcjonalność w ogóle warto budować — koszt/ryzyko/zwrot).

---

## 1. Agent/bot odpowiadający na pytania klientów i zbierający leady

**Status: ✅ Faza 1 wdrożona (branch `bot/faza1-qa-regulowy`) — bot regułowy Q&A. Faza 2 (zbieranie leadów + integracja z systemem obsługującym naprawy) zaplanowana, niezaimplementowana.**

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

✅ **Faza 1 — wdrożona (2026-08-20):** widżet czatu w prawym dolnym rogu (`index.html`), dopasowanie słów kluczowych do gotowych odpowiedzi z treści już opublikowanej na stronie (FAQ, godziny, dojazd, zalanie, faktura, gwarancja) + rozpoznawanie nazwy modelu w pytaniu i odpowiedź z ceną ekranu/baterii z `PRICE_DATA`. Zero kosztów bieżących, zero ryzyka halucynacji (brak LLM). Jawny disclaimer w UI, że to automatyczna odpowiedź na podstawie treści strony. Szybkie pytania (chipy) dla najczęstszych tematów.

➡️ **Faza 2 (kolejny krok, zaplanowany przez klienta):** rozszerzenie bota o zbieranie leadów (imię/telefon/model/usterka) i wysyłkę do systemu obsługującego naprawy (CRM). Wymaga: (a) wyboru/potwierdzenia systemu docelowego (jaki CRM/narzędzie klient używa albo planuje), (b) tego samego backendu, który i tak jest potrzebny do podłączenia głównego formularza kontaktowego — sensowne zrobić oba na raz, jednym mechanizmem wysyłki.

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

## 5. Analityka strony (cel: dane do poprawy konwersji)

**Status: do przedyskutowania — potrzebne dane wejściowe od klienta, żeby wdrożyć.**

### Dyskusja zespołu

**Strateg biznesowy:** To jedna z niewielu inwestycji na tej stronie o niemal zerowym koszcie i wysokim zwrocie — bez danych o tym, gdzie klienci rezygnują (np. wybierają model, ale nie dzwonią), każda kolejna zmiana UX to zgadywanie, a nie decyzja oparta na faktach. Rekomendacja: **wdrożyć jak najszybciej**, ale pod jednym twardym warunkiem — zgodność z RODO (patrz uwaga UX/prawna niżej), bo to jedyny realny koszt/ryzyko w tym pomyśle.

**Behawiorysta/CRO:** Kluczowe zdarzenia do śledzenia (lejek konwersji):
1. Wejście w sekcję cennika,
2. Wybór generacji → wybór wariantu (gdzie użytkownicy porzucają wybór?),
3. Wyświetlenie cennika dla modelu,
4. Klik w "Potwierdź cenę telefonicznie" / inne `tel:` linki,
5. Wysłanie formularza kontaktowego,
6. Kliknięcie w link do opinii Google / poradnika o modelu.
Dziś namiary na to częściowo już istnieją: `script.js` ma gotowy `window.dataLayer.push({event: "cta_clicked", ...})` dla wszystkich elementów `[data-track]` — to fundament pod Google Tag Manager, nie trzeba pisać tego od nowa.

**Architekt:** Rekomenduję **Google Tag Manager (GTM)** jako warstwę pośrednią zamiast wpinania Google Analytics (GA4) bezpośrednio w kod. Różnica: z GTM dodawanie/zmiana tagów (GA4, ewentualnie Meta Pixel, Google Ads conversion tracking) odbywa się w panelu GTM, bez kolejnych zmian w `script.js` — istniejący `dataLayer.push` już jest w formacie, który GTM czyta natywnie. Jedna linijka `<script>` w `index.html`, cała konfiguracja dalej w panelu przeglądarkowym klienta.

**UX / kwestia prawna (RODO):** **Blocker, nie szczegół.** Strona działa w Polsce/UE, GA4/GTM ustawia pliki cookie do śledzenia — zgodnie z RODO i Prawem Telekomunikacyjnym **wymaga to zgody użytkownika (banner cookie) przed załadowaniem skryptów śledzących**, nie po fakcie. Nie da się tego pominąć "bo to tylko analityka" — to wymóg prawny niezależny od intencji. Trzeba dodać banner zgody (odrzuć/akceptuj), a skrypt analityczny ładować dopiero po zgodzie.

**SEO/AEO:** Analityka nie wpływa bezpośrednio na SEO, ale dostarcza danych do priorytetyzacji dalszych zmian (np. które strony/sekcje mają wysoki bounce rate).

**Marketingowiec:** Warto też skonfigurować śledzenie parametrów UTM w GA4 (dla przyszłych kampanii Google Ads powiązanych z mechanizmem `?model=` z punktu 4) — to naturalne domknięcie już wdrożonego mechanizmu.

**Potencjalny klient:** Nie mam nic przeciwko analityce, o ile nie śledzi mnie bez pytania — jasny, prosty banner "Akceptuję/Odrzucam" wystarczy, nie chcę wielostopniowego formularza zgód.

### Rekomendacja zespołu (pierwotna, GTM/GA4)

✅ Wdrożyć: banner zgody na cookie → Google Tag Manager → tag GA4 + zdarzenia konwersji z listy Behawiorysty wyżej.

**Blokada do wdrożenia:** potrzebny Container ID z Google Tag Manager (i/lub Measurement ID z GA4) należący do klienta.

### Decyzja klienta (2026-08-20): self-hosted Umami zamiast GA4/GTM

Klient ma własny serwer i woli hostować analitykę samodzielnie. Zespół omówił alternatywy (Umami, Plausible CE, Matomo, PostHog, GoatCounter) — rekomendacja padła na **Umami**: lekkie, bez cookies domyślnie (**nie wymaga bannera zgody RODO**), estetyczny dashboard, proste wdrożenie przez Docker Compose.

**Status:** klient przygotowuje instalację na własnym serwerze (przy pomocy własnego asystenta/"codexa"). Instrukcja instalacji (Docker Compose, reverse proxy, pierwsze logowanie) przekazana klientowi poza tym repo.

**Status: ✅ wdrożone (2026-08-20).** Skrypt Umami wpięty w `<head>` w `index.html` i `sprawdz-model-iphone.html` (website ID `72b84c69-a97a-42fa-a1d1-c10e87437836`, instancja `analytics.mojiphone.pl`). Statystyki dostępne w panelu Umami klienta.

**Nieaktualne po tej decyzji:** krok "banner zgody na cookie" (punkt 1 rekomendacji GTM/GA4 wyżej) — Umami w domyślnej konfiguracji nie wymaga zgody, więc banner nie jest potrzebny, chyba że klient później doda inne narzędzia korzystające z cookies.

---

## 6. Baza wiedzy o typowych problemach iPhone (karmi bota i SEO)

**Status: pomysł, niezaimplementowany.**

Pomysł klienta: rozbudować stronę o artykuły diagnostyczne dla najczęstszych problemów (telefon zalany, ekran miga/zmienia kolory, słabo trzyma baterię itd.), i użyć tej samej wiedzy do zasilenia bazy bota.

**SEO/AEO:** Mocny kierunek — długi ogon zapytań diagnostycznych ("ekran iphone miga co robić") ma niską konkurencję komercyjną i jest dokładnie tym, co AI Overview/ChatGPT/Perplexity lubią cytować (treść rzetelna, nie sprzedażowa).

**Architekt:** Rekomendacja: jedno źródło danych (tablica `PROBLEMS` w `script.js`, analogicznie do `PRICE_DATA`), z którego generuje się **jednocześnie** stronę z artykułami i regułę bota (`BOT_RULES`/`BOT_PART_GROUPS`) — inaczej baza strony i baza bota rozjadą się z czasem przy ręcznej synchronizacji.

**Marketingowiec/UX:** Treść ma być diagnozą ("co to zwykle oznacza"), nie instrukcją majsterkowania — zgodnie z wcześniejszą zasadą zespołu (ryzyko: klient sam coś sobie uszkodzi, winą obarczy serwis).

**Behawiorysta/CRO:** Domyka lejek: objaw → artykuł → cennik dla wykrytego modelu (przez istniejący mechanizm `?model=`) → telefon/formularz.

**Werdykt zespołu:** ✅ warto budować, jako wspólne źródło danych dla strony i bota, nie dwa osobne byty.

---

## 7. Statystyki użycia bota i archiwizacja rozmów — ocena RODO

**Status: ✅ punkt 1 rekomendacji wdrożony (2026-08-21, branch `analityka/wiecej-zdarzen-umami` — zdarzenia ogólne strony; 2026-08-25 — zdarzenia specyficzne dla bota z rekomendacji Architekta poniżej: `bot_rule_matched`, `bot_part_asked`, `bot_model_missing`, `bot_problem_matched`, `bot_generation_ambiguous`, `bot_onboarding_step`, `bot_fallback`, wszystkie bez treści wiadomości). Punkty 2-3 (archiwizacja treści fallbacków) czekają na decyzję klienta.**

### Co zaimplementowano

Cel klienta: wiedzieć co oglądał, czy próbował wypełnić formularz, jakich cen szukał, jaki ma telefon — **bez zbierania treści rozmów** (zgodnie z rekomendacją zespołu poniżej).

Nowe zdarzenia w `script.js` (funkcja `trackUmamiEvent`, wywoływana tylko gdy `window.umami` jest dostępne):
- **`model_selected`** `{ model, source }` — jeden punkt instrumentacji w `selectModel()`, więc łapie wybór modelu niezależnie od ścieżki: `select` (rozwijane listy generacja/wariant), `popular` (popularne modele), `search` (wyszukiwarka), `bot` (bot ustalił model w rozmowie), `url_param` (link z `?model=`). To odpowiada na "jakich cen szukał" i "jaki ma telefon" jednocześnie.
- **`contact_form_started`** — pierwsza interakcja z formularzem kontaktowym (focus na dowolne pole), jednorazowo.
- **`contact_form_submitted`** — wysłanie formularza. Celowo **bez treści pól** (imię/telefon/opis usterki to dane osobowe) — liczy się tylko fakt.
- Wszystkie dotychczasowe `[data-track]` (kliknięcia `tel:`, WhatsApp, otwarcie czatu) — dotąd szły tylko do nieużywanego `window.dataLayer` (relikt po pierwotnym planie GTM/GA4, nigdy nie podłączonym po zmianie na Umami) — teraz idą też do Umami pod tą samą nazwą zdarzenia (np. `phone_hero`, `whatsapp_dock`, `chat_open`).

Odsłony stron (co klient oglądał, w tym `sprawdz-model-iphone.html` vs `index.html`) Umami zbiera automatycznie, bez dodatkowego kodu.

**Zaimplementowane później (2026-08-25):** zdarzenia specyficzne dla bota (`bot_rule_matched`, `bot_fallback` i pokrewne) proponowane przez Architekta niżej — wdrożone przy okazji poprawy czatbota, patrz `bot.md` sekcja "Śledzenie skuteczności bota".

### Do decyzji klienta (część nadal aktualna)

Cel: wiedzieć, co poprawiać w bocie, i rozważyć archiwizację rozmów do "uczenia" bota.

**Zastrzeżenie techniczne:** bot to reguły (Faza 1), nie model językowy — nie ma tu "trenowania" w sensie ML. "Uczenie bota" w praktyce oznacza ręczny przegląd nietrafionych pytań i dopisywanie nowych słów kluczowych do `BOT_RULES`/`BOT_PART_GROUPS`.

**Architekt:** Rekomendacja: śledzić **zdarzenia w Umami** (już zainstalowanym, self-hosted, bez cookies), nie treść rozmów: `bot_rule_matched` (jaki temat), `bot_fallback` (pytanie nietrafione — najcenniejszy sygnał), `bot_part_asked`, `bot_onboarding_step`. To mówi, co poprawiać, bez zbierania treści wiadomości.

**Strateg biznesowy / RODO — trzy poziomy ryzyka:**

| Co zbieramy | Ryzyko RODO | Rekomendacja |
|---|---|---|
| Zanonimizowane zdarzenia (temat/fallback, bez treści wiadomości) | Brak — nie są to dane osobowe | ✅ Wdrożyć od razu |
| Treść tylko nietrafionych pytań (fallback), bez ID sesji/IP | Niskie, ale realne (klient może wpisać nr telefonu/imię w wolnym tekście) | ⚠️ Możliwe pod warunkiem: krótka retencja (np. 30 dni), własny serwer, wpis w polityce prywatności |
| Pełne archiwum wszystkich rozmów | Wysokie — systematyczne przetwarzanie potencjalnych danych osobowych | ❌ Niepolecane bez wyraźnej potrzeby i podstawy prawnej |

**Krytyczny brak niezależnie od decyzji:** strona **nie ma dziś polityki prywatności** — warunek konieczny przed zbieraniem czegokolwiek więcej niż anonimowe zdarzenia Umami.

**Rekomendacja zespołu:**
1. Teraz: zdarzenia w Umami bez treści wiadomości — zero ryzyka.
2. Jeśli klient chce też widzieć treść nietrafionych pytań: logować tylko fallbacki, krótka retencja, własny serwer, **najpierw** dodać podstawową politykę prywatności.
3. Nie archiwizować pełnych rozmów — nieproporcjonalne ryzyko względem korzyści ponad punkt 2.

---

## Jak korzystać z tego pliku

Każdy nowy pomysł omawiany z zespołem trafia tu jako osobna sekcja: krótki opis, dyskusja poszczególnych ekspertów (w tym stratega biznesowego oceniającego zasadność), rekomendacja i status (✅ wdrożone / ⏸ odłożone / do przedyskutowania).
