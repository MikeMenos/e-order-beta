import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "./spinner"

type LoadingProps = {
    label?: string
    fullPage?: boolean
}

export default function Loading({
    label = "Loading…",
    fullPage = false,
}: LoadingProps) {
    return (
        <div
            className={
                fullPage
                    ? "min-h-[60vh] flex items-center justify-center"
                    : "w-full"
            }
        >
            <Card className="border border-zinc-200/70 shadow-none rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center gap-4 px-8 py-10">
                    <Spinner size={36} />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {label}
                    </span>
                </CardContent>
            </Card>
        </div>
    )
}
