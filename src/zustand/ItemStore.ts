import { create } from "zustand";
import { CustomItem, DefaultItem, Item } from "../types/itemTypes";
import { itemService } from "../service/itemService";

// const db = SQLite.openDatabaseSync("../../assets/pakker_default.db");
// const db = await initializeDatabase();

interface ItemStore {
    items: Item[];
    isLoading: boolean;
    error: string | null;

    loadItems: () => Promise<void>;

    addItem: (item: CustomItem) => Promise<void>;
    updateItem: (item: Item) => Promise<void>;

    deleteItem: (id: number, isCustom: boolean) => Promise<void>;
}

export const useItemStore = create<ItemStore>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    loadItems: async () => {
        if (get().isLoading) return;

        set({ isLoading: true, error: null });

        try {
            const result = await itemService.loadItems();
            set({ items: result, error: null });
        } catch (e) {
            console.error(e);
            // Error msg translation?
            set({ items: [], error: "Failed to load items" });
        } finally {
            set({ isLoading: false });
        }
    },

    addItem: async (item: CustomItem) => {
        const tmpItem: CustomItem = itemService.createTmpItem(item);

        set((state) => ({
            items: [tmpItem, ...state.items],
            error: null,
        }));

        try {
            const insertedItem = await itemService.insertItem(tmpItem);

            set((state) => ({
                items: state.items.map((i) =>
                    i.id === tmpItem.id ? insertedItem : i,
                ),
                error: null,
            }));
        } catch (error) {
            console.error(error);
            // Rollback
            set((state) => ({
                items: state.items.filter((i) => i.id !== tmpItem.id),
                error: "Failed to save item",
            }));
        }
    },

    updateItem: async (item: Item) => {},

    deleteItem: async (id: number) => {
        const prevItems = get().items;

        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            error: null,
        }));

        try {
            await itemService.deleteItem(id);
        } catch (error) {
            console.error(error);
            // Rollback
            set({ items: prevItems, error: "Failed to remove item" });
        }
    },
}));
