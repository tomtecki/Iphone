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

const SERVICES = [
  ["screen", "Wymiana wyświetlacza"],
  ["battery", "Wymiana baterii"],
  ["backGlass", "Wymiana szkła tylnego"],
  ["rearCamera", "Aparat główny"],
  ["frontCamera", "Aparat przedni"],
  ["charging", "Gniazdo ładowania"],
  ["mic", "Mikrofon dolny"],
  ["speakerTop", "Głośnik górny"],
  ["speakerBottom", "Głośnik dolny"],
  ["buttons", "Przycisk on/off lub volume"],
  ["home", "Przycisk HOME"],
  ["sim", "Antena SIM"],
  ["housing", "Korpus / tylna obudowa"],
  ["sensor", "Czujnik zbliżeniowy"]
];

const NA = ["-", "-", "Na zapytanie"];

// TODO: modele poniżej (17/Air/16) nie mają jeszcze cen - klient musi przesłać cennik, żeby wypełnić pola takie jak w modelach poniżej (screen, battery, itd.), zamiast pokazywać "Na zapytanie" dla wszystkiego.
const PRICE_DATA = [
  { model: "iPhone 17 Pro Max", generation: "iPhone 17", variantLabel: "Pro Max" },
  { model: "iPhone 17 Pro", generation: "iPhone 17", variantLabel: "Pro" },
  { model: "iPhone Air", generation: "iPhone Air", variantLabel: "Standardowy" },
  { model: "iPhone 17", generation: "iPhone 17", variantLabel: "Standardowy" },
  { model: "iPhone 17e", generation: "iPhone 17", variantLabel: "e" },
  { model: "iPhone 16 Pro Max", generation: "iPhone 16", variantLabel: "Pro Max" },
  { model: "iPhone 16 Pro", generation: "iPhone 16", variantLabel: "Pro" },
  { model: "iPhone 16 Plus", generation: "iPhone 16", variantLabel: "Plus" },
  { model: "iPhone 16", generation: "iPhone 16", variantLabel: "Standardowy" },
  { model: "iPhone 16e", generation: "iPhone 16", variantLabel: "e" },
  {
    model: "iPhone 15 Pro Max",
    generation: "iPhone 15",
    variantLabel: "Pro Max",
    screen: ["1600 zł OLED", "2400 zł", "30-60 min"],
    battery: ["250 zł", "500 zł", "30-60 min"],
    backGlass: ["-", "850 zł", "2-3 dni robocze"],
    frontCamera: ["-", "400 zł", "30-60 min"],
    charging: ["brak", "650 zł", "30-60 min"],
    mic: ["brak", "650 zł", "30-60 min"],
    speakerTop: ["350 zł", "750 zł", "30-60 min"],
    speakerBottom: ["-", "350 zł", "30-60 min"],
    buttons: ["350 zł", "500 zł", "30-60 min"],
    housing: ["350 zł", "750 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 15 Pro",
    generation: "iPhone 15",
    variantLabel: "Pro",
    screen: ["1300 zł OLED", "1900 zł", "30-60 min"],
    battery: ["250 zł", "500 zł", "30-60 min"],
    backGlass: ["-", "850 zł", "2-3 dni robocze"],
    frontCamera: ["-", "400 zł", "30-60 min"],
    charging: ["brak", "650 zł", "30-60 min"],
    mic: ["brak", "650 zł", "30-60 min"],
    speakerTop: ["350 zł", "750 zł", "30-60 min"],
    speakerBottom: ["-", "350 zł", "30-60 min"],
    buttons: ["350 zł", "500 zł", "30-60 min"],
    housing: ["350 zł", "750 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 15 Plus",
    generation: "iPhone 15",
    variantLabel: "Plus",
    screen: ["950 zł", "1500 zł", "30-60 min"],
    battery: ["250 zł", "500 zł", "30-60 min"],
    backGlass: ["-", "850 zł", "2-3 dni robocze"],
    frontCamera: ["-", "400 zł", "30-60 min"],
    charging: ["brak", "650 zł", "30-60 min"],
    mic: ["brak", "650 zł", "30-60 min"],
    speakerTop: ["350 zł", "750 zł", "30-60 min"],
    speakerBottom: ["-", "350 zł", "30-60 min"],
    buttons: ["350 zł", "500 zł", "30-60 min"],
    housing: ["350 zł", "750 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 15",
    generation: "iPhone 15",
    variantLabel: "Standardowy",
    screen: ["700 zł OLED", "1300 zł", "30-60 min"],
    battery: ["250 zł", "500 zł", "30-60 min"],
    backGlass: ["-", "850 zł", "2-3 dni robocze"],
    frontCamera: ["-", "400 zł", "30-60 min"],
    charging: ["brak", "650 zł", "30-60 min"],
    mic: ["brak", "650 zł", "30-60 min"],
    speakerTop: ["350 zł", "750 zł", "30-60 min"],
    speakerBottom: ["-", "350 zł", "30-60 min"],
    buttons: ["350 zł", "500 zł", "30-60 min"],
    housing: ["350 zł", "750 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 14 Pro Max",
    generation: "iPhone 14",
    variantLabel: "Pro Max",
    screen: ["1250 zł OLED", "1850 zł", "30-60 min"],
    battery: ["230 zł", "450 zł", "30-60 min"],
    backGlass: ["-", "600 zł", "2-3 dni robocze"],
    rearCamera: ["-", "550 zł", "30-60 min"],
    frontCamera: ["-", "350 zł", "30-60 min"],
    charging: ["brak", "600 zł", "30-60 min"],
    mic: ["brak", "600 zł", "30-60 min"],
    speakerTop: ["300 zł", "650 zł", "30-60 min"],
    speakerBottom: ["-", "300 zł", "30-60 min"],
    buttons: ["300 zł", "400 zł", "30-60 min"],
    housing: ["400-500 zł", "650 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 14 Pro",
    generation: "iPhone 14",
    variantLabel: "Pro",
    screen: ["1200 zł OLED", "1800 zł", "30-60 min"],
    battery: ["230 zł", "450 zł", "30-60 min"],
    backGlass: ["-", "600 zł", "2-3 dni robocze"],
    rearCamera: ["-", "550 zł", "30-60 min"],
    frontCamera: ["-", "350 zł", "30-60 min"],
    charging: ["brak", "600 zł", "30-60 min"],
    mic: ["brak", "600 zł", "30-60 min"],
    speakerTop: ["300 zł", "650 zł", "30-60 min"],
    speakerBottom: ["-", "300 zł", "30-60 min"],
    buttons: ["300 zł", "400 zł", "30-60 min"],
    housing: ["400-500 zł", "650 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 14 Plus",
    generation: "iPhone 14",
    variantLabel: "Plus",
    screen: ["600 zł", "1250 zł", "30-60 min"],
    battery: ["230 zł", "450 zł", "30-60 min"],
    backGlass: ["-", "600 zł", "2-3 dni robocze"],
    rearCamera: ["-", "500 zł", "30-60 min"],
    frontCamera: ["-", "350 zł", "30-60 min"],
    charging: ["brak", "600 zł", "30-60 min"],
    mic: ["brak", "600 zł", "30-60 min"],
    speakerTop: ["300 zł", "650 zł", "30-60 min"],
    speakerBottom: ["-", "300 zł", "30-60 min"],
    buttons: ["300 zł", "400 zł", "30-60 min"],
    housing: ["400-500 zł", "650 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 14",
    generation: "iPhone 14",
    variantLabel: "Standardowy",
    screen: ["550 zł OLED", "1200 zł", "30-60 min"],
    battery: ["230 zł", "450 zł", "30-60 min"],
    backGlass: ["-", "600 zł", "2-3 dni robocze"],
    rearCamera: ["-", "500 zł", "30-60 min"],
    frontCamera: ["-", "350 zł", "30-60 min"],
    charging: ["brak", "600 zł", "30-60 min"],
    mic: ["brak", "600 zł", "30-60 min"],
    speakerTop: ["300 zł", "650 zł", "30-60 min"],
    speakerBottom: ["-", "300 zł", "30-60 min"],
    buttons: ["300 zł", "400 zł", "30-60 min"],
    housing: ["400-500 zł", "650 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 13 Pro Max",
    generation: "iPhone 13",
    variantLabel: "Pro Max",
    screen: ["900 zł OLED", "1500 zł", "30-60 min"],
    battery: ["220 zł", "450 zł", "30-60 min"],
    backGlass: ["-", "400 zł", "2-3 dni robocze"],
    rearCamera: ["-", "450 zł", "30-60 min"],
    frontCamera: ["-", "300 zł", "30-60 min"],
    charging: ["brak", "500 zł", "30-60 min"],
    mic: ["brak", "500 zł", "30-60 min"],
    speakerTop: ["250 zł", "550 zł", "30-60 min"],
    speakerBottom: ["-", "250 zł", "30-60 min"],
    buttons: ["250 zł", "350 zł", "30-60 min"],
    housing: ["300-350 zł", "450 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 13 Pro",
    generation: "iPhone 13",
    variantLabel: "Pro",
    screen: ["850 zł OLED", "1400 zł", "30-60 min"],
    battery: ["220 zł", "450 zł", "30-60 min"],
    backGlass: ["-", "400 zł", "2-3 dni robocze"],
    rearCamera: ["-", "450 zł", "30-60 min"],
    frontCamera: ["-", "300 zł", "30-60 min"],
    charging: ["brak", "500 zł", "30-60 min"],
    mic: ["brak", "500 zł", "30-60 min"],
    speakerTop: ["250 zł", "550 zł", "30-60 min"],
    speakerBottom: ["-", "250 zł", "30-60 min"],
    buttons: ["250 zł", "350 zł", "30-60 min"],
    housing: ["300-350 zł", "450 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 13 / 13 mini",
    generation: "iPhone 13",
    variantLabel: "Standardowy / mini",
    screen: ["450 zł OLED", "990 zł", "30-60 min"],
    battery: ["220 zł", "450 zł", "30-60 min"],
    backGlass: ["-", "400 zł", "2-3 dni robocze"],
    rearCamera: ["-", "350 zł", "30-60 min"],
    frontCamera: ["-", "300 zł", "30-60 min"],
    charging: ["brak", "500 zł", "30-60 min"],
    mic: ["brak", "500 zł", "30-60 min"],
    speakerTop: ["250 zł", "550 zł", "30-60 min"],
    speakerBottom: ["-", "250 zł", "30-60 min"],
    buttons: ["250 zł", "350 zł", "30-60 min"],
    housing: ["300-350 zł", "450 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 12 Pro Max",
    generation: "iPhone 12",
    variantLabel: "Pro Max",
    screen: ["850 zł OLED", "1050 zł", "30-60 min"],
    battery: ["210 zł", "390 zł", "30-60 min"],
    backGlass: ["-", "350 zł", "2-3 dni robocze"],
    rearCamera: ["-", "500 zł", "30-60 min"],
    frontCamera: ["-", "250 zł", "30-60 min"],
    charging: ["brak", "400 zł", "30-60 min"],
    mic: ["brak", "400 zł", "30-60 min"],
    speakerTop: ["200 zł", "450 zł", "30-60 min"],
    speakerBottom: ["-", "200 zł", "30-60 min"],
    buttons: ["250 zł", "300 zł", "30-60 min"],
    housing: ["220-250 zł", "400 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 12 / 12 Pro",
    generation: "iPhone 12",
    variantLabel: "Standardowy / Pro",
    screen: ["450 zł OLED", "790 zł", "30-60 min"],
    battery: ["210 zł", "390 zł", "30-60 min"],
    backGlass: ["-", "350 zł", "2-3 dni robocze"],
    rearCamera: ["350-500 zł", "500 zł", "30-60 min"],
    frontCamera: ["-", "250 zł", "30-60 min"],
    charging: ["brak", "400 zł", "30-60 min"],
    mic: ["brak", "400 zł", "30-60 min"],
    speakerTop: ["200 zł", "450 zł", "30-60 min"],
    speakerBottom: ["-", "200 zł", "30-60 min"],
    buttons: ["250 zł", "300 zł", "30-60 min"],
    housing: ["220-250 zł", "400 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 12 mini",
    generation: "iPhone 12",
    variantLabel: "mini",
    screen: ["490 zł OLED", "790 zł", "30-60 min"],
    battery: ["210 zł", "390 zł", "30-60 min"],
    backGlass: ["-", "350 zł", "2-3 dni robocze"],
    rearCamera: ["-", "350 zł", "30-60 min"],
    frontCamera: ["-", "250 zł", "30-60 min"],
    charging: ["brak", "400 zł", "30-60 min"],
    mic: ["brak", "400 zł", "30-60 min"],
    speakerTop: ["200 zł", "450 zł", "30-60 min"],
    speakerBottom: ["-", "200 zł", "30-60 min"],
    buttons: ["250 zł", "300 zł", "30-60 min"],
    housing: ["220-250 zł", "400 zł", "1 dzień roboczy"]
  },
  {
    model: "iPhone 11 Pro Max",
    generation: "iPhone 11",
    variantLabel: "Pro Max",
    screen: ["450 zł OLED", "790 zł", "30-60 min"],
    battery: ["200 zł", "350 zł", "15-30 min"],
    backGlass: ["-", "300 zł", "1-2 dni robocze"],
    rearCamera: ["-", "450 zł", "30-60 min"],
    frontCamera: ["-", "200 zł", "30-60 min"],
    charging: ["300 zł", "300 zł", "30-60 min"],
    mic: ["300 zł", "400 zł", "30-60 min"],
    speakerTop: ["150 zł", "450 zł", "30-60 min"],
    speakerBottom: ["-", "180 zł", "30-60 min"],
    buttons: ["200 zł", "300 zł", "30-60 min"],
    housing: ["220-250 zł", "300 zł", "50-90 min"]
  },
  {
    model: "iPhone 11 Pro",
    generation: "iPhone 11",
    variantLabel: "Pro",
    screen: ["400 zł OLED", "750 zł", "30-60 min"],
    battery: ["200 zł", "350 zł", "15-30 min"],
    backGlass: ["-", "300 zł", "1-2 dni robocze"],
    rearCamera: ["-", "450 zł", "30-60 min"],
    frontCamera: ["-", "200 zł", "30-60 min"],
    charging: ["250 zł", "250 zł", "30-60 min"],
    mic: ["250 zł", "350 zł", "30-60 min"],
    speakerTop: ["150 zł", "450 zł", "30-60 min"],
    speakerBottom: ["-", "180 zł", "30-60 min"],
    buttons: ["200 zł", "300 zł", "30-60 min"],
    housing: ["220-250 zł", "300 zł", "50-90 min"]
  },
  {
    model: "iPhone 11",
    generation: "iPhone 11",
    variantLabel: "Standardowy",
    screen: ["390 zł", "590 zł", "30-60 min"],
    battery: ["190 zł", "350 zł", "15-30 min"],
    backGlass: ["-", "300 zł", "1-2 dni robocze"],
    rearCamera: ["-", "350 zł", "30-60 min"],
    frontCamera: ["-", "200 zł", "30-60 min"],
    charging: ["200 zł", "250 zł", "30-60 min"],
    mic: ["250 zł", "350 zł", "30-60 min"],
    speakerTop: ["150 zł", "450 zł", "30-60 min"],
    speakerBottom: ["-", "180 zł", "30-60 min"],
    buttons: ["200 zł", "300 zł", "30-60 min"],
    housing: ["200-250 zł", "300 zł", "50-90 min"]
  },
  {
    model: "iPhone XS Max",
    generation: "iPhone X / XS / XR",
    variantLabel: "XS Max",
    screen: ["320 zł OLED", "490 zł", "30-60 min"],
    battery: ["170 zł", "350 zł", "15-30 min"],
    backGlass: ["-", "250 zł", "1-2 dni robocze"],
    rearCamera: ["-", "300 zł", "15-30 min"],
    frontCamera: ["-", "180 zł", "15-30 min"],
    charging: ["150 zł", "200 zł", "15-30 min"],
    mic: ["250 zł", "300 zł", "15-30 min"],
    speakerTop: ["150 zł", "400 zł", "15-30 min"],
    speakerBottom: ["-", "160 zł", "15-30 min"],
    buttons: ["150 zł", "200 zł", "15-30 min"],
    housing: ["160-200 zł", "300 zł", "50-90 min"]
  },
  {
    model: "iPhone X / XS",
    generation: "iPhone X / XS / XR",
    variantLabel: "X / XS",
    screen: ["320 zł OLED", "490 zł", "30-60 min"],
    battery: ["170 zł", "250-350 zł", "15-30 min"],
    backGlass: ["-", "250 zł", "1-2 dni robocze"],
    rearCamera: ["-", "300 zł", "15-30 min"],
    frontCamera: ["-", "180 zł", "15-30 min"],
    charging: ["150 zł", "200 zł", "15-30 min"],
    mic: ["200 zł", "250 zł", "15-30 min"],
    speakerTop: ["150 zł", "400 zł", "15-30 min"],
    speakerBottom: ["-", "160 zł", "15-30 min"],
    buttons: ["150 zł", "200 zł", "15-30 min"],
    housing: ["160-200 zł", "280 zł", "50-90 min"]
  },
  {
    model: "iPhone XR",
    generation: "iPhone X / XS / XR",
    variantLabel: "XR",
    screen: ["290 zł", "450 zł", "30-60 min"],
    battery: ["170 zł", "350 zł", "15-30 min"],
    backGlass: ["-", "250 zł", "1-2 dni robocze"],
    rearCamera: ["-", "300 zł", "15-30 min"],
    frontCamera: ["-", "180 zł", "15-30 min"],
    charging: ["150 zł", "200 zł", "15-30 min"],
    mic: ["200 zł", "250 zł", "15-30 min"],
    speakerTop: ["150 zł", "400 zł", "15-30 min"],
    speakerBottom: ["-", "160 zł", "15-30 min"],
    buttons: ["150 zł", "200 zł", "15-30 min"],
    housing: ["160-200 zł", "280 zł", "50-90 min"]
  },
  {
    model: "iPhone 8 / SE 2020",
    generation: "iPhone 8 / SE",
    variantLabel: "8 / SE 2020",
    screen: ["180 zł", "280 zł", "15-30 min"],
    battery: ["120 zł", "200-350 zł", "15-30 min"],
    backGlass: ["-", "200 zł", "1-2 dni robocze"],
    rearCamera: ["-", "250 zł", "15-30 min"],
    frontCamera: ["-", "150 zł", "15-30 min"],
    charging: ["120 zł", "190 zł", "15-30 min"],
    mic: ["120 zł", "190 zł", "15-30 min"],
    speakerTop: ["100 zł", "140 zł", "15-30 min"],
    speakerBottom: ["-", "150 zł", "15-30 min"],
    buttons: ["140 zł", "200 zł", "30-50 min"],
    home: ["-", "150 zł", "15-30 min"],
    sim: ["170 zł", "180 zł", "15-30 min"],
    housing: ["130-160 zł", "250 zł", "50-90 min"],
    sensor: ["-", "180 zł", "15-30 min"]
  },
  {
    model: "iPhone 8 Plus",
    generation: "iPhone 8 / SE",
    variantLabel: "8 Plus",
    screen: ["180 zł", "280 zł", "15-30 min"],
    battery: ["120 zł", "200 zł", "15-30 min"],
    backGlass: ["-", "200 zł", "1-2 dni robocze"],
    rearCamera: ["-", "250 zł", "15-30 min"],
    frontCamera: ["-", "150 zł", "15-30 min"],
    charging: ["120 zł", "190 zł", "15-30 min"],
    mic: ["120 zł", "190 zł", "15-30 min"],
    speakerTop: ["100 zł", "140 zł", "15-30 min"],
    speakerBottom: ["-", "150 zł", "15-30 min"],
    buttons: ["140 zł", "200 zł", "30-50 min"],
    home: ["-", "150 zł", "15-30 min"],
    sim: ["170 zł", "180 zł", "15-30 min"],
    housing: ["130-160 zł", "250 zł", "50-90 min"],
    sensor: ["-", "180 zł", "15-30 min"]
  },
  {
    model: "iPhone 7 Plus",
    generation: "iPhone 7",
    variantLabel: "Plus",
    screen: ["160 zł", "220 zł", "15-30 min"],
    battery: ["120 zł", "200 zł", "15-30 min"],
    rearCamera: ["-", "180 zł", "15-30 min"],
    frontCamera: ["-", "100 zł", "15-30 min"],
    charging: ["100 zł", "150 zł", "15-30 min"],
    mic: ["100 zł", "150 zł", "15-30 min"],
    speakerTop: ["100 zł", "140 zł", "15-30 min"],
    speakerBottom: ["-", "100 zł", "15-30 min"],
    buttons: ["120 zł", "160 zł", "30-50 min"],
    home: ["-", "120 zł", "15-30 min"],
    sim: ["140 zł", "150 zł", "15-30 min"],
    housing: ["120-150 zł", "200 zł", "50-90 min"],
    sensor: ["-", "140 zł", "15-30 min"]
  },
  {
    model: "iPhone 7",
    generation: "iPhone 7",
    variantLabel: "Standardowy",
    screen: ["160 zł", "220 zł", "15-30 min"],
    battery: ["120 zł", "200 zł", "15-30 min"],
    rearCamera: ["-", "150 zł", "15-30 min"],
    frontCamera: ["-", "100 zł", "15-30 min"],
    charging: ["100 zł", "150 zł", "15-30 min"],
    mic: ["100 zł", "140 zł", "15-30 min"],
    speakerTop: ["100 zł", "140 zł", "15-30 min"],
    speakerBottom: ["-", "100 zł", "15-30 min"],
    buttons: ["120 zł", "160 zł", "30-50 min"],
    home: ["-", "120 zł", "15-30 min"],
    sim: ["140 zł", "150 zł", "15-30 min"],
    housing: ["120-150 zł", "200 zł", "50-90 min"],
    sensor: ["-", "140 zł", "15-30 min"]
  },
  {
    model: "iPhone 6 / 6s",
    generation: "iPhone 6 / 6s",
    variantLabel: "Standardowy",
    screen: ["140 zł", "230 zł", "15-30 min"],
    battery: ["110 zł", "200 zł", "15-30 min"],
    rearCamera: ["-", "100 zł", "15-30 min"],
    frontCamera: ["-", "100 zł", "15-30 min"],
    charging: ["90 zł", "100 zł", "15-30 min"],
    mic: ["90 zł", "100 zł", "15-30 min"],
    speakerTop: ["90 zł", "100 zł", "15-30 min"],
    speakerBottom: ["-", "100 zł", "15-30 min"],
    buttons: ["90 zł", "120 zł", "30-50 min"],
    home: ["-", "100 zł", "15-30 min"],
    sim: ["100 zł", "120 zł", "15-30 min"],
    housing: ["60-90 zł", "150 zł", "50-90 min"],
    sensor: ["-", "100 zł", "15-30 min"]
  },
  {
    model: "iPhone 6 Plus / 6s Plus",
    generation: "iPhone 6 / 6s",
    variantLabel: "Plus",
    screen: ["140 zł", "230 zł", "15-30 min"],
    battery: ["110 zł", "200 zł", "15-30 min"],
    rearCamera: ["-", "100 zł", "15-30 min"],
    frontCamera: ["-", "100 zł", "15-30 min"],
    charging: ["90 zł", "250 zł", "15-30 min"],
    mic: ["90 zł", "250 zł", "15-30 min"],
    speakerTop: ["90 zł", "100 zł", "15-30 min"],
    speakerBottom: ["-", "100 zł", "15-30 min"],
    buttons: ["90 zł", "120 zł", "30-50 min"],
    home: ["-", "100 zł", "15-30 min"],
    sim: ["200 zł", "200 zł", "15-30 min"],
    housing: ["60-90 zł", "150 zł", "50-90 min"],
    sensor: ["-", "200 zł", "15-30 min"]
  },
  {
    model: "iPhone 5 / 5s / SE",
    generation: "iPhone 5 / SE",
    variantLabel: "Standardowy",
    screen: ["130 zł", "200 zł", "15-30 min"],
    battery: ["100 zł", "150 zł", "15-30 min"],
    rearCamera: ["-", "90 zł", "15-30 min"],
    frontCamera: ["-", "80 zł", "15-30 min"],
    charging: ["80 zł", "90 zł", "15-30 min"],
    mic: ["80 zł", "90 zł", "15-30 min"],
    speakerTop: ["80 zł", "90 zł", "15-30 min"],
    speakerBottom: ["-", "80 zł", "15-30 min"],
    buttons: ["80 zł", "100 zł", "30-50 min"],
    home: ["-", "80 zł", "15-30 min"],
    sim: ["80 zł", "100 zł", "15-30 min"],
    housing: ["50-80 zł", "100 zł", "50-90 min"],
    sensor: ["-", "80 zł", "15-30 min"]
  },
  {
    model: "iPhone 4s",
    generation: "iPhone 4s",
    variantLabel: "Standardowy",
    screen: ["100 zł", "brak", "15-30 min"],
    battery: ["100 zł", "brak", "15-30 min"]
  }
];

const POPULAR_MODELS = ["iPhone 17 Pro Max", "iPhone 17", "iPhone 16", "iPhone 15 Pro Max", "iPhone 14", "iPhone 13 / 13 mini"];

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
      selectModel(item, { skipScroll: true });
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
    button.addEventListener("click", () => selectModel(item));
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
    button.addEventListener("click", () => selectModel(item));
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

  SERVICES.forEach(([key, label]) => {
    const values = item[key] || NA;
    const row = document.createElement("tr");
    const cells = [label, values[0], values[1], values[2]];

    cells.forEach((value) => {
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
  pricePanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

if (contactForm && formNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent = "Dziękujemy. Aby najszybciej potwierdzić termin mobilnego serwisu, zadzwoń: 570 222 345.";
  });
}

window.dataLayer = window.dataLayer || [];

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target.closest("[data-track]") : null;

  if (!target) {
    return;
  }

  window.dataLayer.push({
    event: "cta_clicked",
    cta_id: target.getAttribute("data-track"),
    cta_text: target.textContent.trim(),
    page_location: window.location.href
  });
});
