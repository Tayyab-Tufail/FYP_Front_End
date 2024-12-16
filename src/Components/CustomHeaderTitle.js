// src/components/CustomHeaderTitle.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CustomHeaderTitle = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../Images/1st_rm.png')} style={styles.logo} /> 
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    logo: {
      width: 80,
      height: 80,
      left: 135,
      position: 'absolute',
    }
  });
  
export default CustomHeaderTitle;
