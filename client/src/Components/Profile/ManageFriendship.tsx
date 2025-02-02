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
  getRequestsForLending,
} from './relationshipUtils'; // Adjust the path if needed
import {SegmentControl} from './SegmentControl';
import SendMoney from './SendMoney'; // Import the SendMoney component
import RequestMoney from './RequestMoneyModal';
import {useAppDispatch, useAppSelector} from '../../Redux/Store/hooks';

const options = ['Add Friends', 'Your Friends', 'Blocked Users'];
interface User {
  _id: string;
  username: string;
  relationship: {
    _id: string;
  };
  photo: string;
}

export default function ConnectionScreen({navigation}: PropsWithChildren<any>) {
  // const dispatch = useAppDispatch();
  const user = useAppSelector((state: {auth: any}) => state.auth.user);
  const isAuth = useAppSelector((state: {auth: any}) => state.auth.isAuth);
  const [userId, setUserId] = useState(user.id || null); // Replace with dynamic user ID
  const [friends, setFriends] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showMoneyRequests, setShowMoneyRequests] = useState(false);
  const [moneyRequests, setMoneyRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [friendRequestUsername, setFriendRequestUsername] = useState('');
  const [selectedOption, setSelectedOption] = useState('Your Friends');
  const [filter, setFilter] = useState('Received');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]); 

  const filteredData = filter === 'Received' ? pendingRequests : sentRequests;

  // const fetchMoneyRequests = async () => {
  //   const requests = await getRequestsForLending(user.username);
  //   setMoneyRequests(requests);
  // };
  const fetchMoneyRequests = async () => {
    try {
      if (!user || !user.username) {
        throw new Error("User information is missing.");
      }
  
      const requests = await getRequestsForLending(user.username);
      setMoneyRequests(requests || []);
    } catch (error) {
      console.error("❌ Error fetching money requests:", error);
      Alert.alert("Error", "Failed to load money requests.");
    }
  };
  

  // useEffect(() => {
  //   setUserId(user?._id || null);
  // }, [user]);

  useEffect(() => {
    if (user && user.id) {  // ✅ Fix: Use `user.id` instead of `user._id`
      console.log("✅ Setting userId:", user.id);
      setUserId(user.id);
    } else {
      console.warn("❌ userId is undefined, user object:", user);
    }
  }, [user]);
  

  useEffect(() => {
    if (isAuth && userId) {
      fetchData();
    }
  }, [userId, selectedOption, blockedUsers, friends, pendingRequests, sentRequests]);


 const toggleMoneyRequests = () => {
  if (!showMoneyRequests) {
    if (user && user.username) {
      fetchMoneyRequests();
    } else {
      Alert.alert("Error", "User information is not available.");
    }
  }
  setShowMoneyRequests(!showMoneyRequests);
};

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

  

  // const fetchData = async () => {
  //   try {
  //     const friendsData = await getFriends(userId);
  //     const pendingRequestsData = await getFriendRequestsReceived(userId);
  //     const sentRequestsData = await getFriendRequestsSent(userId);
  //     const blockedUsersData = await getBlockedUsers(userId);

  //     setFriends(friendsData);
  //     setPendingRequests(pendingRequestsData);
  //     setSentRequests(sentRequestsData);
  //     setBlockedUsers(blockedUsersData);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  
  // const fetchData = async () => {
  //   try {
  //     if (!userId) return;
      
  //     const friendsData = await getFriends(userId);
  //     const pendingRequestsData = await getFriendRequestsReceived(userId);
  //     const sentRequestsData = await getFriendRequestsSent(userId);
  //     const blockedUsersData = await getBlockedUsers(userId);
  
  //     setFriends(friendsData || []);
  //     setPendingRequests(pendingRequestsData || []);
  //     setSentRequests(sentRequestsData || []);
  //     setBlockedUsers(blockedUsersData || []);
  //   } catch (error) {
  //     console.error("❌ Error fetching data:", error);
  //     Alert.alert("Error", "Failed to fetch friendship data.");
  //   }
  // };
  const fetchData = async () => {
    if (!userId) {
      console.warn("❌ fetchData(): userId is undefined, skipping API calls");
      return;
    }
  
    try {
      console.log("✅ Fetching data for userId:", userId);
      const friendsData = await getFriends(userId);
      const pendingRequestsData = await getFriendRequestsReceived(userId);
      const sentRequestsData = await getFriendRequestsSent(userId);
      const blockedUsersData = await getBlockedUsers(userId);
  
      setFriends(friendsData || []);
      setPendingRequests(pendingRequestsData || []);
      setSentRequests(sentRequestsData || []);
      setBlockedUsers(blockedUsersData || []);
    } catch (error) {
      console.error("❌ fetchData(): Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch friendship data.");
    }
  };
  
  
  
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = friends.filter((friend) =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(friends);
    }
  }, [searchQuery, friends]);


  const handleSendFriendRequest = async () => {
    if (!friendRequestUsername) return;

    if (friendRequestUsername === user.username) {
      return Alert.alert('You cannot send a friend request to yourself!');
    }

    try {
      await requestFriend(userId, friendRequestUsername);
      Alert.alert('Friend request sent!');
      setFriendRequestUsername(''); 
      fetchData();
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const gotoProfile = () => {
    navigation.navigate('PROFILE');
  };

  // const openModal = (friend:User) => {
  //   setSelectedFriend(friend);
  //   setModalVisible(true);
  //   console.log('open modal');
  // };

  const openModal = (friend: User) => {
    if (!friend) return;
    setSelectedFriend(friend);
    setModalVisible(true);
    console.log("✅ Opened modal for:", friend.username);
  };
  
  const closeModal = ():void => {
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
            <TextInput
            style={styles.searchInput}
            placeholder="Search friends by username"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />



          <FlatList
            data={filteredFriends}
            keyExtractor={(item:any ) => item.relationship._id.toString()}
            renderItem={({item}) => (
              <View style={styles.listElement}>
                {/* Profile picture */}
                <Image
                  source={{uri: 'https://via.placeholder.com/50'}} // Placeholder image URL
                  style={styles.profilePicture}
                />
                {/* User details */}
                <TouchableOpacity
                  style={styles.userDetails}
                  onPress={() => {
                    console.log('Selected friend:', item);
                    console.log('Selected friend username:', item.username);
                     // Debug log
                    setSelectedFriend(item); // Set the selected friend
                  }}>
                  <Text style={styles.userName}>{item.username}</Text>
                </TouchableOpacity>

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
                <Pressable
                style={[styles.modalButton]}
                onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      )}

      {/* <View style={{flex: 1}}> */}
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
      {/* </View> */}

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
        
      {selectedFriend && (
        <SendMoney
          friendUsername={selectedFriend.username}
          onClose={() => {
            setSelectedFriend(null);
          }} // Close the SendMoney component
        />
      )}

      {/* {selectedFriend &&(
        <RequestMoney
        friendUsername={selectedFriend.username}
        onClose={()=>{
          setSelectedFriend(null);
        }}
        />
      )} */}
      {selectedFriend && showMoneyRequests && (
  <RequestMoney
    friendUsername={selectedFriend.username}
    onClose={() => {
      setSelectedFriend(null);
      setShowMoneyRequests(false);
    }}
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
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
    elevation: 3,
    marginBottom: 15,
    marginTop: 10,
  },
});


// failed in trying to make ui for the respond to lending by first getting and then showing
// import React, {useState, useEffect, PropsWithChildren} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TextInput,
//   Alert,
//   TouchableOpacity,
//   Pressable,
//   Modal,
//   Image,
// } from 'react-native';
// import Icon from '@react-native-vector-icons/ionicons';
// import {
//   getFriends,
//   getFriendRequestsReceived,
//   getFriendRequestsSent,
//   blockFriend,
//   deleteRelationship,
//   approveFriendRequest,
//   requestFriend,
//   getBlockedUsers,
//   getRequestsForLending,
// } from './relationshipUtils'; // Adjust path if needed
// import {SegmentControl} from './SegmentControl';
// import SendMoney from './SendMoney'; // Import SendMoney component
// import RequestMoney from './RequestMoneyModal';
// import {useAppSelector} from '../../Redux/Store/hooks';
// import { API_URL } from '../../constants';

// const options = ['Add Friends', 'Your Friends', 'Blocked Users'];
// interface Transaction {
//   _id: string;
//   sender_username: string;
//   receiver_username: string;
//   amount: number;
//   status: string;
// }

// interface User {
//   _id: string;
//   username: string;
//   relationship: {
//     _id: string;
//   };
//   photo: string;
// }

// export default function ConnectionScreen({navigation}: PropsWithChildren<any>) {
//   const user = useAppSelector((state: {auth: any}) => state.auth.user);
//   const isAuth = useAppSelector((state: {auth: any}) => state.auth.isAuth);
//   const [userId, setUserId] = useState(user._id || null);
//   const [friends, setFriends] = useState<User[]>([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [sentRequests, setSentRequests] = useState([]);
//   const [blockedUsers, setBlockedUsers] = useState([]);
//   const [friendRequestUsername, setFriendRequestUsername] = useState('');
//   const [selectedOption, setSelectedOption] = useState('Your Friends');
//   const [filter, setFilter] = useState('Received');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredFriends, setFilteredFriends] = useState<User[]>([]);
  
//   // Money Requests State
//   const [showMoneyRequests, setShowMoneyRequests] = useState(false);
//   const [moneyRequests, setMoneyRequests] = useState([]);

//   useEffect(() => {
//     setUserId(user?._id || null);
//   }, [user]);

//   useEffect(() => {
//     if (isAuth) {
//       fetchData();
//     }
//   }, [userId, selectedOption, blockedUsers, friends, pendingRequests, sentRequests]);

//   const fetchData = async () => {
//     try {
//       const friendsData = await getFriends(userId);
//       const pendingRequestsData = await getFriendRequestsReceived(userId);
//       const sentRequestsData = await getFriendRequestsSent(userId);
//       const blockedUsersData = await getBlockedUsers(userId);

//       setFriends(friendsData);
//       setPendingRequests(pendingRequestsData);
//       setSentRequests(sentRequestsData);
//       setBlockedUsers(blockedUsersData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   // Fetch Money Requests
//   const fetchMoneyRequests = async () => {
//     const requests = await getRequestsForLending(user.username);
//     setMoneyRequests(requests);
//   };

//   // Toggle Money Requests View
//   const toggleMoneyRequests = () => {
//     setShowMoneyRequests(!showMoneyRequests);
//     if (!showMoneyRequests) fetchMoneyRequests();
//   };

//   // Handle Approve / Decline Request
//   const handleApproveRequest = async (transactionId:string) => {
//     try {
//       const response = await fetch(`${API_URL}/api/relationship/respondToRequest`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ transactionId, response: "approved" }),
//       });

//       if (!response.ok) throw new Error('Failed to approve request.');
//       Alert.alert('Success', 'Money request approved.');
//       fetchMoneyRequests();
//     } catch (error:unknown) {
//       const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
//       Alert.alert('Error', errMessage);
//         }
//   };

//   const handleDeclineRequest = async (transactionId:string) => {
//     try {
//       const response = await fetch(`${API_URL}/api/relationship/respondToRequest`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ transactionId, response: "declined" }),
//       });

//       if (!response.ok) throw new Error('Failed to decline request.');
//       Alert.alert('Success', 'Money request declined.');
//       fetchMoneyRequests();
//     } catch (error:unknown) {
//       // Alert.alert('Error', error.message);
//       const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
//     Alert.alert('Error', errMessage);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => navigation.navigate('PROFILE')} style={styles.backButtonContainer}>
//         <Icon name="arrow-back" size={30} color="#1E2A78" style={styles.icon} />
//         <Text style={styles.backButtonText}>Profile</Text>
//       </TouchableOpacity>

//       <SegmentControl options={options} selectedOption={selectedOption} onOptionPress={setSelectedOption} />

//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search friends by username"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//       />

//       {/* View Money Requests Button */}
//       <TouchableOpacity
//         style={[styles.viewRequestsButton, showMoneyRequests ? styles.activeTab : styles.inactiveTab]}
//         onPress={toggleMoneyRequests}
//       >
//         <Text style={styles.viewRequestsText}>
//           {showMoneyRequests ? "Hide Money Requests" : "View Money Requests"}
//         </Text>
//       </TouchableOpacity>

//       {/* Show money requests OR friends list based on toggle */}
//       {showMoneyRequests ? (
//        <FlatList
//        data={moneyRequests}
//        keyExtractor={(item) => item._id}
//        renderItem={({ item }: { item: Transaction }) => (
//          <View style={styles.moneyRequestItem}>
//            <Text>{item.sender_username} requested ${item.amount}</Text>
//            <View style={styles.buttonContainer}>
//              <Pressable style={styles.approveButton} onPress={() => handleApproveRequest(item._id)}>
//                <Text style={styles.buttonText}>Approve</Text>
//              </Pressable>
//              <Pressable style={styles.declineButton} onPress={() => handleDeclineRequest(item._id)}>
//                <Text style={styles.buttonText}>Decline</Text>
//              </Pressable>
//            </View>
//          </View>
//        )}
//      />
     
//       ) : (
//         <FlatList
//           data={filteredFriends}
//           keyExtractor={(item) => item.relationship._id.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.listElement}>
//               <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profilePicture} />
//               <TouchableOpacity style={styles.userDetails}>
//                 <Text style={styles.userName}>{item.username}</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// // Styles (same as before, add new styles for buttons)
// const styles = StyleSheet.create({
//   viewRequestsButton: { paddingVertical: 12, marginVertical: 10, borderRadius: 8, alignItems: 'center', width: '100%' },
//   activeTab: { backgroundColor: '#1E2A78' },
//   inactiveTab: { backgroundColor: '#ccc' },
//   viewRequestsText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   moneyRequestItem: { padding: 15, marginVertical: 5, backgroundColor: '#f9f9f9', borderRadius: 5 },
//   buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
//   approveButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, flex: 1, marginRight: 5 },
//   declineButton: { backgroundColor: '#D32F2F', padding: 10, borderRadius: 5, flex: 1, marginLeft: 5 },
//   buttonText: { color: '#fff', fontWeight: 'bold' },
//   container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#fff',
//       },
//       header: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginVertical: 8,
//         color: '#1E2A78',
//       },
//       user: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//       },
//       input: {
//         height: 50,
    
//         borderWidth: 1,
//         borderColor: '#DDD',
//         borderRadius: 10,
//         paddingHorizontal: 12,
//         backgroundColor: '#f9f9f9',
//         fontSize: 16,
//         color: '#333',
//         elevation: 3,
//         width: '85%',
//       },
//       backButtonContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 10,
//       },
//       icon: {
//         marginRight: 10,
//       },
//       backButtonText: {
//         fontSize: 12,
//         color: '#1E2A78',
//         fontWeight: 'bold',
//       },
    
//       listElement: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         borderBottomWidth: 1,
//         borderBottomColor: '#ccc',
//         padding: 8,
//         // margin: 10,
//       },
//       profilePicture: {
//         width: 80,
//         height: 80,
//         borderRadius: 40,
//         marginRight: 15,
//       },
//       userDetails: {
//         flex: 1,
//       },
//       userName: {
//         fontSize: 18,
//         color: '#333',
//         marginHorizontal: 10,
//       },
//       actions: {
//         flexDirection: 'row',
//         alignItems: 'flex-end',
//       },
//       button: {
//         paddingVertical: 8,
//         paddingHorizontal: 10,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'flex-end',
//       },
//       filterContainer: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         marginBottom: 10,
//         borderRadius: 20,
//       },
//       filterButton: {
//         paddingVertical: 8,
//         paddingHorizontal: 20,
//         backgroundColor: '#F5F5F5',
//       },
//       activeFilterButton: {
//         backgroundColor: '#1E2A78',
//       },
//       filterText: {
//         fontSize: 14,
//         color: '#333',
//       },
//       activeFilterText: {
//         color: '#FFF',
//       },
//       requestContainer: {
//         // margin: 20,
//         marginTop: 10,
//       },
//       addContainer: {
//         flexDirection: 'row',
//         marginBottom: 20,
//       },
//       sendButton: {
//         marginLeft: 2,
//         backgroundColor: '#fff',
//         padding: 10,
//         borderRadius: 10,
//       },
//       modalOverlay: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         zIndex: 1000,
//       },
//       modalContent: {
//         width: '100%',
//         backgroundColor: '#FFF',
//         borderRadius: 10,
//         padding: 20,
//         alignItems: 'center',
//         zIndex: 1001,
//         pointerEvents: 'auto',
//       },
    
//       modalHeader: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         color: '#333',
//       },
    
//       modalButton: {
//         width: '100%', // Buttons take up full width of the modal
//         // paddingVertical: 12,
//         borderRadius: 5,
//         alignItems: 'center',
//         paddingBottom: 10,
//         marginBottom: 10,
//       },
    
//       modalButtonText: {
//         color: '#1E2A78',
//         fontSize: 16,
//       },
    
//       modalCancelButton: {
//         marginTop: 10,
//       },
//       searchInput: {
//         height: 50,
//         borderWidth: 1,
//         borderColor: '#DDD',
//         borderRadius: 10,
//         paddingHorizontal: 12,
//         backgroundColor: '#f9f9f9',
//         fontSize: 16,
//         color: '#333',
//         elevation: 3,
//         marginBottom: 15,
//         marginTop: 10,
//       }
// });

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#fff',
// //   },
// //   header: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginVertical: 8,
// //     color: '#1E2A78',
// //   },
// //   user: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //   },
// //   input: {
// //     height: 50,

// //     borderWidth: 1,
// //     borderColor: '#DDD',
// //     borderRadius: 10,
// //     paddingHorizontal: 12,
// //     backgroundColor: '#f9f9f9',
// //     fontSize: 16,
// //     color: '#333',
// //     elevation: 3,
// //     width: '85%',
// //   },
// //   backButtonContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   icon: {
// //     marginRight: 10,
// //   },
// //   backButtonText: {
// //     fontSize: 12,
// //     color: '#1E2A78',
// //     fontWeight: 'bold',
// //   },

// //   listElement: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ccc',
// //     padding: 8,
// //     // margin: 10,
// //   },
// //   profilePicture: {
// //     width: 80,
// //     height: 80,
// //     borderRadius: 40,
// //     marginRight: 15,
// //   },
// //   userDetails: {
// //     flex: 1,
// //   },
// //   userName: {
// //     fontSize: 18,
// //     color: '#333',
// //     marginHorizontal: 10,
// //   },
// //   actions: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-end',
// //   },
// //   button: {
// //     paddingVertical: 8,
// //     paddingHorizontal: 10,
// //     borderRadius: 20,
// //     justifyContent: 'center',
// //     alignItems: 'flex-end',
// //   },
// //   approveButton: {
// //     backgroundColor: '#1E2A78',
// //   },

// //   buttonText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //   },
// //   filterContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     marginBottom: 10,
// //     borderRadius: 20,
// //   },
// //   filterButton: {
// //     paddingVertical: 8,
// //     paddingHorizontal: 20,
// //     backgroundColor: '#F5F5F5',
// //   },
// //   activeFilterButton: {
// //     backgroundColor: '#1E2A78',
// //   },
// //   filterText: {
// //     fontSize: 14,
// //     color: '#333',
// //   },
// //   activeFilterText: {
// //     color: '#FFF',
// //   },
// //   requestContainer: {
// //     // margin: 20,
// //     marginTop: 10,
// //   },
// //   addContainer: {
// //     flexDirection: 'row',
// //     marginBottom: 20,
// //   },
// //   sendButton: {
// //     marginLeft: 2,
// //     backgroundColor: '#fff',
// //     padding: 10,
// //     borderRadius: 10,
// //   },
// //   modalOverlay: {
// //     flex: 1,
// //     justifyContent: 'flex-end',
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //     zIndex: 1000,
// //   },
// //   modalContent: {
// //     width: '100%',
// //     backgroundColor: '#FFF',
// //     borderRadius: 10,
// //     padding: 20,
// //     alignItems: 'center',
// //     zIndex: 1001,
// //     pointerEvents: 'auto',
// //   },

// //   modalHeader: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginBottom: 20,
// //     color: '#333',
// //   },

// //   modalButton: {
// //     width: '100%', // Buttons take up full width of the modal
// //     // paddingVertical: 12,
// //     borderRadius: 5,
// //     alignItems: 'center',
// //     paddingBottom: 10,
// //     marginBottom: 10,
// //   },

// //   modalButtonText: {
// //     color: '#1E2A78',
// //     fontSize: 16,
// //   },

// //   modalCancelButton: {
// //     marginTop: 10,
// //   },
// //   searchInput: {
// //     height: 50,
// //     borderWidth: 1,
// //     borderColor: '#DDD',
// //     borderRadius: 10,
// //     paddingHorizontal: 12,
// //     backgroundColor: '#f9f9f9',
// //     fontSize: 16,
// //     color: '#333',
// //     elevation: 3,
// //     marginBottom: 15,
// //     marginTop: 10,
// //   },
// // });
