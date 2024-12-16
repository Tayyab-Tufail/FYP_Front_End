// src/navigation/DrawerNavigator.js
import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MyProfileScreen from "../screens/MyProfileScreen";
import MyServicesScreen from "../screens/MyServicesScreen";
import NotificationScreen from "../screens/NotificationsScreen";
import ProfessionalLogin from "../screens/ProfessionalLoginScreen";
import ProfessionalDashboardScreen from "../screens/ProfessionalDashboardScreen";
import PostJobScreen from "../screens/PostJobScreen";
import JobVisualization from "../screens/JobVisualization";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="MyProfile"
      screenOptions={{
        headerShown: true,
        drawerType: "slide",
        drawerPosition: "left",
        drawerStyle: {
          backgroundColor: "#ececec",
          width: 200,
        },
      }}
    >
      <Drawer.Screen
        name="ProfessionalDashboard"
        component={ProfessionalDashboardScreen}
        options={{
          drawerLabel: "hola",
          headerTitle: () => <Text>Dashboard</Text>,
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ drawerLabel: "My Profile" }}
      />
      <Drawer.Screen
        name="MyServices"
        component={MyServicesScreen}
        options={{ drawerLabel: "My Services" }}
        // initialParams={{ val }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{ drawerLabel: "Notifications" }}
      />
      <Drawer.Screen
        name="ProfessionalLogin"
        component={ProfessionalLogin}
        options={{ drawerLabel: "Log Out" }}
      />
      <Drawer.Screen name="PostJobScreen" component={PostJobScreen} />
      <Drawer.Screen
        name="JobVisualization"
        component={JobVisualization}
        options={{ drawerLabel: "Job Visualization" }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
