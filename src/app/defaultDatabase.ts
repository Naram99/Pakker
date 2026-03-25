import { Asset } from "expo-asset";
import { File, Directory, Paths } from "expo-file-system";
import { openDatabaseSync } from "expo-sqlite";

const DB_NAME = "pakker_default.db";
const DOCUMENT_PATH = Paths.document;
const DB_PATH = Paths.join(DOCUMENT_PATH, "SQLite", DB_NAME);

const DB_ASSET = require("../../assets/pakker_default.db");

export default async function initializeDatabase() {
    const sqliteDirectory = new Directory(Paths.join(DOCUMENT_PATH, "SQLite"));
    const dbFile = new File(DB_PATH);

    try {
        // if (dbFile.exists) {
        //     dbFile.delete();
        // }
        // const newFile = new File(DB_PATH);

        if (!dbFile.exists) {
            console.log("Database file not exists.");

            if (!sqliteDirectory.exists) {
                console.log("SQLite directory not extists.");
                sqliteDirectory.create();
            }

            const asset = await Asset.fromModule(DB_ASSET).downloadAsync();

            if (asset.localUri) {
                const sourceFile = new File(asset.localUri);

                sourceFile.copy(dbFile);

                console.log("Database copied to SQLite directory");
            }
        } else {
            console.log("Database file exists.");
        }
        const db = openDatabaseSync(DB_NAME);

        // const result = db.getAllSync(
        //     "SELECT COUNT(*) FROM sqlite_master WHERE type='table'",
        // );
        // console.log(result);

        return db;
    } catch (error) {
        console.error(`Database opening failed: ${error}`);
    }
}
