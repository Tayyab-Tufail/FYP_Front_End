import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Font from "expo-font";
import { AppContext } from "../Components/AppContext";
import api from "../api";

const ChangepasswordScreen = () => {
  const { userData, userType } = useContext(AppContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      MontserratRegular: require("../../assets/fonts/Montserrat-Regular.ttf"),
      MontserratBold: require("../../assets/fonts/Montserrat-Bold.ttf"),
      MontserratLight: require("../../assets/fonts/Montserrat-Light.ttf"),
      MontserratMedium: require("../../assets/fonts/Montserrat-Medium.ttf"),
      MontserratSemiBold: require("../../assets/fonts/Montserrat-SemiBold.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "The new passwords do not match.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await api.post(
        "/profile/change-password",
        {
          oldPassword,
          newPassword,
          confirmPassword,
          userType, // Pass userType from the context or storage
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert(
        "Success",
        response.data.message || "Password changed successfully."
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image source={require("../Images/1st_rm.png")} style={styles.logo} />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} style={styles.icon} />
        <TextInput
          secureTextEntry={hidePassword}
          style={styles.input}
          placeholder="Old Password"
          value={oldPassword}
          onChangeText={(text) => setOldPassword(text)}
        />
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          <Icon
            name={hidePassword ? "eye-off" : "eye"}
            size={24}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-reset" size={24} style={styles.icon} />
        <TextInput
          secureTextEntry={hidePassword}
          style={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
        />
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          <Icon
            name={hidePassword ? "eye-off" : "eye"}
            size={24}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-check" size={24} style={styles.icon} />
        <TextInput
          secureTextEntry={hidePassword}
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          <Icon
            name={hidePassword ? "eye-off" : "eye"}
            size={24}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
        <Text style={styles.buttonText}>CHANGE PASSWORD</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20, // Adjusted spacing
    marginTop: 30,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0", // Subtle gray for border
    borderRadius: 12, // Rounded corners for modern look
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    alignItems: "center",
    width: "90%",
    alignSelf: "center", // Centers the input field
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Subtle elevation for Android
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "MontserratMedium",
    paddingVertical: 10,
    color: "#1A202C",
  },
  icon: {
    marginRight: 10, // Added spacing around the icon
    color: "#007AFF",
  },
  button: {
    backgroundColor: "#007AFF", // Vibrant blue for primary action
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 30,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
   fontSize: 18,
    color: "white",
    fontFamily: "MontserratSemiBold",
    textTransform: "uppercase",  // Applied font style
  },
});

export default ChangepasswordScreen;
