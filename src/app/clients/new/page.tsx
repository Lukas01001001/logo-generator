// src/app/clients/new/page.tsx

import ClientForm from "@/components/ClientForm";
import { prisma } from "@/lib/db";

export default async function NewClientPage() {
  const industries = await prisma.industry.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add new client</h1>
      <ClientForm availableIndustries={industries} />
    </div>
  );
}
