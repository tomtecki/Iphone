# Jak działa asystent-bot na stronie MojIphone

Dokumentacja techniczna aktualnego stanu bota (Faza 1). Dla kontekstu decyzji "dlaczego regułowo, nie LLM" zobacz `pomysły.md`, sekcja 1. Dla bazy pytań i przykładowych dialogów zobacz `bot-baza-pytan.md` — ten plik skupia się na tym, **jak to jest zbudowane w kodzie**.

## W jednym zdaniu

Bot to zwykły JavaScript w przeglądarce klienta (`script.js`) — bez AI, bez LLM, bez API, bez serwera i bez żadnej zewnętrznej bazy danych. Cała "wiedza" bota to stałe tablice w tym samym pliku, który renderuje widoczny cennik na stronie.

## Gdzie w kodzie

Wszystko mieszka w [script.js](script.js), w sekcji zaczynającej się komentarzem `// Faza 1 asystenta...`. Widoczny w HTML jako `<div class="chat-widget" data-chat-widget>` na `index.html`, w prawym dolnym rogu.

## Dane, na których działa bot

| Struktura | Rola |
|---|---|
| `PRICE_DATA` | Ta sama tablica, co napędza cennik — model, generacja, wariant, ceny per usterka. Bot generuje odpowiedzi cenowe **na żywo z tych danych**, nigdy z osobnego, ręcznie pisanego tekstu — dlatego cena podana przez bota i cena w cenniku nigdy się nie rozjadą. |
| `GENERATIONS` | Lista unikalnych generacji (iPhone 17, 16, 15... 4s), wyliczona automatycznie z `PRICE_DATA`. Używana w ścieżce startowej i przy dopytywaniu o wariant. |
| `BOT_RULES` | ~15 tematów ogólnych (dojazd, godziny, gwarancja, proces, zalanie, upadek, opinie, faktura, formularz itd.) — każdy ma listę słów kluczowych, gotową odpowiedź i link do właściwej sekcji strony. |
| `BOT_PART_GROUPS` | Mapa usterek na klucze cenowe z `PRICE_DATA` (np. `aparat` → `rearCamera`+`frontCamera`). Zawiera zarówno nazwy usług, jak i opisy objawów, jak faktycznie pisze klient ("pękł ekran", "nie ładuje się", "mnie nie słyszą"). |
| `BOT_SYMPTOM_CHIPS` | Pięć gotowych przycisków objawów pokazywanych w ścieżce startowej. |

## Jak bot rozumie wiadomość klienta

### 1. Normalizacja tekstu

`normalizeBotText()` usuwa polskie znaki diakrytyczne z wiadomości klienta **i** ze słów kluczowych przed porównaniem. Dzięki temu `"nie działa"` i `"nie dziala"` trafiają w tę samą regułę — nie trzeba ręcznie dublować wpisów w bazie.

### 2. Rozpoznanie modelu — trzy poziomy precyzji (`resolveBotModel`)

1. **Pełna nazwa**: `"iPhone 13 Pro"` — dopasowanie dokładne (`findBotModelMatch`).
2. **Skrót bez słowa "iPhone"**: `"13 pro max"`, `"16e"`, `"air"` — dopasowanie po samej nazwie wariantu (`findBotBareModelMatch`), przez wyrażenie regularne z granicami słów, żeby "5" nie złapało się wewnątrz "15".
3. **Sama generacja**: `"13"` — jeśli generacja ma tylko jeden wariant (np. iPhone Air), bot używa go od razu. Jeśli ma kilka (np. iPhone 13 = Pro Max / Pro / standardowy+mini), bot **nie zgaduje** — zwraca `ambiguousGeneration` i pyta klienta, pokazując klikalne przyciski wariantów.

### 3. Rozpoznanie usterki (`findBotPartMatch`)

Szuka w wiadomości słów pasujących do `BOT_PART_GROUPS`. Jeśli trafi, odpowiedź dotyczy **konkretnie tej części** (np. tylko aparatu), a nie ogólnego podsumowania.

### 4. Reguły ogólne (`findBotRuleMatch`)

Jeśli wiadomość nie dotyczy ani modelu, ani konkretnej usterki, bot sprawdza `BOT_RULES` — dojazd, godziny, gwarancja itd.

### 5. Pamięć kontekstu (`botContextModel`)

Zwykła zmienna w pamięci przeglądarki. Gdy klient poda model, zostaje on zapamiętany na czas trwania rozmowy — kolejne pytania o inne usterki ("a bateria?") używają go automatycznie, bez ponownego pytania o model. Znika przy odświeżeniu strony (nic nie jest zapisywane na serwerze).

