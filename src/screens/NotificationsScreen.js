// NotificationScreen.js
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { AppContext } from "../Components/AppContext";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationScreen = () => {
  const { userData } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]); // State to store notifications

  // Fetch notifications from the backend on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await api.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotifications(response.data); // Update state with fetched notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
        Alert.alert("Error", "Failed to load notifications.");
      }
    };
    fetchNotifications();
  }, []);

  // Delete notification
  const handleDeleteNotification = async (id) => {
    console.log("Deleting notification with ID:", id); // Log the ID
    try {
      const token = await AsyncStorage.getItem("authToken");
      await api.delete(`/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== id)
      );
      Alert.alert(
        "Notification Removed",
        "The notification has been successfully removed."
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
      Alert.alert("Error", "Failed to delete notification.");
    }
  };

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={styles.noNotificationsText}>No Notifications Found</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.notificationContainer}>
              {/* Updated to use item.message instead of item.text */}
              <Text style={styles.notificationText}>{item.message}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => handleDeleteNotification(item._id)}
              >
                <Icon name="times-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC", // Subtle light background for a modern look
    paddingHorizontal: 20,
  },
  noNotificationsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A5568", // Darker gray for a neutral tone
    textAlign: "center",
  },
  notificationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E2E8F0", // Light gray background for notifications
    padding: 10,
    borderRadius: 10,

    // Rounded corners for smooth visuals
    width: "100%",
    marginBottom: 10, // Space between notifications
    shadowColor: "#000", // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    top: 10,
  },
  notificationText: {
    fontSize: 16,
    color: "#2D3748", // Dark gray for text readability
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
});

export default NotificationScreen;
