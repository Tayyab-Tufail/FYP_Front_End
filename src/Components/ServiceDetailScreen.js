import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import * as Font from "expo-font";

const ServiceDetailScreen = ({ route }) => {
  const {
    uri,
    price,
    experience,
    name,
    experties,
    rating,
    additionalImages,
    deliveredTime,
  } = route.params;
  console.log(uri);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // or a loader component
  }

  const renderDetailItem = (label, value) => (
    <View style={styles.detailContainer}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.text}>{value}</Text>
    </View>
  );

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  console.log(uri);
  
  return (
    <>
      <FlatList
        ListHeaderComponent={
          <>
            <TouchableOpacity onPress={() => handleImagePress(uri)}>
              <View style={styles.imageContainer}>
                <Image source={uri} style={styles.mainImage} />
              </View>
            </TouchableOpacity>
            {renderDetailItem("Name", name)}
            {renderDetailItem("Experience", experience)}
            {renderDetailItem("Rating", rating)}

            <Text style={styles.additionalImagesTitle}>
              Previous Work Photos
            </Text>
          </>
        }
        data={additionalImages}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleImagePress(item)}>
            <View style={styles.itemContainer}>
              <Image source={item} style={styles.itemImage} />
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.container}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image source={selectedImage} style={styles.modalImage} />
            )}
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  mainImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: "#00BFFF",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  serviceDetailsContainer: {
    marginBottom: 25,
  },
  detailContainer: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#00BFFF",
    fontFamily: "MontserratSemiBold",
  },
  text: {
    fontSize: 16,
    color: "#333",
    fontFamily: "MontserratMedium",
  },
  additionalImagesTitle: {
    fontSize: 18,
    fontFamily: "MontserratSemiBold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemContainer: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  itemImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    width: "90%",
    maxWidth: 500,
  },
  modalImage: {
    width: "100%",
    height: 350,
    resizeMode: "contain",
    marginBottom: 20,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 2,
  },
  closeButton: {
    backgroundColor: "#00BFFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "MontserratSemiBold",
  },
});
  
export default ServiceDetailScreen;
