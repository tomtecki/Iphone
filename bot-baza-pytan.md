# Baza pytań i architektura bota — asystent MojIphone

Dokument dla zespołu: jak zaprojektowany jest bot (Faza 1, regułowy) i jaka baza pytań/odpowiedzi go zasila. Stan po sesji projektowej z perspektywy eksperta od botów opartych o treść strony + testów w roli klienta.

## Zasada projektowa: slot-filling, nie dopasowanie zdań

Klient nie pisze pełnych zdań. Pisze "13 wymiana ekranu", "16e cena", "aparat ile". Bot musi rozpoznawać **niezależne elementy** (sloty) w wiadomości, a nie całe wyrażenie:

| Slot | Przykłady rozpoznawane | Co się dzieje, gdy brakuje |
|---|---|---|
| **Model** (dokładny wariant) | "iPhone 13 Pro", "13 pro", "16e", "air" | Bot pyta: "Jaki masz model?" |
| **Generacja bez wariantu** | "13", "12", "16" | Generacja ma >1 wariant cenowy → bot **dopytuje** który dokładnie, pokazując klikalne przyciski (Pro Max / Pro / Standardowy) |
| **Usterka/część** | "ekran", "bateria", "aparat", "ładowanie", "głośnik", "mikrofon", "obudowa", "przycisk", "czujnik", "antena/sim" | Bez usterki bot podaje ogólne podsumowanie (ekran + bateria) zamiast całego cennika |
| **Intencja cenowa** | "cena", "koszt", "ile kosztuje", "wycena" | Wzmacnia priorytet odpowiedzi cenowej nad ogólną regułą |

**Kontekst rozmowy:** raz podany model (`botContextModel`) zostaje zapamiętany do końca sesji czatu. Kolejne pytania o inne usterki ("a bateria?", "a ładowanie?") używają go automatycznie — bot nie pyta drugi raz o model, dopóki użytkownik nie poda nowego.

## Rozszerzenie: normalizacja i pełne przeskanowanie treści strony

Po pierwszym wdrożeniu okazało się, że baza była za wąska — trafiała tylko w dokładne sformułowania. Dwie zmiany:

1. **Normalizacja tekstu bez polskich znaków** (`normalizeBotText`) — klienci piszą "nie dziala", "laduje sie", "peknieta" bez diakrytyków. Bot teraz normalizuje zarówno wiadomość klienta, jak i słowa kluczowe w bazie przed porównaniem, więc "ładowanie" i "ladowanie" trafiają w tę samą regułę bez podwójnego wpisywania wariantów.
2. **Przeskanowano całą treść `index.html`** (karty usług, proces, FAQ, opinie, trust-strip) i dopisano brakujące tematy oraz **frazy opisujące objawy**, a nie tylko nazwy usług — bo klient pisze "pękł mi ekran" albo "nie ładuje się", a nie "wymiana wyświetlacza".

Nowe tematy dodane do `BOT_RULES`: przygotowanie do serwisu, pełny zakres usług, przebieg wizyty/proces, usterki po upadku, opinie klientów, formularz kontaktowy.

Nowe frazy objawowe dodane do `BOT_PART_GROUPS` (przykłady): "pękł/rozbity/czarny ekran", "szybko się rozładowuje/słabo trzyma" (bateria), "nie ładuje się/wolno się ładuje" (ładowanie), "rozmówcy nie słyszą/charczy" (głośnik), "mnie nie słyszą" (mikrofon), "brak zasięgu" (antena/SIM).

## Baza reguł (intencje bez modelu)

