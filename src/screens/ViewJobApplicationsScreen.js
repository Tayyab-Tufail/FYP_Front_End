import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import api from "../api";
import { AppContext } from "../Components/AppContext"; // Access user context

const ViewJobApplicationsScreen = ({ navigation }) => {
  const [jobApplications, setJobApplications] = useState([]);
  const [serviceApplications, setServiceApplications] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const { userData } = useContext(AppContext); // Get logged-in user info

  const loadFonts = async () => {
    await Font.loadAsync({
      MontserratRegular: require("../../assets/fonts/Montserrat-Regular.ttf"),
      MontserratBold: require("../../assets/fonts/Montserrat-Bold.ttf"),
      MontserratMedium: require("../../assets/fonts/Montserrat-Medium.ttf"),
      MontserratSemiBold: require("../../assets/fonts/Montserrat-SemiBold.ttf"),
    });
    setFontsLoaded(true);
  };

  // Fetch job applications from the job API
  const fetchJobApplications = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await api.get(
        `/applications/user/${userData._id}/applications`
      );
      setJobApplications(response.data);
    } catch (error) {
      console.log("Error fetching job applications:", error);
    }
  };

  // Fetch service applications from the service API
  const fetchServiceApplications = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await api.get(`/services/applications`);
      console.log(response.data);

      setServiceApplications(response.data);
    } catch (error) {
      console.log("Error fetching service applications:", error);
    }
  };

  const handleAccept = async (applicationId, type) => {
    try {
      console.log(type);

      const endpoint =
        type === "job"
          ? `/applications/application/${applicationId}/accept`
          : `/services/applications/accept`;

      await api.post(endpoint, { applicationId });
      if (type === "job") {
        setJobApplications((prev) =>
          prev.map((application) =>
            application._id === applicationId
              ? { ...application, accepted: true }
              : application
          )
        );
      } else {
        setServiceApplications((prev) =>
          prev.map((application) =>
            application._id === applicationId
              ? { ...application, accepted: true }
              : application
          )
        );
      }
      Alert.alert("Success", "The application has been accepted.");
    } catch (error) {
      Alert.alert("Error", "Could not accept the application.");
    }
  };

  const handleReject = async (applicationId, type) => {
    try {
      const endpoint =
        type === "job"
          ? `/applications/application/${applicationId}/reject`
          : `/services/applications/reject`;

      await api.post(endpoint, { applicationId });
      if (type === "job") {
        setJobApplications((prev) =>
          prev.filter((application) => application._id !== applicationId)
        );
      } else {
        setServiceApplications((prev) =>
          prev.filter((application) => application._id !== applicationId)
        );
      }
      Alert.alert("Success", "The application has been rejected.");
    } catch (error) {
      Alert.alert("Error", "Could not reject the application.");
    }
  };

  useEffect(() => {
    loadFonts();
    fetchJobApplications(); // Fetch job applications
    fetchServiceApplications(); // Fetch service applications
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const renderApplications = (applications, type) => (
    <>
      {applications.map((application) => (
        <View key={application._id} style={styles.applicationCard}>
          <Text style={styles.text}>
            <Text style={styles.label}>Professional Name: </Text>
            {application.professional.fullName}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Mobile Number: </Text>
            {application.professional.mobileNumber}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>
              {type === "job" ? "Job Title:" : "Service Title:"}
            </Text>{" "}
            {application.job?.title || application.service?.title}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Applied On: </Text>
            {new Date(application.appliedAt).toLocaleString()}
          </Text>
          {/* Portfolio Button */}
          <TouchableOpacity
            style={styles.portfolioButton}
            onPress={() =>
              navigation.navigate("PreviousWorkPhotos", {
                professionalName: application.professional.fullName,
                professionalId: application.professional._id,
              })
            }
          >
            <Text style={styles.buttonText}>
              <Icon name="folder" size={16} /> Portfolio
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            {!application.accepted && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleAccept(application._id, type)}
              >
                <Text style={styles.buttonText}>
                  <Icon name="check" size={16} /> Accept
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleReject(application._id, type)}
            >
              <Text style={styles.buttonText}>
                <Icon name="trash" size={16} /> Reject
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Job Applications</Text>
      {jobApplications.length > 0 ? (
        renderApplications(jobApplications, "job")
      ) : (
        <Text>No job applications found.</Text>
      )}

      <Text style={styles.sectionTitle}>Service Applications</Text>
      {serviceApplications.length > 0 ? (
        renderApplications(serviceApplications, "service")
      ) : (
        <Text>No service applications found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "MontserratBold",
    color: "#333",
  },
  applicationCard: {
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "MontserratRegular",
    color: "#555",
  },
  label: {
    fontWeight: "bold",
    fontFamily: "MontserratSemiBold",
    color: "#333",
  },
  portfolioButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "MontserratSemiBold",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});

export default ViewJobApplicationsScreen;
