import { Card, CardContent } from "@/components/ui/card";
import { IFamilyCategories } from "@/lib/interfaces";
import Link from "next/link";
import Heading from "@/components/layout/heading";

interface ProductCategoriesProps {
  data?: IFamilyCategories[];
}

const categoryImages: Record<string, string> = {
  DONUT: "/categories/lixoudis.jpg",
  ΑΡΤΟΠΟΙΗΜΑΤΑ: "/categories/diaxeiros.jpg",
  ΣΦΟΛΙΑΤΑ: "/categories/diaxeiros.jpg",
  ΑΛΛΟ: "/categories/allo.jpg",
};

export default function ProductCategories({ data }: ProductCategoriesProps) {
  return (
    <>
      <Heading
        title="Επιλέξτε οικογένεια προϊόντων"
        description="Οι διαθέσιμες οικογένειες προϊόντων από το σύστημά σας."
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.map((item, index) => (
          <Link href={`/products/${item.FAMILY.trim()}`} key={index}>
            <CategoryCard key={item.FAMILY} family={item.FAMILY} />
          </Link>
        ))}
      </div>
    </>
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
      <Card
        className="
      group overflow-hidden
      border border-brand/20
      bg-brand/10
      shadow-sm backdrop-blur-sm
      transition
      hover:-translate-y-1 hover:border-brand/40 hover:shadow-md
      dark:border-brand/30
      dark:bg-brand/20
    "
      >
        <div className="flex justify-center p-4">
          <img
            src={imageSrc}
            alt={family}
            className="h-25 w-25 rounded-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <CardContent className="p-3 text-center">
          <h3 className="text-sm font-semibold tracking-tight text-brand dark:text-brand-light">
            {family}
          </h3>
        </CardContent>
      </Card>
    </div>

  );
}
