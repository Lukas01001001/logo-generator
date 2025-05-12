# 📘 Logo Generator

## 🧭 Inhaltsverzeichnis

1. [Projektbeschreibung](#projektbeschreibung)
2. [Technologien und Bibliotheken](#technologien-und-bibliotheken)
3. [Systemanforderungen](#systemanforderungen)
4. [Installation und Einrichtung](#installation-und-einrichtung)
5. [Projektstruktur](#projektstruktur)
6. [Datenbank und Prisma](#datenbank-und-prisma)
7. [Daten seeden](#daten-seeden)
8. [Funktionen](#funktionen)
9. [Logo-Verarbeitung](#logo-verarbeitung)
10. [Responsives Interface und UX](#responsives-interface-und-ux)
11. [TODO / Roadmap](#todo--roadmap)

## 📝 Projektbeschreibung

Logo Generator ist eine Webanwendung zur Erstellung, Filterung und Verwaltung von Kunden sowie zur Generierung visueller Logos. Das Projekt nutzt Infinite Scroll, eine Kombination aus SSR/CSR und eine durchdachte Frontend-Architektur.

## ⚙️ Technologien und Bibliotheken

- **Next.js** 15+
- **React** 19
- **TypeScript**
- **TailwindCSS** 4
- **Prisma** (ORM + PostgreSQL)
- **ts-node** (zum Seeden)
- **html-to-image** (Bildgenerierung)
- **lodash.debounce** (Suchoptimierung)
- **react-rnd** (Größe und Position von Logos anpassen)

## 💻 Systemanforderungen

- Node.js `>=18.x` (empfohlen: 20+)
- PostgreSQL (lokal oder remote)
- pnpm / npm / yarn
- CLI-Unterstützung (bash, zsh etc.)

## 🚀 Installation und Einrichtung

```bash
git clone https://github.com/dein-benutzername/logo-generator.git
cd logo-generator
npm install
```

SKonfiguriere deine `.env`-Datei:

```
DATABASE_URL=postgresql://...
```

Datenbank erstellen und Migration starten:

```bash
npx prisma migrate dev --name init
```

Entwicklungsserver starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser, um das Ergebnis zu sehen.

```
## Mehr erfahren

Weitere Informationen zu Next.js findest du hier:

- [Dokumentation Next.js](https://nextjs.org/docs) – Funktionen und API kennenlernen
- [Lernen Next.js](https://nextjs.org/learn) – Interaktives Tutorial

Siehe auch das [ Next.js GitHub](https://github.com/vercel/next.js) - Feedback und Beiträge sind willkommen!
```

## 📁 Projektstruktur

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

## 🗃️ Datenbank und Prisma

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

## 🌱 Daten seeden

```bash
npm run seed
```

Die Standard-Logo-Datei (`Tux_Default.png`) wird jedem neuen Client automatisch zugewiesen.

## 🔍 Funktionen

- Infinite scroll (IntersectionObserver)
- Filterung nach Name und Branche
- SSR + CSR logisch kombiniert (z. B. Branchenliste mit SSR)
- Mehrfachauswahl von Clients mit Weiterleitung zur Generierung

## 🖼️ Logo-Verarbeitung

Logos werden als `logoBlob` (`Bytes`) i `logoType`. in der Datenbank gespeichert.
Wenn kein Logo hochgeladen wird, wird automatisch ein Standardbild zugewiesen.
Im Frontend wird das Logo in `data:image/png;base64,...` dekodiert.

## 📱 Responsives Interface und UX

- „Generate Logo Forest“-Button neben „Reset Checkbox“ (Desktop)
- Auf mobilen Geräten unterhalb des Titels
- Komponenten für Tailwind-Skalierung optimiert
- Debounced Inputs sorgen für flüssiges UX ohne Neuladen

## 🧩 TODO / Roadmap

- [ ] Client bearbeiten
- [ ] Import aus CSV / Excel
- [ ] Export der Logos als ZIP
- [ ] Integration von Cloud-Storage (z. B. Supabase)
