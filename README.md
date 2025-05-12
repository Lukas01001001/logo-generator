# 📘 Logo Generator

## 🧭 Table of Contents

1. [Project Description](#project-description)
2. [Technologies and Libraries](#technologies-and-libraries)
3. [System Requirements](#system-requirements)
4. [Installation and Setup](#installation-and-setup)
5. [Project Structure](#project-structure)
6. [Database and Prisma](#database-and-prisma)
7. [Seeding Data](#seeding-data)
8. [Features](#features)
9. [Logo Handling](#logo-handling)
10. [Responsive Interface and UX](#responsive-interface-and-ux)
11. [TODO / Roadmap](#todo--roadmap)

## 📝 Project Description

Logo Generator is a web application that allows you to create, filter, and manage clients, as well as generate visual logo representations. The project uses infinite scroll, a hybrid of SSR/CSR, and a well-thought-out frontend architecture.

## ⚙️ Technologies and Libraries

- **Next.js** 15+
- **React** 19
- **TypeScript**
- **TailwindCSS** 4
- **Prisma** (ORM + PostgreSQL)
- **ts-node** (for seeding)
- **html-to-image** (image generation)
- **lodash.debounce** (search input optimization)
- **react-rnd** (resizing and positioning logos)

## 💻 System Requirements

- Node.js `>=18.x` (20+ recommended)
- PostgreSQL (local or remote)
- pnpm / npm / yarn
- Command line interface (bash, zsh, etc.)

## 🚀 Installation and Setup

```bash
git clone https://github.com/your-username/logo-generator.git
cd logo-generator
npm install
```

Configure your `.env` file:

```
DATABASE_URL=postgresql://...
```

Create the database and run the initial migration:

```bash
npx prisma migrate dev --name init
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
```

## 📁 Project Structure

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

## 🗃️ Database and Prisma

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

## 🌱 Seeding Data

```bash
npm run seed
```

The default logo file (Tux_Default.png) is automatically assigned to each client.

## 🔍 Features

- Infinite scroll (via IntersectionObserver)
- Filtering by name and industry
- Logical SSR + CSR combination (e.g., SSR industry list)
- Select multiple clients and redirect to generation view

## 🖼️ Logo Handling

Each logo is stored in the database as a `logoBlob` (`Bytes`) and `logoType`.
If no file is uploaded, a default PNG is assigned by the backend.
In the frontend, logos are decoded into `data:image/png;base64,...` .

## 📱 Responsive Interface and UX

- "Generate Logo Forest" button placed next to "Reset Checkbox" on desktop
- On mobile, buttons are displayed below the title
- Components optimized for Tailwind scaling
- Smooth UX with debounced inputs and no reloads

## 🧩 TODO / Roadmap

- [ ] Edit client
- [ ] Import from CSV / Excel
- [ ] Export logos as ZIP
- [ ] Cloud storage integration (e.g., Supabase)
