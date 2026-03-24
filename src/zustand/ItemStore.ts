import { create } from "zustand";
import * as SQLite from "expo-sqlite";
import initializeDatabase from "../app/defaultDatabase";

const db = SQLite.openDatabaseSync("../../assets/pakker_default.db");
// const db = await initializeDatabase();

interface DefaultItem {
    id: number;
    name: string;
    isAlwaysNeeded: boolean;
    priority: number;
    recommendedSex?: string;
    version: number;
    isCustom: false;
}

interface CustomItem {
    id: number;
    name: string;
    isAlwaysNeeded: boolean;
    priority: number;
    recommendedSex?: string;
    version: number;
    isCustom: true;
}

type Item = DefaultItem | CustomItem;

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

    loadItems: async () => {
        set({ isLoading: true });

        try {
            const result = await db.getAllAsync<DefaultItem>(
                "SELECT * FROM default_items",
            );
            set({ items: result });
        } catch (error) {
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },
    addItem: async (item: Item) => {},
    updateItem: async (id: number, updates: Partial<Item>) => {},
    deleteItem: async (id: number, isCustom: boolean) => {},
}));
