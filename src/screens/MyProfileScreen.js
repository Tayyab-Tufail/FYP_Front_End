import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Ensure this package is installed
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import * as Font from "expo-font";
import { AppContext } from "../Components/AppContext";

const MyProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [avatarUri, setAvatarUri] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { userData, userType } = useContext(AppContext);
  console.log(userData, userType);

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

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header with the username */}
      <TouchableOpacity style={styles.headerContainer} onPress={openModal}>
        {userData?.image ? (
          <Image style={styles.avatar} source={{ uri: userData.image }} />
        ) : (
          <Icon
            name="person"
            size={80}
            color="#e9e9e9"
            style={styles.defaultAvatarIcon}
          />
        )}
        <Text style={styles.username}>{userData?.fullName || "User"}</Text>
      </TouchableOpacity>

      {/* Personal Information Section */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("PersonalInformation")}
      >
        <Icon name="person" size={30} color="#007AFF" />
        <Text style={styles.menuItemText}>Personal Information</Text>
        <Icon name="chevron-right" size={25} color="#333" />
      </TouchableOpacity>

      {/* Change Password Section */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("ChangePassword")}
      >
        <Icon name="lock" size={25} color="#007AFF" />
        <Text style={styles.menuItemText}>Change Password</Text>
        <Icon name="chevron-right" size={25} color="#333" />
      </TouchableOpacity>

      {/* Previous Work Photos Section */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("PreviousWorkPhotos")}
      >
        <Icon name="photo-library" size={25} color="#007AFF" />
        <Text style={styles.menuItemText}>Previous Work Photos</Text>
        <Icon name="chevron-right" size={25} color="#333" />
      </TouchableOpacity>

      {/* Delete Profile Button */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("DeleteProfile")}
      >
        <Icon name="delete" size={25} color="#007AFF" />
        <Text style={styles.menuItemText}>Delete Profile</Text>
        <Icon name="chevron-right" size={25} color="#333" />
      </TouchableOpacity>

      {/* Modal to show avatar in fullscreen */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {userData.image ? (
              <Image
                source={{ uri: userData.image }}
                style={styles.fullscreenImage}
              />
            ) : (
              <Icon
                name="person"
                size={300}
                color="#e9e9e9"
                style={styles.fullscreenDefaultAvatarIcon}
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
  },
  headerContainer: {
    alignSelf: "stretch",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 30,
    marginTop: 30,
    // Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // Add elevation for Android
    elevation: 3,
  },
  avatar: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "gray",
  },
  defaultAvatarIcon: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: "#e9e9e9",
    borderWidth: 1,
  },
  username: {
    fontSize: 22,
    marginTop: 10,
    fontFamily: "MontserratBold", // Applied font style
  },
  generalSettingsText: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontFamily: "MontserratBold", // Applied font style
    color: "#333",
    paddingLeft: 20,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    // Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // Add elevation for Android
    elevation: 3,
  },
  menuItemText: {
    flex: 1,
    fontSize: 18,
    fontFamily: "MontserratSemiBold", // Applied font style
    color: "#333",
    paddingLeft: 20, // This creates space between the icon and the text
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    // Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // Add elevation for Android
    elevation: 5,
  },
  fullscreenImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  fullscreenDefaultAvatarIcon: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontFamily: "MontserratBold",
  },
});

export default MyProfileScreen;
