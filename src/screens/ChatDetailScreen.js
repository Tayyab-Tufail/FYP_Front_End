import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../Components/AppContext";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons for the tick icon


const ChatDetailScreen = ({ route }) => {
  const { jobId, chatPartner, orderId } = route.params; // chatPartner is always passed
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const { userData, userType } = useContext(AppContext);
  const flatListRef = useRef(null); // Ref for FlatList

  const fetchChatHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await api.get("/chats/history", {
        headers: { Authorization: `Bearer ${token}` },
        params: { recipientId: chatPartner._id }, // Pass recipientId as a parameter
      });

      if (response.data && response.data.messages) {
        setMessages(response.data.messages); // Update state with messages
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    try {
      const token = await AsyncStorage.getItem("authToken");
      const messageData = {
        recipientId: chatPartner._id,
        content: inputText.trim(),
        userType,
        jobId: jobId || null,
        orderId: orderId || null,
      };

      const response = await api.post("/chats/send", messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userData._id,
        },
      });

      if (response.data && response.data.data) {
        setMessages((prev) => [...prev, response.data.data]);
        setInputText(""); // Clear input

        // Scroll to bottom
        setTimeout(
          () => flatListRef.current?.scrollToEnd({ animated: true }),
          100
        );
      }
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
    }
  };
  const isMessageRead = (message) => {
    return message.read && isMyMessage(message.sender.id);
  };
  const isMyMessage = (senderId) => senderId === userData._id;

  useEffect(() => {
    fetchChatHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  isMyMessage(item.sender.id)
                    ? styles.myMessage
                    : styles.userMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isMyMessage(item.sender.id)
                      ? styles.myMessageText
                      : styles.userMessageText,
                  ]}
                >
                  {item.content}
                </Text>
                {isMessageRead(item) && (
                  <Ionicons
                    name="checkmark-done"
                    size={16}
                    color="#4CAF50"
                    style={styles.readTick}
                  />
                )}
              </View>
            )}
            keyExtractor={(item, index) => item._id || index.toString()}
            style={styles.messageList}
            contentContainerStyle={{ paddingBottom: 10 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              value={inputText}
              onChangeText={setInputText}
              onFocus={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Subtle background color
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  messageList: {
    flex: 1,
    paddingTop: 10,
  },
  messageContainer: {
    padding: 15,
    borderRadius: 20,
    marginVertical: 6,
    maxWidth: "75%",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  userMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e6e6e6",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: "#fff",
  },
  userMessageText: {
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#dcdcdc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 50,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  readTick: {
    marginTop: 5,
    alignSelf: "flex-end",
  },
});

export default ChatDetailScreen;
