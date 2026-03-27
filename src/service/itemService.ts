import { getDB } from "../app/defaultDatabase";
import { CustomItem, DefaultItem, Item } from "../types/itemTypes";

class ItemServiceError extends Error {
    constructor(
        public message: string = "",
        public options: ErrorOptions = {},
    ) {
        super(message, options);
    }
}

export const itemService = {
    loadItems: async (): Promise<DefaultItem[]> => {
        const db = await getDB();

        if (!db) throw new ItemServiceError("Database is not available!");

        const result = await db.getAllAsync<DefaultItem>(
            "SELECT * FROM default_items",
        );

        return result;
    },

    insertItem: async (item: CustomItem): Promise<CustomItem> => {
        const db = await getDB();

        if (!db) throw new ItemServiceError("Database is not available!");

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

        return { ...item, id: insert.lastInsertRowId, status: "ready" };
    },

    deleteItem: async (id: number) => {
        const db = await getDB();

        if (!db) throw new ItemServiceError("Database is not available!");

        // Foreign keys !?
        const query = await db.prepareAsync(
            `DELETE FROM custom_items WHERE id = $id`,
        );

        await query.executeAsync({ $id: id });
    },

    updateItem: async (item: CustomItem) => {},

    createTmpItem: (item: CustomItem): CustomItem => {
        const tmpId = -Date.now();
        return { ...item, id: tmpId, status: "saving" };
    },
};
