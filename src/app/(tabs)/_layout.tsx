import { Tabs } from "expo-router";

export default function TabsLayout() {
    // Tab options initialization (language, icons)
    return (
        <Tabs>
            <Tabs.Screen name="home" options={{}} />
            <Tabs.Screen name="items" options={{}} />
            <Tabs.Screen name="profile" options={{}} />
        </Tabs>
    );
}
