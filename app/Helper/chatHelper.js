import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";

/**
 * Fetch all chats where the user is involved
 * Chat document IDs follow the format: userId1_userId2
 * @param {string} userId - The logged-in user's UID
 * @returns {Promise<Array>} Array of chat documents with metadata
 */
export const fetchUserChats = async (userId) => {
  try {
    if (!userId) {
      console.warn("fetchUserChats: userId is required");
      return [];
    }

    const chatsRef = collection(db, "chats");
    const snapshot = await getDocs(chatsRef);

    // Filter chats where userId is part of the chat ID
    const userChats = [];

    for (const doc of snapshot.docs) {
      const chatId = doc.id;
      // Chat ID format: userId1_userId2
      const [id1, id2] = chatId.split("_");

      // Check if current user is part of this chat
      if (id1 === userId || id2 === userId) {
        // Get the other user's ID
        const otherUserId = id1 === userId ? id2 : id1;

        // Get last message from messages subcollection
        const lastMessage = await getLastChatMessage(chatId);

        userChats.push({
          chatId,
          userId: userId,
          otherUserId,
          lastMessage: lastMessage?.text || "",
          lastMessageTime: lastMessage?.createdAt || null,
          senderId: lastMessage?.senderId || null,
          ...doc.data(),
        });
      }
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
    console.error("Error fetching user chats:", error);
    return [];
  }
};

/**
 * Get the last message from a chat's messages subcollection
 * @param {string} chatId - The chat document ID
 * @returns {Promise<Object|null>} Last message object or null
 */
export const getLastChatMessage = async (chatId) => {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
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
    console.error("Error fetching last message:", error);
    return null;
  }
};

/**
 * Subscribe to real-time updates of user chats
 * @param {string} userId - The logged-in user's UID
 * @param {Function} callback - Function to call when chats update
 * @returns {Function} Unsubscribe function
 */
export const subscribeToUserChats = (userId, callback) => {
  try {
    if (!userId) {
      console.warn("subscribeToUserChats: userId is required");
      return () => {};
    }

    const chatsRef = collection(db, "chats");

    // Subscribe to chats collection
    const unsubscribe = onSnapshot(
      chatsRef,
      async (snapshot) => {
        const userChats = [];

        for (const doc of snapshot.docs) {
          const chatId = doc.id;
          const [id1, id2] = chatId.split("_");

          // Check if current user is part of this chat
          if (id1 === userId || id2 === userId) {
            const otherUserId = id1 === userId ? id2 : id1;
            const lastMessage = await getLastChatMessage(chatId);

            userChats.push({
              chatId,
              userId: userId,
              otherUserId,
              lastMessage: lastMessage?.text || "",
              lastMessageTime: lastMessage?.createdAt || null,
              senderId: lastMessage?.senderId || null,
              ...doc.data(),
            });
          }
        }

        // Sort by last message time
        userChats.sort((a, b) => {
          const timeA = a.lastMessageTime
            ? new Date(a.lastMessageTime).getTime()
            : 0;
          const timeB = b.lastMessageTime
            ? new Date(b.lastMessageTime).getTime()
            : 0;
          return timeB - timeA;
        });

        callback(userChats);
      },
      (error) => {
        console.error("Error subscribing to chats:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error in subscribeToUserChats:", error);
    return () => {};
  }
};

/**
 * Get chat ID from two user IDs (sorted format)
 * @param {string} userId1 - First user ID
 * @param {string} userId2 - Second user ID
 * @returns {string} Formatted chat ID
 */
export const getChatId = (userId1, userId2) => {
  if (!userId1 || !userId2) {
    throw new Error("Both user IDs are required");
  }
  return [userId1, userId2].sort().join("_");
};

/**
 * Format timestamp for display
 * @param {Object} timestamp - Firebase timestamp object
 * @returns {string} Formatted time string
 */
export const formatChatTime = (timestamp) => {
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
    console.error("Error formatting chat time:", error);
    return "";
  }
};
