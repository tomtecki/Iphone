// Zdarzenia w Umami (self-hosted, bez cookies) - patrz pomysły.md, sekcja 7.
// Zasada: śledzimy CO klient zrobił (model/cena/formularz/kontakt), nigdy
// treść tego, co napisał - żeby nie zbierać danych osobowych bez potrzeby.
function trackUmamiEvent(eventName, eventData) {
  if (typeof window !== "undefined" && window.umami && typeof window.umami.track === "function") {
    window.umami.track(eventName, eventData);
  }
}

const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Ceny i lista modeli są w cennik.js (ładowanym przed tym plikiem) - tam
// zmienia się cennik, ten plik tylko go wyświetla.
const PRICE_DATA = CENNIK;

// Zamienia wpis z cennika ("450*", 270, null) na cenę i czas do wyświetlenia.
function getServicePrice(item, service) {
  const raw = item[service.klucz];
  if (raw === null || raw === undefined) {
    return null;
  }
  const match = String(raw).trim().match(/^(\d+)(\**)$/);
  if (!match) {
    return null;
  }
  return {
    amount: Number(match[1]),
    price: `${match[1]} zł`,
    time: CZAS_GWIAZDKA[match[2]] || CZAS_STANDARD
  };
}

function getServiceLabel(service) {
  return service.czesc ? `${service.naprawa} (${service.czesc})` : service.naprawa;
}

function getAvailableServices(item, groups) {
  return USLUGI
    .filter((service) => !groups || groups.includes(service.grupa))
    .map((service) => ({ service, price: getServicePrice(item, service) }))
    .filter((entry) => entry.price);
}

const POPULAR_MODELS = ["iPhone 17 Pro Max", "iPhone 17", "iPhone 16", "iPhone 15 Pro Max", "iPhone 14", "iPhone 13"];

const modelList = document.querySelector("[data-model-list]");
const generationSelect = document.querySelector("[data-generation-select]");
const variantSelect = document.querySelector("[data-variant-select]");
const searchToggle = document.querySelector("[data-search-toggle]");
const searchBox = document.querySelector("[data-search-box]");
const modelPicker = document.querySelector("[data-model-picker]");
const popularModelsList = document.querySelector("[data-popular-models]");
const modelSearch = document.querySelector("#model-search");
const selectedModel = document.querySelector("[data-selected-model]");
const priceCaption = document.querySelector("[data-price-caption]");
const priceRows = document.querySelector("[data-price-rows]");
const pricePanel = document.querySelector(".price-panel");
const modelPhotoImg = document.querySelector("[data-model-photo-img]");
const modelPhotoPlaceholder = document.querySelector("[data-model-photo-placeholder]");

const DEFAULT_MODEL = PRICE_DATA.find((item) => item.model === "iPhone 15 Pro Max") || PRICE_DATA[0];

const GENERATIONS = [];
PRICE_DATA.forEach((item) => {
  if (!GENERATIONS.includes(item.generation)) {
    GENERATIONS.push(item.generation);
  }
});

let activeModel = DEFAULT_MODEL.model;
let openGeneration = null;

