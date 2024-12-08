import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  useColorScheme,
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';

import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Icon from '@react-native-vector-icons/ionicons';

import {useAppDispatch, useAppSelector} from '../../Redux/Store/hooks';
import {API_URL} from '../../constants';

export default function ProfileScreen({navigation}: PropsWithChildren<any>) {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useAppDispatch();

  const user = useAppSelector((state: {auth: any}) => state.auth.user);
  const isAuth = useAppSelector((state: {auth: any}) => state.auth.isAuth);
  const [modalVisible, setModalVisible] = useState(false);
  const [adjustmentVisible, setAdjustmentVisible] = useState(false);

  const [userState, setUserState] = useState(user);
  const [photo, setPhoto] = useState<any | null>({
    uri: null,
    fileName: null,
    type: null,
  });

  const pickImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
    };

    const response = await launchImageLibrary(options);
    console.log(response);

    if (response.didCancel) {
      Alert.alert('Cancelled', 'Image selection cancelled');
    } else if (response.errorCode) {
      Alert.alert('Error', response.errorMessage);
    } else {
      if (response.assets && response.assets.length > 0) {
        console.log(response);
        const selectedPhoto = response.assets[0];
        setPhoto(selectedPhoto || null);
        setAdjustmentVisible(true);
      }
    }
  };

  const uploadImage = async () => {
    if (!photo) {
      Alert.alert('No Image Selected', 'Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: photo.uri,
      name: photo.fileName,
      type: photo.type,
    });
    formData.append('username', user.username); // Replace with actual username or dynamic input.

    try {
      const response = await fetch(`${API_URL}/api/auth/photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `Photo URL: ${data.photoUrl}`);
      } else {
        Alert.alert('Upload Error', data.message || 'Something went wrong.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
    setAdjustmentVisible(false);
  };

  const handleLogout = () => {
    dispatch({type: 'LOGOUT'});
  };

  const gotoConnections = () => {
    navigation.navigate('CONNECTIONS');
  };
  const openModal = () => {
    setModalVisible(true);
    console.log('open modal');
  };

  const closeModal = () => {
    console.log('Closing Modal');
    setModalVisible(false);
    console.log('Modal Visible State:', modalVisible); // Log after state chang
  };

  return (
    <View
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        flex: 1,
      }}>
      {user ? (
        <>
          <View style={styles.topHalf} />

          <View style={styles.profilePictureContainer}>
            <TouchableOpacity onPress={openModal}>
              <Image
                source={{
                  uri:
                    user.photo ||
                    photo.uri ||
                    'https://via.placeholder.com/100',
                }}
                style={styles.profilePicture}
              />
            </TouchableOpacity>
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                <Pressable
                    style={[styles.modalButton]}
                    onPress={() => {
                      closeModal();
                    }}>
                    <Text style={[styles.modalButtonText, {color: 'red'}]}>
                      Remove Profile Picture
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton]}
                    onPress={() => {
                      pickImage();

                      closeModal();
                    }}>
                    <Text style={[styles.modalButtonText]}>
                      Change Profile Picture
                    </Text>
                  </Pressable>
                  
                  {/* Cancel Button */}
                  <TouchableOpacity onPress={closeModal}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              visible={adjustmentVisible}
              transparent={false}
              animationType="slide">
              <View style={styles.adjustmentContainer}>
                <Text style={styles.adjustmentHeader}>
                  Your Profile Picture
                </Text>
                {photo && (
                  <Image
                    source={{uri: photo.uri}}
                    style={styles.adjustedImage}
                  />
                )}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={uploadImage}>
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setAdjustmentVisible(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* <View style={{zIndex: 999}}>
              <Button title="Change Photo" onPress={pickImage} />
              <Button title="Upload Photo" onPress={uploadImage} />
            </View> */}
          </View>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.userName}>{user.username || user.email}</Text>
            <View style={styles.amountBox}>
              <View style={styles.column}>
                <Text style={styles.columnTitle}>Receivable</Text>
                <Text style={styles.amount}>$1000</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.columnTitle}>Payable</Text>
                <Text style={styles.amount}>$500</Text>
              </View>
            </View>

            <View style={styles.itemsBox}>
              <View style={styles.row}>
                <TouchableOpacity style={styles.item}>
                  <Icon name="people" size={24} color="#1E2A78" />
                  <Text style={styles.itemText}>Groups</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={gotoConnections}>
                  <Icon name="person-add" size={24} color="#1E2A78" />
                  <Text style={styles.itemText}>Friends</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <TouchableOpacity style={styles.item}>
                  <Icon name="analytics" size={24} color="#1E2A78" />
                  <Text style={styles.itemText}>Insights</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                  <Icon name="time" size={24} color="#1E2A78" />
                  <Text style={styles.itemText}>History</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <TouchableOpacity style={styles.item}>
                  <Icon name="calendar" size={24} color="#1E2A78" />
                  <Text style={styles.itemText}>Upcoming Transactions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                  <Icon name="mail" size={24} color="#1E2A78" />
                  <Text style={styles.itemText}>Pending Requests</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity style={styles.item}>
                  <Icon name="settings" size={24} color="#1E2A78" />
                  <Text style={styles.itemText}>Account Settings</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}>
              <Icon name="log-out" size={24} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      ) : (
        <Text style={styles.userInfo}>No user is logged in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    color: '#1E2A78',
    fontWeight: 'bold',
    textAlign: 'center',
    // marginTop: 10,
    zIndex: 5,
    // position: 'absolute',
    // top: 220,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  topHalf: {
    backgroundColor: 'rgba(30, 42, 120, 0.85)',
    width: '100%',
    height: 150,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 70, // Adjust for the space taken by the profile picture and name
    paddingBottom: 20, // Optional for adding some space at the bottom
    backgroundColor: 'fff',
    zIndex: 5,
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  profilePictureContainer: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#FFF',
    zIndex: 1,
  },
  amountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1E2A78',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemsBox: {
    marginTop: 30,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    fontSize: 14,
    fontWeight: 'bold',
    // color: '#1E2A78',
    color: '#333',
    marginTop: 5,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E2A78', // Blue color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  adjustmentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  adjustmentHeader: {
    fontSize: 18,
    marginBottom: 20,
  },
  adjustedImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 150,
  },
  button: {
    backgroundColor: '#1E2A78',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginTop: 20, // Optional spacing from other elements
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
