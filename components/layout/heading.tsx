import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
}

export default function Heading({
    title,
    description,
    actions,
    className,
}: HeadingProps) {
    return (
        <div
            className={cn(
                "mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                className
            )}
        >
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {title}
                </h1>

                {description && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {description}
                    </p>
                )}
            </div>

            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}
