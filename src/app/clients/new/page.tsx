import ClientForm from "@/components/ClientForm";

export default function NewClientPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add new client</h1>
      <ClientForm />
    </div>
  );
}
