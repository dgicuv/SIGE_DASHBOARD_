import {useCallback, useEffect, useRef} from "react";
import type {EChartsOption} from "echarts";
import * as echarts from "echarts";
import {fileTimestamp} from "@/lib/utils";

export function useEChart(option: EChartsOption, exportExtra?: Partial<EChartsOption>) {
    const chartRef = useRef<echarts.ECharts | null>(null);
    const domRef = useRef<HTMLDivElement | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const optionRef = useRef(option);
    optionRef.current = option;
    const handleResize = useRef(() => {
        chartRef.current?.resize();
    });

    // ResizeObserver en vez de (solo) window.resize: el contenedor puede cambiar de
    // tamaño sin que cambie el viewport (grids responsivos, sidebar, modal de pantalla
    // completa, fuentes que terminan de cargar), y en esos casos "resize" del window
    // nunca se dispara.
    const observeContainer = (node: HTMLDivElement) => {
        resizeObserverRef.current?.disconnect();
        const observer = new ResizeObserver(() => handleResize.current());
        observer.observe(node);
        resizeObserverRef.current = observer;
    };

    // Callback ref (en vez de useRef simple): cuando el contenedor se mueve entre dos
    // árboles distintos (ej. de la card al modal de pantalla completa), React desmonta y
    // remonta el div, por lo que hay que reinicializar el chart en el nuevo nodo.
    const containerRef = useCallback((node: HTMLDivElement | null) => {
        if (chartRef.current) {
            resizeObserverRef.current?.disconnect();
            resizeObserverRef.current = null;
            chartRef.current.dispose();
            chartRef.current = null;
        }
        domRef.current = node;
        if (node && node.clientWidth) {
            chartRef.current = echarts.init(node);
            observeContainer(node);
            chartRef.current.setOption({...optionRef.current, animation: false}, {notMerge: false});
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            resizeObserverRef.current?.disconnect();
            resizeObserverRef.current = null;
            chartRef.current?.dispose();
            chartRef.current = null;
        };
    }, []);

    // Init lazily (only when container has real dimensions) + apply option
    useEffect(() => {
        const container = domRef.current;
        if (!container || !container.clientWidth) return;

        if (!chartRef.current) {
            chartRef.current = echarts.init(container);
            observeContainer(container);
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
