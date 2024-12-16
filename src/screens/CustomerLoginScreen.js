import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import api from "../api"; // Import Axios instance
import { AppContext } from "../Components/AppContext";

const CustomerLoginScreen = () => {
  const navigation = useNavigation();
  const { updateUserData, updateUserType, userData } = useContext(AppContext); // Access context functions

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
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

    loadFonts();
  }, []);

  const handleLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    try {
      const response = await api.post("/auth/customer/login", {
        mobileNumber: `+92${mobileNumber}`,
        password,
      });

      const { token, _id, fullName, image, experience, gender, user } =
        response.data; // Extract more user data if needed

      // Store the user data and token in AsyncStorage
      await AsyncStorage.setItem("authToken", token);

      // Update global context
      updateUserData({
        _id,
        fullName,
        mobileNumber,
        image,
        experience,
        gender,
        token,
        ...user,
      });
      updateUserType("customer");

      // Navigate to the dashboard or home screen
      navigation.navigate("ProfessionalDashboard", { fullName });
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Image source={require("../Images/1st_rm.png")} style={styles.logo} />
          <Text style={styles.welcomeText}>Welcome to Asan Mazdoor</Text>

          <View style={styles.inputContainer}>
            <Icon name="phone" size={22} color="#000" style={styles.icon} />
            <Text style={styles.prefix}>+92</Text>
            <TextInput
              placeholder="Enter mobile number"
              value={mobileNumber}
              keyboardType="phone-pad"
              onChangeText={(text) =>
                setMobileNumber(text.replace(/[^0-9]/g, "").slice(0, 10))
              }
              style={[styles.input, { paddingLeft: 35 }]}
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={25} color="black" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.passwordIconContainer}
            >
              <Icon
                name={passwordVisible ? "eye" : "eye-slash"}
                size={25}
                color="black"
                style={styles.passwordIcon}
              />
            </TouchableOpacity>
          </View>

          
          
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>
              Forgot Password? Click here
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    width: "100%",
    borderTopColor: "black",
    borderTopWidth: 1,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 55,
    marginTop: -30,
  },
  welcomeText: {
    fontSize: 22,
    marginBottom: 60,
    marginTop: -80,
    fontFamily: "MontserratBold",
    color: "#007AFF",
    textAlign: "center", // Ensures the text is centered horizontally
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    height: 50,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "#FFFFFF", // Ensure a solid background for shadow visibility
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 4,
  },

  input: {
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 5,
    fontFamily: "MontserratRegular",
  },
  icon: {
    padding: 10,
    color: "#333333",
  },
  passwordIconContainer: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  passwordIcon: {
    marginHorizontal: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  checkboxLabel: {
    fontSize: 18,
    marginLeft: 10,
    fontFamily: "MontserratSemiBold",
  },
  forgotPasswordButton: {
    marginBottom: 24,
    alignSelf: "flex-start",
    marginLeft: "1%",
  },
  forgotPasswordText: {
    color: "#007AFF",
    fontSize: 16,
    marginBottom: 20,
    top: -5,
    marginRight: 110,
    fontFamily: "MontserratSemiBold",
    width: "100%",
  },
  loginButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 170,
  },
  loginButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "MontserratBold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default CustomerLoginScreen;
