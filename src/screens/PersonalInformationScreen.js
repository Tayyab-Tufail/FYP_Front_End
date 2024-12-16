import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  ActionSheetIOS,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Font from "expo-font";
import { AppContext } from "../Components/AppContext";
import api from "../api";

const PersonalInformationScreen = () => {
  const { userData, updateUserData, userType } = useContext(AppContext);

  const [fullName, setFullName] = useState(userData?.fullName || "");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState(userData?.gender || "");
  const [avatarUri, setAvatarUri] = useState(userData?.image || null);
  const [experience, setExperience] = useState(userData?.experience || "");
  const [location, setLocation] = useState(userData?.location || "");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showLocationUpdateModal, setShowLocationUpdateModal] = useState(false);  // Added new modal for location options

  const cities = [
    "Mehria Town",
    "People Colony",
    "Faroq-e-Azam Colony",
    "New Town",
    "Police Line",
    "Zamzma Road",
    "Fawara Chock",
    "Madni Chock",
    "Darul Islam Colony",
    "Khalid Saeed Road",
    "SheenBagh",
    "Shakurdarah",
  ];

  // Initialize mobile number from userData
  useEffect(() => {
    if (userData?.mobileNumber) {
      // Remove +92 prefix if it exists, to store only the number part
      const numberWithoutPrefix = userData.mobileNumber.replace("+92", "");
      setMobileNumber(numberWithoutPrefix);
    }
  }, [userData]);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        MontserratRegular: require("../../assets/fonts/Montserrat-Regular.ttf"),
        MontserratBold: require("../../assets/fonts/Montserrat-Bold.ttf"),
        MontserratMedium: require("../../assets/fonts/Montserrat-Medium.ttf"),
        MontserratSemiBold: require("../../assets/fonts/Montserrat-SemiBold.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  const handleMobileNumberChange = (text) => {
    // Remove any non-numeric characters and limit to 10 digits
    const cleaned = text.replace(/[^0-9]/g, "").slice(0, 10);
    setMobileNumber(cleaned);
  };

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location access is required.");
      return;
    }
    setIsFetchingLocation(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const locationString = `${address.name || ""}, ${
          address.street || ""
        }, ${address.city || ""}, ${address.region || ""}, ${
          address.country || ""
        }`;
        setLocation(locationString.trim());
      } else {
        setLocation(`${latitude}, ${longitude}`);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      Alert.alert("Error", "Unable to fetch location.");
    } finally {
      setIsFetchingLocation(false);
    }
  };
  const handleCitySelect = (selectedCity) => {
    setLocation(selectedCity);
    setShowCityModal(false);
  };
  const handleUpdate = async () => {
    if (!fullName || !mobileNumber || !gender || !experience) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    // Validate mobile number length
    if (mobileNumber.length < 10) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("mobileNumber", `+92${mobileNumber}`);
      formData.append("gender", gender);
      formData.append("experience", experience);
      formData.append("userType", userType);

      if (userType === "professional") {
        formData.append("location", location);
      }

      if (avatarUri) {
        const fileName = avatarUri.split("/").pop();
        const fileType = avatarUri.substring(avatarUri.lastIndexOf(".") + 1);
        formData.append("image", {
          uri: avatarUri,
          name: fileName,
          type: `image/${fileType}`,
        });
      }

      const response = await api.put("/profile/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      updateUserData(response.data.user);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "There was an issue updating your profile.");
    }
  };

  const openActionSheet = () => {
    const options = ["Cancel", "Upload From Gallery", "Take Photo"];
    if (avatarUri) options.push("View Photo");
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 0 },
        (buttonIndex) => {
          if (buttonIndex === 1) pickImage();
          else if (buttonIndex === 2) takePhoto();
          else if (buttonIndex === 3 && avatarUri) viewPhoto();
        }
      );
    } else {
      Alert.alert(
        "Choose an option",
        "",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Upload From Gallery", onPress: pickImage },
          { text: "Take Photo", onPress: takePhoto },
          avatarUri && { text: "View Photo", onPress: viewPhoto },
        ].filter(Boolean)
      );
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const viewPhoto = () => setAvatarUri(null);

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    setShowGenderModal(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={openActionSheet}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <Icon name="user" size={50} color="gray" />
        )}
        <Icon
          name="edit"
          size={20}
          color="#007AFF"
          style={styles.avatarEditIcon}
        />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mobile Number *</Text>
        <View style={styles.phoneInputContainer}>
          <Text style={styles.prefix}>+92</Text>
          <TextInput
            value={mobileNumber}
            onChangeText={handleMobileNumberChange}
            placeholder="3XXXXXXXXX"
            keyboardType="phone-pad"
            style={[styles.input, styles.phoneInput]}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender *</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowGenderModal(true)}
        >
          <Text style={styles.inputText}>{gender || "Select Gender"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Experience *</Text>
        <TextInput
          value={experience}
          onChangeText={setExperience}
          placeholder="Experience (e.g., 3 years)"
          style={styles.input}
        />
      </View>

      {userType === "professional" && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowLocationUpdateModal(true)}  // Trigger location modal
          >
            <Text style={styles.inputText}>
              {location || "Select or Detect Location"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>

      {/* Location Update Modal */}
      <Modal visible={showLocationUpdateModal} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Location</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={fetchLocation}
            >
              <Text style={styles.modalButtonText}>
                {isFetchingLocation
                  ? "Fetching location..."
                  : "Detect Location"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowCityModal(true)}
            >
              <Text style={styles.modalButtonText}>Select City</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowLocationUpdateModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* City Selection Modal */}
      <Modal visible={showCityModal} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a City</Text>
            <FlatList
              data={cities}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handleCitySelect(item)}
                >
                  <Text style={styles.modalButtonText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowCityModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Gender Modal */}
      <Modal visible={showGenderModal} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleGenderSelect("Male")}
            >
              <Text style={styles.modalButtonText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleGenderSelect("Female")}
            >
              <Text style={styles.modalButtonText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleGenderSelect("Other")}
            >
              <Text style={styles.modalButtonText}>Other</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowGenderModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "white",
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#007AFF", // Vibrant blue for avatar border
    borderWidth: 2,
    borderRadius: 50,
    width: 100, // Increased size for better visibility
    height: 100,
    marginBottom: 20,
    alignSelf: "center",
    position: "relative",
    backgroundColor: "#FFFFFF",
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 7,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  avatarEditIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  updateButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "MontserratBold",
  },
  inputContainer: {
    marginBottom: 17,
  },
  label: {
    fontSize: 16,
    fontFamily: "MontserratBold",
    marginBottom: 8,
    color: "#333333",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E2E8F0", // Subtle gray for input border
    borderWidth: 1,
    borderRadius: 8,
    height: 50, // Increased height for better usability
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  prefix: {
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: "MontserratMedium",
    color: "#1A202C",
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
  },
  phoneInput: {
    flex: 1,
    borderWidth: 0,
    height: "100%",
  },
  input: {
    height: 50,
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: "MontserratMedium",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  locationButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 10,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  locationButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "MontserratMedium",
  },
  buttonContainer: {
    marginTop: 25,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 11,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  updateButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "MontserratBold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: "MontserratMedium",
    textAlign: "center",
    color: "#4A5568",
  },
  cancelOption: {
    marginTop: 15,
  },
  cancelText: {
    color: "red",
    fontSize: 16,
    fontFamily: "MontserratMedium",
    textAlign: "center",
  },
  genderText: {
    fontSize: 16,
    fontFamily: "MontserratMedium",
    color: "#1A202C",
  },
});

export default PersonalInformationScreen;
