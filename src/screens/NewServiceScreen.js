import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native"; // Import useRoute
import { AppContext } from "../Components/AppContext";

// Dummy data for services
const services = [
  { id: "1", title: "AC Services at Home", image: require("../Images/ac.jpg") },
  {
    id: "2",
    title: "Refrigerator Repair",
    image: require("../Images/fridge.jpg"),
  },
  { id: "3", title: "Beauty Parlour", image: require("../Images/beauty.jpg") },
  {
    id: "4",
    title: "Mechanic Services",
    image: require("../Images/mechanic.jpg"),
  },
  {
    id: "5",
    title: "Carpenter Services",
    image: require("../Images/furt.jpg"),
  },
  {
    id: "6",
    title: "Electrician Services",
    image: require("../Images/electrican.jpg"),
  },
  {
    id: "7",
    title: "Tailoring Services",
    image: require("../Images/tailor.jpg"),
  },
  {
    id: "8",
    title: "Home Paint Services",
    image: require("../Images/painter.jpg"),
  },
  {
    id: "9",
    title: "Home Repair and Maintenance",
    image: require("../Images/home.jpg"),
  },
  {
    id: "10",
    title: "Home Plumbing Services",
    image: require("../Images/plumber.jpg"),
  },
  {
    id: "11",
    title: "Home Cleaning Services",
    image: require("../Images/cleaner.jpg"),
  },
  {
    id: "12",
    title: "Solar Panel Services",
    image: require("../Images/solar.jpg"),
  },
  {
    id: "13",
    title: "Welding Services",
    image: require("../Images/weder.jpg"),
  },
  {
    id: "14",
    title: "Glass Aluminium Services",
    image: require("../Images/glass.jpg"),
  },
];

// Memoized SearchHeader component
const SearchHeader = React.memo(({ searchQuery, onSearchChange }) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchQuery}
        onChangeText={onSearchChange}
        autoCorrect={false}
        returnKeyType="search"
      />
      <Icon name="search" size={22} color="black" style={styles.searchIcon} />
      <Text style={styles.infoText}>Or Select from the list below</Text>
    </View>
  );
});

const NewServiceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Get the current route
  const { userData, userType } = useContext(AppContext); // Access user data and role

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useCallback((text) => {
    setSearchQuery(text);
  }, []);

  // Filter services based on search query
  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Destructure val (userRole) from route params
  const { val: userRole } = route.params || {}; // Get userRole from previous screen

  // Handle adding service and navigating to MyServicesScreen
  const handleAddService = (service) => {
    navigation.navigate("MyServicesScreen", {
      selectedServices: [service], // Pass selected service(s)
      val: userRole,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ marginBottom: 20 }}
        data={filteredServices}
        numColumns={2}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <SearchHeader
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer}>
            <Image source={item.image} style={styles.itemImage} />
            <Text style={styles.itemText}>{item.title}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleAddService(item)} // Pass the service to MyServicesScreen
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
  searchIcon: {
    position: "absolute",
    right: 15,
    top: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 12,
    height: 48,
    width: "98%",
    left: 5,
  },
  searchInput: {
    flex: 1,
    paddingRight: 30,
    fontSize: 18,
  },
  infoText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    bottom: -25,
    fontSize: 16,
    color: "#0a90f0",
    fontWeight: "bold",
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    top: 10,
    marginBottom: 10,
  },
  itemImage: {
    width: 150,
    height: 100,
    borderRadius: 0,
    resizeMode: "contain",
  },
  itemText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0a90f0",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default NewServiceScreen;
