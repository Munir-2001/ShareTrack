import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
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
                <View style={styles.itemsRow}>
                    {data.map((item: any, index: number) => (
                        <View key={item._id} style={[styles.itemCard, index % 2 === 0 && styles.itemCardLeft]}>
                            <Image
                                source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
                                style={styles.itemImage}
                            />
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>Price: {item.price} Pkr</Text>
                            <Text style={styles.itemCategory}>Type: {item.category}</Text>
                            
                            <Text style={styles.itemDescription}>{item.description}</Text>
                            {!showAll && (
                                <TouchableOpacity style={styles.deleteButton} onPress={() => { /* Handle delete */ }}>
                                    <Text style={styles.deleteText}>Delete</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
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
    addButton: {
        backgroundColor: '#1E2A78', // Primary blue color
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
        backgroundColor: '#F5F5F5',
    },
    activeButton: {
        backgroundColor: '#1E2A78', // Active button blue color
        borderColor: '#1E2A78',
    },
    toggleButtonText: {
        fontSize: 14,
        color: '#555',
    },
    activeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    itemsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allows wrapping to the next row
        justifyContent: 'space-between', // Distribute items with space between them
    },
    itemCard: {
        backgroundColor: '#fff', // White background for the card
        borderRadius: 8, // Rounded corners
        padding: 15,
        marginBottom: 15, // Space between cards
        width: '48%', // Adjust width to fit two items per row
        marginRight: '2%', // Space between items
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5, // Adding shadow for Android
    },
    itemCardLeft: {
        marginLeft: '2%', // Space between the first card and the second one in the row
    },
    itemImage: {
        width: '100%', // Full width of the card
        height: 150, // Fixed height for the image
        borderRadius: 8, // Rounded corners for the image
        marginBottom: 10, // Space below the image
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#1E2A78', // Primary blue color
    },
    itemCategory: {
        fontSize: 14,
        color: '#333', 
        marginBottom: 3,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333', 
        marginBottom: 3,
    },
    itemDescription: {
        fontSize: 14,
        color: '#333', 
        marginBottom: 15,
    },
    deleteButton: {
        backgroundColor: '#1E2A78', 
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: 10,
    },
    deleteText: {
        color: '#fff', // Primary red color
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
    },
});
