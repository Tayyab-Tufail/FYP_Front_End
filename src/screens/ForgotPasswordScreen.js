import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Font from "expo-font";
import Icon from "react-native-vector-icons/FontAwesome";
import api from "../api";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const navigation = useNavigation();

  const otpInputRefs = Array(4)
    .fill()
    .map(() => useRef(null));

  const loadFonts = async () => {
    await Font.loadAsync({
      Font1: require("../../assets/fonts/Montserrat-Regular.ttf"),
      Font2: require("../../assets/fonts/Montserrat-Bold.ttf"),
      Font3: require("../../assets/fonts/Montserrat-Light.ttf"),
      Font4: require("../../assets/fonts/Montserrat-Medium.ttf"),
      Font5: require("../../assets/fonts/Montserrat-SemiBold.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const handleSend = async () => {
    if (mobileNumber.trim() === "") {
      Alert.alert("Alert", "Enter Mobile Number");
    } else {
      try {
        const response = await api.post("/otp/send-otp", { mobileNumber });
        if (response.status === 200) {
          setOtpSent(true);
          Alert.alert("Success", "OTP sent to your WhatsApp number.");
        }
      } catch (error) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Failed to send OTP"
        );
      }
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 4) {
      Alert.alert("Alert", "Enter complete OTP");
    } else {
      try {
        const response = await api.post("/otp/verify-otp", {
          mobileNumber,
          otp: fullOtp,
        });
        if (response.status === 200) {
          setPasswordModalVisible(true);
        }
      } catch (error) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Invalid or expired OTP"
        );
      }
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value) || value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 3) otpInputRefs[index + 1].current.focus();
  };

  const handlePasswordUpdate = async () => {
    try {
      const response = await api.post("/otp/reset-password", {
        mobileNumber,
        newPassword,
      });
      if (response.status === 200) {
        Alert.alert("Success", "Password updated successfully.");
        setPasswordModalVisible(false);
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "Could not update password. Please try again.");
      setPasswordModalVisible(false);
    }
  };

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.innerContainer}>
          <Image source={require("../Images/1st_rm.png")} style={styles.logo} />
          <Text style={styles.instructions}>
            Enter your mobile number, and we’ll send an OTP to change your
            password.
          </Text>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={25} style={styles.inputIcon} />
            <Text style={styles.prefix}>+92</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChangeText={(text) => setMobileNumber(text.slice(-10))}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          {otpSent && (
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={otpInputRefs[index]}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  keyboardType="number-pad"
                  maxLength={1}
                />
              ))}
            </View>
          )}
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={otpSent ? handleVerify : handleSend}
          >
            <Text style={styles.verifyButtonText}>
              {otpSent ? "Verify" : "Send OTP"}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={isPasswordModalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Reset Password</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter new password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handlePasswordUpdate}
                >
                  <Text style={styles.modalButtonText}>Update Password</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: { flex: 1, backgroundColor: "white" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderTopColor: "black",
    borderTopWidth: 1,
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  instructions: {
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "normal",
    fontFamily: "Font5",
    color: "#6C757D", // Subtle gray for text
    top: -25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB", // Light border for subtlety
    borderRadius: 12, // Slightly more rounded for modern look
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    width: "95%", // Full width with margin
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3, // Subtle shadow
  },
  inputIcon: {
    marginRight: 10,
    color: "#333333", // Soft gray for icons
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Font2",
    color: "#374151", // Dark gray for text
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB", // Soft border color
    borderRadius: 10,
    padding: 12,
    textAlign: "center",
    fontSize: 18,
    width: 55,
    height: 55,
    fontFamily: "Font3",
    backgroundColor: "#F9FAFB", // Subtle background for input
    color: "#374151", // Text color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  verifyButton: {
    backgroundColor: "#2563EB", // Bright modern blue
    paddingVertical: 14,
    borderRadius: 30, // Fully rounded button
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  verifyButtonText: {
   color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Font5",
    fontWeight: "600",
  },
  prefix: { 
    fontSize: 16, 
    marginRight: 5, 
    fontFamily: "Font5", 
    color: "#6C757D",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background for focus
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20, // Rounded modal for softer appearance
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    fontFamily: "Font5",
    color: "#1F2937",
  },
  modalInput: {
    width: "100%",
    padding: 12,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#F9FAFB", // Subtle background for input
    fontSize: 16,
    fontFamily: "Font3",
    color: "#374151",
  },
  modalButton: {
    backgroundColor: "#2563EB", // Same blue as primary button
    paddingVertical: 12,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Font5",
  },
});

export default ForgotPasswordScreen;
