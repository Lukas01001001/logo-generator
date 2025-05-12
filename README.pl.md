# 📘 Logo Generator

## 🧭 Spis treści

1. [Opis projektu](#opis-projektu)
2. [Technologie i biblioteki](#technologie-i-biblioteki)
3. [Wymagania systemowe](#wymagania-systemowe)
4. [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
5. [Struktura projektu](#struktura-projektu)
6. [Baza danych i Prisma](#baza-danych-i-prisma)
7. [Seedowanie danych](#seedowanie-danych)
8. [Funkcjonalności](#funkcjonalności)
9. [Obsługa logo (grafiki)](#obsługa-logo-grafiki)
10. [Responsywny interfejs i UX](#responsywny-interfejs-i-ux)
11. [TODO / Roadmap](#todo--roadmap)

## 📝 Opis projektu

Logo Generator to aplikacja webowa umożliwiająca tworzenie, filtrowanie i zarządzanie klientami oraz generowanie wizualnych reprezentacji logo. Projekt wykorzystuje infinite scroll, SSR/CSR mieszany oraz przemyślaną architekturę frontendu.

## ⚙️ Technologie i biblioteki

- **Next.js** 15+
- **React** 19
- **TypeScript**
- **TailwindCSS** 4
- **Prisma** (ORM + PostgreSQL)
- **ts-node** (do seedowania)
- **html-to-image** (generacja grafik)
- **lodash.debounce** (optymalizacja wyszukiwania)
- **react-rnd** (manipulacja pozycją i rozmiarem logo)

## 💻 Wymagania systemowe

- Node.js `>=18.x` (zalecane 20+)
- PostgreSQL (lokalny lub zdalny)
- pnpm / npm / yarn
- system z obsługą CLI (bash, zsh, etc.)

## 🚀 Instalacja i uruchomienie

```bash
git clone https://github.com/nazwa-uzytkownika/logo-generator.git
cd logo-generator
npm install
```

Skonfiguruj `.env`:

```
DATABASE_URL=postgresql://...
```

Utwórz bazę danych i uruchom migrację:

```bash
npx prisma migrate dev --name init
```

Uruchom projekt:

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce, aby zobaczyć wynik.

```
## Dowiedz się więcej

Aby dowiedzieć się więcej o Next.js, zapoznaj się z następującymi zasobami:

- [Dokumentacja Next.js](https://nextjs.org/docs) - poznaj funkcje i interfejs API Next.js.
- [Learn Next.js](https://nextjs.org/learn) - interaktywny samouczek Next.js.

Możesz sprawdzić [repozytorium Next.js GitHub](https://github.com/vercel/next.js) - Twoja opinia i wkład są mile widziane!
```

## 📁 Struktura projektu

```
.
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   ├── components/
│   │   ├── ClientCard.tsx
│   │   ├── ClientList.tsx
│   │   └── ui/
│   └── lib/
│       └── db.ts
├── public/
│   └── Tux_Default.png
├── .env
└── package.json
```

## 🗃️ Baza danych i Prisma

```prisma
model Client {
  id        Int     @id @default(autoincrement())
  name      String
  address   String?
  industry  String?
  logoBlob  Bytes?
  logoType  String?
  createdAt DateTime @default(now())
}
```

## 🌱 Seedowanie danych

```bash
npm run seed
```

Domyślny plik logo (`Tux_Default.png`) jest automatycznie dodawany do każdego klienta.

## 🔍 Funkcjonalności

- Infinite scroll (IntersectionObserver)
- Filtrowanie po nazwie i branży
- SSR i CSR połączone logicznie (np. lista branż z SSR)
- Zaznaczanie wielu klientów i przekierowanie do generacji

## 🖼️ Obsługa logo (grafiki)

Logo przechowywane jest jako `logoBlob` (`Bytes`) i `logoType`. W przypadku braku pliku logo, serwer dodaje domyślny plik PNG. W interfejsie frontendowym, logo jest dekodowane do `data:image/png;base64,...`.

## 📱 Responsywny interfejs i UX

- Przycisk "Generate Logo Forest" umieszczony obok "Reset Checkbox" na desktopie
- Na mobile pod tytułem
- Komponenty zoptymalizowane pod Tailwind i skalowanie
- Płynne UX dzięki debounced input i bez przeładowań

## 🧩 TODO / Roadmap

- [ ] Edycja klienta
- [ ] Import CSV / Excel
- [ ] Eksport logo jako ZIP
- [ ] Integracja z chmurą (np. Supabase storage)
