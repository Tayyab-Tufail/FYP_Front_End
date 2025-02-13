import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();  // This hooks directly into the navigation context

  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Text>Back</Text>
    </TouchableOpacity>
  );
};

export default BackButton;
