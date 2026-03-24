import * as FileSystem from "expo-file-system";
import { openDatabaseSync } from "expo-sqlite";

const DB_NAME = "pakker_default.db";

export default async function initializeDatabase() {
    try {
        const db = openDatabaseSync(DB_NAME);

        const result = db.getAllSync(
            "SELECT COUNT(*) FROM sqlite_master WHERE type='table'",
        );
        console.log(result);

        return db;
    } catch (error) {}
}
