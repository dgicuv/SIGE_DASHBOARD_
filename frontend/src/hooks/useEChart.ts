import {useEffect, useRef} from "react";
import type {EChartsOption} from "echarts";
import * as echarts from "echarts";
import {fileTimestamp} from "@/lib/utils";

export function useEChart(option: EChartsOption, exportExtra?: Partial<EChartsOption>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<echarts.ECharts | null>(null);
    const handleResize = useRef(() => {
        chartRef.current?.resize();
    });

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.removeEventListener("resize", handleResize.current);
            chartRef.current?.dispose();
            chartRef.current = null;
        };
    }, []);

    // Init lazily (only when container has real dimensions) + apply option
    useEffect(() => {
        const container = containerRef.current;
        if (!container || !container.clientWidth) return;

        if (!chartRef.current) {
            chartRef.current = echarts.init(container);
            window.addEventListener("resize", handleResize.current);
        }

        chartRef.current.setOption({...option, animation: false}, {notMerge: false});
        chartRef.current.resize();
    }, [option]);

    function downloadImage(filename: string) {
        if (!chartRef.current) return;

        if (exportExtra) {
            chartRef.current.setOption(exportExtra, {notMerge: false});
        }

        const url = chartRef.current.getDataURL({
            type: "png",
            pixelRatio: 2,
            backgroundColor: "#fff",
        });

        if (exportExtra) {
            chartRef.current.setOption(option, {notMerge: true});
        }

        if (!url) return;
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}_${fileTimestamp()}.png`;
        a.click();
    }

    return {containerRef, downloadImage};
}
