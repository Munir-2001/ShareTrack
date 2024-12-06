import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

export default function Header() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
       {navigation.toggleDrawer && (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.drawerIcon}>
          <Text style={styles.drawerIconText}>☰</Text>
        </TouchableOpacity>
      )}


      <Text style={styles.logo}>
        SHARE<Text style={styles.track}>TRACK</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70, 
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20, 
    elevation: 4,
  },
  drawerIcon: {
    position: 'absolute',
    left: 10, 
    top: 20, 
  },
  drawerIconText: {
    fontSize: 30,
    color: '#1E2A78', 
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E2A78',
  },
  track: {
    color: '#E63946', 
  },
});