import { Stack } from "expo-router";

export default function RootLayout() {
    // Future initialization on app start
    return <Stack screenOptions={{ headerShown: false }} />;
}
