type ColorThemes = "light" | "dark";

interface ThemeContextType {
    theme: ColorThemes;
    setTheme: (theme: ColorThemes) => Promise<void>;
    isLoading: boolean;
}
