import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SplashScreen from "./src/screens/SplashScreen";
import SignupScreen from "./src/screens/SignupScreen";
import CustomerSignupScreen from "./src/screens/CustomerSignupScreen";
import CustomerLoginScreen from "./src/screens/CustomerLoginScreen";
import CustomerDashboardScreen from "./src/screens/CustomerDashboardScreen";
import ProfessionalLoginScreen from "./src/screens/ProfessionalLoginScreen";
import ProfessionalSignupScreen from "./src/screens/ProfessionalSignupScreen";
import ProfessionalDashboardScreen from "./src/screens/ProfessionalDashboardScreen";
import MyProfileScreen from "./src/screens/MyProfileScreen";
import SelectScreen from "./src/screens/SelectScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import ChangePasswordScreen from "./src/screens/ChangepasswordScreen";
import PreviousWorkPhotos from "./src/screens/PreviousWorkPhotos";
import PersonalInformationScreen from "./src/screens/PersonalInformationScreen";
import MyServicesScreen from "./src/screens/MyServicesScreen";
import NewServiceScreen from "./src/screens/NewServiceScreen";
import SubService from "./src/screens/SubService";
import NotificationScreen from "./src/screens/NotificationsScreen";
import TabsScreen from "./src/screens/TabsScreen";
import PostJobScreen from "./src/screens/PostJobScreen";
import JobVisualization from "./src/screens/JobVisualization";
import DrawerNavigator from "./src/screens/DrawerNavigator";
import { JobsProvider } from "./src/Components/JobsContext";
import ServiceDetailScreen from "./src/Components/ServiceDetailScreen";
import ChatScreen from "./src/screens/ChatScreen";
import PaymentDetailScreen from "./src/screens/PaymentDetailScreen";
import DeleteProfileScreen from "./src/screens/DeleteProfileScreen";
import ChatDetailScreen from "./src/screens/ChatDetailScreen";
import { AppProvider } from "./src/Components/AppContext";
import JobApplicationsScreen from "./src/screens/ViewJobApplicationsScreen";
import ViewJobApplicationsScreen from "./src/screens/ViewJobApplicationsScreen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "./src/Components/AppContext";
import StripeAppProvider from "./src/stripe";
import { Text, View } from "react-native";
import api from "./src/api";

const Stack = createStackNavigator();

const MainApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track auth status
  const [loading, setLoading] = useState(true); // Track splash loading
  const { updateUserData, updateUserType } = useContext(AppContext); // Access the updateUserData function from context

  // Function to fetch user data
  const fetchUserData = async (token) => {
    try {
      const response = await api.get("/profile/my-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      updateUserData(response.data.user); // Store user data in context
      updateUserType(response.data.userType); // Store user data in context
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Check if user is already logged in (auth token exists)
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log(token);

      setIsAuthenticated(!!token);
      if (token) {
        await fetchUserData(token);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Run checkAuthStatus when the app loads
  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (loading) {
    // Show splash or loading screen while loading
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "ProfessionalDashboard" : "Welcome"}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "", headerShown: true }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: "", headerShown: true }}
        />
        <Stack.Screen
          name="CustomerSignup"
          component={CustomerSignupScreen}
          options={{ title: "Customer Signup", headerShown: true }}
        />
        <Stack.Screen
          name="CustomerLogin"
          component={CustomerLoginScreen}
          options={{ title: "Customer Login", headerShown: true }}
        />
        <Stack.Screen
          name="ProfessionalLogin"
          component={ProfessionalLoginScreen}
          options={{ title: "Professional Login", headerShown: true }}
        />
        <Stack.Screen
          name="ProfessionalSignup"
          component={ProfessionalSignupScreen}
          options={{ title: "Professional Signup", headerShown: true }}
        />
        <Stack.Screen
          name="ProfessionalDashboard"
          component={TabsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyProfileScreen"
          component={MyProfileScreen}
          options={{ title: "My Profile", headerShown: true }}
        />
        <Stack.Screen
          name="MyServicesScreen"
          component={MyServicesScreen}
          options={({ route }) => ({
            title:
              route.params?.val === "customer"
                ? "What type of work do you want?"
                : "What type of work do you do?",
            headerShown: true,
            headerTitleStyle: {
              fontSize: 16, // Change this value to set the font size
              fontWeight: "italic",
              color: "#000", // Optional: Change the color of the text
            },
          })}
        />

        <Stack.Screen
          name="NewServiceScreen"
          component={NewServiceScreen}
          options={{
            title: "What type of work do you do?",
            headerShown: true,
            headerTitleStyle: {
              fontSize: 17, // Change this value to set the font size
              fontWeight: "italic",
              color: "#333", // Optional: Change the color of the text
            },
          }}
        />
        <Stack.Screen
          name="CustomerDashboard"
          component={CustomerDashboardScreen}
          options={{ title: "Customer Dashboard", headerShown: true }}
        />
        <Stack.Screen
          name="Select"
          component={SelectScreen}
          options={{
            title: "Select Role",
            headerBackTitleVisible: false,
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{
            title: "Forgot Password",
            headerBackTitleVisible: false,
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ title: "Change Password", headerShown: true }}
        />
        <Stack.Screen
          name="PreviousWorkPhotos"
          component={PreviousWorkPhotos}
          options={{
            title: "Service / Business Images",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="SubService"
          component={SubService}
          options={{ title: "SubService", headerShown: true }}
        />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{ title: "Notification Screen", headerShown: true }}
        />
        <Stack.Screen
          name="PersonalInformation"
          component={PersonalInformationScreen}
          options={{ title: "Personal Information", headerShown: true }}
        />
        <Stack.Screen
          name="PostJobScreen"
          component={PostJobScreen}
          options={{ title: "Post a Job", headerShown: true }}
        />
        <Stack.Screen
          name="JobVisualization"
          component={JobVisualization}
          options={{ title: "View a Job", headerShown: true }}
        />
        <Stack.Screen
          name="ViewJobApplicationsScreen"
          component={ViewJobApplicationsScreen}
          options={{ title: "View Job Applications" }}
        />

        <Stack.Screen
          name="ServiceDetailScreen"
          component={ServiceDetailScreen}
          options={{ title: "Service Detail", headerShown: true }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: "Chat", headerShown: true }}
        />
        <Stack.Screen
          name="PaymentDetailScreen"
          component={PaymentDetailScreen}
          options={{ title: "Payment", headerShown: true }}
        />
        <Stack.Screen
          name="DeleteProfile"
          component={DeleteProfileScreen}
          options={{ title: "Delete Profile", headerShown: true }}
        />
        <Stack.Screen
          name="ChatDetailScreen"
          component={ChatDetailScreen}
          options={({ route }) => ({ title: route.params.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <AppProvider>
    <StripeAppProvider>
      <JobsProvider>
        <MainApp />
      </JobsProvider>
    </StripeAppProvider>
  </AppProvider>
);

export default App;
