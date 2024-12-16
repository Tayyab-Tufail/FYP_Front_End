import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Font from "expo-font";
import MyOrdersScreen from "../screens/MyOrdersScreen";
import PastOrdersScreen from "../screens/PastOrdersScreen";

const Tab = createMaterialTopTabNavigator();

const OrdersTopTabs = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleTabChange = (routeName) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>My Orders</Text>
      </View>
      {loading && (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      )}
      <View style={styles.tabWrapper}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarLabel: ({ focused }) => {
              let label;
              if (route.name === "MyOrders") {
                label = "My-Orders";
              } else if (route.name === "PastOrders") {
                label = "Past-Orders";
              }
              return (
                <View
                  style={{
                    ...styles.tabContainer,
                    backgroundColor: focused ? "white" : "#F0F0F0",
                  }}
                >
                  <Text
                    style={{
                      color: focused ? "#007AFF" : "black",
                      fontWeight: focused ? "500" : "normal",
                      fontSize: 17,
                      fontFamily: "MontserratSemiBold",
                    }}
                  >
                    {label}
                  </Text>
                </View>
              );
            },
            tabBarIndicatorStyle: {
              backgroundColor: "white",
              height: "100%",
              borderRadius: 10,
              borderColor: "white",
              borderWidth: 1,
            },
            tabBarStyle: {
              backgroundColor: "#F0F0F0",
              elevation: 4,
              shadowOpacity: 5,
              paddingVertical: -5,
            },
            headerShown: false, // Hide the default header
          })}
          screenListeners={({ route }) => ({
            tabPress: () => {
              handleTabChange(route.name);
            },
          })}
        >
          <Tab.Screen name="MyOrders" component={MyOrdersScreen} />
          <Tab.Screen name="PastOrders" component={PastOrdersScreen} />
        </Tab.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "white",
    marginTop: 5,
    zIndex: 2,
  },
  headerText: {
    fontSize: 23,
    fontFamily: "MontserratBold",
    textAlign: "center",
    top: 17,
    width: "100%",
  },
  tabWrapper: {
    flex: 1,
    marginTop: 80,
    backgroundColor: "#ccc",
    paddingVertical: 2,
  },
  tabContainer: {
    alignItems: "center",
    paddingVertical: -3,
    paddingHorizontal: 10,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
});

export default OrdersTopTabs;
