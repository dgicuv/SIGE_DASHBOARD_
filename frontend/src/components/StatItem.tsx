import type { ReactNode } from "react";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";

const fmt = new Intl.NumberFormat("es-MX");

type Props = {
    titulo: string;
    icon: ReactNode;
    description: number | string;
    className?: string;
};

export function StatItem({ titulo, icon, description, className }: Props) {
    const value = typeof description === "number" ? fmt.format(description) : description;

    return (
        <Item variant="default" className="bg-accent">
            <ItemMedia variant="icon" className={cn(className)}>
                {icon}
            </ItemMedia>
            <ItemContent>
                <ItemTitle className="line-clamp-1">{titulo}</ItemTitle>
            </ItemContent>
            <ItemContent className="flex-none text-center">
                <ItemDescription className="text-lg">{value}</ItemDescription>
            </ItemContent>
        </Item>
    );
}
