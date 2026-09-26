"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type SidebarStyle = "solid" | "gradient" | "glass";
export type SidebarActiveStyle = "pill" | "border" | "glow" | "minimal";
export type FontSizeScale = "compact" | "normal" | "comfortable";
export type ContentBgPreset = "default" | "pitch" | "slate" | "warm";

export interface FontOption {
  id: string;
  name: string;
  family: string;
  googleFont?: string;
  category: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  { id: "inter", name: "Inter", family: "'Inter', sans-serif", googleFont: "Inter:wght@400;500;600;700;800", category: "Modern Sans" },
  { id: "plus-jakarta", name: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', sans-serif", googleFont: "Plus+Jakarta+Sans:wght@400;500;600;700;800", category: "Modern Sans" },
  { id: "outfit", name: "Outfit", family: "'Outfit', sans-serif", googleFont: "Outfit:wght@400;500;600;700;800", category: "Geometric" },
  { id: "poppins", name: "Poppins", family: "'Poppins', sans-serif", googleFont: "Poppins:wght@400;500;600;700", category: "Rounded" },
  { id: "roboto", name: "Roboto", family: "'Roboto', sans-serif", googleFont: "Roboto:wght@400;500;700", category: "Clean" },
  { id: "geist", name: "Geist Sans", family: "var(--font-geist-sans), sans-serif", category: "Minimal" },
  { id: "playfair", name: "Playfair Display", family: "'Playfair Display', serif", googleFont: "Playfair+Display:wght@500;600;700;800", category: "Luxury Serif" },
  { id: "fira-code", name: "Fira Code", family: "'Fira Code', monospace", googleFont: "Fira+Code:wght@400;500;600;700", category: "Monospace" },
  { id: "system", name: "System UI", family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", category: "Default" },
];

export interface ColorPreset {
  id: string;
  name: string;
  color: string;
  isGradient?: boolean;
  gradient?: string;
  textColor?: string;
  accentRecommended?: string;
}

export const SIDEBAR_COLOR_PRESETS: ColorPreset[] = [
  { id: "midnight-slate", name: "Midnight Slate", color: "#0f172a" },
  { id: "oled-black", name: "Pitch Black", color: "#000000" },
  { id: "deep-navy", name: "Deep Sapphire", color: "#0a192f" },
  { id: "forest-emerald", name: "Forest Emerald", color: "#052015" },
  { id: "royal-purple", name: "Royal Amethyst", color: "#1b0b2e" },
  { id: "luxury-burgundy", name: "Crimson Burgundy", color: "#250813" },
  { id: "espresso-coffee", name: "Espresso Mocha", color: "#19100a" },
  {
    id: "cyber-gradient",
    name: "Cyberpunk Gradient",
    color: "#160a2b",
    isGradient: true,
    gradient: "linear-gradient(180deg, #1d0e3a 0%, #091224 100%)",
  },
  {
    id: "arctic-light",
    name: "Arctic Light",
    color: "#ffffff",
    textColor: "#1e293b",
    accentRecommended: "#f59e0b",
  },
];

export const ACCENT_COLOR_PRESETS = [
  { id: "amber", name: "Amber Gold", hex: "#f59e0b" },
  { id: "emerald", name: "Emerald", hex: "#10b981" },
  { id: "blue", name: "Electric Blue", hex: "#3b82f6" },
  { id: "violet", name: "Vivid Violet", hex: "#8b5cf6" },
  { id: "rose", name: "Crimson Rose", hex: "#f43f5e" },
  { id: "cyan", name: "Neon Cyan", hex: "#06b6d4" },
  { id: "orange", name: "Sunset Orange", hex: "#f97316" },
];

export interface AdminThemeSettings {
  themeMode: ThemeMode;
  sidebarColor: string;
  isSidebarGradient: boolean;
  sidebarGradient: string;
  sidebarStyle: SidebarStyle;
  sidebarActiveStyle: SidebarActiveStyle;
  accentColor: string;
  fontFamilyId: string;
  fontSizeScale: FontSizeScale;
  contentBgPreset: ContentBgPreset;
  glassmorphism: boolean;
  sidebarCollapsed: boolean;
  compactMode: boolean;
}

const DEFAULT_SETTINGS: AdminThemeSettings = {
  themeMode: "dark",
  sidebarColor: "#000000",
  isSidebarGradient: false,
  sidebarGradient: "linear-gradient(180deg, #1d0e3a 0%, #091224 100%)",
  sidebarStyle: "solid",
  sidebarActiveStyle: "pill",
  accentColor: "#f59e0b",
  fontFamilyId: "inter",
  fontSizeScale: "normal",
  contentBgPreset: "default",
  glassmorphism: true,
  sidebarCollapsed: false,
  compactMode: false,
};

interface AdminThemeContextType {
  settings: AdminThemeSettings;
  resolvedTheme: "light" | "dark";
  isDark: boolean;
  isCustomizerOpen: boolean;
  activeFont: FontOption;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  toggleCustomizer: () => void;
  updateSetting: <K extends keyof AdminThemeSettings>(key: K, value: AdminThemeSettings[K]) => void;
  resetToDefaults: () => void;
  isSidebarDark: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType | null>(null);

const STORAGE_KEY = "flazo_admin_appearance_v2";

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AdminThemeSettings>(DEFAULT_SETTINGS);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [systemIsDark, setSystemIsDark] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage and detect system color scheme
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error("Failed to load admin theme settings", e);
    }

    // Media query listener for OS dark mode
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      setSystemIsDark(media.matches);
      const listener = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, []);

