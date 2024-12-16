import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [isPickerModalVisible, setIsPickerModalVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [tempGender, setTempGender] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
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

  const handleSignUp = async () => {
    const nameRegex = /^[A-Za-z\s]+$/;

    if (
      !fullName ||
      !mobileNumber ||
      !password ||
      !confirmPassword ||
      !gender
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!nameRegex.test(fullName) || fullName.length < 3) {
      Alert.alert(
        "Error",
        "Full Name must contain only letters and be at least 3 characters long."
      );
      return;
    }

    if (password.length < 5) {
      Alert.alert("Error", "Password must be at least 5 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match.");
      return;
    }

    try {
      await AsyncStorage.setItem(
        "userCredentials",
        JSON.stringify({
          fullName,
          mobileNumber,
          password,
          gender,
          rememberPassword,
        })
      );
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "There was an issue with the sign-up process.");
    }
  };

  const togglePickerModal = () => {
    setIsPickerModalVisible(!isPickerModalVisible);
  };

  const handleGenderCancel = () => {
    setTempGender(gender); // Reset the temporary gender back to the last saved gender
    setIsPickerModalVisible(false); // Close the modal
  };

  const openPickerModal = () => {
    setTempGender(gender); // Set the temporary gender to the current gender when opening the modal
    setIsPickerModalVisible(true); // Open the modal
  };

  const handleGenderConfirm = () => {
    setGender(tempGender); // Set the gender to the temporarily selected gender
    setIsPickerModalVisible(false); // Close the modal
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../Images/1st_rm.png")} // replace with your image path
        style={styles.logo}
      />
      <Text style={styles.header}>Sign Up As A Buyer</Text>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#000" style={styles.icon} />
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={(text) => {
            if (/^[A-Za-z\s]*$/.test(text)) {
              // Allows only letters and spaces
              setFullName(text);
            }
          }}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="#000" style={styles.icon} />
        <TextInput
          placeholder="Mobile Number"
          value={mobileNumber}
          keyboardType="phone-pad"
          onChangeText={setMobileNumber}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#000" style={styles.icon} />
        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry={!isPasswordVisible}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Icon
            name={isPasswordVisible ? "eye" : "eye-slash"}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#000" style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          secureTextEntry={!isConfirmPasswordVisible}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <Icon
            name={isConfirmPasswordVisible ? "eye" : "eye-slash"}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setRememberPassword(!rememberPassword)}
      >
        <Icon
          name={rememberPassword ? "check-square" : "square-o"}
          size={25}
          color="#000"
        />
        <Text style={styles.checkboxLabel}>Remember Password</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginPromptContainer}>
        <Text style={styles.loginPromptText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLinkText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15, // Padding applied to all sides of the container
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signupButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 150,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 25,
    marginBottom: 80,
    marginBottom: 0,
    width: "120%",
  },
  signupButtonText: {
    color: "#ffffff",
    fontSize: 17,
    textAlign: "center",
    fontFamily: "MontserratBold",
  },
  pickerOpener: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerOpenerText: {
    fontSize: 16,
    fontFamily: "MontserratMedium",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: -27,
    marginTop: -30,
  },
  header: {
    fontSize: 20,
    marginBottom: 25,
    fontFamily: "MontserratBold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 5,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: "MontserratMedium",
  },
  pickerContainer: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
    fontFamily: "MontserratSemiBold",
  },
  picker: {
    width: "100%",
    padding: "10%",
    fontFamily: "MontserratSemiBold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    left: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 20,
    marginRight: 125,
    fontFamily: "MontserratMedium",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    padding: 100,
    borderRadius: 5,
    width: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
  loginPromptContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 0,
  },
  loginPromptText: {
    fontSize: 20,
    fontFamily: "MontserratMedium",
  },
  loginLinkText: {
    fontSize: 20,
    color: "#007AFF",
    marginTop: 0,
    fontFamily: "MontserratSemiBold",
  },
});

export default SignupScreen;
