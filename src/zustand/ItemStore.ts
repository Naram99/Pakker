import { create } from "zustand";

interface Item {
    id: number;
    name: string;
    isAlwaysNeeded: boolean;
    priority: number;
    recommendedSex?: string;
    version: number;
    isCustom: boolean;
}

interface ItemStore {
    items: Item[];
    isLoading: boolean;

    loadItems: () => Promise<void>;
    addItem: (item: Item) => Promise<void>;
    updateItem: (id: number, updates: Partial<Item>) => Promise<void>;
    deleteItem: (id: number, isCustom: boolean) => Promise<void>;
}

export const useItemStore = create<ItemStore>((set, get) => ({
    items: [],
    isLoading: false,

    loadItems: async () => {},
    addItem: async (item: Item) => {},
    updateItem: async (id: number, updates: Partial<Item>) => {},
    deleteItem: async (id: number, isCustom: boolean) => {},
}));
