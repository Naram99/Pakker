import { create } from "zustand";
import * as SQLite from "expo-sqlite";
import initializeDatabase from "../app/defaultDatabase";

// const db = SQLite.openDatabaseSync("../../assets/pakker_default.db");
// const db = await initializeDatabase();

interface DefaultItem {
    id: number;
    name: string;
    isAlwaysNeeded: boolean;
    priority: number;
    recommendedSex?: string;
    version: number;
    isCustom: false;
    status: "ready";
}

interface CustomItem {
    id: number;
    name: string;
    isAlwaysNeeded: boolean;
    priority: number;
    recommendedSex?: string;
    version: number;
    isCustom: true;
    status: "ready" | "saving";
}

type Item = DefaultItem | CustomItem;

interface ItemStore {
    db: SQLite.SQLiteDatabase | null;
    items: Item[];
    isReady: boolean;
    isLoading: boolean;

    init: () => Promise<void>;
    loadItems: () => Promise<void>;

    addItem: (item: CustomItem) => Promise<void>;
    addItemToDB: (item: CustomItem) => Promise<number>;

    updateItem: (id: number, updates: Partial<Item>) => Promise<void>;
    updateItemInDB: (id: number, updates: Partial<Item>) => Promise<void>;

    deleteItem: (id: number, isCustom: boolean) => Promise<void>;
    deleteItemFromDB: (id: number, isCustom: boolean) => Promise<void>;
}

class ItemStoreError extends Error {
    constructor(
        public message: string = "",
        public options: ErrorOptions = {},
    ) {
        super(message, options);
    }
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
            const database = await initializeDatabase();
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

        const tmpItem: CustomItem = {
            ...item,
            id: tmpId,
            status: "saving",
        };

        set((state) => ({
            items: [tmpItem, ...state.items],
        }));

        try {
            const insertId = await get().addItemToDB(item);

            set((state) => ({
                items: state.items.map((i) =>
                    i.id === tmpId
                        ? { ...i, id: insertId, status: "ready" }
                        : i,
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

    addItemToDB: async (item: CustomItem) => {
        const { db } = get();

        if (!get().isReady || !db)
            throw new ItemStoreError("Database is not available!");

        const query = await db.prepareAsync(`
            INSERT INTO custom_items (name, is_always_needed, priority, version ${item.recommendedSex ? ", recommended_sex" : ""})
            VALUES ($name, $isAlwaysNeeded, $priority, $version ${item.recommendedSex ? ", $recommendedSex" : ""})
        `);

        const insert = await query.executeAsync({
            $name: item.name,
            $isAlwaysNeeded: item.isAlwaysNeeded,
            $priority: item.priority,
            $version: item.version,
            $recommendedSex: item.recommendedSex || null,
        });

        return insert.lastInsertRowId;
    },

    updateItem: async (id: number, updates: Partial<Item>) => {},

    updateItemInDB: async (id: number, updates: Partial<Item>) => {},

    deleteItem: async (id: number, isCustom: boolean) => {
        const prevItems = get().items;

        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        }));

        try {
            await get().deleteItemFromDB(id, isCustom);
        } catch (error) {
            console.error(error);
            // Rollback
            set({ items: prevItems });
        }
    },

    deleteItemFromDB: async (id: number, isCustom: boolean) => {
        const { db } = get();

        if (!get().isReady || !db)
            throw new ItemStoreError("Database is not available!");

        // Foreign keys !?
        const query = await db.prepareAsync(
            `DELETE FROM ${isCustom ? "custom_items" : "default_items"} WHERE id = $id`,
        );

        await query.executeAsync({ $id: id });
    },
}));
