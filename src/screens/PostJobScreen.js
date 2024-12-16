import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Platform,
  ActionSheetIOS,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native"; // Import navigation
import api from "../api"; // Import axios instance
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../Components/AppContext";

const jobCategories = [
  "Teacher",
  "Student",
  "Doctor",
  "Nurse",
  "Engineer",
  "Daily Worker",
  "Pest Control",
  "Electrical",
  "Driving",
  "Gardening",
  "Security Systems",
  "Interior Design",
  "Windows & Doors",
  "Carpentry",
  "Appliance Repair",
  "Painting",
  "Plumbing",
  "Roofing",
  "House Shifting",
  "Home Inspection",
  "Flooring",
  "Masonry",
  "Cleaning",
  "Landscaping",
  "Catering Services",
  "Pet Care",
  "Event Planning",
  "Hair Stylist",
  "Mobile Mechanic",
  "Computer Repair",
  "IT Support",
  "Fitness Trainer",
];

const uniqueJobCategories = Array.from(new Set(jobCategories)).sort();

const PostJobScreen = () => {
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

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  const { userType } = useContext(AppContext); // Access context functions

  const navigation = useNavigation();

  // Handle API call to post a job
  const handlePostJob = async () => {
    if (!jobTitle || !jobDescription || !paymentMethod) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      const formData = new FormData();

      formData.append("title", jobTitle);
      formData.append("description", jobDescription);
      formData.append("category", jobCategory);
      formData.append("location", location);
      formData.append("paymentMethod", paymentMethod);
      formData.append("userType", userType);

      images.forEach((uri, index) => {
        formData.append("images", {
          uri,
          name: `image_${index}.jpg`,
          type: "image/jpg",
        });
      });

      const response = await api.post("/jobs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Job posted successfully.");

        navigation.navigate("JobVisualization", {
          jobId: response.data.job._id,
        });
      } else {
        Alert.alert("Error", response.data.message || "Job posting failed.");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      Alert.alert("Error", "An error occurred while posting the job.");
    }
  };
  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
    };

    if (locationPermission === null) {
      requestLocationPermission();
    }
  }, [locationPermission]);
  const handleLocationFocus = async () => {
    if (locationPermission !== "granted") {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }
      setLocationPermission(status);
    }

    let location = await Location.getCurrentPositionAsync({});
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;

    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (reverseGeocode.length > 0) {
      let address = reverseGeocode[0];
      let locationString = `${address.name}, ${address.street}, ${address.city}, ${address.region}, ${address.country}`;
      setLocation(locationString);
    } else {
      setLocation(`${latitude}, ${longitude}`);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const handleRemoveImage = (uri) => {
    setImages(images.filter((image) => image !== uri));
    Alert.alert("Image Removed", "Image has been removed");
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Upload From Gallery", "Take Photo"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImage();
          } else if (buttonIndex === 2) {
            takePhoto();
          }
        }
      );
    } else {
      Alert.alert(
        "Upload Image",
        "Choose an option",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Upload From Gallery",
            onPress: pickImage,
          },
          {
            text: "Take Photo",
            onPress: takePhoto,
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Post a Job</Text>
      </View>

      <Text style={styles.label}>Job Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter job title"
        value={jobTitle}
        onChangeText={setJobTitle}
      />

      <Text style={styles.label}>Job Description</Text>
      <TextInput
        style={[styles.input, styles.inputDescription]}
        placeholder="Enter job description"
        value={jobDescription}
        onChangeText={setJobDescription}
        multiline={true}
        numberOfLines={4}
      />

      <Text style={styles.label}>Job Category</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setJobCategory(value)}
          items={uniqueJobCategories.map((category) => ({
            label: category,
            value: category,
          }))}
          style={pickerSelectStyles}
          placeholder={{
            label: "Select a job category",
            value: null,
          }}
        />
      </View>

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location (Optional)"
        value={location}
        onFocus={handleLocationFocus}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Images</Text>
      <View style={styles.uploadContainer}>
        <TouchableOpacity
          style={styles.uploadArea}
          onPress={showImagePickerOptions}
        >
          <Text style={styles.uploadText}>
            Upload image of your work (Optional)
          </Text>
          <Ionicons
            name="camera"
            size={24}
            color="gray"
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => handleRemoveImage(uri)}
              >
                <Icon name="times-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.subtitle}>Choose a payment method</Text>

      <TouchableOpacity
        style={[
          styles.box,
          paymentMethod === "Cash on Delivery" && styles.selectedBox,
        ]}
        onPress={() => handlePaymentSelection("COD")}
      >
        <Text style={styles.boxText}>Cash on Delivery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.box,
          paymentMethod === "EasyPaisa" && styles.selectedBox,
        ]}
        onPress={() => handlePaymentSelection("Online")}
      >
        <Text style={styles.boxText}>Online Payment</Text>
        <Image
          source={require("../Images/stripe.png")}
          style={styles.easyPaisaLogo}
        />
      </TouchableOpacity>

      {/* Display the selected payment method */}
      {paymentMethod && (
        <Text style={styles.paymentMethodText}>
          Selected Payment: {paymentMethod}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handlePostJob}>
        <Text style={styles.buttonText}>Post Job</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    paddingRight: 30,
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    paddingRight: 30,
    marginBottom: 15,
  },
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
  titleContainer: {
    borderBottomColor: "#007BFF",
    borderBottomWidth: 1,
    alignSelf: "center",
    top: -3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
    color: "#007BFF",
    fontFamily: "MontserratBold", // Applied font style
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "MontserratSemiBold",
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontFamily: "MontserratMedium", // Applied font style
  },
  inputDescription: {
    minHeight: 100,
    textAlignVertical: "top",
    fontFamily: "MontserratMedium", // Applied font style
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  uploadContainer: {
    marginBottom: 15,
  },
  uploadArea: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  uploadText: {
    flex: 1,
    fontSize: 16,
    color: "gray",
    fontFamily: "MontserratMedium", // Applied font style
  },
  cameraIcon: {
    marginLeft: 10,
    color: "black",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 15,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  imageWrapper: {
    position: "relative",
    margin: 5,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
  },
  removeIcon: {
    position: "absolute",
    top: -3.5,
    right: -1,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
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
  selectedBox: {
    borderColor: "#007AFF",
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
  paymentMethodText: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "MontserratMedium",
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16.5,
    fontFamily: "MontserratBold", // Applied font style
  },
});

export default PostJobScreen;
