import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import ProfessionalDashboardScreen from "./ProfessionalDashboardScreen";
import WalletScreen from "./WalletScreen";
import OrdersTopTabs from "./OrdersTopTabs";
import ChatScreen from "./ChatScreen";
import * as Font from "expo-font";

const Tab = createBottomTabNavigator();

const TabsScreen = ({ route }) => {
  const { val } = route.params || {};
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

  useEffect(() => {
    console.log("route.params:", route.params);
  }, [route.params]);

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        switch (route.name) {
          case "Home":
            iconName = "home";
            size = 30;
            break;
          case "Orders":
            iconName = "list";
            size = 25;
            break;
          case "Chat":
            iconName = "comments";
            size = 25;
            break;
          default:
            iconName = "circle";
            break;
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#007AFF", // Deep blue for active tab
      tabBarInactiveTintColor: "#393b38", // Subtle gray for inactive tab
      tabBarStyle: {
        backgroundColor: "#F5F7FA", // Light background for modern look
        borderTopColor: "#ccc",
        height: 65, // Increased height for better touch area
        paddingBottom: 8, // Adjusted padding
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8, // Shadow for Android
      },
      tabBarLabelStyle: {
        fontSize: 13,
        fontFamily: "MontserratMedium",
      },
    })}
  >
      <Tab.Screen
        name="Home"
        component={ProfessionalDashboardScreen}
        options={{
          headerShown: false,
        }}
        initialParams={{ val }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersTopTabs}
        options={{
          headerShown: false,
        }}
      />
      
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
    </Tab.Navigator>
  );
};

export default TabsScreen;
