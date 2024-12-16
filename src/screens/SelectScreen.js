import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as Font from "expo-font";

const SelectScreen = ({ navigation }) => {
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
    return null; // or a loading spinner
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../Images/1st_rm.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.questionText, styles.fontBold]}>
        I want to Signup as a?
      </Text>
      <TouchableOpacity
        style={[styles.button, styles.shadow]}
        onPress={() => navigation.navigate("CustomerSignup")}
      >
        <Text style={[styles.buttonText, styles.fontSemiBold]}>Customer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.shadow]}
        onPress={() => navigation.navigate("ProfessionalSignup")}
      >
        <Text style={[styles.buttonText, styles.fontSemiBold]}>
          Professional
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTopColor: "black",
    borderTopWidth: 1,
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 20,
    top: -120,
  },
  questionText: {
    fontSize: 23,
    marginBottom: 10,
    textAlign: "center",
    top: -170,
    fontFamily: "MontserratSemiBold",
    color: "#007AFF", // Vibrant blue for emphasis
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#1E40AF", // Consistent with text color
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "80%", // Responsive width
    borderRadius: 25, // Rounded corners for modern look
    alignItems: "center",
    marginVertical: 12,
    top: -150,
    shadowColor: "#1E40AF", // Consistent shadow color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#1E40AF",
    fontFamily: "MontserratSemiBold",
  },
  // shadow: {
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 16 },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 10,
  //   elevation: 25,
  // },
});

export default SelectScreen;

