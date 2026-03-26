import { create } from "zustand";
import * as SQLite from "expo-sqlite";
import { getDB } from "../app/defaultDatabase";
import { CustomItem, DefaultItem, Item } from "../types/itemTypes";
import { itemService } from "../service/itemService";

// const db = SQLite.openDatabaseSync("../../assets/pakker_default.db");
// const db = await initializeDatabase();

interface ItemStore {
    db: SQLite.SQLiteDatabase | null | undefined;
    items: Item[];
    isReady: boolean;
    isLoading: boolean;

    init: () => Promise<void>;
    loadItems: () => Promise<void>;

    addItem: (item: CustomItem) => Promise<void>;
    updateItem: (id: number, updates: Partial<Item>) => Promise<void>;

    deleteItem: (id: number, isCustom: boolean) => Promise<void>;
}

export const useItemStore = create<ItemStore>((set, get) => ({
    db: null,
    items: [],
    isReady: false,
    isLoading: false,

    init: async () => {
        if (get().isReady || get().isLoading) return;

        set({ isLoading: true });

        try {
            const database = await getDB();
            set({ db: database, isReady: true });
        } catch (error) {
            console.error(`ItemStore init failed: ${error}`);
        } finally {
            set({ isLoading: false });
        }
    },

    loadItems: async () => {
        const { db } = get();

        if (!get().isReady || get().isLoading || !db) return;

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

    addItem: async (item: CustomItem) => {
        const tmpId = -Date.now();

        const tmpItem: CustomItem = itemService.createTmpItem(item, tmpId);

        set((state) => ({
            items: [tmpItem, ...state.items],
        }));

        try {
            const insertedItem = await itemService.insertItem(tmpItem);

            set((state) => ({
                items: state.items.map((i) =>
                    i.id === tmpId ? insertedItem : i,
                ),
            }));
        } catch (error) {
            console.error(error);
            // Rollback
            set((state) => ({
                items: state.items.filter((i) => i.id !== tmpId),
            }));
        }
    },

    updateItem: async (id: number, updates: Partial<Item>) => {},

    deleteItem: async (id: number) => {
        const prevItems = get().items;

        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        }));

        try {
            await itemService.deleteItem(id);
        } catch (error) {
            console.error(error);
            // Rollback
            set({ items: prevItems });
        }
    },
}));
