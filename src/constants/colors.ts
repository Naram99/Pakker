export type ColorTheme = {
    light: ColorScheme;
    dark: ColorScheme;
};

type ColorScheme = {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
};

export const defaultColors: ColorTheme = {
    light: {
        primary: "#477ea5",
        secondary: "#5b8dd8",
        background: "#f0f2f6",
        accent: "#ed8936",
    },
    dark: {
        primary: "#f0f4f8",
        secondary: "#2d3748",
        background: "#0d1117",
        accent: "#fbbf24",
    },
};

type SemanticColors = {
    info: string;
    success: string;
    warning: string;
    error: string;
};

export const semanticColors: SemanticColors = {
    info: "#5b8dd8",
    success: "#28a745",
    warning: "#ed8936",
    error: "#dc3545",
};

export type ThemeName = "beach" | "sightseeing" | "hiking";

export const thematicColors: { [index in ThemeName]: ColorTheme } = {
    beach: {
        light: {
            primary: "#0066cc",
            secondary: "#00c9ff",
            background: "#f0fbff",
            accent: "#ff9a56",
        },
        dark: {
            primary: "#e0e0e0",
            secondary: "#a0a0a0",
            background: "#0a1628",
            accent: "#ffa366",
        },
    },
    hiking: {
        light: {
            primary: "#1a4d2e",
            secondary: "#2d6a4f",
            background: "#f5f9f7",
            accent: "#d4a574",
        },
        dark: {
            primary: "#e0e0e0",
            secondary: "#b0b0b0",
            background: "#1a1f2e",
            accent: "#a8d5ba",
        },
    },
    sightseeing: {
        light: {
            primary: "#2d3a4d",
            secondary: "#636e89",
            background: "#f5f6f9",
            accent: "#5b7dd8",
        },
        dark: {
            primary: "#e8eef5",
            secondary: "#8a92a8",
            background: "#0f1419",
            accent: "#5b8fd9",
        },
    },
};
