import { Card, CardContent } from "@/components/ui/card";
import { IFamilyCategories } from "@/lib/interfaces";
import Link from "next/link";

interface ProductCategoriesProps {
  data?: IFamilyCategories[];
}

const categoryImages: Record<string, string> = {
  DONUT: "/categories/donut.jpg",
  ΑΡΤΟΠΟΙΗΜΑΤΑ: "/categories/artos.jpg",
  ΣΦΟΛΙΑΤA: "/categories/sfoliata.jpg",
  ΑΛΛΟ: "/categories/allo.jpg",
};

export default function ProductCategories({ data }: ProductCategoriesProps) {
  return (
    <section className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em]"></div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Επιλέξτε οικογένεια προϊόντων
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Οι διαθέσιμες οικογένειες προϊόντων από το σύστημά σας.
        </p>
      </div>

      {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data?.map((item) => (
                    <Link key={item.FAMILY} href={`/products/${item.FAMILY}`}>
                        <CategoryCard family={item.FAMILY} />
                    </Link>
                ))}
            </div> */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((item, index) => (
          <Link href={`/products/${item.FAMILY}`} key={index}>
            <CategoryCard key={item.FAMILY} family={item.FAMILY} />
          </Link>
        ))}
      </div>
    </section>
  );
}

interface CategoryCardProps {
  family: string;
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
  );
}

// const initial = family.charAt(0)?.toUpperCase() ?? "?";

//   return (
//     <Card className="group relative overflow-hidden border border-zinc-200 bg-white/80 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/80">
//       {/* Decorative gradient blob */}
//       <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />

//       <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-4">
//         <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-100">
//           <span className="text-lg font-semibold">{initial}</span>
//         </div>
//         <div className="space-y-1">
//           <CardTitle className="text-base font-semibold tracking-tight">
//             {family}
//           </CardTitle>
//           <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
//             Οικογένεια προϊόντων
//           </CardDescription>
//         </div>
//       </CardHeader>

//       <CardContent className="flex flex-col gap-3 pb-4 pt-0 text-xs text-zinc-500 dark:text-zinc-400">
//         <div className="flex items-center gap-2 text-[11px]">
//           <Grid3X3 className="h-3 w-3" />
//           <span>
//             Ομαδοποίηση ειδών με βάση την οικογένεια. Ιδανικό για αναζήτηση,
//             φίλτρα και αναφορές.
//           </span>
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="inline-flex items-center gap-1 text-[11px]">
//             <Package className="h-3 w-3" />
//             <span>Λεπτομέρειες προϊόντων θα προστεθούν αργότερα.</span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );

// }
