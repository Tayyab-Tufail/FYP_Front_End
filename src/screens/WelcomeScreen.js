import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";

const WelcomeScreen = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation();

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

  const handleNextPress = () => {
    navigation.navigate("Select");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>Welcome (خوش آمدید)</Text>
      <Image
        source={require("../Images/1st_rm.png")} // Replace with your relative path
        style={[styles.logo, styles.shadow]}
      />
      <Image
        source={require("../Images/rm_bg.png")} // Replace with your relative path
        style={[styles.personImage, styles.shadow]}
      />
      <Text style={styles.descriptionText1}>اپنا ہر کام کروائیں </Text>
      <Text style={styles.descriptionText}>
        ☑️ فوراً ☑️ انتہائی مناسب قیمت پر
      </Text>
      <Text style={styles.descriptionText}>
        ☑️ باحفاظت ☑️ اعلی معیار کے ساتھ
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleNextPress}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
  },
  welcomeText: {
    fontSize: 22,
    color: "#000",
    textAlign: "center",
    top: 40,
    marginTop: 10,
    fontFamily: "MontserratBold",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 30,
  },
  personImage: {
    width: 400,
    height: 385,
    resizeMode: "contain",
    borderColor: "white",
    marginTop: -15,
  },
  descriptionText: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    paddingVertical: 3,
    fontFamily: "MontserratSemiBold",
  },
  descriptionText1: {
    fontSize: 25,
    color: "black",
    textAlign: "center",
    paddingVertical: 5,
    fontFamily: "MontserratBold",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 150,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 10,
    alignSelf: "center",
    minWidth: 100,
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    fontFamily: "MontserratSemiBold",
  },
});

export default WelcomeScreen;
