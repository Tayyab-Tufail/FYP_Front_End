import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Font from "expo-font";
import api from "../api";
import { useFocusEffect } from "@react-navigation/native";

const PastOrdersScreen = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
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

  const fetchCompletedOrders = async () => {
    try {
      const response = await api.get("/orders", {
        params: { status: "Completed" },
      });

      console.log(response.data);

      setCompletedOrders(response.data);
      return true;
    } catch (error) {
      Alert.alert("Error", "Failed to load completed orders.");
      return false;
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCompletedOrders();
    setRefreshing(false);
  }, []);

  // Load fonts on initial mount
  useEffect(() => {
    loadFonts();
  }, []);

  // Refresh orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCompletedOrders();
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderService}>
        {item.orderType === "Job" ? "Job Title: " : "Service Title: "}
        {item.orderType === "Job" ? item.job?.title : item.service?.title}
      </Text>

      <View style={styles.userInfo}>
        <Icon name="user" size={16} color="#666" style={styles.icon} />
        <Text style={styles.userName}>
          Professional: {item.professional?.fullName || "N/A"}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <Icon name="check-circle" size={16} color="green" style={styles.icon} />
        <Text style={styles.orderStatus}>Completed</Text>
      </View>

      <View style={styles.dateContainer}>
        <Icon name="calendar" size={16} color="#666" style={styles.icon} />
        <Text style={styles.orderDate}>
          Created: {formatDate(item.createdAt)}
        </Text>
      </View>

      {item.paymentMethod && (
        <View style={styles.paymentContainer}>
          <Icon name="credit-card" size={16} color="#666" style={styles.icon} />
          <Text style={styles.paymentMethod}>
            Payment Method:{" "}
            {item.paymentMethod ||
              (item.orderType === "Job"
                ? item.job?.paymentMethod
                : item.service?.paymentMethod) ||
              "N/A"}
          </Text>
        </View>
      )}
    </View>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {completedOrders.length > 0 ? (
        <FlatList
          data={completedOrders}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.ordersList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.noOrdersContainer}>
          <Icon name="inbox" size={50} color="#ccc" />
          <Text style={styles.noRecordText}>No completed orders found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  ordersList: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 20,
    color: "#007AFF",
    marginBottom: 15,
    fontFamily: "MontserratSemiBold",
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noRecordText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    marginTop: 10,
    fontFamily: "MontserratMedium",
  },
  orderItem: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  orderService: {
    fontSize: 18,
    color: "#007AFF",
    fontFamily: "MontserratSemiBold",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    color: "#333",
    fontFamily: "MontserratMedium",
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 16,
    color: "green",
    fontFamily: "MontserratMedium",
    marginLeft: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    fontFamily: "MontserratRegular",
    marginLeft: 8,
  },
  paymentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentMethod: {
    fontSize: 14,
    color: "#666",
    fontFamily: "MontserratRegular",
    marginLeft: 8,
  },
  icon: {
    width: 20,
  },
});

export default PastOrdersScreen;