  // Compute resolved theme
  const resolvedTheme: "light" | "dark" = useMemo(() => {
    if (settings.themeMode === "system") {
      return systemIsDark ? "dark" : "light";
    }
    return settings.themeMode;
  }, [settings.themeMode, systemIsDark]);

  // Sync dark class on documentElement for global tailwind dark mode
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (resolvedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [resolvedTheme]);

  // Save to localStorage whenever settings change
  const updateSetting = <K extends keyof AdminThemeSettings>(
    key: K,
    value: AdminThemeSettings[K]
  ) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
          console.error("Failed to save admin theme", e);
        }
      }
      return next;
    });
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    }
  };

  // Find active font object
  const activeFont = useMemo(() => {
    return (
      AVAILABLE_FONTS.find((f) => f.id === settings.fontFamilyId) ||
      AVAILABLE_FONTS[0]
    );
  }, [settings.fontFamilyId]);

  // Determine if sidebar background is dark or light (for high-contrast text)
  const isSidebarDark = useMemo(() => {
    if (settings.isSidebarGradient) return true;
    const hex = settings.sidebarColor.replace("#", "");
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.6;
    }
    return true;
  }, [settings.sidebarColor, settings.isSidebarGradient]);

  // Dynamically load Google Font if needed
  useEffect(() => {
    if (!isClient || !activeFont.googleFont) return;
    const fontHref = `https://fonts.googleapis.com/css2?family=${activeFont.googleFont}&display=swap`;
    const linkId = "admin-dynamic-google-font";

    let existingLink = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!existingLink) {
      existingLink = document.createElement("link");
      existingLink.id = linkId;
      existingLink.rel = "stylesheet";
      document.head.appendChild(existingLink);
    }
    if (existingLink.href !== fontHref) {
      existingLink.href = fontHref;
    }
  }, [activeFont, isClient]);

  // Font scale value
  const fontScaleValue = useMemo(() => {
    switch (settings.fontSizeScale) {
      case "compact":
        return "0.92";
      case "comfortable":
        return "1.08";
      default:
        return "1";
    }
  }, [settings.fontSizeScale]);

  return (
    <AdminThemeContext.Provider
      value={{
        settings,
        resolvedTheme,
        isDark: resolvedTheme === "dark",
        isCustomizerOpen,
        activeFont,
        openCustomizer: () => setIsCustomizerOpen(true),
        closeCustomizer: () => setIsCustomizerOpen(false),
        toggleCustomizer: () => setIsCustomizerOpen((prev) => !prev),
        updateSetting,
        resetToDefaults,
        isSidebarDark,
      }}
    >
      <div
        className={`admin-theme-root h-screen w-full overflow-hidden ${
          resolvedTheme === "dark" ? "dark bg-black text-zinc-100" : "bg-slate-50 text-slate-900"
        }`}
        style={
          {
            "--admin-font": activeFont.family,
            "--admin-accent": settings.accentColor,
            "--admin-scale": fontScaleValue,
            fontFamily: "var(--admin-font)",
            fontSize: `calc(14px * var(--admin-scale))`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
}
