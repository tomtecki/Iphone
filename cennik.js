// =====================================================================
// CENNIK NAPRAW (stan: cennik 2026)
// To jedyne miejsce, w którym zmienia się ceny na stronie. Tabela w sekcji
// "Cennik" i odpowiedzi czatu czytają dane wyłącznie stąd.
//
// Jak zmienić cenę:
//   1. Znajdź model (np. "iPhone 13 Pro") i nazwę naprawy (np. bateriaZamiennik).
//   2. Zmień liczbę - cena w zł, bez "zł" i bez spacji: 270
//   3. Gwiazdki tak jak w arkuszu Excel ustawiają czas naprawy:
//        "450*"  -> 2-3 dni robocze
//        "300**" -> 1 dzień roboczy
//        450     -> CZAS_STANDARD (poniżej)
//      Wartość z gwiazdką musi być w cudzysłowie, liczba bez - nie.
//   4. null = usługa niedostępna dla modelu (wiersz nie pokaże się w tabeli).
// Po każdej zmianie zostaw przecinki na końcach linii tak jak są.
// =====================================================================

const CZAS_STANDARD = "od ręki";
const CZAS_GWIAZDKA = { "*": "2-3 dni robocze", "**": "1 dzień roboczy" };

// Kolejność wierszy w tabeli cennika. "grupa" służy czatowi do dopasowania
// pytania klienta (np. "pękł ekran") do właściwych napraw.
const USLUGI = [
  { klucz: "wyswietlaczZamiennik", naprawa: "Wymiana wyświetlacza", czesc: "zamiennik", grupa: "screen" },
  { klucz: "wyswietlaczOled", naprawa: "Wymiana wyświetlacza", czesc: "OLED", grupa: "screen" },
  { klucz: "wyswietlaczOryginalny", naprawa: "Wymiana wyświetlacza", czesc: "oryginalny", grupa: "screen" },
  { klucz: "szybaWyswietlacza", naprawa: "Wymiana szyby wyświetlacza", czesc: "", grupa: "screen" },
  { klucz: "bateriaZamiennik", naprawa: "Wymiana baterii", czesc: "zamiennik", grupa: "battery" },
  { klucz: "bateriaProgramowalna", naprawa: "Wymiana baterii", czesc: "programowalna", grupa: "battery" },
  { klucz: "bateriaOryginalna", naprawa: "Wymiana baterii", czesc: "oryginalna Apple", grupa: "battery" },
  { klucz: "szybaTylna", naprawa: "Wymiana szyby tylnej", czesc: "", grupa: "backGlass" },
  { klucz: "szkloAparatu", naprawa: "Wymiana szkła aparatu", czesc: "", grupa: "camera" },
  { klucz: "kameraTylna", naprawa: "Aparat tylny", czesc: "", grupa: "camera" },
  { klucz: "kameraPrzednia", naprawa: "Aparat przedni", czesc: "", grupa: "camera" },
  { klucz: "gniazdoLadowania", naprawa: "Gniazdo ładowania / mikrofon", czesc: "", grupa: "charging" },
  { klucz: "glosnikGorny", naprawa: "Głośnik górny", czesc: "", grupa: "speaker" },
  { klucz: "glosnikDolny", naprawa: "Głośnik dolny", czesc: "", grupa: "speaker" },
  { klucz: "regeneracjaGlosnikow", naprawa: "Regeneracja głośników", czesc: "", grupa: "speaker" }
];

