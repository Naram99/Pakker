export interface DefaultItem {
    id: number;
    name: string;
    isAlwaysNeeded: boolean;
    priority: number;
    recommendedSex?: string;
    version: number;
    isCustom: false;
    status: "ready";
}

export interface CustomItem {
    id: number;
    name: string;
    isAlwaysNeeded: boolean;
    priority: number;
    recommendedSex?: string;
    version: number;
    isCustom: true;
    status: "ready" | "saving";
}

export type Item = DefaultItem | CustomItem;
