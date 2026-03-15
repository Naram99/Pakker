import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useItemStore } from "../../zustand/ItemStore";

const HomePage = () => {
    const items = useItemStore((state) => state.items);
    const loadItems = useItemStore((state) => state.loadItems);
    useEffect(() => {
        loadItems();
        console.log(items);
    }, []);
    return (
        <View>
            <Text>HomePage</Text>
        </View>
    );
};

export default HomePage;

const styles = StyleSheet.create({});