| Intencja | Przykładowe frazy klienta | Odpowiedź | Link/akcja |
|---|---|---|---|
| Czas naprawy | "ile trwa", "jak długo", "ile czasu trwa naprawa" | Najczęściej tego samego dnia, jeśli część dostępna | → FAQ |
| Obszar dojazdu | "dojeżdżacie", "do jakich miast", "obsługujecie" | Rybnik w cenie + 5 miast z dopłatą do potwierdzenia | → sekcja lokalizacji |
| Godziny pracy | "godziny", "kiedy otwarte", "czynne" | Pon–pt 9–18, sob 10–14 | → tel. |
| Naprawa "u mnie" | "w domu", "gdzie odbywa się naprawa" | Naprawa w samochodzie serwisowym, nie trzeba wpuszczać nikogo | → FAQ |
| Zalanie | "zalanie", "wpadł do wody" | Nie ładować, diagnostyka jak najszybciej | → usługi |
| Nieznany model | "nie znam modelu", "nie wiem jaki mam" | Sprawdzimy na miejscu / poradnik | → `sprawdz-model-iphone.html` |
| Dane/kopia zapasowa | "kasujecie dane", "kopia zapasowa" | Standardowe naprawy nie kasują danych | → FAQ |
| Faktura | "faktura", "rachunek" | Tak, dokument sprzedaży | → FAQ |
| Gwarancja | "gwarancja" | Obowiązuje, warunki przy wycenie | → tel. |
| Kontakt ogólny | "telefon", "kontakt", "numer" | Numer + link `tel:` | → tel. |

## Baza modeli i usterek (dynamiczna, z `PRICE_DATA`)

Nie jest to statyczna lista pytań — bot generuje odpowiedź na żywo z tych samych danych, które napędzają widoczny cennik na stronie (`script.js`, `PRICE_DATA`). Dzięki temu **odpowiedzi bota i cennik nigdy się nie rozjadą** (jedno źródło prawdy).

Rozpoznawanie modelu, trzy poziomy precyzji:
1. Pełna nazwa: "iPhone 13 Pro Max" (dokładne dopasowanie),
2. Nazwa skrócona bez "iPhone": "13 pro max", "16e", "air" (dokładne dopasowanie po numerze/wariancie),
3. Sama generacja: "13", "16" — **wieloznaczna**, bot pyta o wariant z przyciskami do wyboru zamiast zgadywać.

Rozpoznawanie usterki (przykłady synonimów w kodzie, `BOT_PART_GROUPS`):
- aparat/kamera → aparat główny + przedni
- ekran/wyświetlacz/szybka/matryca → wymiana wyświetlacza
- bateria/akumulator → wymiana baterii
- ładowanie/gniazdo/wtyczka → gniazdo ładowania
- głośnik → głośnik górny + dolny
- mikrofon, obudowa/korpus/szkło tylne, przycisk/guzik/home, czujnik, antena/sim

## Przykładowy dialog (test w roli klienta)

```
Klient: 13 wymiana ekranu
Bot: iPhone 13 ma kilka wariantów z różną ceną. Który dokładnie masz?
     [Pro Max] [Pro] [Standardowy / mini]
Klient: (klika "Pro")
Bot: Dla iPhone 13 Pro: Wymiana wyświetlacza — zamiennik 850 zł OLED,
     oryginał 1400 zł, czas 30-60 min.
     [Pokaż w cenniku]

Klient: a bateria?
Bot: Dla iPhone 13 Pro: Wymiana baterii — zamiennik 220 zł, oryginał 450 zł,
     czas 30-60 min.
     [Pokaż w cenniku]
```

Model pozostaje zapamiętany — drugie pytanie nie wymaga powtórzenia "iPhone 13 Pro".

## Dlaczego regułowo, nie przez LLM (przypomnienie decyzji stratega)

Ten sam efekt (elastyczne rozpoznawanie skrótów, dopytywanie, pamięć kontekstu) da się osiągnąć bez modelu językowego — powyższy slot-filling jest w pełni deterministyczny: żadnego ryzyka wymyślonej ceny, zero kosztów API, natychmiastowa odpowiedź. LLM miałby sens dopiero, gdyby klienci zadawali pytania wykraczające poza schemat (model + usterka + kilka stałych intencji) na tyle często, żeby uzasadnić koszt i ryzyko — zgodnie z wcześniejszą rekomendacją stratega w `pomysły.md`, decyzję tę warto podjąć na podstawie realnych rozmów po wdrożeniu Fazy 1, nie z góry.

## Status wdrożenia

✅ Zaimplementowane w `script.js` na branchu `bot/faza1-qa-regulowy` (nie wypchnięte na GitHub na życzenie klienta — czeka na potwierdzenie).
Zweryfikowane lokalnie (symulacja logiki poza przeglądarką) dla scenariuszy: "13 wymiana ekranu" → dopytanie o wariant, "15 pro cena baterii" → bezpośrednia odpowiedź, "a bateria?" po ustaleniu modelu → użycie pamięci kontekstu.
