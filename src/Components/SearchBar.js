// SearchBar.js
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchBar = ({ searchQuery, onSearchChange, onSearchIconPress }) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      {/* Search Icon */}
      <TouchableOpacity onPress={onSearchIconPress} style={styles.iconContainer}>
        <Icon name="search" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    width: '90%',
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  iconContainer: {
    padding: 8,
  },
});

export default SearchBar;
