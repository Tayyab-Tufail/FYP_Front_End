import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { CardForm, useConfirmPayment } from "@stripe/stripe-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../api";
import StarRating from "react-native-star-rating-widget";

const PaymentDetailScreen = () => {
  const navigation = useNavigation();
  const { confirmPayment } = useConfirmPayment();
  const route = useRoute();
  const { orderId } = route.params;

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);

  const handlePayment = async () => {
    if (!amount) {
      Alert.alert("Error", "Please enter the amount.");
      return;
    }

    if (!cardComplete) {
      Alert.alert("Error", "Please complete all card details.");
      return;
    }

    setLoading(true);

    try {
      // Create Payment Intent
      const response = await api.post(`/orders/${orderId}/complete`, {
        price: parseFloat(amount),
        paymentMethodType: "card",
      });

      const { clientSecret, paymentIntentId } = response.data;

      // Confirm the payment
      const billingDetails = {
        email: "email@stripe.com",
      };

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        billingDetails,
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else if (paymentIntent) {
        // Update order status after successful payment
        try {
          await api.post(`/orders/${orderId}/payment-complete`, {
            paymentIntentId,
          });

          setRatingModalVisible(true); // Show rating modal
        } catch (updateError) {
          Alert.alert(
            "Warning",
            "Payment was successful but there was an error updating the order status. Please contact support."
          );
        }
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error processing your payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    try {
      await api.post(`/orders/${orderId}/rate`, { rating });
      setRatingModalVisible(false);
      Alert.alert("Thank you!", "Rating submitted successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting rating:", error);
      Alert.alert("Error", "Failed to submit rating.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.label}>Card Information</Text>
        <CardForm
          style={styles.cardForm}
          onFormComplete={(details) => {
            setCardComplete(details.complete);
          }}
          cardStyle={styles.cardField}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.payButton,
          (!cardComplete || loading) && styles.disabledButton,
        ]}
        onPress={handlePayment}
        disabled={!cardComplete || loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.payButtonText}>
            Pay ${parseFloat(amount || 0).toFixed(2)}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.testCardText}>
        Test Card: 4242 4242 4242 4242{"\n"}
        Exp: Any future date (e.g., 12/34){"\n"}
        CVC: Any 3 digits
      </Text>

      <Modal
        visible={ratingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.ratingModalContent}>
            <Text style={styles.ratingModalTitle}>Rate Your Experience</Text>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 26,
    fontFamily: "MontserratBold",
    color: "#007AFF",
    marginBottom: 40,
    textAlign: "center",
    textShadowColor: "rgba(0, 122, 255, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "MontserratMedium",
    color: "#555555",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    fontFamily: "MontserratMedium",
    elevation: 2,
  },
  cardContainer: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardForm: {
    height: 200,
    marginVertical: 10,
    backgroundColor: "#007AFF",
  },
  cardField: {
    backgroundColor: "#FAFAFA",
    textColor: "#000000",
    borderRadius: 8,
    fontSize: 14,
    placeholderColor: "#CCCCCC",
    padding: 10,
  },
  payButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#B3C2CE",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "MontserratSemiBold",
  },
  testCardText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 20,
    fontFamily: "MontserratMedium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  ratingModalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    width: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  ratingModalTitle: {
    fontSize: 22,
    fontFamily: "MontserratBold",
    color: "#444444",
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "MontserratSemiBold",
  },
});


export default PaymentDetailScreen;
