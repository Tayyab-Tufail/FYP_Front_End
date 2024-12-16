import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomCheckbox = ({ isChecked, onToggle }) => {
  return (
    <TouchableOpacity
      style={styles.checkbox}
      onPress={onToggle}>
      <Icon
        name={isChecked ? "check-square" : "square-o"}
        size={30}
        color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    padding: 15,
    marginLeft: 35,
    marginRight: 350,
  },
});

export default CustomCheckbox;
