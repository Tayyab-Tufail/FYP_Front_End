import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { AppContext } from "../Components/AppContext";
import api from "../api";

const { width, height } = Dimensions.get("window");

const JobVisualization = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState("jobs");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { userType } = useContext(AppContext);

  useEffect(() => {
    loadFonts();
    fetchAllJobs();
    fetchAllServices();
  }, []);

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

  const fetchAllJobs = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (error) {
      Alert.alert("Error", "Could not fetch jobs. Please try again.");
    }
  };

  const fetchAllServices = async () => {
    try {
      const response = await api.get("/services/open");
      setServices(response.data);
    } catch (error) {
      Alert.alert("Error", "Could not fetch services. Please try again.");
    }
  };

  const openImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  const applyToItem = async (itemId, type) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const endpoint =
        type === "job" ? "/applications/apply" : "/services/apply";
      await api.post(
        endpoint,
        { [`${type}Id`]: itemId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Application Sent", "You have successfully applied.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred while applying.";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleApply = (itemId, itemTitle, type) => {
    Alert.alert(
      "Confirm Application",
      `Are you sure you want to apply for the ${type}: ${itemTitle}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Apply", onPress: () => applyToItem(itemId, type) },
      ]
    );
  };

  const renderJobs = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Job Details</Text>
      {jobs.length > 0 ? (
        jobs.map((job, index) => (
          <View key={index} style={styles.jobContainer}>
            <Text style={styles.jobNumber}>Job {index + 1}</Text>
            <View style={styles.detailBox}>
              <Text style={styles.label}>Job Title:</Text>
              <Text style={styles.text}>{job.title}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.label}>Job Description:</Text>
              <Text style={styles.text}>{job.description}</Text>
            </View>
            {job.category && (
              <View style={styles.detailBox}>
                <Text style={styles.label}>Job Category:</Text>
                <Text style={styles.text}>{job.category}</Text>
              </View>
            )}
            {job.location && (
              <View style={styles.detailBox}>
                <Text style={styles.label}>Location:</Text>
                <Text style={styles.text}>{job.location}</Text>
              </View>
            )}
            {job.paymentMethod && (
              <View style={styles.detailBox}>
                <Text style={styles.label}>Payment Method:</Text>
                <Text style={styles.text}>{job.paymentMethod}</Text>
              </View>
            )}
            {job.images && job.images.length > 0 && (
              <View style={styles.detailBox}>
                <Text style={styles.label}>Images:</Text>
                <View style={styles.imageContainer}>
                  {job.images.map((uri, imageIndex) => (
                    <TouchableOpacity
                      key={imageIndex}
                      onPress={() => openImage(uri)}
                    >
                      <Image source={{ uri }} style={styles.image} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => handleApply(job._id, job.title, "job")}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noItemsText}>No jobs available</Text>
      )}
    </ScrollView>
  );

  const renderServices = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Service Details</Text>
      {services.length > 0 ? (
        services.map((service, index) => (
          <View key={index} style={styles.jobContainer}>
            <Text style={styles.jobNumber}>Service {index + 1}</Text>
            <View style={styles.detailBox}>
              <Text style={styles.label}>Service Title:</Text>
              <Text style={styles.text}>{service.title}</Text>
            </View>
            {service.owner && (
              <View style={styles.detailBox}>
                <Text style={styles.label}>Owner:</Text>
                <Text style={styles.text}>{service.owner.fullName}</Text>
              </View>
            )}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() =>
                  handleApply(service._id, service.title, "service")
                }
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noItemsText}>No services available</Text>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.mainContainer}>
      {userType === "professional" ? (
        <View>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewMode === "jobs" && styles.activeToggle,
              ]}
              onPress={() => setViewMode("jobs")}
            >
              <Text style={styles.toggleText}>Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewMode === "services" && styles.activeToggle,
              ]}
              onPress={() => setViewMode("services")}
            >
              <Text style={styles.toggleText}>Services</Text>
            </TouchableOpacity>
          </View>
          {viewMode === "jobs" ? renderJobs() : renderServices()}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeImageViewer}
              >
                <Ionicons name="close-circle" size={36} color="white" />
              </TouchableOpacity>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.fullImage}
                />
              )}
            </View>
          </Modal>
        </View>
      ) : (
        <View>
          <Text>This Page is only accessible for Professionals</Text>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white", // Soft background for a modern look
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    width: "100%",
    marginLeft: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: -17,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 5,
  },
  title: {
  fontSize: 20,
  marginBottom: 15,
  color: "#1F2937",
  textAlign: "center",
  fontFamily: "MontserratBold",
  textTransform: "uppercase",
  paddingBottom: -20,
},

  jobContainer: {
    width: "100%",
    marginBottom: 20,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  jobNumber: {
    fontSize: 20,
    marginBottom: 10,
    color: "#3B82F6",
    fontFamily: "MontserratSemiBold",
  },
  detailBox: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    backgroundColor: "#F9FAFB",
  },
  label: {
    fontSize: 16,
    color: "#374151",
    fontFamily: "MontserratSemiBold",
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: "#6B7280",
    fontFamily: "MontserratRegular",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  image: {
    width: 90,
    height: 90,
    margin: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  noItemsText: {
    fontSize: 18,
    color: "#9CA3AF",
    marginTop: 20,
    textAlign: "center",
    fontFamily: "MontserratMedium",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
  fullImage: {
    width: width * 0.85,
    height: height * 0.75,
    borderRadius: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  applyButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "MontserratSemiBold",
    textAlign: "center",
  },
  toggleRow: {
  flexDirection: "row",
  justifyContent: "center",
  marginVertical: 16,
  paddingHorizontal: 20,
},
toggleButton: {
  paddingVertical: 12,
  paddingHorizontal: 32,
  marginHorizontal: 12,
  borderWidth: 1,
  borderColor: "#3B82F6",
  borderRadius: 25,
  backgroundColor: "#FFFFFF",
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#3B82F6",
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: 3,
  transition: "background-color 0.3s ease, transform 0.2s, shadow 0.3s ease",
},
activeToggle: {
  backgroundColor: "#3B82F6",
  transform: [{ scale: 1.1 }],
  shadowOpacity: 0.3,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
},
toggleText: {
  fontSize: 16,
  color: "#374151", // default text color (black)
  fontFamily: "MontserratMedium",
  fontWeight: "600",
  textAlign: "center",
  textTransform: "uppercase",
  transition: "color 0.3s ease",
},
activeText: {
  color: "#FFFFFF", // text color when button is active
},


});

export default JobVisualization;
