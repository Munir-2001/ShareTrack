import React, {useState, useEffect, PropsWithChildren} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Pressable,
  Modal,
  Image,
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
import {SegmentControl} from './SegmentControl';

import {useAppDispatch, useAppSelector} from '../../Redux/Store/hooks';

const options = ['Add Friends', 'Your Friends', 'Blocked Users'];
interface Friend {
  _id: string;
  username: string;
  relationship: {
    _id: string;
  };
}

export default function ConnectionScreen({navigation}: PropsWithChildren<any>) {
  // const dispatch = useAppDispatch();
  const user = useAppSelector((state: {auth: any}) => state.auth.user);
  const isAuth = useAppSelector((state: {auth: any}) => state.auth.isAuth);
  const [userId, setUserId] = useState(user._id || null); // Replace with dynamic user ID
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [friendRequestUsername, setFriendRequestUsername] = useState('');
  const [selectedOption, setSelectedOption] = useState('Add Friends');
  const [filter, setFilter] = useState('Received');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const filteredData = filter === 'Received' ? pendingRequests : sentRequests;

  useEffect(() => {
    setUserId(user?._id || null);
  }, [user]);

  useEffect(() => {
    if (isAuth) {
      fetchData();
    }
  }, [
    userId,
    selectedOption,
    blockedUsers,
    friends,
    pendingRequests,
    sentRequests,
  ]);

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
      console.error('Error fetching data:', error);
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
    navigation.navigate('PROFILE');
  };

  const openModal = friend => {
    setSelectedFriend(friend);
    setModalVisible(true);
    console.log('open modal');
  };

  const closeModal = () => {
    console.log('Closing Modal'); // Add this log
    setSelectedFriend(null);
    setModalVisible(false);
    console.log('Modal Visible State:', modalVisible); // Log after state chang
  };

  const blockAlert = () => {
    return Alert.alert('User Blocked');
  };

  const unfriendAlert = () => {
    return Alert.alert('User Removed from Friends');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={gotoProfile}
        style={styles.backButtonContainer}>
        <Icon name="arrow-back" size={30} color="#1E2A78" style={styles.icon} />
        <Text style={styles.backButtonText}>Profile</Text>
      </TouchableOpacity>
      <SegmentControl
        options={options}
        selectedOption={selectedOption}
        onOptionPress={setSelectedOption}
      />

      {/* <Text style={styles.header}>Friends</Text> */}
      {selectedOption === 'Your Friends' && (
        <View style={{flex: 1}}>
          <FlatList
            data={friends}
            keyExtractor={(item: any) => item.relationship._id.toString()}
            renderItem={({item}) => (
              <View style={styles.listElement}>
                {/* Profile picture */}
                <Image
                  source={{uri: 'https://via.placeholder.com/50'}} // Placeholder image URL
                  style={styles.profilePicture}
                />
                {/* User details */}
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{item.username}</Text>
                </View>

                <TouchableOpacity onPress={() => openModal(item)}>
                  <Icon name="ellipsis-vertical" size={24} color="#1E2A78" />
                </TouchableOpacity>
              </View>
            )}
          />
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {/* <Text style={styles.modalHeader}>
          Actions for {selectedFriend?.username}
        </Text> */}
                {/* Block Button */}
                <Pressable
                  style={[styles.modalButton]}
                  onPress={() => {
                    blockFriend(selectedFriend?.relationship._id, userId);

                    closeModal();
                    fetchData();
                    blockAlert();
                  }}>
                  <Text style={[styles.modalButtonText, {color: 'red'}]}>
                    Block
                  </Text>
                </Pressable>
                {/* Unfriend Button */}
                <Pressable
                  style={[styles.modalButton]}
                  onPress={() => {
                    deleteRelationship(selectedFriend?.relationship._id);

                    closeModal();
                    fetchData();
                    unfriendAlert();
                  }}>
                  <Text style={styles.modalButtonText}>Unfriend</Text>
                </Pressable>
                {/* Cancel Button */}
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}

      <View style={{flex: 1}}>
        {selectedOption === 'Add Friends' && (
          <View style={{flex: 1}}>
            {/* Header */}
            <Text style={styles.header}>Send Friend Request</Text>

            {/* Input Section */}
            <View style={styles.addContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={friendRequestUsername}
                onChangeText={setFriendRequestUsername}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendFriendRequest}>
                <Icon name="send" size={30} color="#1E2A78" />
              </TouchableOpacity>
            </View>

            {/* Pending Friend Requests */}
            <Text style={styles.header}>Pending Friend Requests</Text>
            <View style={{flex: 1}}>
              {/* Filter Buttons */}
              <View style={styles.filterContainer}>
                <Pressable
                  style={[
                    styles.filterButton,
                    filter === 'Received' && styles.activeFilterButton,
                  ]}
                  onPress={() => setFilter('Received')}>
                  <Text
                    style={[
                      styles.filterText,
                      filter === 'Received' && styles.activeFilterText,
                    ]}>
                    Received
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterButton,
                    filter === 'Sent' && styles.activeFilterButton,
                  ]}
                  onPress={() => setFilter('Sent')}>
                  <Text
                    style={[
                      styles.filterText,
                      filter === 'Sent' && styles.activeFilterText,
                    ]}>
                    Sent
                  </Text>
                </Pressable>
              </View>

              {/* Filtered List */}
              <FlatList
                data={filteredData}
                keyExtractor={(item: any) => item.relationship._id.toString()}
                renderItem={({item}) => (
                  <View style={styles.listElement}>
                    <View style={styles.user}>
                      <Image
                        source={{uri: 'https://via.placeholder.com/50'}}
                        style={styles.profilePicture}
                      />
                      <Text style={styles.userName}>{item.username}</Text>
                    </View>
                    <View style={styles.actions}>
                      {filter === 'Received' && (
                        <Pressable
                          style={[styles.button, styles.approveButton]}
                          onPress={() => {
                            approveFriendRequest(item.relationship._id);
                            fetchData();
                          }}>
                          <Text style={styles.buttonText}>Approve</Text>
                        </Pressable>
                      )}
                      <Pressable
                        style={styles.button}
                        onPress={() => {
                          deleteRelationship(item.relationship._id);
                          fetchData();
                        }}>
                        <Icon name="trash-outline" size={20} color="#1E2A78" />
                      </Pressable>
                    </View>
                  </View>
                )}
                contentContainerStyle={{paddingBottom: 20}}
              />
            </View>
          </View>
        )}
      </View>

      {/* <Text style={styles.header}>Blocked Users</Text> */}
      {selectedOption === 'Blocked Users' && (
        <FlatList
          data={blockedUsers}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.listElement}>
                {/* Profile picture */}
                <Image
                  source={{uri: 'https://via.placeholder.com/50'}} // Placeholder image URL
                  style={styles.profilePicture}
                />
                {/* User details */}
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{item.username}</Text>
                </View>

                <Pressable
                          style={[styles.button, styles.approveButton]}
                          onPress={() => {
                            deleteRelationship(item.relationship._id);
                  fetchData();
                          }}>
                          <Text style={styles.buttonText}>Unblock</Text>
                        </Pressable>
              </View>
            // <View style={styles.listElement}>
            //   <Text>{item.username}</Text>
            //   <Pressable
            //     style={styles.button}
            //     onPress={() => {
            //       deleteRelationship(item.relationship._id);
            //       fetchData();
            //     }}>
            //     <Text>Unblock</Text>
            //   </Pressable>
            // </View>
          )}
        />
      )}
        

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
    color: '#1E2A78',
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
    elevation: 3,
    width: '85%',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 12,
    color: '#1E2A78',
    fontWeight: 'bold',
  },

  listElement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
    // margin: 10,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    color: '#333',
    marginHorizontal: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  approveButton: {
    backgroundColor: '#1E2A78',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  activeFilterButton: {
    backgroundColor: '#1E2A78',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterText: {
    color: '#FFF',
  },
  requestContainer: {
    // margin: 20,
    marginTop: 10,
  },
  addContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sendButton: {
    marginLeft: 2,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    zIndex: 1001,
    pointerEvents: 'auto',
  },

  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },

  modalButton: {
    width: '100%', // Buttons take up full width of the modal
    // paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 10,
  },

  modalButtonText: {
    color: '#1E2A78',
    fontSize: 16,
  },

  modalCancelButton: {
    marginTop: 10,
  },
});
