// src/app/api/industries/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const industries = await prisma.client.findMany({
    select: { industry: true },
    distinct: ["industry"],
    where: {
      industry: {
        not: null,
      },
    },
  });

  const uniqueIndustries = industries
    .map((item) => item.industry)
    .filter((i): i is string => !!i);

  return NextResponse.json({ industries: uniqueIndustries });
}

// src/app/api/industries/route.ts
/* import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const industries = await prisma.client.findMany({
    distinct: ["industry"],
    where: {
      industry: { not: null },
    },
    select: { industry: true },
  });

  const values = industries.map((i) => i.industry).filter(Boolean);

  return NextResponse.json(values);
}
 */
