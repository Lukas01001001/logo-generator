// src/app/clients/[id]/edit/page.tsx

import { prisma } from "@/lib/db";
import ClientForm from "@/components/ClientForm";
import { redirect } from "next/navigation";

export default async function EditClientPage(props: {
  params: Promise<{ id: string }>;
}) {
  const industries = await prisma.industry.findMany({
    orderBy: { name: "asc" },
  });
  const { id } = await props.params;

  const client = await prisma.client.findUnique({
    where: { id: Number(id) },
    include: { industry: true }, // take industry
  });

  if (!client) {
    redirect("/clients");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit client</h1>
      <ClientForm client={client} isEdit availableIndustries={industries} />
    </div>
  );
}
