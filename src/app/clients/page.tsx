import ClientFilters from "@/components/ClientFilters";
import ClientList from "@/components/ClientList";
import { prisma } from "@/lib/db";

import { headers } from "next/headers";
import Link from "next/link";

export default async function ClientPage() {
  const headersList = headers();
  const url = (await headersList).get("x-url") || "";
  const fullUrl = new URL(url, process.env.NEXT_PUBLIC_BASE_URL);

  const name = fullUrl.searchParams.get("name") || "";
  const industry = fullUrl.searchParams.get("industry") || "";

  // export default async function ClientsPage({
  //   searchParams,
  // }: {
  //   searchParams: { name?: string; industry?: string };
  // }) {
  //const name = searchParams.name || "";
  //const industry = searchParams.industry || "";

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
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex flex-col md:flex-row md:items-center w-full gap-4">
          <ClientFilters availableIndustries={industries} />
        </div>

        <Link
          href="/clients/new"
          // className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded"
          // className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md text-sm"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-md whitespace-nowrap min-w-[150px] text-center"
        >
          Add new client
        </Link>
      </div>

      {/* CLIENT LIST */}
      <ClientList clients={data} />
    </div>
  );
}
