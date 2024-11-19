import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert
    // Picker,
    // DatePickerAndroid,
} from 'react-native';
import { formConfig, fieldTypes } from './config';

// import { Picker } from '@react-native-picker/picker';
import { SelectList } from 'react-native-dropdown-select-list';

import { createItem } from '../../Redux/Actions/AuthActions/ItemAction';
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';



// Define the form data type with an index signature
interface FormData {
    name: string;
    description: string;
    price: string;
    category: string;
    city: string;
    state: string;
    country: string;
    isAvailable: boolean;
    availableDates: { start: string, end: string }[]; // for available dates
    [key: string]: any; // index signature allows dynamic keys
}


export default function AddItemScreen(props: any) {
    // State to manage form inputs, initialized from config
    const [formData, setFormData] = useState<FormData>(formConfig.initialStates);
    // const [availableDateRange, setAvailableDateRange] = useState({ start: '', end: '' });
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();


    // Handler to update form values
    const handleInputChange = (field: string, value: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    // // Handler to update available date range
    // const handleDateChange = (field: string, value: any) => {
    //     setAvailableDateRange((prevState) => ({
    //         ...prevState,
    //         [field]: value,
    //     }));
    // };

    // // Add date range to availableDates
    // const addAvailableDate = () => {
    //     if (availableDateRange.start && availableDateRange.end) {
    //         const startDate = new Date(availableDateRange.start);
    //         const endDate = new Date(availableDateRange.end);
    //         if (startDate < endDate) {
    //             setFormData((prevState) => ({
    //                 ...prevState,
    //                 availableDates: [...prevState.availableDates, availableDateRange],
    //             }));
    //             setAvailableDateRange({ start: '', end: '' });
    //         } else {
    //             Alert.alert('Start date must be earlier than end date.');
    //         }
    //     } else {
    //         Alert.alert('Both start and end dates are required.');
    //     }
    // };

    // // Remove date range
    // const removeAvailableDate = (index: number) => {
    //     const updatedDates = formData.availableDates.filter((_, i) => i !== index);
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         availableDates: updatedDates,
    //     }));
    // };

    // Handle form submission
    const handleSubmit = async () => {
        var itemData = { ...formData };

        // Simple validation before submitting
        for (const field of formConfig.formFields) {
            if (field.type !== fieldTypes.switch && !itemData[field.key]) {
                Alert.alert(`${field.label} is required.`);
                return;
            }
        }

        // Add user id to item data
        itemData = { ...itemData, owner: user._id };

        // Dispatch action to create item
        dispatch(createItem(itemData));

        // Redirect to items screen
        props.navigation.navigate('ITEMS');

        // Reset form data
        setFormData(formConfig.initialStates);
        


    };

    return (
        <View>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.screenText}>Add Item for Rent</Text>

                {/* Render form fields dynamically */}
                {formConfig.formFields.map((field) => {
                    const { key, label, type, options } = field;
                    const optionList = { key: options, value: options };
                    return (
                        <View key={key} style={styles.inputContainer}>
                            {type !== fieldTypes.switch && <Text style={styles.inputLabel}>{label}</Text>}
                            {type === fieldTypes.text && (
                                <TextInput
                                    style={styles.input}
                                    value={formData[key]}
                                    onChangeText={(value) => handleInputChange(key, value)}
                                    placeholder={label}
                                    maxLength={50}
                                />
                            )}

                            {type === fieldTypes.textarea && (
                                <TextInput
                                    style={[styles.input, { height: 100 }]}
                                    value={formData[key]}
                                    onChangeText={(value) => handleInputChange(key, value)}
                                    placeholder={label}
                                    multiline
                                    maxLength={200}
                                />
                            )}

                            {type === fieldTypes.number && (
                                <TextInput
                                    style={styles.input}
                                    value={formData[key]}
                                    onChangeText={(value) => handleInputChange(key, value)}
                                    placeholder={label}
                                    keyboardType="numeric"
                                />
                            )}

                            {type === fieldTypes.switch && (
                                <View style={styles.switchContainer}>
                                    <Text style={styles.switchText}>{label}</Text>
                                    <Switch
                                        value={formData[key]}
                                        onValueChange={(value) => handleInputChange(key, value)}
                                        trackColor={{ false: '#DDD', true: '#E63946' }}
                                        thumbColor={formData[key] ? '#FFF' : '#F4F3F4'}
                                    />
                                </View>
                            )}



                            {type === fieldTypes.select && (
                                <View>
                                    <SelectList
                                        setSelected={(val: any) => handleInputChange(key, val)}
                                        data={options || []}
                                        boxStyles={styles.selectBox}
                                    dropdownStyles={styles.selectDropdown}
                                    placeholder={`Select ${label}`}
                                    />
                                </View>
                            )}

                        </View>
                    );
                })}



                {/* Submit Button */}
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Create Item</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    screenText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1E2A78',
        textAlign: 'center',
        marginBottom: 20,

    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: '#FFF',
        fontSize: 16,
        color: '#333',
        elevation: 3,
    },
    switchText: {
        fontSize: 14,
        textAlign: 'left',
        fontWeight: '600',
        marginBottom: 5,

    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#FFF',

    },
    selectBox: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    selectDropdown: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
    },

    button: {
        backgroundColor: '#1E2A78',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        elevation: 2,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    removeButton: {
        backgroundColor: '#ff4d4d',
        padding: 5,
        borderRadius: 5,
    },
    removeButtonText: {
        color: 'white',
    },
});
