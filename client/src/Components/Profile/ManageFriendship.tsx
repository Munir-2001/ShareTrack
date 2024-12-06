import React, { useState, useEffect, PropsWithChildren } from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    StyleSheet,
    TextInput, Alert, TouchableOpacity,

    Pressable
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import {
    getFriends,
    getFriendRequestsReceived,
    getFriendRequestsSent,
    blockFriend,
    deleteRelationship,
    approveFriendRequest,
    requestFriend,
    getBlockedUsers,
} from './relationshipUtils'; // Adjust the path if needed
import { SegmentControl } from './SegmentControl';

import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';

const options = ['Your Friends', 'Pending Requests', 'Sent Requests'];


export default function ConnectionScreen({ navigation }: PropsWithChildren<any>) {
    // const dispatch = useAppDispatch();
    const user = useAppSelector((state: { auth: any }) => state.auth.user);
    const isAuth = useAppSelector((state: { auth: any }) => state.auth.isAuth);
    const [userId, setUserId] = useState(user._id || null); // Replace with dynamic user ID
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [friendRequestUsername, setFriendRequestUsername] = useState('');
    const [selectedOption, setSelectedOption] = useState('Your Friends');

    useEffect(() => {
        setUserId(user?._id || null);
    }, [user])

    useEffect(() => {
        if (isAuth) {
            fetchData();
        }
    }, [userId]);



    const fetchData = async () => {
        try {
            const friendsData = await getFriends(userId);
            const pendingRequestsData = await getFriendRequestsReceived(userId);
            const sentRequestsData = await getFriendRequestsSent(userId);
            const blockedUsersData = await getBlockedUsers(userId);


            setFriends(friendsData);
            setPendingRequests(pendingRequestsData);
            setSentRequests(sentRequestsData);
            setBlockedUsers(blockedUsersData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSendFriendRequest = async () => {
        if (!friendRequestUsername) return;

        if (friendRequestUsername === user.username) {
            return Alert.alert('You cannot send a friend request to yourself!');
        }

        try {
            await requestFriend(userId, friendRequestUsername);
            Alert.alert('Friend request sent!');
            setFriendRequestUsername(''); // Clear the input
            fetchData();
        } catch (error: any) {

            Alert.alert(error.message);
        }
    };

    const gotoProfile = () => {
        navigation.navigate("PROFILE");
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={gotoProfile} style={styles.backButtonContainer}>
                <Icon name="arrow-back" size={30} color="#1E2A78" style={styles.icon} />
                <Text style={styles.backButtonText}>Back to Profile</Text>
            </TouchableOpacity>
            <SegmentControl
        options={options}
        selectedOption={selectedOption}
        onOptionPress={setSelectedOption}
      />
            <Button title="Go to Profile" onPress={gotoProfile} />


            <Text style={styles.header}>Friends</Text>
            <FlatList
                data={friends}
                keyExtractor={(item: any) => item.relationship._id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listElement}>
                        <Text>{item.username}</Text>
                        <View >

                            <Pressable style={styles.button} onPress={() => {
                                blockFriend(item.relationship._id, userId);
                                fetchData();
                            }}>
                                <Text>Block</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={() => {
                                deleteRelationship(item.relationship._id);
                                fetchData();
                            }}>
                                <Text>Unfriend</Text>
                            </Pressable>
                        </View>
                    </View>
                )} />

            <Text style={styles.header}>Pending Requests</Text>
            <FlatList
                data={pendingRequests}
                keyExtractor={(item: any) => item.relationship._id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listElement}>
                        <Text>{item.username}</Text>

                        <Pressable style={styles.button} onPress={() => {
                            approveFriendRequest(item.relationship._id);
                            fetchData();
                        }}>
                            <Text>Approve</Text>
                        </Pressable>

                    </View>)}
            />

            <Text style={styles.header}>Sent Requests</Text>
            <FlatList
                data={sentRequests}
                keyExtractor={(item: any) => item.relationship._id.toString()}
                renderItem={({ item }) => (

                    <View style={styles.listElement}>
                        <Text>{item.username}</Text>
                        <Pressable style={styles.button} onPress={() => {
                            deleteRelationship(item.relationship._id);
                            fetchData();
                        }}>
                            <Text>Cancel</Text>
                        </Pressable>
                    </View>

                )}
            />


            <Text style={styles.header}>Blocked Users</Text>
            <FlatList
                data={blockedUsers}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listElement}>
                        <Text>{item.username}</Text>
                        <Pressable style={styles.button} onPress={() => {
                            deleteRelationship(item.relationship._id);
                            fetchData();
                        }}>
                            <Text>Unblock</Text>
                        </Pressable>
                    </View>
                )}
            />


            <Text style={styles.header}>Send Friend Request</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={friendRequestUsername}
                onChangeText={setFriendRequestUsername}
                keyboardType="numeric"
            />
            <Button title="Send Request" onPress={handleSendFriendRequest} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
    },
    backButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        marginBottom: 10, 
      },
      icon: {
        marginRight: 8, 
      },
      backButtonText: {
        fontSize: 16, 
        color: '#1E2A78', 
        fontWeight: 'bold', 
      },
    
    button: {
        width: 100,
        height: 50,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        margin: 10
    }
    ,
    listElement: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 8,
    },
});
