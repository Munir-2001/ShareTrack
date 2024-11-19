import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import { getAllItems, getUserItems } from '../../Redux/Actions/AuthActions/ItemAction';

import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';

export default function ItemScreen(props: any) {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: { auth: any }) => state.auth.user);
    const all_items = useAppSelector((state: { item: any }) => state.item.all_items);
    const my_items = useAppSelector((state: { item: any }) => state.item.user_items);

    const [showAll, setShowAll] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (showAll) {
            setData(all_items);
        } else {
            setData(my_items);
        }
    }, [showAll, all_items, my_items]);

    useEffect(() => {
        if (all_items.length === 0) {
            dispatch(getAllItems());
        }

        if (my_items.length === 0) {
            dispatch(getUserItems(user._id));
        }
    }, []);

    const navigate = (screen: string) => {
        props.navigation.navigate(screen);
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.headerText}>Items</Text> */}
            <TouchableOpacity style={styles.addButton} onPress={() => navigate("ADDITEM")}>
                <Text style={styles.addButtonText}>Add a Listing</Text>
            </TouchableOpacity>
            <View style={styles.toggleButtonsContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, showAll && styles.activeButton]}
                    onPress={() => setShowAll(true)}
                >
                    <Text style={showAll ? styles.activeButtonText : styles.toggleButtonText}>
                        Show All Items
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, !showAll && styles.activeButton]}
                    onPress={() => setShowAll(false)}
                >
                    <Text style={!showAll ? styles.activeButtonText : styles.toggleButtonText}>
                        Show My Items
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                {data.map((item: any) => (
                    <View key={item._id} style={styles.itemCard}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDetail}>Type: {item.category}</Text>
                        <Text style={styles.itemDetail}>Price: {item.price} Pkr</Text>
                        <Text style={styles.itemDescription}>{item.description}</Text>
                        {!showAll && (
                            <TouchableOpacity onPress={() => { /* Handle delete */ }}>
                                <Text style={styles.deleteText}>Delete</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    toggleButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    toggleButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f0f0f0',
    },
    activeButton: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    toggleButtonText: {
        fontSize: 14,
        color: '#555',
    },
    activeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    itemCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginVertical: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    itemDetail: {
        fontSize: 14,
        color: '#555',
    },
    itemDescription: {
        fontSize: 14,
        color: '#777',
        marginVertical: 10,
    },
    deleteText: {
        color: '#d9534f',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
    },
});