function selectModel(item, options = {}) {
  activeModel = item.model;
  openGeneration = item.generation;
  renderModelList(modelSearch ? modelSearch.value : "");
  renderPopularModels();
  syncSelects();
  renderPrices(item);
  trackUmamiEvent("model_selected", { model: item.model, source: options.source || "unknown" });
  if (!options.skipScroll && pricePanel && window.matchMedia("(max-width: 900px)").matches) {
    pricePanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function populateGenerationSelect() {
  if (!generationSelect) {
    return;
  }

  GENERATIONS.forEach((generation) => {
    const option = document.createElement("option");
    option.value = generation;
    option.textContent = generation;
    generationSelect.append(option);
  });
}

function populateVariantSelect(generation) {
  if (!variantSelect) {
    return;
  }

  variantSelect.innerHTML = "";

  if (!generation) {
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Najpierw wybierz generację";
    variantSelect.append(placeholder);
    variantSelect.disabled = true;
    return;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Wybierz wariant";
  variantSelect.append(placeholder);

  PRICE_DATA.filter((item) => item.generation === generation).forEach((item) => {
    const option = document.createElement("option");
    option.value = item.model;
    option.textContent = item.variantLabel;
    variantSelect.append(option);
  });

  variantSelect.disabled = false;
}

function syncSelects() {
  if (generationSelect) {
    generationSelect.value = openGeneration || "";
  }
  populateVariantSelect(openGeneration);
  if (variantSelect && openGeneration) {
    variantSelect.value = activeModel;
  }
}

if (generationSelect) {
  generationSelect.addEventListener("change", () => {
    openGeneration = generationSelect.value || null;
    populateVariantSelect(openGeneration);
  });
}

if (variantSelect) {
  variantSelect.addEventListener("change", () => {
    const item = PRICE_DATA.find((entry) => entry.model === variantSelect.value);
    if (item) {
      selectModel(item, { skipScroll: true, source: "select" });
    }
  });
}

if (searchToggle && searchBox) {
  searchToggle.addEventListener("click", () => {
    const isHidden = searchBox.hasAttribute("hidden");
    if (isHidden) {
      searchBox.removeAttribute("hidden");
      searchToggle.setAttribute("aria-expanded", "true");
      searchToggle.textContent = "Ukryj wyszukiwanie";
      if (modelSearch) {
        modelSearch.focus();
      }
    } else {
      searchBox.setAttribute("hidden", "");
      searchToggle.setAttribute("aria-expanded", "false");
      searchToggle.textContent = "Szukaj po nazwie modelu";
      if (modelPicker) {
        modelPicker.classList.remove("is-searching");
      }
      if (modelSearch) {
        modelSearch.value = "";
      }
    }
  });
}

function renderPopularModels() {
  if (!popularModelsList) {
    return;
  }

  popularModelsList.innerHTML = "";

  POPULAR_MODELS.forEach((modelName) => {
    const item = PRICE_DATA.find((entry) => entry.model === modelName);
    if (!item) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = `model-button${item.model === activeModel ? " is-active" : ""}`;
    button.textContent = item.model;
    button.addEventListener("click", () => selectModel(item, { source: "popular" }));
    popularModelsList.append(button);
  });
}

function renderModelList(filter = "") {
  if (!modelList) {
    return;
  }

  const normalizedFilter = filter.trim().toLowerCase();
  const models = PRICE_DATA.filter((item) => item.model.toLowerCase().includes(normalizedFilter));

  modelList.innerHTML = "";

  models.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `model-button${item.model === activeModel ? " is-active" : ""}`;
    button.textContent = item.model;
    button.addEventListener("click", () => selectModel(item, { source: "search" }));
    modelList.append(button);
  });
}

function renderPrices(item = DEFAULT_MODEL) {
  if (!selectedModel || !priceRows || !priceCaption) {
    return;
  }

  selectedModel.textContent = item.model;
  priceCaption.textContent = `Cennik napraw dla ${item.model}`;
  priceRows.innerHTML = "";

  if (modelPhotoImg && modelPhotoPlaceholder) {
    if (item.image) {
      modelPhotoImg.src = item.image;
      modelPhotoImg.alt = item.model;
      modelPhotoImg.removeAttribute("hidden");
      modelPhotoPlaceholder.setAttribute("hidden", "");
    } else {
      modelPhotoImg.setAttribute("hidden", "");
      modelPhotoImg.removeAttribute("src");
      modelPhotoPlaceholder.removeAttribute("hidden");
    }
  }

  getAvailableServices(item).forEach(({ service, price }) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = service.naprawa;
    if (service.czesc) {
      const part = document.createElement("span");
      part.className = "price-part";
      part.textContent = service.czesc;
      nameCell.append(part);
    }
    row.append(nameCell);

    [price.price, price.time].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    priceRows.append(row);
  });
}

if (modelSearch) {
  modelSearch.addEventListener("input", () => {
    const isSearching = modelSearch.value.trim().length > 0;
    if (modelPicker) {
      modelPicker.classList.toggle("is-searching", isSearching);
    }
    renderModelList(modelSearch.value);
  });
}

function getModelFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("model");

  if (!requested) {
    return null;
  }

  const normalized = requested.trim().toLowerCase();
  return PRICE_DATA.find((item) => item.model.toLowerCase() === normalized) || null;
}

const preselectedModel = getModelFromUrl();

if (preselectedModel) {
  activeModel = preselectedModel.model;
  openGeneration = preselectedModel.generation;
}

populateGenerationSelect();
renderPopularModels();
renderModelList();
syncSelects();
renderPrices(preselectedModel || undefined);

if (preselectedModel && pricePanel) {
  trackUmamiEvent("model_selected", { model: preselectedModel.model, source: "url_param" });
  pricePanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

if (contactForm && formNote) {
  contactForm.addEventListener("focusin", () => trackUmamiEvent("contact_form_started"), { once: true });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // Zdarzenie bez treści pól - imię/telefon/opis usterki to dane osobowe,
    // do analityki liczy się tylko sam fakt wysłania formularza.
    trackUmamiEvent("contact_form_submitted");
    formNote.textContent = "Dziękujemy. Aby najszybciej potwierdzić termin mobilnego serwisu, zadzwoń: 570 222 345.";
  });
}

// Faza 1 asystenta: bot regułowy, bez LLM i bez kosztów API - patrz pomysły.md.
// Zbieranie leadów i wysyłka do systemu obsługującego naprawy to Faza 2, jeszcze niezaimplementowana.

