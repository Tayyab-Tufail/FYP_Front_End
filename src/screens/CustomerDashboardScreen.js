// CustomerDashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomerDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.dashboardText}>Customer Dashboard</Text>
      {/* Rest of your component */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  dashboardText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  // ... any other styles you need
});

export default CustomerDashboardScreen;