const CENNIK = [
  {
    model: "iPhone 17 Pro Max", generation: "iPhone 17", variantLabel: "Pro Max",
    bateriaZamiennik: 270, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 700, wyswietlaczOled: 890, wyswietlaczOryginalny: 2100, szybaWyswietlacza: "1000*",
    szybaTylna: 550, szkloAparatu: 250, gniazdoLadowania: 500, kameraTylna: 650,
    kameraPrzednia: 350, glosnikGorny: 250, regeneracjaGlosnikow: 300, glosnikDolny: 350
  },
  {
    model: "iPhone 17 Pro", generation: "iPhone 17", variantLabel: "Pro",
    bateriaZamiennik: 270, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 700, wyswietlaczOled: 890, wyswietlaczOryginalny: 2100, szybaWyswietlacza: "950*",
    szybaTylna: 550, szkloAparatu: 250, gniazdoLadowania: 500, kameraTylna: 650,
    kameraPrzednia: 350, glosnikGorny: 250, regeneracjaGlosnikow: 300, glosnikDolny: 350
  },
  {
    model: "iPhone Air", generation: "iPhone Air", variantLabel: "Standardowy",
    bateriaZamiennik: 270, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 700, wyswietlaczOled: 950, wyswietlaczOryginalny: 2100, szybaWyswietlacza: "950*",
    szybaTylna: 550, szkloAparatu: 250, gniazdoLadowania: 500, kameraTylna: 550,
    kameraPrzednia: 350, glosnikGorny: 250, regeneracjaGlosnikow: 300, glosnikDolny: 350
  },
  {
    model: "iPhone 17", generation: "iPhone 17", variantLabel: "Standardowy",
    bateriaZamiennik: 270, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 590, wyswietlaczOled: 750, wyswietlaczOryginalny: 1450, szybaWyswietlacza: "850*",
    szybaTylna: 550, szkloAparatu: 250, gniazdoLadowania: 500, kameraTylna: 550,
    kameraPrzednia: 350, glosnikGorny: 250, regeneracjaGlosnikow: 300, glosnikDolny: 350
  },
  {
    model: "iPhone 17e", generation: "iPhone 17", variantLabel: "e",
    bateriaZamiennik: 270, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 590, wyswietlaczOled: 690, wyswietlaczOryginalny: 1450, szybaWyswietlacza: "690*",
    szybaTylna: 550, szkloAparatu: 250, gniazdoLadowania: 500, kameraTylna: 550,
    kameraPrzednia: 350, glosnikGorny: 250, regeneracjaGlosnikow: 300, glosnikDolny: 300
  },
  {
    model: "iPhone 16 Pro Max", generation: "iPhone 16", variantLabel: "Pro Max",
    bateriaZamiennik: 250, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 590, wyswietlaczOled: 690, wyswietlaczOryginalny: 1690, szybaWyswietlacza: "590*",
    szybaTylna: 490, szkloAparatu: 200, gniazdoLadowania: 400, kameraTylna: 550,
    kameraPrzednia: 290, glosnikGorny: 200, regeneracjaGlosnikow: 250, glosnikDolny: 290
  },
  {
    model: "iPhone 16 Pro", generation: "iPhone 16", variantLabel: "Pro",
    bateriaZamiennik: 250, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 590, wyswietlaczOled: 690, wyswietlaczOryginalny: 1490, szybaWyswietlacza: "590*",
    szybaTylna: 490, szkloAparatu: 200, gniazdoLadowania: 400, kameraTylna: 550,
    kameraPrzednia: 290, glosnikGorny: 200, regeneracjaGlosnikow: 250, glosnikDolny: 290
  },
  {
    model: "iPhone 16 Plus", generation: "iPhone 16", variantLabel: "Plus",
    bateriaZamiennik: 250, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 590, wyswietlaczOled: 690, wyswietlaczOryginalny: 990, szybaWyswietlacza: "590*",
    szybaTylna: 490, szkloAparatu: 200, gniazdoLadowania: 400, kameraTylna: 490,
    kameraPrzednia: 290, glosnikGorny: 200, regeneracjaGlosnikow: 250, glosnikDolny: 290
  },
  {
    model: "iPhone 16", generation: "iPhone 16", variantLabel: "Standardowy",
    bateriaZamiennik: 250, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 590, wyswietlaczOled: 690, wyswietlaczOryginalny: 1050, szybaWyswietlacza: "590*",
    szybaTylna: 490, szkloAparatu: 200, gniazdoLadowania: 400, kameraTylna: 490,
    kameraPrzednia: 290, glosnikGorny: 200, regeneracjaGlosnikow: 250, glosnikDolny: 290
  },
  {
    model: "iPhone 16e", generation: "iPhone 16", variantLabel: "e",
    bateriaZamiennik: 250, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 590, wyswietlaczOled: 690, wyswietlaczOryginalny: 950, szybaWyswietlacza: "690*",
    szybaTylna: 490, szkloAparatu: 200, gniazdoLadowania: 400, kameraTylna: 490,
    kameraPrzednia: 290, glosnikGorny: 200, regeneracjaGlosnikow: 250, glosnikDolny: 290
  },
  {
    model: "iPhone 15 Pro Max", generation: "iPhone 15", variantLabel: "Pro Max",
    bateriaZamiennik: 250, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 550, wyswietlaczOled: 690, wyswietlaczOryginalny: 1450, szybaWyswietlacza: "550*",
    szybaTylna: 450, szkloAparatu: 200, gniazdoLadowania: 350, kameraTylna: 490,
    kameraPrzednia: 250, glosnikGorny: 190, regeneracjaGlosnikow: 200, glosnikDolny: 250
  },
  {
    model: "iPhone 15 Pro", generation: "iPhone 15", variantLabel: "Pro",
    bateriaZamiennik: 250, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 550, wyswietlaczOled: 690, wyswietlaczOryginalny: 1250, szybaWyswietlacza: "550*",
    szybaTylna: 450, szkloAparatu: 200, gniazdoLadowania: 350, kameraTylna: 490,
    kameraPrzednia: 250, glosnikGorny: 190, regeneracjaGlosnikow: 200, glosnikDolny: 250
  },
  {
    model: "iPhone 15 Plus", generation: "iPhone 15", variantLabel: "Plus",
    bateriaZamiennik: 250, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 550, wyswietlaczOled: 690, wyswietlaczOryginalny: 950, szybaWyswietlacza: "550*",
    szybaTylna: 450, szkloAparatu: 200, gniazdoLadowania: 350, kameraTylna: 450,
    kameraPrzednia: 250, glosnikGorny: 190, regeneracjaGlosnikow: 200, glosnikDolny: 250
  },
  {
    model: "iPhone 15", generation: "iPhone 15", variantLabel: "Standardowy",
    bateriaZamiennik: 250, bateriaProgramowalna: 400, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 550, wyswietlaczOled: 690, wyswietlaczOryginalny: 950, szybaWyswietlacza: "550*",
    szybaTylna: 450, szkloAparatu: 200, gniazdoLadowania: 350, kameraTylna: 450,
    kameraPrzednia: 250, glosnikGorny: 190, regeneracjaGlosnikow: 200, glosnikDolny: 250
  },
  {
    model: "iPhone 14 Pro Max", generation: "iPhone 14", variantLabel: "Pro Max",
    bateriaZamiennik: 230, bateriaProgramowalna: 390, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 490, wyswietlaczOled: 650, wyswietlaczOryginalny: 1400, szybaWyswietlacza: "490*",
    szybaTylna: "350**", szkloAparatu: 150, gniazdoLadowania: 300, kameraTylna: 450,
    kameraPrzednia: 200, glosnikGorny: 170, regeneracjaGlosnikow: 150, glosnikDolny: 190
  },
  {
    model: "iPhone 14 Pro", generation: "iPhone 14", variantLabel: "Pro",
    bateriaZamiennik: 230, bateriaProgramowalna: 390, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 490, wyswietlaczOled: 650, wyswietlaczOryginalny: 950, szybaWyswietlacza: "490*",
    szybaTylna: "350**", szkloAparatu: 150, gniazdoLadowania: 300, kameraTylna: 450,
    kameraPrzednia: 200, glosnikGorny: 170, regeneracjaGlosnikow: 150, glosnikDolny: 190
  },
  {
    model: "iPhone 14 Plus", generation: "iPhone 14", variantLabel: "Plus",
    bateriaZamiennik: 230, bateriaProgramowalna: 390, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 490, wyswietlaczOled: 650, wyswietlaczOryginalny: 950, szybaWyswietlacza: "490*",
    szybaTylna: 350, szkloAparatu: 150, gniazdoLadowania: 300, kameraTylna: 400,
    kameraPrzednia: 200, glosnikGorny: 170, regeneracjaGlosnikow: 150, glosnikDolny: 190
  },
  {
    model: "iPhone 14", generation: "iPhone 14", variantLabel: "Standardowy",
    bateriaZamiennik: 230, bateriaProgramowalna: 390, bateriaOryginalna: 500,
    wyswietlaczZamiennik: 490, wyswietlaczOled: 650, wyswietlaczOryginalny: 750, szybaWyswietlacza: "490*",
    szybaTylna: 350, szkloAparatu: 150, gniazdoLadowania: 300, kameraTylna: 400,
    kameraPrzednia: 200, glosnikGorny: 170, regeneracjaGlosnikow: 150, glosnikDolny: 190
  },
  {
    model: "iPhone 13 Pro Max", generation: "iPhone 13", variantLabel: "Pro Max",
    bateriaZamiennik: 220, bateriaProgramowalna: 350, bateriaOryginalna: 450,
    wyswietlaczZamiennik: 450, wyswietlaczOled: 550, wyswietlaczOryginalny: 1150, szybaWyswietlacza: "450*",
    szybaTylna: "300**", szkloAparatu: 150, gniazdoLadowania: 250, kameraTylna: 450,
    kameraPrzednia: 190, glosnikGorny: 150, regeneracjaGlosnikow: 150, glosnikDolny: 170
  },
  {
    model: "iPhone 13 Pro", generation: "iPhone 13", variantLabel: "Pro",
    bateriaZamiennik: 220, bateriaProgramowalna: 350, bateriaOryginalna: 450,
    wyswietlaczZamiennik: 450, wyswietlaczOled: 550, wyswietlaczOryginalny: 950, szybaWyswietlacza: "450*",
    szybaTylna: "300**", szkloAparatu: 150, gniazdoLadowania: 250, kameraTylna: 450,
    kameraPrzednia: 190, glosnikGorny: 150, regeneracjaGlosnikow: 150, glosnikDolny: 170
  },
  {
    model: "iPhone 13", generation: "iPhone 13", variantLabel: "Standardowy",
    bateriaZamiennik: 220, bateriaProgramowalna: 350, bateriaOryginalna: 450,
    wyswietlaczZamiennik: 450, wyswietlaczOled: 550, wyswietlaczOryginalny: 750, szybaWyswietlacza: "450*",
    szybaTylna: "300**", szkloAparatu: 150, gniazdoLadowania: 250, kameraTylna: 350,
    kameraPrzednia: 190, glosnikGorny: 150, regeneracjaGlosnikow: 150, glosnikDolny: 170
  },
  {
    model: "iPhone 13 mini", generation: "iPhone 13", variantLabel: "mini",
    bateriaZamiennik: 220, bateriaProgramowalna: 350, bateriaOryginalna: 450,
    wyswietlaczZamiennik: 450, wyswietlaczOled: 550, wyswietlaczOryginalny: 750, szybaWyswietlacza: "450*",
    szybaTylna: "300**", szkloAparatu: 150, gniazdoLadowania: 250, kameraTylna: 350,
    kameraPrzednia: 190, glosnikGorny: 150, regeneracjaGlosnikow: 150, glosnikDolny: 170
  },
  {
    model: "iPhone 12 Pro Max", generation: "iPhone 12", variantLabel: "Pro Max",
    bateriaZamiennik: 200, bateriaProgramowalna: 350, bateriaOryginalna: 450,
    wyswietlaczZamiennik: 350, wyswietlaczOled: 450, wyswietlaczOryginalny: 590, szybaWyswietlacza: "350*",
    szybaTylna: "250**", szkloAparatu: 100, gniazdoLadowania: 200, kameraTylna: 350,
    kameraPrzednia: 150, glosnikGorny: 120, regeneracjaGlosnikow: 100, glosnikDolny: 150
  },
  {
    model: "iPhone 12 Pro", generation: "iPhone 12", variantLabel: "Pro",
    bateriaZamiennik: 200, bateriaProgramowalna: 350, bateriaOryginalna: 450,
    wyswietlaczZamiennik: 350, wyswietlaczOled: 450, wyswietlaczOryginalny: 590, szybaWyswietlacza: "350*",
    szybaTylna: "250**", szkloAparatu: 100, gniazdoLadowania: 200, kameraTylna: 350,
    kameraPrzednia: 150, glosnikGorny: 120, regeneracjaGlosnikow: 100, glosnikDolny: 150
  },
  {
    model: "iPhone 12", generation: "iPhone 12", variantLabel: "Standardowy",
    bateriaZamiennik: 200, bateriaProgramowalna: 350, bateriaOryginalna: 450,
    wyswietlaczZamiennik: 350, wyswietlaczOled: 450, wyswietlaczOryginalny: 590, szybaWyswietlacza: "350*",
    szybaTylna: "250**", szkloAparatu: 100, gniazdoLadowania: 200, kameraTylna: 290,
    kameraPrzednia: 150, glosnikGorny: 120, regeneracjaGlosnikow: 100, glosnikDolny: 150
  },
  {
    model: "iPhone 12 mini", generation: "iPhone 12", variantLabel: "mini",
    bateriaZamiennik: 200, bateriaProgramowalna: 350, bateriaOryginalna: 450,
    wyswietlaczZamiennik: 350, wyswietlaczOled: 450, wyswietlaczOryginalny: 590, szybaWyswietlacza: "350*",
    szybaTylna: "250**", szkloAparatu: 100, gniazdoLadowania: 200, kameraTylna: 290,
    kameraPrzednia: 150, glosnikGorny: 120, regeneracjaGlosnikow: 100, glosnikDolny: 150
  },
  {
    model: "iPhone 11 Pro Max", generation: "iPhone 11", variantLabel: "Pro Max",
    bateriaZamiennik: 150, bateriaProgramowalna: "350*", bateriaOryginalna: null,
    wyswietlaczZamiennik: 290, wyswietlaczOled: 390, wyswietlaczOryginalny: "550*", szybaWyswietlacza: "290*",
    szybaTylna: "200**", szkloAparatu: 100, gniazdoLadowania: 150, kameraTylna: 250,
    kameraPrzednia: 150, glosnikGorny: 100, regeneracjaGlosnikow: 100, glosnikDolny: 100
  },
  {
    model: "iPhone 11 Pro", generation: "iPhone 11", variantLabel: "Pro",
    bateriaZamiennik: 150, bateriaProgramowalna: "350*", bateriaOryginalna: null,
    wyswietlaczZamiennik: 290, wyswietlaczOled: 390, wyswietlaczOryginalny: "550*", szybaWyswietlacza: "290*",
    szybaTylna: "200**", szkloAparatu: 100, gniazdoLadowania: 150, kameraTylna: 250,
    kameraPrzednia: 150, glosnikGorny: 100, regeneracjaGlosnikow: 100, glosnikDolny: 100
  },
  {
    model: "iPhone 11", generation: "iPhone 11", variantLabel: "Standardowy",
    bateriaZamiennik: 150, bateriaProgramowalna: "350*", bateriaOryginalna: null,
    wyswietlaczZamiennik: 290, wyswietlaczOled: null, wyswietlaczOryginalny: "500*", szybaWyswietlacza: "290*",
    szybaTylna: "200**", szkloAparatu: 100, gniazdoLadowania: 150, kameraTylna: 250,
    kameraPrzednia: 150, glosnikGorny: 100, regeneracjaGlosnikow: 100, glosnikDolny: 100
  },
  {
    model: "iPhone XS Max", generation: "iPhone X / XS / XR", variantLabel: "XS Max",
    bateriaZamiennik: 140, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 250, wyswietlaczOled: 390, wyswietlaczOryginalny: "490*", szybaWyswietlacza: "250*",
    szybaTylna: "170**", szkloAparatu: 80, gniazdoLadowania: 100, kameraTylna: 150,
    kameraPrzednia: 100, glosnikGorny: 100, regeneracjaGlosnikow: 100, glosnikDolny: 100
  },
  {
    model: "iPhone XS", generation: "iPhone X / XS / XR", variantLabel: "XS",
    bateriaZamiennik: 140, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 250, wyswietlaczOled: 390, wyswietlaczOryginalny: "490*", szybaWyswietlacza: "250*",
    szybaTylna: "170**", szkloAparatu: 80, gniazdoLadowania: 100, kameraTylna: 150,
    kameraPrzednia: 100, glosnikGorny: 100, regeneracjaGlosnikow: 100, glosnikDolny: 100
  },
  {
    model: "iPhone X", generation: "iPhone X / XS / XR", variantLabel: "X",
    bateriaZamiennik: 140, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 250, wyswietlaczOled: 390, wyswietlaczOryginalny: "490*", szybaWyswietlacza: "250*",
    szybaTylna: "170**", szkloAparatu: 80, gniazdoLadowania: 100, kameraTylna: 150,
    kameraPrzednia: 100, glosnikGorny: 100, regeneracjaGlosnikow: 100, glosnikDolny: 100
  },
  {
    model: "iPhone XR", generation: "iPhone X / XS / XR", variantLabel: "XR",
    bateriaZamiennik: 140, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 250, wyswietlaczOled: 390, wyswietlaczOryginalny: "490*", szybaWyswietlacza: "250*",
    szybaTylna: "170**", szkloAparatu: 80, gniazdoLadowania: 100, kameraTylna: 150,
    kameraPrzednia: 100, glosnikGorny: 100, regeneracjaGlosnikow: 100, glosnikDolny: 100
  },
  {
    model: "iPhone SE 3", generation: "iPhone SE", variantLabel: "SE 3",
    bateriaZamiennik: 150, bateriaProgramowalna: "300*", bateriaOryginalna: 450,
    wyswietlaczZamiennik: 200, wyswietlaczOled: null, wyswietlaczOryginalny: 250, szybaWyswietlacza: 200,
    szybaTylna: "200**", szkloAparatu: 100, gniazdoLadowania: 200, kameraTylna: 250,
    kameraPrzednia: 150, glosnikGorny: 150, regeneracjaGlosnikow: 100, glosnikDolny: 100
  },
  {
    model: "iPhone SE 2020 / SE 2022", generation: "iPhone SE", variantLabel: "SE 2020 / SE 2022",
    bateriaZamiennik: 120, bateriaProgramowalna: "300*", bateriaOryginalna: null,
    wyswietlaczZamiennik: 150, wyswietlaczOled: null, wyswietlaczOryginalny: 200, szybaWyswietlacza: "150*",
    szybaTylna: "150**", szkloAparatu: 80, gniazdoLadowania: 80, kameraTylna: 80,
    kameraPrzednia: 100, glosnikGorny: 80, regeneracjaGlosnikow: 80, glosnikDolny: 80
  },
  {
    model: "iPhone 8 Plus", generation: "iPhone 8", variantLabel: "Plus",
    bateriaZamiennik: 120, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 150, wyswietlaczOled: null, wyswietlaczOryginalny: 200, szybaWyswietlacza: "150*",
    szybaTylna: "150**", szkloAparatu: 80, gniazdoLadowania: 80, kameraTylna: 80,
    kameraPrzednia: 100, glosnikGorny: 80, regeneracjaGlosnikow: 80, glosnikDolny: 80
  },
  {
    model: "iPhone 8", generation: "iPhone 8", variantLabel: "Standardowy",
    bateriaZamiennik: 120, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 150, wyswietlaczOled: null, wyswietlaczOryginalny: 200, szybaWyswietlacza: "150*",
    szybaTylna: "150**", szkloAparatu: 80, gniazdoLadowania: 80, kameraTylna: 80,
    kameraPrzednia: 100, glosnikGorny: 80, regeneracjaGlosnikow: 80, glosnikDolny: 80
  },
  {
    model: "iPhone 7 Plus", generation: "iPhone 7", variantLabel: "Plus",
    bateriaZamiennik: 100, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 120, wyswietlaczOled: null, wyswietlaczOryginalny: 180, szybaWyswietlacza: "150*",
    szybaTylna: null, szkloAparatu: 80, gniazdoLadowania: 80, kameraTylna: 80,
    kameraPrzednia: 80, glosnikGorny: 80, regeneracjaGlosnikow: 80, glosnikDolny: 80
  },
  {
    model: "iPhone 7", generation: "iPhone 7", variantLabel: "Standardowy",
    bateriaZamiennik: 100, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 120, wyswietlaczOled: null, wyswietlaczOryginalny: 180, szybaWyswietlacza: "150*",
    szybaTylna: null, szkloAparatu: 80, gniazdoLadowania: 80, kameraTylna: 80,
    kameraPrzednia: 80, glosnikGorny: 80, regeneracjaGlosnikow: 80, glosnikDolny: 80
  },
  {
    model: "iPhone 6s Plus", generation: "iPhone 6 / 6s", variantLabel: "6s Plus",
    bateriaZamiennik: 100, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 100, wyswietlaczOled: null, wyswietlaczOryginalny: null, szybaWyswietlacza: "150*",
    szybaTylna: null, szkloAparatu: 80, gniazdoLadowania: 80, kameraTylna: 80,
    kameraPrzednia: 80, glosnikGorny: 80, regeneracjaGlosnikow: 80, glosnikDolny: 80
  },
  {
    model: "iPhone 6s", generation: "iPhone 6 / 6s", variantLabel: "6s",
    bateriaZamiennik: 100, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 100, wyswietlaczOled: null, wyswietlaczOryginalny: null, szybaWyswietlacza: "150*",
    szybaTylna: null, szkloAparatu: 80, gniazdoLadowania: 80, kameraTylna: 80,
    kameraPrzednia: 80, glosnikGorny: 80, regeneracjaGlosnikow: 80, glosnikDolny: 80
  },
  {
    model: "iPhone 6 Plus", generation: "iPhone 6 / 6s", variantLabel: "6 Plus",
    bateriaZamiennik: 100, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 100, wyswietlaczOled: null, wyswietlaczOryginalny: null, szybaWyswietlacza: "150*",
    szybaTylna: null, szkloAparatu: 80, gniazdoLadowania: 80, kameraTylna: 80,
    kameraPrzednia: 80, glosnikGorny: 80, regeneracjaGlosnikow: 80, glosnikDolny: 80
  },
  {
    model: "iPhone 6", generation: "iPhone 6 / 6s", variantLabel: "6",
    bateriaZamiennik: 100, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 100, wyswietlaczOled: null, wyswietlaczOryginalny: null, szybaWyswietlacza: "150*",
    szybaTylna: null, szkloAparatu: 80, gniazdoLadowania: 80, kameraTylna: 80,
    kameraPrzednia: 80, glosnikGorny: 80, regeneracjaGlosnikow: 80, glosnikDolny: 80
  },
  {
    model: "iPhone SE (2016)", generation: "iPhone 5 / SE", variantLabel: "SE (2016)",
    bateriaZamiennik: 100, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 100, wyswietlaczOled: null, wyswietlaczOryginalny: null, szybaWyswietlacza: "150*",
    szybaTylna: null, szkloAparatu: 80, gniazdoLadowania: 80, kameraTylna: 80,
    kameraPrzednia: 80, glosnikGorny: 80, regeneracjaGlosnikow: 80, glosnikDolny: 80
  },
  {
    model: "iPhone 5s", generation: "iPhone 5 / SE", variantLabel: "5s",
    bateriaZamiennik: 100, bateriaProgramowalna: null, bateriaOryginalna: null,
    wyswietlaczZamiennik: 100, wyswietlaczOled: null, wyswietlaczOryginalny: null, szybaWyswietlacza: "150*",
    szybaTylna: null, szkloAparatu: 80, gniazdoLadowania: 80, kameraTylna: 80,
    kameraPrzednia: 80, glosnikGorny: 80, regeneracjaGlosnikow: 80, glosnikDolny: 80
  }
];
