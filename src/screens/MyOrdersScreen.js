import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Font from "expo-font";
import StarRating from "react-native-star-rating-widget";
import api from "../api";
import { AppContext } from "../Components/AppContext";

const MyOrdersScreen = () => {
  const isFocused = useIsFocused();
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { userData } = useContext(AppContext); // Get user data from context

  const navigation = useNavigation();

  const loadFonts = async () => {
    await Font.loadAsync({
      MontserratRegular: require("../../assets/fonts/Montserrat-Regular.ttf"),
      MontserratBold: require("../../assets/fonts/Montserrat-Bold.ttf"),
      MontserratMedium: require("../../assets/fonts/Montserrat-Medium.ttf"),
      MontserratSemiBold: require("../../assets/fonts/Montserrat-SemiBold.ttf"),
    });
    setFontsLoaded(true);
  };

  const fetchPendingOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await api.get("/orders?status=Pending");
      console.log(response.data);

      setOrders(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load pending orders.");
    }
  };

  useEffect(() => {
    loadFonts();
    fetchPendingOrders();
  }, [isFocused]);

  const completeOrder = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/complete`, { paymentMethod: "COD" });
      setRatingModalVisible(true); // Show the rating modal after order completion
      fetchPendingOrders(); // Refresh the orders list
    } catch (error) {
      Alert.alert("Error", "Failed to mark order as completed.");
    }
  };
  const submitRating = async () => {
    if (!selectedOrder) {
      Alert.alert("Error", "Order not found. Please try again.");
      return;
    }

    try {
      await api.post(`/orders/${selectedOrder._id}/rate`, { rating });
      setRatingModalVisible(false);
      Alert.alert("Thank you!", "Rating submitted successfully.");
      setSelectedOrder(null); // Clear selection after rating
      fetchPendingOrders(); // Refresh orders
    } catch (error) {
      Alert.alert("Error", "Failed to submit rating.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderService}>
        {item.orderType === "Job" ? "Job Title: " : "Service Title: "}
        {item.orderType === "Job" ? item.job?.title : item.service?.title}
      </Text>
      <Text style={styles.orderInfo}>
        Owner: {item.owner?.fullName || "N/A"}
      </Text>
      <Text style={styles.orderInfo}>
        Professional: {item.professional?.fullName || "N/A"}
      </Text>
      <Text style={styles.orderInfo}>
        Payment Method:{" "}
        {item.paymentMethod ||
          (item.orderType === "Job"
            ? item.job?.paymentMethod
            : item.service?.paymentMethod) ||
          "N/A"}
      </Text>
      <Text style={styles.orderInfo}>
        Order Type: {item.orderType || "N/A"}
      </Text>
      <Text style={styles.orderStatus}>
        <Icon name="clock-o" size={16} color="red" /> Pending
      </Text>

      {item.owner?._id === userData?._id && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => {
            // Get payment method from the correct source
            const paymentMethod =
              item.paymentMethod ||
              (item.orderType === "Job"
                ? item.job?.paymentMethod
                : item.service?.paymentMethod);

            if (paymentMethod === "Online") {
              navigation.navigate("PaymentDetailScreen", { orderId: item._id });
            } else {
              setSelectedOrder(item);
              completeOrder(item._id);
            }
          }}
        >
          <Text style={styles.confirmButtonText}>
            <Icon name="check-circle" size={16} color="white" /> Confirm Order
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pending Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.ordersList}
        ListEmptyComponent={
          <Text style={styles.noRecordText}>No pending orders</Text>
        }
      />

      <Modal
        visible={ratingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setRatingModalVisible(false);
          setSelectedOrder(null); // Clear order on close
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.ratingModalContent}>
            <Text style={styles.ratingModalTitle}>Rate Order</Text>
            <StarRating rating={rating} onChange={setRating} />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitRating}
            >
              <Text style={styles.submitButtonText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20 },
  heading: { fontSize: 20, color: "#007AFF", fontFamily: "MontserratSemiBold" },
  ordersList: { paddingBottom: 20 },
  orderItem: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderService: {
    fontSize: 18,
    color: "#007AFF",
    fontFamily: "MontserratMedium",
  },
  orderPrice: { fontSize: 16, color: "#333", fontFamily: "MontserratRegular" },
  orderInfo: { fontSize: 16, color: "#333", fontFamily: "MontserratRegular" },
  orderStatus: { fontSize: 16, color: "#333", fontFamily: "MontserratRegular" },
  confirmButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "MontserratMedium",
  },
  noRecordText: { textAlign: "center", fontSize: 18, color: "gray" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  ratingModalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  ratingModalTitle: {
    fontSize: 20,
    fontFamily: "MontserratBold",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "MontserratSemiBold",
  },
});

export default MyOrdersScreen;
