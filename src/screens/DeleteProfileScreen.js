import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../Components/AppContext";
import api from "../api";

const DeleteProfileScreen = () => {
  const { userType } = useContext(AppContext);

  const [mobileNumber, setMobileNumber] = useState("");
  const navigation = useNavigation();

  const handleDeleteAccount = async () => {
    if (!mobileNumber.trim()) {
      Alert.alert("Error", "Please fill in the mobile number field.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken"); // Get token
      console.log(token);

      // Make API call to delete the profile
      const response = await api.delete("/profile/delete-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { mobileNumber, userType }, // Send data in the 'data' field
      });

      // If deletion is successful
      Alert.alert(
        "Account Deleted",
        response.data.message,
        [
          {
            text: "OK",
            onPress: async () => {
              await AsyncStorage.clear(); // Clear all stored data
              navigation.navigate("Welcome"); // Navigate to welcome screen
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to delete the account. Please try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.inner}>
          <Image source={require("../Images/1st_rm.png")} style={styles.logo} />
          <TextInput
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            style={[styles.input, styles.shadow]}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.deleteButton, styles.shadow]}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inner: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    top: -50, // Adjust margin as needed
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: "white",
    top: -30,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center", // Center the button horizontally
    marginBottom: 70,
  },
  deleteButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    width: "50%",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "MontserratSemiBold",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default DeleteProfileScreen;
