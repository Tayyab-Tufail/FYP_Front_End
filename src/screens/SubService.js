import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';  // Make sure to import useNavigation

const servicesData = [
  { id: '1', title: 'AC Dismounting/Removal' },
  { id: '2', title: 'AC Installation Service' }
];

const SubService = () => {
  const navigation = useNavigation(); // Hook for navigation
  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleSelectService = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleAddServices = () => {
    const selectedServices = Array.from(selectedIds).map(id => 
      servicesData.find(service => service.id === id)
    );
    navigation.navigate('MyServicesScreen', { selectedServices });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.title}</Text>
      <Checkbox
        value={selectedIds.has(item.id)}
        onValueChange={() => handleSelectService(item.id)}
        color={selectedIds.has(item.id) ? '#007AFF' : 'gray'}
        style={styles.checkbox}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>AC Services at Home</Text>
      <FlatList
        data={servicesData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleAddServices}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 22,
    backgroundColor: 'white'
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
    marginBottom: 10,
    color: '#007AFF',
    left: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 5,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-between'
  },
  itemText: {
    fontSize: 16
  },
  checkbox: {
    marginLeft: 'auto'
  },
  buttonContainer: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    bottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  }
});

export default SubService;