// Klienci piszą bez polskich znaków ("nie dziala", "laduje") - normalizacja
// sprawia, że dopasowanie działa niezależnie od tego, czy diakrytyki są wpisane.
const BOT_DIACRITICS_MAP = { ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z" };

function normalizeBotText(text) {
  return text
    .toLowerCase()
    .split("")
    .map((char) => BOT_DIACRITICS_MAP[char] || char)
    .join("");
}

const BOT_RULES = [
  {
    id: "czas-naprawy",
    keywords: ["ile trwa", "jak długo", "czas naprawy", "kiedy będzie gotowe", "ile czasu", "trwa naprawa", "trwa wymiana"],
    answer: "Najczęściej naprawa jest możliwa tego samego dnia, jeśli część jest dostępna. Przy rzadszych modelach termin potwierdzamy telefonicznie.",
    link: { href: "#faq", label: "Zobacz pełne FAQ" }
  },
  {
    id: "dojazd",
    keywords: ["dojazd", "dojeżdżacie", "obszar", "twoje miasto", "moje miasto", "przyjedziecie", "jakich miast", "do jakich miast", "docie", "dojechać", "dojechac", "obsługujecie"],
    answer: "Dojazd na terenie Rybnika jest wliczony w cenę. Obsługujemy też Żory, Wodzisław Śląski, Jastrzębie-Zdrój, Gliwice i Katowice — koszt dojazdu dla tych miast potwierdzamy telefonicznie.",
    link: { href: "#obszar", label: "Zobacz obsługiwane lokalizacje" }
  },
  {
    id: "godziny",
    keywords: ["godziny", "kiedy otwarte", "czynne", "pracujecie", "godzin pracy"],
    answer: "Pracujemy pon.–pt. 9:00–18:00 oraz w soboty 10:00–14:00.",
    link: { href: "tel:+48570222345", label: "Zadzwoń: 570 222 345" }
  },
  {
    id: "miejsce-naprawy",
    keywords: ["w domu", "u mnie", "gdzie naprawa", "gdzie odbywa"],
    answer: "Nie trzeba nikogo wpuszczać do domu ani biura — naprawa odbywa się w specjalnie przystosowanym samochodzie serwisowym pod wskazanym adresem.",
    link: { href: "#faq", label: "Zobacz pełne FAQ" }
  },
  {
    id: "zalanie",
    keywords: ["zalanie", "zalany", "woda", "wpadł do wody", "wpadł w wodę"],
    answer: "Nie podłączaj zalanego telefonu do ładowarki. Wykonujemy diagnostykę po zalaniu — im szybciej trafi do nas telefon, tym większa szansa na ograniczenie szkód.",
    link: { href: "#naprawy", label: "Zobacz usługę diagnostyki po zalaniu" }
  },
  {
    id: "nieznany-model",
    keywords: ["nie znam modelu", "nie wiem jaki mam", "jaki to model"],
    answer: "Nie musisz znać dokładnego modelu z góry — sprawdzimy go na miejscu, albo skorzystaj z naszego poradnika.",
    link: { href: "sprawdz-model-iphone.html", label: "Otwórz poradnik: jak sprawdzić model" }
  },
  {
    id: "dane-kopia-zapasowa",
    keywords: ["dane", "kasujecie dane", "utracę dane", "kopia zapasowa"],
    answer: "Standardowe naprawy mechaniczne nie wymagają kasowania danych. Mimo to warto mieć aktualną kopię zapasową, zwłaszcza przy zalaniu lub problemach z płytą.",
    link: { href: "#faq", label: "Zobacz pełne FAQ" }
  },
  {
    id: "faktura",
    keywords: ["faktura", "dokument sprzedaży", "rachunek"],
    answer: "Tak, po naprawie możemy wystawić dokument sprzedaży. Dane do faktury najlepiej podać przy przyjęciu telefonu.",
    link: { href: "#faq", label: "Zobacz pełne FAQ" }
  },
  {
    id: "gwarancja",
    keywords: ["gwarancj"],
    answer: "Na wykonane naprawy obowiązuje gwarancja — dokładne warunki potwierdzimy przy wycenie telefonicznej.",
    link: { href: "tel:+48570222345", label: "Zadzwoń: 570 222 345" }
  },
  {
    id: "kontakt",
    keywords: ["telefon", "numer", "kontakt", "zadzwonić"],
    answer: "Zadzwoń: 570 222 345 — to najszybsza droga do wyceny i umówienia terminu.",
    link: { href: "tel:+48570222345", label: "Zadzwoń: 570 222 345" }
  },
  {
    id: "przygotowanie-do-wizyty",
    keywords: ["przygotować", "co zabrać", "kod odblokowania", "backup przed", "przed wizytą", "przed naprawą co"],
    answer: "Jeśli to możliwe, wykonaj kopię zapasową, wyłącz blokady ograniczające testy i zabierz kod odblokowania albo zostań na miejscu podczas testowania funkcji.",
    link: { href: "#faq", label: "Zobacz pełne FAQ" }
  },
  {
    id: "zakres-uslug",
    keywords: ["co naprawiacie", "jakie naprawy", "jakie usługi", "co robicie", "zakres napraw", "czym się zajmujecie"],
    answer: "Naprawiamy: ekran/szybkę, baterię, złącze ładowania, aparat/głośnik/mikrofon, usterki po zalaniu i po upadku.",
    link: { href: "#naprawy", label: "Zobacz wszystkie usługi" }
  },
  {
    id: "proces-naprawy",
    keywords: ["jak wygląda wizyta", "jak to działa", "jak zamówić", "jak umówić", "proces naprawy", "jak się umówić", "jak zgłosić"],
    answer: "Trzy kroki: opisujesz objaw (telefon lub formularz), technik ocenia usterkę i podaje wycenę, naprawa zaczyna się po Twojej zgodzie.",
    link: { href: "#proces", label: "Zobacz pełny proces" }
  },
  {
    id: "upadek",
    keywords: ["upadek", "upadł", "spadł", "wypadł z ręki", "stłuczony telefon"],
    answer: "Po upadku sprawdzamy ekran, ramkę, aparat, ładowanie, anteny i inne elementy, które mogły ucierpieć nawet wtedy, gdy telefon wygląda dobrze.",
    link: { href: "#naprawy", label: "Zobacz usługę" }
  },
  {
    id: "opinie",
    keywords: ["opinie", "recenzje", "referencje", "czy macie opinie"],
    answer: "4,9/5 na podstawie 164 opinii Google — prawdziwe recenzje klientów są na tej stronie.",
    link: { href: "#opinie", label: "Zobacz opinie" }
  },
  {
    id: "formularz",
    keywords: ["formularz", "zgłoszenie wyślij", "napisać zamiast dzwonić"],
    answer: "Formularz kontaktowy jest na dole strony — podaj model, objawy i preferowany kontakt.",
    link: { href: "#formularz", label: "Przejdź do formularza" }
  },
  {
    id: "zamiennik-vs-oryginal",
    keywords: ["zamiennik", "orygina"],
    answer: "Zamiennik to sprawdzona, kompatybilna część (nie od Apple) — tańsza opcja. Oryginał to część od Apple — droższa, ale w pełni zgodna ze wszystkimi funkcjami (np. przy niektórych ekranach zachowuje funkcję True Tone). Obie opcje montujemy z tą samą starannością — ceny obu wariantów zobaczysz obok siebie w cenniku dla Twojego modelu.",
    link: { href: "#cennik", label: "Zobacz obie ceny w cenniku" }
  },
  {
    id: "powitanie",
    keywords: ["cześć", "czesc", "hej", "dzień dobry", "dzien dobry", "witam", "siema"],
    answer: "Cześć! Podaj model iPhone i to, co się z nim dzieje (np. „13 Pro pękł ekran”), a sprawdzę cenę naprawy, albo wybierz model z listy poniżej.",
    options: GENERATIONS.map((generation) => ({
      label: generation.replace(/^iPhone\s*/i, ""),
      onClick: () => handleBotGenerationPick(generation)
    }))
  },
  {
    id: "podziekowanie",
    keywords: ["dziękuj", "dzięki", "spoko dzięki"],
    answer: "Nie ma za co! Jeśli będziesz potrzebować kolejnej wyceny albo masz inne pytanie, jestem tutaj."
  },
  {
    id: "kim-jestes",
    keywords: ["jesteś botem", "jestes botem", "czy to bot", "rozmawiam z człowiekiem", "rozmawiam z czlowiekiem", "sztuczna inteligencja", "kim jesteś", "kim jestes"],
    answer: "Jestem automatycznym asystentem MojIphone — odpowiadam na podstawie informacji z tej strony (cennik, FAQ), bez sztucznej inteligencji. Do rozmowy z człowiekiem zadzwoń: 570 222 345.",
    link: { href: "tel:+48570222345", label: "Zadzwoń: 570 222 345" }
  }
];

// Poradnik "co zrobić, gdy..." - te same treści co na problemy-z-iphone.html
// (patrz usterki.md - źródło). Rozpoznaje pytania ogólne o objawy (bez podanego
// modelu ani intencji cenowej) i kieruje do właściwej sekcji poradnika, zamiast
// od razu pytać o model albo cenę.
// Słowa kluczowe to rdzenie wyrazów (np. "rozładowuj" zamiast "rozładowuje się"),
// bo szyk zdania w polskim jest zbyt zmienny na sztywne frazy - "iPhone się grzeje"
// i "grzeje się telefon" muszą trafić w tę samą regułę.
const BOT_PROBLEM_TOPICS = [
  {
    keywords: ["rozładowuj", "rozladowuj", "traci baterie", "słabo trzyma", "slabo trzyma", "kondycja baterii", "pojemność baterii", "pojemnosc baterii"],
    summary: "Sprawdź kondycję baterii w Ustawieniach → Bateria → Kondycja baterii. Poniżej 80% pojemności warto ją wymienić.",
    href: "problemy-z-iphone.html#bateria",
    label: "Pełna instrukcja: szybko rozładowująca się bateria"
  },
  {
    keywords: ["grze", "przegrzew", "gorąc", "gorac", "rozgrzan"],
    summary: "Odłącz od ładowarki, zdejmij etui i przenieś telefon w chłodne miejsce. Nigdy nie wkładaj go do lodówki.",
    href: "problemy-z-iphone.html#przegrzewanie",
    label: "Pełna instrukcja: telefon się grzeje"
  },
  {
    keywords: ["ghost touch", "klika", "duch dotyku", "sam się otwiera", "sam sie otwiera", "sam wybiera", "wariuje ekran", "szaleje ekran"],
    summary: "Przetrzyj ekran, zdejmij dodatkowe szkło ochronne i zrób twardy restart. Jeśli nie pomoże, zwykle to pęknięcie pod szybką po upadku.",
    href: "problemy-z-iphone.html#ghost-touch",
    label: "Pełna instrukcja: ekran sam coś klika"
  },
  {
    keywords: ["ostrzeżenie o cieczy", "ostrzezenie o cieczy", "wykryto płyn", "wykryto plyn", "ciecz w złączu", "ciecz w zlaczu", "wilgoć w porcie", "wilgoc w porcie"],
    summary: "Odłącz kabel, nie wkładaj telefonu do ryżu, nie susz suszarką. Zostaw w suchym miejscu na kilka godzin.",
    href: "problemy-z-iphone.html#zalanie",
    label: "Pełna instrukcja: ostrzeżenie o cieczy w złączu"
  },
  {
    keywords: ["zamyka", "wolno działa", "wolno dziala", "muli", "zawiesz", "mało pamięci", "malo pamieci", "brak miejsca", "brak pamięci", "brak pamieci"],
    summary: "Sprawdź wolne miejsce w Ustawieniach → Ogólne → iPhone (pamięć), usuń zbędne pliki i zaktualizuj aplikacje oraz iOS.",
    href: "problemy-z-iphone.html#pamiec",
    label: "Pełna instrukcja: telefon wolno działa"
  },
  {
    keywords: ["brak sieci", "szare wifi", "nie działa wifi", "nie dziala wifi", "nie działa bluetooth", "nie dziala bluetooth", "zgubił zasięg", "zgubil zasieg", "bez zasięgu", "bez zasiegu"],
    summary: "Wyjmij i włóż ponownie kartę SIM. Jeśli WiFi/Bluetooth nadal się nie włącza, zresetuj ustawienia sieciowe w Ustawieniach.",
    href: "problemy-z-iphone.html#siec",
    label: "Pełna instrukcja: brak sieci, WiFi lub Bluetooth"
  },
  {
    keywords: ["restartuje się co", "restartuje sie co", "wyłącza się co kilka minut", "wylacza sie co kilka minut", "panic-full", "panic full", "sam się wyłącza", "sam sie wylacza"],
    summary: "To zwykle fizyczne uszkodzenie taśmy wewnątrz telefonu (często po upadku) — nie da się tego naprawić samodzielnie.",
    href: "problemy-z-iphone.html#restart-co-3-minuty",
    label: "Pełna instrukcja: telefon restartuje się co kilka minut"
  },
  {
    keywords: ["nikt mnie nie słyszy", "nikt mnie nie slyszy", "brak głosu podczas rozmowy", "brak glosu podczas rozmowy", "nie słychać mnie", "nie slychac mnie", "nie słyszą mnie", "nie slysza mnie"],
    summary: "Dla iPhone 12 i 12 Pro (bez mini/Pro Max) z wadą fabryczną głośnika Apple prowadzi darmowy program naprawczy przez Autoryzowany Serwis Apple.",
    href: "problemy-z-iphone.html#brak-glosu-12",
    label: "Pełna instrukcja: brak głosu podczas rozmów"
  },
  {
    keywords: ["dyktafon nie nagrywa", "audio ic", "cichy głośnik i długo się włącza", "cichy glosnik i dlugo sie wlacza"],
    summary: "To znana wada płyty głównej w iPhone 7/7 Plus (Audio IC Disease) — wymaga specjalistycznej naprawy, nie da się jej naprawić w domu.",
    href: "problemy-z-iphone.html#audio-ic-7",
    label: "Pełna instrukcja: dyktafon nie nagrywa, cichy głośnik"
  },
  {
    keywords: ["zielony ekran", "biały ekran", "bialy ekran", "nie widać obrazu", "nie widac obrazu", "zzieleniał", "zzielenial"],
    summary: "Zrób twardy restart. Jeśli ekran nadal jest zielony/biały mimo że telefon reaguje, to zwykle wada fabryczna sterownika ekranu w iPhone 13 Pro/Pro Max.",
    href: "problemy-z-iphone.html#zielony-ekran-13pro",
    label: "Pełna instrukcja: zielony lub biały ekran"
  }
];

function findBotProblemMatch(message) {
  const normalized = normalizeBotText(message);
  return BOT_PROBLEM_TOPICS.find((topic) => topic.keywords.some((keyword) => normalized.includes(normalizeBotText(keyword)))) || null;
}

// Mapa usterek na grupy usług z cennik.js (pole "grupa") - żeby bot odpowiadał dokładnie
// na zapytaną część, a nie zawsze podsumowaniem ekran+bateria. Oprócz nazw usług
// (np. "ekran") rozpoznaje też opisy objawów, jak realnie pisze klient
// (np. "pękł mi ekran", "nie ładuje się", "słabo trzyma baterię").
const BOT_PART_GROUPS = [
  {
    keywords: ["aparat", "kamer", "rozmazane zdjęcia", "nie robi zdjęć", "facetime", "nie widzę obrazu z aparatu"],
    keys: ["camera"]
  },
  {
    keywords: ["ekran", "wyświetlacz", "szybk", "display", "matryc", "pękł", "pęknięty", "peknieta", "rozbity", "miga", "plamy", "nie reaguje na dotyk", "czarny ekran", "nie widać obrazu"],
    keys: ["screen"]
  },
  {
    keywords: ["bateri", "akumulator", "szybko się rozładowuje", "wyłącza się sam", "słabo trzyma", "kondycja baterii", "szybko traci baterię"],
    keys: ["battery"]
  },
  {
    keywords: ["ładowani", "gniazdo", "port ładowania", "wtyczk", "nie ładuje się", "wolno się ładuje", "przerywane ładowanie", "kabel nie działa"],
    keys: ["charging"]
  },
  {
    keywords: ["głośnik", "charczy", "cichy dźwięk", "rozmówcy nie słyszą", "słabo słychać", "nie słyszę rozmówcy"],
    keys: ["speaker"]
  },
  {
    keywords: ["mikrofon", "mnie nie słyszą", "nie słychać mnie", "rozmówca mnie nie słyszy"],
    keys: ["charging"]
  },
  {
    keywords: ["obudow", "korpus", "szkło tylne", "tylna szyb", "tył telefonu", "pęknięta obudowa", "tył się rozleciał"],
    keys: ["backGlass"]
  },
  {
    keywords: ["przycisk", "guzik", "home", "nie działa przycisk", "nie reaguje przycisk"],
    keys: ["buttons"]
  },
  {
    keywords: ["czujnik zbliżeniowy", "czujnik"],
    keys: ["sensor"]
  },
  {
    keywords: ["antena", "sim", "nie łapie zasięgu", "brak zasięgu"],
    keys: ["sim"]
  }
];

function escapeBotRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findBotModelMatch(message) {
  const normalized = normalizeBotText(message);
  // Najdłuższa pasująca nazwa wygrywa - "iPhone 13 mini" nie może trafić w "iPhone 13".
  const matches = PRICE_DATA.filter((item) => normalized.includes(normalizeBotText(item.model)));
  return matches.sort((a, b) => b.model.length - a.model.length)[0] || null;
}

// Rozpoznaje wariant modelu po samym numerze/nazwie, bez słowa "iPhone"
// (np. "13 pro max", "16e", "se 2020") - klient rzadko pisze pełne zdania.
const BARE_MODEL_MAP = PRICE_DATA
  .map((item) => ({ item, bare: normalizeBotText(item.model.replace(/^iPhone\s*/i, "").trim()) }))
  .filter(({ bare }) => bare.length > 0)
  .sort((a, b) => b.bare.length - a.bare.length);

function findBotBareModelMatch(message) {
  const normalized = normalizeBotText(message);
  const match = BARE_MODEL_MAP.find(({ bare }) => new RegExp(`\\b${escapeBotRegExp(bare)}\\b`, "i").test(normalized));
  return match ? match.item : null;
}

// Rozpoznaje samą generację (np. "13" bez wariantu) - gdy generacja ma więcej
// niż jeden wariant cenowy, bot musi dopytać zamiast zgadywać.
const GENERATION_BARE_MAP = GENERATIONS
  .filter((generation) => !generation.includes("/"))
  .map((generation) => ({ generation, bare: normalizeBotText(generation.replace(/^iPhone\s*/i, "").trim()) }))
  .filter(({ bare }) => bare.length > 0)
  .sort((a, b) => b.bare.length - a.bare.length);

function findBotGenerationMatch(message) {
  const normalized = normalizeBotText(message);
  const match = GENERATION_BARE_MAP.find(({ bare }) => new RegExp(`\\b${escapeBotRegExp(bare)}\\b`, "i").test(normalized));
  return match ? match.generation : null;
}

function resolveBotModel(message) {
  const exact = findBotModelMatch(message) || findBotBareModelMatch(message);
  if (exact) {
    return { item: exact };
  }

  const generation = findBotGenerationMatch(message);
  if (generation) {
    const variants = PRICE_DATA.filter((entry) => entry.generation === generation);
    if (variants.length === 1) {
      return { item: variants[0] };
    }
    return { ambiguousGeneration: generation, variants };
  }

  return null;
}

function findBotPartMatch(message) {
  const normalized = normalizeBotText(message);
  return BOT_PART_GROUPS.find((group) => group.keywords.some((keyword) => normalized.includes(normalizeBotText(keyword)))) || null;
}

function findBotRuleMatch(message) {
  const normalized = normalizeBotText(message);
  return BOT_RULES.find((rule) => rule.keywords.some((keyword) => normalized.includes(normalizeBotText(keyword)))) || null;
}

function formatPartAnswer(item, partGroup) {
  const entries = getAvailableServices(item, partGroup.keys);
  if (entries.length === 0) {
    return `Dla ${item.model} tę naprawę wyceniamy indywidualnie — zadzwoń: 570 222 345.`;
  }
  const lines = entries.map(({ service, price }) => `${getServiceLabel(service)} — ${price.price}, czas: ${price.time}`);
  return `Dla ${item.model}: ${lines.join("; ")}.`;
}

function formatLowestPrice(item, group) {
  const amounts = getAvailableServices(item, [group]).map(({ price }) => price.amount);
  return amounts.length ? `od ${Math.min(...amounts)} zł` : "na zapytanie";
}

function formatGeneralAnswer(item) {
  return `Dla ${item.model}: wymiana wyświetlacza ${formatLowestPrice(item, "screen")}, wymiana baterii ${formatLowestPrice(item, "battery")}. Pełny cennik i pozostałe naprawy zobaczysz w sekcji cennika.`;
}

// Kontekst rozmowy - bot zapamiętuje ostatnio wspomniany model w tej sesji czatu,
// żeby nie pytać o niego ponownie przy kolejnych pytaniach o inne usterki.
let botContextModel = null;

function answerForResolvedModel(item, partMatch) {
  return {
    text: partMatch ? formatPartAnswer(item, partMatch) : formatGeneralAnswer(item),
    action: () => selectModel(item, { source: "bot" })
  };
}

function getBotAnswer(message) {
  const resolved = resolveBotModel(message);
  const partMatch = findBotPartMatch(message);
  const containsPriceIntent = /cena|koszt|ile kosztuje|wycena/i.test(message);

  // Pytania ogólne o objaw ("się grzeje", "sam klika") bez podanego modelu
  // i bez intencji cenowej trafiają najpierw do poradnika - klient dostaje
  // diagnozę i bezpieczne kroki, zanim zaczniemy mówić o cenach.
  if (!resolved && !containsPriceIntent) {
    const problemMatch = findBotProblemMatch(message);
    if (problemMatch) {
      trackUmamiEvent("bot_problem_matched", { topic: problemMatch.href.split("#")[1] });
      return { text: problemMatch.summary, link: { href: problemMatch.href, label: problemMatch.label } };
    }
  }

  // Sama generacja bez wariantu (np. "13") ma kilka różnych cen - dopytaj,
  // zamiast zgadywać, zanim cokolwiek policzysz.
  if (resolved && resolved.ambiguousGeneration) {
    trackUmamiEvent("bot_generation_ambiguous", { generation: resolved.ambiguousGeneration });
    return {
      text: `${resolved.ambiguousGeneration} ma kilka wariantów z różną ceną. Który dokładnie masz?`,
      options: resolved.variants.map((variant) => ({
        label: variant.variantLabel,
        onClick: () => {
          botContextModel = variant;
          const followUp = answerForResolvedModel(variant, partMatch);
          addChatMessage(followUp.text, "bot", { action: followUp.action });
        }
      }))
    };
  }

  const explicitModel = resolved ? resolved.item : null;
  if (explicitModel) {
    botContextModel = explicitModel;
  }
  const contextModel = explicitModel || botContextModel;

  if (partMatch) {
    if (!contextModel) {
      trackUmamiEvent("bot_model_missing", { part: partMatch.keys.join("+") });
      return {
        text: "Jaki masz model iPhone? Podaj nazwę albo numer (np. „13 Pro”), a sprawdzę dokładną cenę tej naprawy."
      };
    }
    trackUmamiEvent("bot_part_asked", { part: partMatch.keys.join("+") });
    return answerForResolvedModel(contextModel, partMatch);
  }

  if (explicitModel) {
    return answerForResolvedModel(explicitModel, null);
  }

  if (containsPriceIntent) {
    if (contextModel) {
      return answerForResolvedModel(contextModel, null);
    }
    trackUmamiEvent("bot_model_missing", { part: "price_intent" });
    return {
      text: "Cena zależy od modelu i rodzaju naprawy. Napisz model (np. „13 Pro cena” albo „iPhone 13 cena”), a pokażę orientacyjną wycenę, albo przejdź do sekcji cennika na stronie.",
      link: { href: "#cennik", label: "Otwórz cennik" }
    };
  }

  const ruleMatch = findBotRuleMatch(message);
  if (ruleMatch) {
    trackUmamiEvent("bot_rule_matched", { topic: ruleMatch.id });
    return { text: ruleMatch.answer, link: ruleMatch.link, options: ruleMatch.options };
  }

  trackUmamiEvent("bot_fallback");
  return {
    text: "Nie mam gotowej odpowiedzi na to pytanie. Mogę pomóc z: wyceną naprawy (podaj model), dojazdem, godzinami pracy, zalaniem, gwarancją albo różnicą między zamiennikiem a oryginałem. Jeśli wolisz, zadzwoń: 570 222 345, albo napisz przez formularz.",
    link: { href: "#formularz", label: "Przejdź do formularza kontaktowego" }
  };
}

const chatWidget = document.querySelector("[data-chat-widget]");
const chatToggle = document.querySelector("[data-chat-toggle]");
const chatPanel = document.querySelector("[data-chat-panel]");
const chatClose = document.querySelector("[data-chat-close]");
const chatLog = document.querySelector("[data-chat-log]");
const chatForm = document.querySelector("[data-chat-form]");
const chatInput = document.querySelector("#chat-input");

function addChatMessage(text, from, extra = {}) {
  if (!chatLog) {
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = `chat-bubble chat-bubble-${from}`;

  const bubble = document.createElement("p");
  bubble.className = "chat-bubble-text";
  bubble.textContent = text;
  wrap.append(bubble);

  if (extra.link) {
    const anchor = document.createElement("a");
    anchor.className = "chat-bubble-link";
    anchor.href = extra.link.href;
    anchor.textContent = extra.link.label;
    if (extra.link.href.startsWith("http")) {
      anchor.target = "_blank";
      anchor.rel = "noopener";
    }
    wrap.append(anchor);
  } else if (extra.action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chat-bubble-link";
    button.textContent = "Pokaż w cenniku";
    button.addEventListener("click", () => {
      extra.action();
      const pricingSection = document.querySelector("#cennik");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    wrap.append(button);
  } else if (extra.options) {
    const optionsWrap = document.createElement("div");
    optionsWrap.className = "chat-bubble-options";
    extra.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chat-bubble-link chat-bubble-option";
      button.textContent = option.label;
      button.addEventListener("click", () => option.onClick());
      optionsWrap.append(button);
    });
    wrap.append(optionsWrap);
  }

  chatLog.append(wrap);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function handleBotQuestion(question) {
  const trimmed = question.trim();
  if (!trimmed) {
    return;
  }

  addChatMessage(trimmed, "user");
  const response = getBotAnswer(trimmed);
  addChatMessage(response.text, "bot", response);
}

// Prowadzona ścieżka na start rozmowy: generacja -> wariant -> co się stało.
// Klient rzadko sam zacznie od trafnego pytania - łatwiej poprowadzić go
// przyciskami, niż czekać aż wpisze coś, co bot rozpozna.
const BOT_SYMPTOM_CHIPS = [
  "Pękł ekran",
  "Nie ładuje się",
  "Szybko się rozładowuje",
  "Zalany",
  "Nie robi zdjęć"
];

function promptForBotSymptom() {
  addChatMessage(`Mam: ${botContextModel.model}. Co się stało z telefonem? Napisz krótko albo wybierz poniżej.`, "bot", {
    options: [
      ...BOT_SYMPTOM_CHIPS.map((symptom) => ({
        label: symptom,
        onClick: () => handleBotQuestion(symptom)
      })),
      {
        label: "Coś innego — napiszę",
        onClick: () => {
          if (chatInput) {
            chatInput.focus();
          }
        }
      }
    ]
  });
}

function handleBotVariantPick(variant) {
  addChatMessage(variant.variantLabel, "user");
  botContextModel = variant;
  trackUmamiEvent("bot_onboarding_step", { step: "variant", value: variant.variantLabel });
  promptForBotSymptom();
}

function handleBotGenerationPick(generation) {
  addChatMessage(generation, "user");
  trackUmamiEvent("bot_onboarding_step", { step: "generation", value: generation });
  const variants = PRICE_DATA.filter((entry) => entry.generation === generation);
  if (variants.length === 1) {
    botContextModel = variants[0];
    promptForBotSymptom();
    return;
  }
  addChatMessage(`Który dokładnie wariant ${generation}?`, "bot", {
    options: variants.map((variant) => ({
      label: variant.variantLabel,
      onClick: () => handleBotVariantPick(variant)
    }))
  });
}

function startBotOnboarding() {
  addChatMessage("Zacznijmy od Twojego telefonu — jaki masz model?", "bot", {
    options: GENERATIONS.map((generation) => ({
      label: generation.replace(/^iPhone\s*/i, ""),
      onClick: () => handleBotGenerationPick(generation)
    }))
  });
}

if (chatWidget && chatToggle && chatPanel) {
  let chatInitialized = false;
  let chatUserInteracted = false;

  const openChat = ({ focusInput = true } = {}) => {
    chatPanel.removeAttribute("hidden");
    chatToggle.setAttribute("aria-expanded", "true");
    if (!chatInitialized) {
      addChatMessage("Cześć! Jestem asystentem MojIphone.", "bot");
      startBotOnboarding();
      chatInitialized = true;
    }
    if (chatInput && focusInput) {
      chatInput.focus();
    }
  };

  const closeChat = () => {
    chatPanel.setAttribute("hidden", "");
    chatToggle.setAttribute("aria-expanded", "false");
  };

  chatToggle.addEventListener("click", () => {
    chatUserInteracted = true;
    const isOpen = !chatPanel.hasAttribute("hidden");
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  });

  if (chatClose) {
    chatClose.addEventListener("click", () => {
      chatUserInteracted = true;
      closeChat();
    });
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handleBotQuestion(chatInput.value);
      chatInput.value = "";
      chatInput.focus();
    });
  }

  // Czat ma się pojawić samoczynnie w ciągu 3 s od wejścia na stronę,
  // ale tylko jeśli klient wcześniej sam go nie otworzył ani nie zamknął.
  window.setTimeout(() => {
    if (!chatUserInteracted) {
      openChat({ focusInput: false });
    }
  }, 3000);
}

window.dataLayer = window.dataLayer || [];

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target.closest("[data-track]") : null;

  if (!target) {
    return;
  }

  const ctaId = target.getAttribute("data-track");

  window.dataLayer.push({
    event: "cta_clicked",
    cta_id: ctaId,
    cta_text: target.textContent.trim(),
    page_location: window.location.href
  });

  trackUmamiEvent(ctaId);
});
