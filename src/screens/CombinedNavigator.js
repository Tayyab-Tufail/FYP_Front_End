import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MyOrdersScreen from "../screens/MyOrdersScreen";
import PastOrdersScreen from "../screens/PastOrdersScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import MyServicesScreen from "../screens/MyServicesScreen";
import NotificationScreen from "../screens/NotificationsScreen";
import ProfessionalLogin from "../screens/ProfessionalLoginScreen";
import ProfessionalDashboardScreen from "../screens/ProfessionalDashboardScreen";
import PostJobScreen from "../screens/PostJobScreen";
import JobVisualization from "../screens/JobVisualization";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

const OrdersTopTabs = () => {
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();

  const handleTabChange = (routeName) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.drawerButton}
        >
          <Icon name="bars" size={25} color="black" />
        </TouchableOpacity>
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
                label = "My Orders";
              } else if (route.name === "PastOrders") {
                label = "Past Orders";
              }
              return (
                <View
                  style={{
                    ...styles.tabContainer,
                    backgroundColor: focused ? "white" : "#ccc",
                  }}
                >
                  <Text
                    style={{
                      color: focused ? "#007AFF" : "black",
                      fontWeight: focused ? "500" : "normal",
                      fontSize: 17,
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
              borderRadius: 5,
            },
            tabBarStyle: {
              backgroundColor: "#ccc",
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderColor: "gray",
              borderTopWidth: 1,
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

const DrawerContent = ({ navigation }) => {
  return (
    <View style={styles.drawerContent}>
      <Text style={styles.drawerHeaderText}>Professional Dashboard</Text>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("MyProfile")}
      >
        <Icon name="user" size={20} color="black" style={styles.icon} />
        <Text style={styles.drawerItemText}>My Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("MyServices")}
      >
        <Icon name="wrench" size={20} color="black" style={styles.icon} />
        <Text style={styles.drawerItemText}>My Services</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("Notifications")}
      >
        <Icon name="bell" size={20} color="black" style={styles.icon} />
        <Text style={styles.drawerItemText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("PostJobScreen")}
      >
        <Icon name="briefcase" size={20} color="black" style={styles.icon} />
        <Text style={styles.drawerItemText}>Post a Job</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("JobVisualization")}
      >
        <Icon name="tasks" size={20} color="black" style={styles.icon} />
        <Text style={styles.drawerItemText}>Job Visualization</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.replace("ProfessionalLogin")}
      >
        <Icon name="sign-out" size={20} style={styles.icon} />
        <Text style={styles.drawerItemText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const CombinedNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="ProfessionalDashboard"
        component={ProfessionalDashboardScreen}
      />
      <Drawer.Screen name="OrdersTopTabs" component={OrdersTopTabs} />
      <Drawer.Screen name="MyProfile" component={MyProfileScreen} />
      <Drawer.Screen name="MyServices" component={MyServicesScreen} />
      <Drawer.Screen name="Notifications" component={NotificationScreen} />
      <Drawer.Screen name="ProfessionalLogin" component={ProfessionalLogin} />
      <Drawer.Screen name="PostJobScreen" component={PostJobScreen} />
      <Drawer.Screen name="JobVisualization" component={JobVisualization} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "white",
    zIndex: 2,
  },
  drawerButton: {
    position: "absolute",
    left: 15,
    top: 15,
  },
  headerText: {
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    top: 17,
    width: "100%",
  },
  tabWrapper: {
    flex: 1,
    marginTop: 80,
    backgroundColor: "white",
  },
  tabContainer: {
    alignItems: "center",
    paddingVertical: 1,
    paddingHorizontal: 10,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 2,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  drawerHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 25,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    justifyContent: "flex-start",
  },
  drawerItemText: {
    marginLeft: 12,
    fontSize: 17,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
  },
  icon: {
    marginRight: 8,
    color: "#007AFF",
  },
});

export default CombinedNavigator;
