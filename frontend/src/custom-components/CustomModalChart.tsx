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

export function CustomModalChart({isFullscreen, onOpenChange, children}: CustomModalChartProps) {
    if (!isFullscreen) {
        return <>{children}</>;
    }

    return (
        <Dialog open={isFullscreen} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "flex flex-col w-[95vw] h-[95vh] max-w-[95vw] sm:max-w-[95vw] overflow-hidden rounded-3xl! p-0"
                )}
                showCloseButton={false}
            >
                <div className="flex-1 min-h-0 overflow-auto p-0">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
