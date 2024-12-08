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
  ScrollView,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Icon from '@react-native-vector-icons/ionicons';

import {useAppDispatch, useAppSelector} from '../../Redux/Store/hooks';

export default function ProfileScreen({navigation}: PropsWithChildren<any>) {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useAppDispatch();

  const user = useAppSelector((state: {auth: any}) => state.auth.user);
  const isAuth = useAppSelector((state: {auth: any}) => state.auth.isAuth);

  const [userState, setUserState] = useState(user);

  const handleLogout = () => {
    dispatch({type: 'LOGOUT'});
  };

  const gotoConnections = () => {
    navigation.navigate('CONNECTIONS');
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
            <Image
              source={{uri: 'https://via.placeholder.com/100'}}
              style={styles.profilePicture}
            />
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
  buttonContainer: {
    marginTop: 20, // Add space above the buttons
    paddingHorizontal: 20, // Optional for adding some space around buttons
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
});
