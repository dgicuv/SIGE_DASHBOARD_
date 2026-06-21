import {useEffect, useRef} from "react";
import type {EChartsOption} from "echarts";
import * as echarts from "echarts";

export function useEChart(option: EChartsOption) {
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

    function downloadImage(filename: string, exportExtra?: Partial<EChartsOption>) {
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
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        const timestamp = `${pad(now.getDate())} ${meses[now.getMonth()]} ${now.getFullYear()} - ${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}h`;
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}_${timestamp}.png`;
        a.click();
    }

    return {containerRef, downloadImage};
}