## `getBotAnswer()` — logika decyzyjna

```
resolveBotModel(wiadomość)
  ├─ ambiguousGeneration? → pytanie o wariant + przyciski (patrz niżej)
  ├─ konkretny model znaleziony → zapamiętaj jako kontekst
  └─ nic nie znaleziono → użyj zapamiętanego kontekstu (jeśli jest)

jeśli rozpoznano usterkę (BOT_PART_GROUPS):
  ├─ jest model (nowy lub z kontekstu) → cena dla tej usterki + przycisk "Pokaż w cenniku"
  └─ brak modelu → "Jaki masz model iPhone?"

jeśli rozpoznano tylko model (bez usterki) → ogólne podsumowanie (ekran + bateria)

jeśli wiadomość zawiera słowo o cenie ("cena", "koszt"...) → cena dla modelu z kontekstu, albo prośba o podanie modelu

jeśli pasuje reguła ogólna (BOT_RULES) → gotowa odpowiedź + link

nic nie pasuje → "Zadzwoń: 570 222 345" + link do formularza
```

## Ścieżka startowa (onboarding)

Zamiast czekać, aż klient sam coś napisze, bot od razu proponuje prowadzoną ścieżkę:

1. **Krok 1** — przyciski wszystkich generacji (`startBotOnboarding` → `GENERATIONS`).
2. **Krok 2** — jeśli generacja ma więcej niż jeden wariant, przyciski wariantów (`handleBotGenerationPick` → `handleBotVariantPick`).
3. **Krok 3** — pytanie "co się stało?" z pięcioma gotowymi objawami (`BOT_SYMPTOM_CHIPS`) + opcja "coś innego — napiszę" (`promptForBotSymptom`).

Kliknięcie chipa objawu działa dokładnie tak samo, jak wpisanie go w polu tekstowym — trafia w tę samą logikę `getBotAnswer()`.

## Auto-otwarcie

Widżet otwiera się samoczynnie **3 sekundy** po wejściu na stronę — ale tylko jeśli klient wcześniej sam nie kliknął ikony czatu (otwierając lub zamykając go ręcznie). Flaga `chatUserInteracted` pilnuje, żeby nie nadpisywać decyzji klienta. Auto-otwarcie nie focusuje pola tekstowego (żeby nie wywołać klawiatury ekranowej na telefonie bez wyraźnej interakcji).

## Interfejs (bąbelki rozmowy)

`addChatMessage(text, from, extra)` renderuje wiadomość jako bąbelek (`bot`/`user`), opcjonalnie z:
- **linkiem** (`extra.link`) — np. do sekcji FAQ, poradnika o modelu, `tel:`,
- **przyciskiem akcji** (`extra.action`) — "Pokaż w cenniku", który realnie przełącza panel cennika na dany model (`selectModel()`) i przewija do niego,
- **wieloma opcjami** (`extra.options`) — np. przyciski wariantów przy niejednoznacznej generacji, albo chipy objawów.

## Czego bot **nie robi** (celowo)

- Nie zgaduje ceny, gdy nie zna dokładnego wariantu modelu — zawsze dopyta.
- Nie daje instrukcji samodzielnej naprawy (DIY) — tylko diagnozę i zachętę do kontaktu (decyzja zespołu, żeby nie zachęcać klienta do majsterkowania na własną rękę).
- Nie zbiera ani nie zapisuje żadnych danych — to Faza 1, czysto informacyjna. Zbieranie leadów (imię/telefon/model/usterka) i wysyłka do systemu obsługującego naprawy to zaplanowana, niezaimplementowana Faza 2 (`pomysły.md`, sekcja 1).
- Nie wysyła treści rozmów do analityki (Umami) — żadne zdarzenie śledzące nie zawiera tego, co klient napisał (patrz `analityka.md`).

## Jak rozszerzyć bazę wiedzy bota

Nie ma panelu administracyjnego — rozszerzenie oznacza edycję tablic w `script.js` i wdrożenie nowej wersji strony:

- **Nowy temat ogólny** → dopisz obiekt do `BOT_RULES` (słowa kluczowe + gotowa odpowiedź + link).
- **Nowa usterka/objaw** → dopisz do `BOT_PART_GROUPS`, wskazując klucze z `PRICE_DATA`/`SERVICES`.
- **Nowy model** → dopisz do `PRICE_DATA` (patrz `progress.md` — modele bez cen pokazują "Na zapytanie").

Warto pamiętać, że `normalizeBotText()` sam obsłuży warianty z i bez polskich znaków — nie trzeba dublować wpisów.
