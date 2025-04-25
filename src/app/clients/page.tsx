import ClientFilters from "@/components/ClientFilters";
import ClientList from "@/components/ClientList";
import { prisma } from "@/lib/db";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { name?: string; industry?: string };
}) {
  const name = searchParams.name || "";
  const industry = searchParams.industry || "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/clients?name=${name}&industry=${industry}`,
    { cache: "no-store" }
  );
  const data = await res.json();

  const industriesData = await prisma.client.findMany({
    select: { industry: true },
    distinct: ["industry"],
    where: { industry: { not: null } },
  });

  const industries = industriesData.map((item) => item.industry!) as string[];

  return (
    <>
      <ClientFilters availableIndustries={industries} />
      <ClientList clients={data} />
    </>
  );
}
