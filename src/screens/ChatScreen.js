import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import api from "../api";
import { AppContext } from "../Components/AppContext";

const ChatScreen = () => {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChats, setActiveChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultAvatar = require("../Images/mzdr1.png");

  const { userData, userType } = useContext(AppContext);

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

  const fetchActiveChats = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await api.get("/chats/active", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          userId: userData._id,
          userType: userType,
        },
      });

      // Group chats by partner ID and keep the most recent one
      const chatsByPartner = response.data.reduce((acc, chat) => {
        const partnerId = chat.chatPartner._id;
        const existingChat = acc[partnerId];

        if (
          !existingChat ||
          new Date(chat.lastMessage?.timestamp) >
            new Date(existingChat.lastMessage?.timestamp)
        ) {
          acc[partnerId] = {
            ...chat,
            uniqueKey: chat.orderId || `direct_${chat.chatPartner._id}`,
          };
        }
        return acc;
      }, {});

      const transformedChats = Object.values(chatsByPartner);
      setActiveChats(transformedChats);
      setFilteredChats(transformedChats);
      setLoading(false);
    } catch (err) {
      console.error("Chat fetch error:", err);
      setError(err.response?.data?.message || "Failed to load chats");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFonts();
    fetchActiveChats();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = activeChats.filter(
        (chat) =>
          chat.chatPartner.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (chat.details?.title
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ??
            false)
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(activeChats);
    }
  }, [searchQuery, activeChats]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString();
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderChatItem = (chat) => (
    <TouchableOpacity
      key={chat.uniqueKey}
      style={styles.userBox}
      onPress={() =>
        navigation.navigate("ChatDetailScreen", {
          jobId: chat.job?._id,
          chatPartner: chat.chatPartner,
          jobTitle: chat.job?.title || "Direct Message",
          orderId: chat.orderId,
        })
      }
    >
      <Image
        source={
          chat.chatPartner?.profileImage
            ? { uri: chat.chatPartner.profileImage }
            : defaultAvatar
        }
        style={styles.userAvatar}
      />
      <View style={styles.chatInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.userName}>
            {chat.chatPartner?.name || "Unnamed User"}
          </Text>
          {chat.lastMessage && (
            <Text style={styles.timestamp}>
              {formatTimestamp(chat.lastMessage.timestamp)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Icon
              name="search"
              size={20}
              color="#000"
              style={styles.searchIcon}
            />
          </View>

          {filteredChats.map(renderChatItem)}

          {filteredChats.length === 0 && (
            <View style={styles.noChatsContainer}>
              <Text style={styles.noChatsText}>No chats found</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderTopColor: "#ccc",
    borderTopWidth: 1.5,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
    fontFamily: "MontserratRegular",
  },
  searchIcon: {
    marginLeft: 10,
  },
  userBox: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: 16,
    color: "#333",
    fontFamily: "MontserratSemiBold",
    flex: 1,
  },
  jobTitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: "MontserratMedium",
    marginTop: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: "#888",
    fontFamily: "MontserratRegular",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    fontFamily: "MontserratRegular",
    marginLeft: 8,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#000",
    borderWidth: 1,
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noChatsText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "MontserratMedium",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontFamily: "MontserratMedium",
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  directMessage: {
    fontSize: 14,
    color: "#666",
    fontFamily: "MontserratRegular",
    marginTop: 2,
    fontStyle: "italic",
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "MontserratMedium",
  },
  orderType: {
    fontSize: 12,
    color: "#666",
    fontFamily: "MontserratRegular",
    marginTop: 2,
  },
});

export default ChatScreen;
