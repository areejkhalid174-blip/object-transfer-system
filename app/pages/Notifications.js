import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { getAllData, updateData } from "../Helper/firebaseHelper";
import Colors from "../constants/colors";

export default function Notifications({ navigation }) {
  const insets = useSafeAreaInsets();
  const user = useSelector((state) => state.home?.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Mark all notifications as read when screen is focused
    const unsubscribe = navigation.addListener('focus', async () => {
      await fetchNotifications();
      // Mark as read after a short delay to ensure notifications are loaded
      setTimeout(() => {
        markAllAsRead();
      }, 300);
    });
    return unsubscribe;
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Fetch notifications from Firebase
      const allNotifications = await getAllData("notifications");
      
      // Filter notifications for current user
      const userNotifications = allNotifications
        .filter(
          (notif) =>
            notif.userId === user?.uid || notif.userEmail === user?.email
        )
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA; // Most recent first
        });

      setNotifications(userNotifications);
      return userNotifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Get current notifications from state
      const currentNotifications = notifications.length > 0 ? notifications : await fetchNotifications();
      
      // Mark all unread notifications as read
      const unreadNotifications = currentNotifications.filter(notif => !notif.read);
      
      if (unreadNotifications.length === 0) return;
      
      for (const notif of unreadNotifications) {
        if (notif.id) {
          await updateData("notifications", notif.id, { read: true, readAt: new Date().toISOString() });
        }
      }
      
      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    try {
      const date = new Date(dateString);
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
      return "Just now";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return "cube-outline";
      case "rider":
        return "person-outline";
      case "delivery":
        return "checkmark-circle-outline";
      case "payment":
        return "card-outline";
      default:
        return "notifications-outline";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "order":
        return "#4A90E2";
      case "rider":
        return "#50C878";
      case "delivery":
        return "#FF6B6B";
      case "payment":
        return "#FFA500";
      default:
        return "#888888";
    }
  };

  const handleNotificationPress = (notification) => {
    // Mark as read and navigate based on type
    // Navigate back to home screen - user can then navigate to specific tabs
    navigation.goBack();
    // Optionally, you can navigate to specific screens based on notification type
    // if (notification.type === "order" || notification.type === "rider" || notification.type === "delivery") {
    //   // Navigate to home and then to orders tab
    //   navigation.navigate("CustomerHome");
    // }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getNotificationColor(item.type) + "20" },
          ]}
        >
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={24}
            color={getNotificationColor(item.type)}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          onPress={fetchNotifications}
          style={styles.refreshButton}
        >
          <Ionicons name="refresh" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      {loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>No notifications</Text>
          <Text style={styles.emptySubtext}>
            You're all caught up! New notifications will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchNotifications}
              colors={["#4A90E2"]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight || "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  refreshButton: {
    padding: 5,
  },
  listContent: {
    padding: 15,
  },
  notificationItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 6,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999999",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4A90E2",
    marginLeft: 8,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666666",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    lineHeight: 20,
  },
});

