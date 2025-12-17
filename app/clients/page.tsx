import ClientsTable from "@/components/clients-table";

export default function ClientsPage() {
    return (
        <main className="mx-auto w-full max-w-6xl p-4 sm:p-6">
            <div className="mb-4">
                <h1 className="text-xl font-semibold">Πελάτες</h1>
                <p className="text-sm text-slate-600">
                    Λίστα πελατών και αναζήτηση με ΑΦΜ ή Όνομα.
                </p>
            </div>

            <ClientsTable />
        </main>
    );
}
