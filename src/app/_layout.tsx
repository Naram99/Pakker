import { Stack } from "expo-router";
import { useItemStore } from "../zustand/ItemStore";
import { useEffect } from "react";

export default function RootLayout() {
    // Future initialization on app start

    // Zustand DB init
    const itemStoreInit = useItemStore((state) => state.init);

    useEffect(() => {
        itemStoreInit();
    }, []);

    return <Stack screenOptions={{ headerShown: false }} />;
}
