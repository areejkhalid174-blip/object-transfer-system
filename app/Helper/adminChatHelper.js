import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

/**
 * Get or create an admin chat for a user
 * @param {string} userId - The user's UID
 * @returns {Promise<string>} The chat document ID (userId)
 */
export const getOrCreateAdminChat = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    // Use userId as the chat ID
    const chatId = userId;

    const chatDocRef = doc(db, "adminChats", chatId);
    const chatDocSnap = await getDoc(chatDocRef);

    if (chatDocSnap.exists()) {
      return chatId;
    }

    // Create new chat document
    await setDoc(chatDocRef, {
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return chatId;
  } catch (error) {
    console.error("Error getting or creating admin chat:", error);
    throw error;
  }
};

/**
 * Get the last message from an admin chat's messages subcollection
 * @param {string} chatId - The chat document ID
 * @returns {Promise<Object|null>} Last message object or null
 */
export const getLastAdminChatMessage = async (chatId) => {
  try {
    const messagesRef = collection(db, "adminChats", chatId, "messages");
    const messagesQuery = query(
      messagesRef,
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(messagesQuery);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching last admin chat message:", error);
    return null;
  }
};

/**
 * Fetch all admin chats for a user
 * @param {string} userId - The user's UID
 * @returns {Promise<Array>} Array of chat documents with metadata
 */
export const fetchUserAdminChats = async (userId) => {
  try {
    if (!userId) {
      console.warn("fetchUserAdminChats: userId is required");
      return [];
    }

    const adminChatsRef = collection(db, "adminChats");
    const q = query(adminChatsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const userChats = [];

    for (const doc of snapshot.docs) {
      const chatData = doc.data();
      const chatId = doc.id;

      // Get last message from messages subcollection
      const lastMessage = await getLastAdminChatMessage(chatId);

      userChats.push({
        chatId,
        userId: chatData.userId,
        lastMessage: lastMessage?.text || "",
        lastMessageTime: lastMessage?.createdAt || chatData.createdAt || null,
        senderId: lastMessage?.senderId || null,
        ...chatData,
      });
    }

    // Sort by last message time (newest first)
    userChats.sort((a, b) => {
      const timeA = a.lastMessageTime
        ? new Date(a.lastMessageTime).getTime()
        : 0;
      const timeB = b.lastMessageTime
        ? new Date(b.lastMessageTime).getTime()
        : 0;
      return timeB - timeA;
    });

    return userChats;
  } catch (error) {
    console.error("Error fetching user admin chats:", error);
    return [];
  }
};

/**
 * Subscribe to real-time updates of admin chat messages
 * @param {string} chatId - The chat document ID
 * @param {Function} callback - Function to call when messages update
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAdminChatMessages = (chatId, callback) => {
  try {
    if (!chatId) {
      console.warn("subscribeToAdminChatMessages: chatId is required");
      return () => {};
    }

    const messagesRef = collection(db, "adminChats", chatId, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        callback(messages);
      },
      (error) => {
        console.error("Error subscribing to admin chat messages:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error in subscribeToAdminChatMessages:", error);
    return () => {};
  }
};

/**
 * Format timestamp for display
 * @param {Object} timestamp - Firebase timestamp object
 * @returns {string} Formatted time string
 */
export const formatAdminChatTime = (timestamp) => {
  if (!timestamp) return "";

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting admin chat time:", error);
    return "";
  }
};

