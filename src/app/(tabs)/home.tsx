import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useItemStore } from "../../zustand/ItemStore";
import * as FileSystem from "expo-file-system";

const HomePage = () => {
    const init = useItemStore((state) => state.init);
    const loadItems = useItemStore((state) => state.loadItems);
    const items = useItemStore((state) => state.items);
    const isReady = useItemStore((state) => state.isReady);
    const isLoading = useItemStore((state) => state.isLoading);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (isReady && !isLoading) console.log(items);
    }, [isReady, isLoading]);

    return (
        <View>
            <Text>HomePage</Text>
        </View>
    );
};

export default HomePage;

const styles = StyleSheet.create({});
