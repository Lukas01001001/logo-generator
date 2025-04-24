import { prisma } from "@/lib/db";
import ClientList from "@/components/ClientList";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany();
  return <ClientList clients={clients} />;
}
