import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as Font from "expo-font";
import Icon from "react-native-vector-icons/FontAwesome";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { AppContext } from "../Components/AppContext";
import axios from "axios";
import api from "../api";
import * as Location from "expo-location";

// Font loading logic
const loadFonts = async () => {
  await Font.loadAsync({
    MontserratRegular: require("../../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../../assets/fonts/Montserrat-Bold.ttf"),
    MontserratLight: require("../../assets/fonts/Montserrat-Light.ttf"),
    MontserratMedium: require("../../assets/fonts/Montserrat-Medium.ttf"),
    MontserratSemiBold: require("../../assets/fonts/Montserrat-SemiBold.ttf"),
  });
};

// Define the content of the drawer
const DrawerContent = ({ navigation, val }) => {
  const { userData, logout } = useContext(AppContext); // Access context functions

  return (
    <View style={styles.drawerContent}>
      <View style={styles.userInfoSection}>
        <Image source={require("../Images/1st_rm.png")} style={styles.logo} />
        <View>
          <Text style={styles.drawerHeaderText}>
            {userData?.fullName || "Guest"}
          </Text>
          <Text style={styles.drawerHeaderRating}>No Rating(0)</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("MyProfileScreen")}
      >
        <Icon name="user" size={22} color="black" style={styles.icon} />
        <Text style={styles.drawerItemText}>My Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("MyServicesScreen", { val })}
      >
        <Icon name="wrench" size={20} color="black" style={styles.icon} />
        <Text style={styles.drawerItemText}>My Services</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("NotificationScreen")}
      >
        <Icon name="bell" size={20} color="black" style={styles.icon} />
        <Text style={styles.drawerItemText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("PostJobScreen")}
      >
        <Icon name="briefcase" size={20} color="black" style={styles.icon} />
        <Text style={styles.drawerItemText}>Post a Job</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("JobVisualization", { val })}
      >
        <Icon name="tasks" size={20} color="black" style={styles.icon} />
        <Text style={styles.drawerItemText}>Job Visualization</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("ViewJobApplicationsScreen")}
      >
        <Icon name="file-text" size={20} color="black" style={styles.icon} />
        <Text style={styles.drawerItemText}>View Job Applications</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={async () => {
          await logout(); // Clear data and token
          navigation.replace("Select"); // Redirect to Welcome screen
        }}
      >
        <Icon name="sign-out" size={20} style={styles.icon} />
        <Text style={styles.drawerItemText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

// Create a drawer navigator
const Drawer = createDrawerNavigator();

// Define the ProfessionalDashboardScreen
const ProfessionalDashboardScreen = ({ route, navigation }) => {
  const { val } = route.params;
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await loadFonts();
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) {
    return (
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    );
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} val={val} />}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerTitle: () => (
            <Image
              source={require("../Images/1st_rm.png")}
              style={styles.ion}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const newImageData = [
  {
    id: "1",
    uri: require("../Images/1..png"),
  },
  {
    id: "2",
    uri: require("../Images/2.png"),
  },
  {
    id: "3",
    uri: require("../Images/3.png"),
  },
  {
    id: "4",
    uri: require("../Images/5.png"),
  },
  {
    id: "5",
    uri: require("../Images/4.png"),
  },
];

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

const DashboardScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const { userData } = useContext(AppContext); // Assumes you have user data in context
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch professionals from the API
  const fetchProfessionals = async (city) => {
    try {
      setLoading(true);
      const response = await api.get("/profile/professionals/top", {
        params: city ? { location: city } : {},
      });
      console.log(response.data);
      setProfessionals(response.data);
    } catch (error) {
      console.error("Error fetching professionals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals(selectedCity);
  }, [selectedCity]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setModalVisible(false);
    fetchProfessionals(city);
  };

  const handleCancelSelection = () => {
    setSelectedCity("");
    fetchProfessionals();
    setModalVisible(false);
  };

  const detectLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const geoResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (geoResponse.length > 0) {
        const city = geoResponse[0].city || geoResponse[0].region;
        setSelectedCity(city);
        fetchProfessionals(city);
      } else {
        alert("Could not detect city. Please try again.");
      }
    } catch (error) {
      console.error("Error detecting location:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.dashboardText}>
        Professional Services at Your Doorstep
      </Text>
      <View style={styles.bottomView}>
        <FlatList
          data={newImageData}
          renderItem={({ item }) => (
            <View style={styles.serviceItems}>
              <Image source={item.uri} style={styles.images} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          style={{ marginVertical: 10 }}
        />
        <View style={{ marginHorizontal: 20 }}>
          <Text style={styles.where}>Select area where you want service</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={styles.selectionBox}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.selectionText}>
                {selectedCity || "Select Area"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detectButton}
              onPress={detectLocation}
            >
              <Text style={styles.detectButtonText}>Detect</Text>
            </TouchableOpacity>
            {selectedCity && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelSelection}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.record}>Recommended</Text>
          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : professionals.length === 0 ? (
              <Text style={styles.noProfessionalsText}>
                No professionals found for the selected area.
              </Text>
            ) : (
              <FlatList
                data={professionals}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.serviceItem}
                    onPress={() =>
                      navigation.navigate("ServiceDetailScreen", {
                        uri: item.image || require("../Images/bg1.png"),
                        experience: item.experience,
                        experties: item.experties || "No Expertise Provided",
                        name: item.fullName,
                        rating: item.averageRating,
                        location: item.location || "No Location",
                      })
                    }
                  >
                    <Image
                      source={
                        item.image
                          ? { uri: item.image }
                          : require("../Images/bg1.png")
                      }
                      style={styles.image}
                    />
                    <Text style={styles.serviceText}>{item.fullName}</Text>
                    <Text style={styles.serviceText}>
                      ⭐ {item.averageRating || "N/A"} |{" "}
                      {item.location || "No Location"}
                    </Text>
                    <TouchableOpacity
                      style={styles.hireButton}
                      onPress={() =>
                        navigation.navigate("ChatDetailScreen", {
                          chatPartner: {
                            _id: item._id, // Professional ID
                            name: item.fullName,
                            profileImage: item.image || null,
                            type: "professional",
                          },
                          jobId: null, // No job associated
                          orderId: null, // No order associated
                        })
                      }
                    >
                      <Text style={styles.hireButtonText}>Hire</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContainer1}
              />
            )}
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a City</Text>
            {cities.map((city) => (
              <TouchableOpacity
                key={city}
                style={styles.cityOption}
                onPress={() => handleCitySelect(city)}
              >
                <Text style={styles.cityText}>{city}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.buttonModal}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  dashboardText: {
    textAlign: "center",
    marginVertical: 4,
    fontSize: 17,
    color: "#007AFF",
    top: 7,
    fontFamily: "MontserratSemiBold",
    width: "99%",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
  detectButton: {
    marginLeft: 10,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    top: -4.5,
  },
  detectButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "MontserratSemiBold",
  },

  noProfessionalsText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "MontserratSemiBold",
  },

  cancelButton: {
    marginLeft: 10,
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    top: -4.3,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "MontserratSemiBold",
  },
  flatListContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginHorizontal: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  flatListContainer1: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginHorizontal: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  image: {
    width: 150,
    height: 150,
    marginHorizontal: 12, // Slightly increased margin for spacing
    borderRadius: 10, // Larger border radius for a more rounded, modern look
    backgroundColor: "#f1f1f1", // Lighter background for a smoother feel
    shadowColor: "#ccc", // Black shadow for depth
    shadowOffset: { width: 0, height: 15 }, // Slightly deeper shadow for a lifted effect
    shadowOpacity: 0.2, // Soft shadow opacity for a subtle effect
    shadowRadius: 15, // More blurred shadow for smoother transitions
    elevation: 9, // Subtle shadow on Android
    borderWidth: 2, // Adding a border to highlight the image container
    borderColor: "#ddd", // Light grey border color for separation
    overflow: "hidden", // Ensures the shadow doesn't break out of the rounded corners
    transform: [{ scale: 1.05 }], // Slight scale-up on hover or press (if using animations)
  },

  selectionBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  selectionText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "MontserratRegular",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: "MontserratBold",
  },
  cityOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
  cityText: {
    fontSize: 18,
    fontFamily: "MontserratRegular",
  },
  drawerContent: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  drawerHeaderText: {
    fontSize: 16,
    fontFamily: "MontserratBold",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 13,
    justifyContent: "flex-start",
  },
  drawerItemText: {
    marginLeft: 12,
    fontSize: 17,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    fontFamily: "MontserratMedium",
  },
  icon: {
    marginRight: 8,
    color: "#007AFF",
  },
  logo: {
    width: 80,
    height: 80,
  },
  userInfoSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  drawerHeaderRating: {
    fontSize: 14,
    fontFamily: "MontserratMedium",
  },
  buttonModal: {
    backgroundColor: "#007AFF",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  serviceItem: {
    alignItems: "center",
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
    shadowColor: "#636363",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  serviceText: {
    fontSize: 16,
    margin: 2,
    paddingHorizontal: 10,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "MontserratRegular",
  },
  images: {
    width: 300,
    height: 170,
    marginHorizontal: 6,
    borderRadius: 1,
    borderColor: "#636363",
    borderWidth: 1,
    resizeMode: "contain",
    backgroundColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  record: {
    fontWeight: "500",
    marginLeft: 22,
    fontSize: 18,
    color: "#007AFF",
    top: -3,
    fontFamily: "MontserratSemiBold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ion: {
    position: "absolute",
    top: -2,
    width: 80,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 86,
  },
  where: {
    color: "#007AFF",
    fontFamily: "MontserratSemiBold",
    fontSize: 16.7,
    top: -4,
    textAlign: "center",
    justifyContent: "center",
  },
  hireButton: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000", // Adding shadow for depth
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1, // Border to make it stand out
    borderColor: "#ccc",
  },
  hireButtonText: {
    color: "white",
    fontSize: 16,
    textTransform: "uppercase", // Capitalized text for a bold look
    letterSpacing: 1, // Spaced out letters for clarity
    fontFamily: "MontserratSemiBold", // Using the custom font for better style
  },
});

export default ProfessionalDashboardScreen;
