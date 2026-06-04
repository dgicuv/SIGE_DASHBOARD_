declare module "echarts" {
  export interface EChartsOption {
    [key: string]: unknown;
  }

  export interface ECharts {
    setOption(option: EChartsOption, opts?: { notMerge?: boolean }): void;
    resize(): void;
    dispose(): void;
    getDataURL(opts?: { type?: string; pixelRatio?: number; backgroundColor?: string }): string;
  }

  export function init(container: HTMLElement): ECharts;
}
