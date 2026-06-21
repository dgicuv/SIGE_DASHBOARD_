import {Item} from "@/components/ui/item";
import * as React from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Button} from "@/components/ui/button.tsx";
import {InfoIcon} from "lucide-react";

type ChartItemProps = {
    footer: string
    children: React.ReactNode
    action: React.ReactNode
    filter?: React.ReactNode

};

export function CustomChartContainer({action, filter, children, footer}: ChartItemProps) {
    return (
        <Item variant="default" className="flex flex-col bg-accent p-0 gap-0 h-140">

            <div className="w-full flex h-[48px] gap-2 p-2  items-center">
                <div className={"flex grow gap-1"}>
                    {filter && <>{filter}</>}

                </div>
                <div className={"flex "}>
                    {action && <>{action}</>}
                </div>
            </div>

            <div className={"w-full grow min-h-0 flex items-center justify-center"}>
                {children}
            </div>

            <div className="w-full flex h-[32px] gap-8 p-1  items-center justify-end ">
                {footer &&
                    <Tooltip>
                        <TooltipTrigger render={<Button variant="ghost"
                        ><InfoIcon className={"text-gray-400"}/></Button>}></TooltipTrigger>
                        <TooltipContent>
                            <p>{footer}</p>
                        </TooltipContent>
                    </Tooltip>
                }
            </div>
        </Item>
    );
}
