import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Font from "expo-font";
import StarRating from "react-native-star-rating-widget";
import { AppContext } from "../Components/AppContext";
import api from "../api";

const PreviousWorkPhotos = ({ route }) => {
  const { userType, userData } = useContext(AppContext);
  const [images, setImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const { professionalName, professionalId } = route.params || {};

  // Load portfolio or previously uploaded images
  const fetchPortfolioImages = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const endpoint = `/business/portfolio/${userType}/${userData._id}`;
      const response = await api.get(endpoint);

      setImages(response.data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load portfolio images.");
    }
  };

  useEffect(() => {
    fetchPortfolioImages();

    // Show rating modal after 4 seconds if viewing a professional's portfolio
    if (professionalId && userType === "customer") {
      const timer = setTimeout(() => {
        setRatingModalVisible(true);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  const submitRating = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await api.post(
        `/business/professionals/${professionalId}/rate`,
        {
          rating,
        }
      );

      setRatingModalVisible(false);
      Alert.alert("Thank you!", "Rating submitted successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to submit rating.");
    }
  };

  // Upload selected images
  const handleUploadImages = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const formData = new FormData();

      images.forEach((uri, index) => {
        formData.append("images", {
          uri,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        });
      });

      formData.append("userType", userType); // Add userType to the request

      const response = await api.post(
        "/business/upload-business-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", response.data.message || "Images uploaded!");
      fetchPortfolioImages(); // Reload portfolio after upload
    } catch (error) {
      Alert.alert("Error", "Failed to upload images.");
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages((prev) => [
        ...prev,
        ...result.assets.map((asset) => asset.uri),
      ]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchPortfolioImages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {professionalName
          ? `Portfolio of ${professionalName}`
          : "Manage Your Work Images"}
      </Text>
      <ScrollView contentContainerStyle={styles.imageGrid}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            {!professionalId && (
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => removeImage(index)}
              >
                <Icon name="times-circle" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {!professionalId && (
        <>
          <TouchableOpacity style={styles.button} onPress={pickImages}>
            <Text style={styles.buttonText}>
              <Icon name="image" size={20} /> Add Images
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleUploadImages}>
            <Text style={styles.buttonText}>Upload Images</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal
        visible={ratingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.ratingModalContent}>
            <Text style={styles.ratingModalTitle}>Rate Professional</Text>
            <Text style={styles.ratingSubtitle}>
              How would you rate {professionalName}'s work?
            </Text>
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
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  header: {
    fontSize: 24,
    marginBottom: 15,
    fontFamily: "MontserratBold", // Clean and professional font
    color: "#2D3748", // Neutral dark color for text
    textAlign: "center",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: "30%",
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#FFFFFF", // White background for better contrast
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Shadow for a modern card-like effect
    overflow: "hidden", // Prevent content from spilling out
    position: "relative",
  },

  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 10, // Rounded edges for images
  },
  removeIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
  },
  button: {
    backgroundColor: "#1E90FF", // Vibrant blue for call-to-action
    paddingVertical: 12,
    borderRadius: 8, // Rounded button
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "MontserratSemiBold",
    textAlign: "center",
  },
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
  ratingSubtitle: {
    fontSize: 16,
    fontFamily: "MontserratRegular",
    marginBottom: 15,
    textAlign: "center",
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#1E90FF",
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

export default PreviousWorkPhotos;
