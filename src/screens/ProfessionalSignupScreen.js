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
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Font from "expo-font";
import api from "../api";

const ProfessionalSignupScreen = () => {
  const navigation = useNavigation();
  const [isPickerModalVisible, setIsPickerModalVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [tempGender, setTempGender] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const experienceOptions = [
    "6 months - 1 year",
    "1 year - 2 years",
    "2 years - 3 years",
    "3 years - 4 years",
    "4 years - 5 years",
    "5 years - 6 years",
    "6 years - 7 years",
    "7 years - 8 years",
    "8 years - 9 years",
    "9 years - 10 years",
    "10+ years",
  ];

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
      !gender ||
      !experience
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
      const response = await api.post("/auth/professional/signup", {
        fullName,
        mobileNumber: `+92${mobileNumber}`,
        password,
        gender,
        experience,
        image: null,
      });

      if (response.status === 201) {
        Alert.alert("Success", "Account created successfully.");
        navigation.navigate("ProfessionalLogin");
      } else {
        Alert.alert("Error", response.data.message || "Signup failed.");
      }
    } catch (error) {
      // Extract the error message from the Axios error response
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Something went wrong. Please try again.";

      Alert.alert("Error", errorMessage);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../Images/1st_rm.png")} // replace with your image path
        style={styles.logo}
      />
      <Text style={styles.header}>Sign Up As A Professional</Text>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#000" style={styles.icon} />
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="#000" style={styles.icon} />
        <Text style={styles.prefix}>+92</Text>
        <TextInput
          placeholder="Enter mobile number"
          value={mobileNumber}
          onChangeText={(text) =>
            setMobileNumber(text.replace(/[^0-9]/g, "").slice(0, 10))
          }
          keyboardType="phone-pad"
          maxLength={10}
          style={[styles.input, { paddingLeft: 35 }]}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="briefcase" size={20} color="#000" style={styles.icon} />
        <TouchableOpacity
          onPress={() => setExperienceModalVisible(true)} // Open modal on press
          style={styles.pickerOpener} // Use the same style as the picker opener
        >
          <Text style={styles.dropdownText}>
            {experience || "Please choose your experience"}{" "}
            {/* Placeholder text */}
          </Text>
          <Icon
            name="chevron-down"
            size={16}
            color="gray"
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={experienceModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <FlatList
              data={experienceOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setExperience(item);
                    setExperienceModalVisible(false); // Close modal after selection
                  }}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setExperienceModalVisible(false)} // Close modal
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <View style={styles.container}>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginPromptContainer}>
        <Text style={styles.loginPromptText}>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfessionalLogin")}
        >
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
    padding: 15,
    backgroundColor: "#fff",
    borderTopColor: "black",
  },
  signupButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 145,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 25,
    marginBottom: 90,
    marginBottom: 0,
    width: "120%",
    marginTop: -10,
  },
  signupButtonText: {
    color: "#ffffff",
    fontSize: 17,
    textAlign: "center",
    fontFamily: "MontserratBold",
    width: "100%",
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 5,
    width: "100%", // Same width as other input containers
    height: 50, // Set a consistent height
  },
  dropdownText: {
    color: "#000",
    fontSize: 15,
    fontFamily: "MontserratMedium",
    flex: 1, // Make the text fill the available space
  },
  dropdownIcon: {
    position: "absolute",
    right: 25, // Adjust this value to keep the icon inside the container
    top: "30%", // Center the icon vertically
    transform: [{ translateY: -12 }], // Adjust for better vertical alignment
  },

  pickerOpener: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerOpenerText: {
    fontSize: 16,
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
    marginBottom: -20,
    marginTop: -30,
  },
  header: {
    fontSize: 22,
    fontFamily: "MontserratBold",
    marginBottom: 25,
    top: -2,
    color: "#007AFF",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#000", // Subtle border
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 5, // Rounded corners
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF", // Solid background for shadow visibility
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 4,
  },
  icon: {
    marginRight: 10,
    color: "#333333",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: "MontserratMedium",
  },
  pickerContainer: {
    width: "100%",
    borderColor: "#CED4DA",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    width: "100%",
    height: 50,
    fontSize: 16,
    fontFamily: "MontserratMedium",
    color: "#495057",
    height: 60,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  modalButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomColor: "#EEE",
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: "MontserratMedium",
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "MontserratBold",
  },
  loginPromptContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: -5,
  },
  loginPromptText: {
    fontSize: 19,
    fontFamily: "MontserratMedium",
  },
  loginLinkText: {
    fontSize: 21,
    color: "#007AFF",
    marginTop: 0,
    fontFamily: "MontserratSemiBold",
  },
});

export default ProfessionalSignupScreen;
