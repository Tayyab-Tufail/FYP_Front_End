import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { AppContext } from "../Components/AppContext";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyServicesScreen = ({ navigation, route }) => {
  const { userData, userType } = useContext(AppContext); // Access user data and role
  const [selectedServices, setSelectedServices] = useState([]); // Store selected services
  const [loading, setLoading] = useState(false);

  // Fetch services from the backend on component mount
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("authToken");
        // Change the endpoint to get user's own services
        const response = await api.get("/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedServices(
          response.data.map((service) => ({
            id: service._id,
            title: service.title,
          }))
        );
      } catch (error) {
        console.error("Error fetching services:", error);
        Alert.alert("Error", "Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Add new service if passed from NewServiceScreen
  useEffect(() => {
    if (route.params?.selectedServices) {
      const newService = route.params.selectedServices[0];
      setSelectedServices((prevServices) => [
        ...prevServices,
        { id: newService.id, title: newService.title },
      ]);
    }
  }, [route.params?.selectedServices]);

  const removeService = async (id) => {
    if (!id) {
      Alert.alert("Error", "Invalid service ID");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication token not found");
        return;
      }

      console.log("Attempting to delete service:", id); // Debug log

      const response = await api.delete(`/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Delete response:", response.data); // Debug log

      setSelectedServices((prevServices) =>
        prevServices.filter((service) => service.id !== id)
      );
      Alert.alert("Success", "Service removed successfully.");
    } catch (error) {
      console.error("Error deleting service:", error.response?.data || error);
      Alert.alert(
        "Error",
        `Failed to delete service: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };
  const handleSaveServices = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      await Promise.all(
        selectedServices.map(async (service) => {
          await api.post(
            "/services",
            {
              title: service.title, // Send the correct key as per backend
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        })
      );
      Alert.alert("Success", "Services uploaded successfully.");
      navigation.navigate("ProfessionalDashboard", { val: userType });
    } catch (error) {
      console.error("Error uploading services:", error);
      Alert.alert("Error", "Failed to upload services.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (route.params?.selectedServices) {
      const newService = route.params.selectedServices[0];
      setSelectedServices((prevServices) => {
        // Check if the service is already in the list
        if (prevServices.some((service) => service.id === newService.id)) {
          return prevServices; // Avoid duplicates
        }
        return [
          ...prevServices,
          { id: newService.id, title: newService.title },
        ];
      });
    }
  }, [route.params?.selectedServices]);
  console.log("Selected Services:", selectedServices);

  return (
    <View style={styles.container}>
      {userType === "customer" ? (
        <>
          <Text style={styles.selectedServicesText}>
            Your Required Services
          </Text>
          <View style={styles.servicesContainer}>
            {selectedServices.map((service) => (
              <View key={service.id} style={styles.serviceContainer}>
                <Text style={styles.serviceText}>{service.title}</Text>
                <TouchableOpacity onPress={() => removeService(service.id)}>
                  <Icon name="times-circle" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("NewServiceScreen", { val: userType })
            }
          >
            <Icon
              name="plus-circle"
              size={20}
              color="#007AFF"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Add New Service</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveServices}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Saving..." : "Done"}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.title}>Access Restricted</Text>
          <Text style={styles.subtitle}>
            This screen is only accessible for professionals.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    paddingTop: 40,
    borderTopColor: "grey",
    borderTopWidth: 1,
  },
  selectedServicesText: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: -45,
    top: -25,
  },
  servicesContainer: {
    width: "100%",
    marginTop: 25,
  },
  serviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 5,
    marginVertical: 5,
  },
  serviceText: {
    fontSize: 16,
    flex: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 75,
    borderRadius: 30,
    position: "absolute",
    bottom: 75,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#007AFF",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
  },
  saveButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
  },
  saveButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default MyServicesScreen;
