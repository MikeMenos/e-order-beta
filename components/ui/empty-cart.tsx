import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EmptyCart() {
    return (
        <Card className="mx-auto max-w-md rounded-2xl border-dashed">
            <CardHeader className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                </div>

                <CardTitle>Το καλάθι σας είναι άδειο</CardTitle>
                <CardDescription>
                    Δεν υπάρχουν προϊόντα στο καλάθι σας.
                    Ξεκινήστε την περιήγησή για να προσθέσετε προϊόντα.
                </CardDescription>
            </CardHeader>

            <CardContent className="flex justify-center">
                <Button asChild className="rounded-xl">
                    <Link href="/">Επιστροφή στην αρχική</Link>
                </Button>
            </CardContent>
        </Card>
    )
}
