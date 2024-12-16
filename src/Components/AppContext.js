import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a context for global state management
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Store user data in state
  const [userType, setUserType] = useState(null); // Store user type
  const [selectedServices, setSelectedServices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCounter, setNotificationCounter] = useState(1);

  const updateUserType = (type) => setUserType(type);

  // Function to update the user data in the context
  const updateUserData = (data) => setUserData(data);

  // Logout function to clear user data and token
  const logout = async () => {
    await AsyncStorage.removeItem("authToken"); // Remove token from storage
    setUserData(null); // Clear user data in context
    setUserType(null); // Clear user type
  };

  const addService = (service) => {
    setSelectedServices((prevServices) => {
      if (!prevServices.some((existing) => existing.id === service.id)) {
        return [...prevServices, service];
      }
      return prevServices;
    });
  };

  const removeService = (id) => {
    setSelectedServices((prevServices) =>
      prevServices.filter((service) => service.id !== id)
    );
  };

  const addNotification = (message) => {
    const newNotification = {
      id: notificationCounter.toString(),
      text: message,
    };
    setNotificationCounter((prev) => prev + 1);
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <AppContext.Provider
      value={{
        userData, // Expose userData
        userType, // Expose userType
        updateUserType, // Provide userType update function
        updateUserData, // Provide userData update function
        selectedServices,
        addService,
        removeService,
        notifications,
        addNotification,
        removeNotification,
        logout, // Provide logout function
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
