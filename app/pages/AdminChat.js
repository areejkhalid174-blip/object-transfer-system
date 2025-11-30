import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  getOrCreateAdminChat,
  subscribeToAdminChatMessages,
} from "../Helper/adminChatHelper";

const AdminChat = ({ route }) => {
  const { currentUserId, adminName = "Support" } =
    route.params || {};

  const [conversationId, setConversationId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  // Load or create admin chat
  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    getOrCreateAdminChat(currentUserId)
      .then((chatId) => {
        setConversationId(chatId);
      })
      .catch((error) => {
        console.error("Error creating/fetching admin chat:", error);
        setLoading(false);
      });
  }, [currentUserId]);

  // Listen for messages
  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAdminChatMessages(conversationId, (fetchedMessages) => {
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Send message
  const handleSend = async () => {
    const trimmed = messageText.trim();
    if (!trimmed || !conversationId) return;

    setMessageText("");

    try {
      await addDoc(
        collection(db, "adminChats", conversationId, "messages"),
        {
          text: trimmed,
          senderId: currentUserId,
          createdAt: serverTimestamp(),
        }
      );
      
      // Update the chat document's updatedAt timestamp
      const chatDocRef = doc(db, "adminChats", conversationId);
      await updateDoc(chatDocRef, {
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUserId;
    return (
      <View
        style={[
          styles.messageRow,
          isCurrentUser ? styles.messageRowRight : styles.messageRowLeft,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              !isCurrentUser && styles.otherMessageText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTimestamp,
              !isCurrentUser && styles.otherMessageTimestamp,
            ]}
          >
            {formatTimestamp(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="small" color="#538cc6" />
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons name="chatbubbles-outline" size={48} color="#bbb" />
        <Text style={styles.emptyStateText}>Start the conversation</Text>
        <Text style={styles.emptyStateSubtext}>
          Your messages will be received by our support team
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{adminName}</Text>
        <Text style={styles.headerSubtitle}>Support Chat</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={[
          styles.messageList,
          messages.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={renderEmptyState}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !messageText.trim() && { opacity: 0.5 }]}
          onPress={handleSend}
          disabled={!messageText.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f3f8" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#538cc6",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 3,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  headerSubtitle: { marginTop: 4, fontSize: 14, color: "rgba(255,255,255,0.85)" },
  messageList: { paddingHorizontal: 16, paddingVertical: 10 },
  messageRow: { flexDirection: "row", marginBottom: 8 },
  messageRowLeft: { justifyContent: "flex-start" },
  messageRowRight: { justifyContent: "flex-end" },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    elevation: 1,
  },
  currentUserBubble: { backgroundColor: "#2c5aa0", borderBottomRightRadius: 4 },
  otherUserBubble: { backgroundColor: "#fff", borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, color: "#fff" },
  otherMessageText: { color: "#1c1b1f" },
  messageTimestamp: {
    marginTop: 6,
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  otherMessageTimestamp: { color: "#6c757d" },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyStateText: { marginTop: 12, fontSize: 16, color: "#888" },
  emptyStateSubtext: { marginTop: 4, fontSize: 14, color: "#aaa" },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e6ed",
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f2f4f8",
    fontSize: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#2c5aa0",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AdminChat;

