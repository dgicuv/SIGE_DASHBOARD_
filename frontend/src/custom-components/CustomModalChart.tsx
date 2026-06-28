import type {ReactNode} from "react";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {cn} from "@/lib/utils.ts";

type CustomModalChartProps = {
    isFullscreen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    selectedRegion?: string;
    selectedDependencia?: string;
    children: ReactNode;
};

export function CustomModalChart({isFullscreen, onOpenChange, title, selectedRegion, selectedDependencia, children}: CustomModalChartProps) {
    if (!isFullscreen) {
        return <>{children}</>;
    }

    const subtitle = [selectedRegion, selectedDependencia].filter(Boolean).join(" · ");

    return (
        <Dialog open={isFullscreen} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "flex flex-col w-[95vw] h-[95vh] max-w-[95vw] sm:max-w-[95vw] overflow-hidden rounded-3xl! p-0"
                )}
                showCloseButton={false}
            >
                {subtitle && (
                    <div className="flex flex-col px-6 pt-4 pb-2 border-b shrink-0">
                        <span className="text-sm font-semibold">{title}</span>
                        <span className="text-xs text-muted-foreground">{subtitle}</span>
                    </div>
                )}
                <div className="flex-1 min-h-0 overflow-auto p-0">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
