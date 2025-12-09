import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IFamilyCategories } from "@/lib/interfaces"
import Link from "next/link"


interface ProductCategoriesProps {
    data?: IFamilyCategories[]
}

const categoryImages: Record<string, string> = {
    "DONUT": "/categories/donut.jpg",
    "ΑΡΤΟΠΟΙΗΜΑΤΑ": "/categories/artos.jpg",
    "ΣΦΟΛΙΑΤA": "/categories/sfoliata.jpg",
    "ΑΛΛΟ": "/categories/allo.jpg",
};

export default function ProductCategories({ data }: ProductCategoriesProps) {
    return (
        <section className="w-full max-w-5xl mx-auto space-y-6">

            <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em]">
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Επιλέξτε οικογένεια προϊόντων
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Οι διαθέσιμες οικογένειες προϊόντων από το σύστημά σας.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data?.map((item) => (
                    <Link key={item.FAMILY} href={`/products/${item.FAMILY}`}>
                        <CategoryCard family={item.FAMILY} />
                    </Link>
                ))}
            </div>

        </section>
    )
}

interface CategoryCardProps {
    family: string
}

function CategoryCard({ family }: CategoryCardProps) {
    const key = family.trim();
    const imageSrc = categoryImages[key] ?? "/categories/default.jpg"; 

    return (
        <div>
            <Card className="group overflow-hidden border border-zinc-200 bg-brand-light shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80">

                <div className="flex justify-center p-4">
                    <img
                        src={imageSrc}
                        alt={family}
                        className="h-25 w-25 rounded-full object-cover transition duration-300 group-hover:scale-105"

                    />
                </div>

                <CardContent className="p-3 text-center">
                    <h3 className="text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-200">
                        {family}
                    </h3>
                </CardContent>
            </Card>
        </div>
    )
}
