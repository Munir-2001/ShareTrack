import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAppSelector } from '../../Redux/Store/hooks';
import { getFriends } from '../Profile/relationshipUtils';

export default function DynamicBillerForm(props: any) {
    const { getBillerDynamicFormDataFromChild, conditionFortrigerringdatacollector } = props
    const user = useAppSelector((state: { auth: any }) => state.auth.user);

    const [userId, setUserId] = useState(user || null);
    const [inputs, setInputs] = useState<any>([]);
    const [friends, setFriends] = useState<any>([]);


    useEffect(() => {
        const fetchData = async () => {
            const id = user?.id || null;
            setUserId(id);
            if (id) {
                const friendsData = await getFriends(id);
                setFriends(friendsData);
            } else {
                setFriends([]);
            }
        };

        fetchData();
    }, [user]);


    // Function to add three new input entries (a group)
    const addInputs: any = () => {
        setInputs((prevInputs: any) => [
            ...prevInputs,
            '', '', ''
        ]);
    };

    // Handler to update a specific input value
    const handleChange = (text: any, index: any) => {
        const newInputs: any = [...inputs];
        newInputs[index] = text;
        setInputs(newInputs);
    };

    // Function to remove a group of three inputs based on group index
    const removeGroup = (groupIndex: any) => {
        const startIndex = groupIndex * 3;
        setInputs((prevInputs: any) => {
            const newInputs = [...prevInputs];
            newInputs.splice(startIndex, 3);
            return newInputs;
        });
    };

    // Group the inputs array into chunks of three
    const groupedInputs = [];
    for (let i = 0; i < inputs.length; i += 3) {
        groupedInputs.push(inputs.slice(i, i + 3));
    }

    if (conditionFortrigerringdatacollector > 0) {
        const billerData = [];
        for (let i = 0; i < inputs.length; i += 3) {
            billerData.push({
                contributor_id: (inputs[i] !='' ? parseFloat(inputs[i]):0),
                share_amount:  inputs[i + 1] != '' ? parseFloat(inputs[i + 1]):0,
                paid_amount:  inputs[i + 2] !='' ?parseFloat(inputs[i + 2]) :0,
            });
        }
        getBillerDynamicFormDataFromChild(billerData, userId);
    }

    // console.log("this is a user api",friends[0]?.id ,friends[0]?.username, friends.length)
    return (
        <ScrollView >
            {groupedInputs.map((group, groupIndex) => (
                <View key={groupIndex} style={styles.groupContainer}>
                    {group.map((value: any, indexInGroup: any) => {
                        const overallIndex = groupIndex * 3 + indexInGroup;
                        if (indexInGroup === 0) {
                            // First input as a select input (Picker)
                            return (
                                <Picker
                                    key={overallIndex}
                                    selectedValue={value}
                                    style={styles.picker}
                                    onValueChange={(itemValue, itemIndex) => handleChange(itemValue, overallIndex)}
                                >
                                    {friends.map((friend: any, index: any) => (
                                        <Picker.Item key={index} label={friend.username} value={friend.id} />
                                    ))}
                                </Picker>
                            );
                        } else {
                            // Second input: Share Amount, Third input: Paid Amount
                            const placeholder = indexInGroup == 1 ? 'Share Amount' : 'Paid Amount';
                            return (
                                <TextInput
                                    key={overallIndex}
                                    style={styles.input}
                                    placeholder={placeholder}
                                    value={value}
                                    placeholderTextColor="#888"
                                    onChangeText={text => handleChange(text, overallIndex)}
                                />
                            );
                        }
                    })}
                    <View style={styles.buttonGroup}>
                        <Button title="Remove Biller" onPress={() => removeGroup(groupIndex)} />
                    </View>
                </View>
            ))}
            <View style={styles.buttonContainer}>
                <Button title="Add Biller" onPress={addInputs} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    groupContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    input: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        marginTop: 20,
    },
    buttonGroup: {
        marginTop: 10,
    },
    picker: {
        height: 50,
        backgroundColor: "#F5F5F5",
        marginBottom: 15,
    },
});

