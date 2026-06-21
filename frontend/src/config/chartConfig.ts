export const chartConfig = {
  colors: [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#a0a7e6",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
  ],
} as const;

export const chartColorThemes = {
  default: chartConfig.colors,
  barman: chartConfig.colors,
  gruvboxDark: [
    "#fb4934", "#b8bb26", "#fabd2f", "#83a598", "#d3869b",
    "#8ec07c", "#fe8019", "#cc241d", "#98971a", "#689d6a",
  ],
  nord: [
    "#8fbcbb", "#88c0d0", "#81a1c1", "#5e81ac", "#bf616a",
    "#d08770", "#ebcb8b", "#a3be8c", "#b48ead", "#d8dee9",
  ],
  dracula: [
    "#ff5555", "#50fa7b", "#f1fa8c", "#bd93f9", "#ff79c6",
    "#8be9fd", "#ffb86c", "#6272a4", "#44475a", "#f8f8f2",
  ],
  tokyonight: [
    "#f7768e", "#ff9e64", "#e0af68", "#9ece6a", "#73daca",
    "#2ac3de", "#7aa2f7", "#b4f9f8", "#bb9af7", "#c0caf5",
  ],
  oneDark: [
    "#e06c75", "#98c379", "#e5c07b", "#61afef", "#c678dd",
    "#56b6c2", "#d19a66", "#abb2bf", "#be5046", "#5c6370",
  ],
  monokai: [
    "#f92672", "#fd971f", "#e6db74", "#a6e22e", "#66d9ef",
    "#ae81ff", "#75715e", "#f8f8f2", "#49483e", "#cfcfc2",
  ],
  catppuccinMocha: [
    "#f5e0dc", "#f2cdcd", "#f5c2e7", "#cba6f7", "#f38ba8",
    "#fab387", "#f9e2af", "#a6e3a1", "#94e2d5", "#89b4fa",
  ],
  solarizedDark: [
    "#b58900", "#cb4b16", "#dc322f", "#d33682", "#6c71c4",
    "#268bd2", "#2aa198", "#859900", "#93a1a1", "#839496",
  ],
  kanagawa: [
    "#e82424", "#ffa066", "#e6c384", "#98bb6c", "#6a9589",
    "#7e9cd8", "#7fb4ca", "#957fb8", "#d27e99", "#727169",
  ],
  everforest: [
    "#e67e80", "#e69875", "#dbbc7f", "#a7c080", "#83c092",
    "#7fbbb3", "#d699b6", "#7a8478", "#859289", "#9da9a0",
  ],
} as const satisfies Record<string, readonly string[]>;

export type ChartColorThemeId = keyof typeof chartColorThemes;
