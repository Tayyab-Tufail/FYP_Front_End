import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";

const WalletScreen = () => {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleNavigation = (paymentMethod) => {
    if (paymentMethod === "Cash on Delivery") {
      setModalVisible(true);
    } else {
      navigation.navigate("PaymentDetailScreen");
    }
  };

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Choose a payment method</Text>

      <TouchableOpacity
        style={styles.box}
        onPress={() => handleNavigation("EasyPaisa")}
      >
        <Text style={styles.boxText}>EasyPaisa</Text>
        <Image
          source={require("../Images/easypaisa1.png")}
          style={styles.easyPaisaLogo}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.box}
        onPress={() => handleNavigation("Cash on Delivery")}
      >
        <Text style={styles.boxText}>Cash on Delivery</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.successMessage}>
              Your order has been Successfully Placed
            </Text>
            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
              color="#007AFF"
            />
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
    padding: 16,
    borderTopColor: "#ccc",
    borderTopWidth: 2,
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "MontserratSemiBold",
    color: "#007AFF",
    top: 15,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    marginTop: 15,
    top: 10,
  },
  boxText: {
    fontSize: 18,
    fontFamily: "MontserratSemiBold",
  },
  easyPaisaLogo: {
    width: 60,
    height: 30,
    marginRight: -4,
    backgroundColor: "#fff",
  },
  modalOverlay: {
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
  successMessage: {
    fontSize: 18,
    color: "green",
    textAlign: "center",
    fontFamily: "MontserratMedium",
    marginBottom: 20,
  },
});

export default WalletScreen;
