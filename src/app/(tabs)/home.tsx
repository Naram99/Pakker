import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useItemStore } from "../../zustand/ItemStore";
import * as FileSystem from "expo-file-system";

const HomePage = () => {
    // const items = useItemStore((state) => state.items);
    // const loadItems = useItemStore((state) => state.loadItems);
    const dir = new FileSystem.Directory();
    useEffect(() => {
        // loadItems();
        console.log("asdf");
        console.log();
    }, []);
    return (
        <View>
            <Text>HomePage</Text>
        </View>
    );
};

export default HomePage;

const styles = StyleSheet.create({});
