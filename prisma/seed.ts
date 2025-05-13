// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  // Load a file from public/
  const logoPath = path.join(process.cwd(), "public/Tux_Default.png");
  const logoBuffer = await fs.readFile(logoPath);
  const logoType = "image/png";

  const addresses = [
    "StreetStreet",
    "ITStreet",
    "Designstreet",
    "Mediastreet",
    "Retailstreet",
    "Financestreet",
  ];
  const industries = ["Crypto", "IT", "Design", "Media", "Retail", "Finance"];
  const names = [
    "Acme Corp",
    "Bitzone",
    "Nextron",
    "Doggo Inc.",
    "MegaByte",
    "CryptoLand",
    "LambdaX",
    "PixelLogic",
    "GreenWorld",
    "OceanSoft",
  ];

  const total = 100; // 100 test clients

  for (let i = 0; i < total; i++) {
    const name = `${names[i % names.length]} ${i + 1}`;
    const address = addresses[i % addresses.length];
    const industry = industries[i % industries.length];

    await prisma.client.create({
      data: {
        name,
        address,
        industry,
        logoBlob: logoBuffer,
        logoType: logoType,
      },
    });
  }

  console.log(`${total} clients created. ✅ Seed completed!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
