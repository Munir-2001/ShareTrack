import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';

export default function UserProfile({ route }: { route: any }) {
    const { userId, username, photo } = route.params;
    const navigation = useNavigation();
  
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.topHalf} >
        <TouchableOpacity style={styles.backIconContainer} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
            </View>
  
        <View style={styles.profilePictureContainer}>
          <Image
            source={{ uri: photo || 'https://via.placeholder.com/100' }}
            style={styles.profilePicture}
          />
        </View>
  
        <View style={styles.bottomHalf}>
          <Text style={styles.userName}>{username}</Text>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    profilePicture: {
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 3,
      borderColor: '#FFF',
    },
    userName: {
      fontSize: 24,
      color: '#1E2A78',
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 20,
    },
    topHalf: {
      backgroundColor: 'rgba(30, 42, 120, 0.85)',
      width: '100%',
      height: 150,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 5,
    },
    bottomHalf: {
      alignItems: 'center',
      marginTop: 70,
    },
    profilePictureContainer: {
      position: 'absolute',
      top: 90,
      alignSelf: 'center',
    },
    backIconContainer: {
        position: 'absolute',
        top: 20, 
        left: 20,
      },
  });
  