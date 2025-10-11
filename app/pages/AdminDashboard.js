import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector, useDispatch } from "react-redux";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { setRole, setUser } from "../redux/Slices/HomeDataSlice";
import AdminUsersManagement from "./AdminUsersManagement";
import AdminRidersManagement from "./AdminRidersManagement";
import AdminTripsManagement from "./AdminTripsManagement";

const Tab = createBottomTabNavigator();

// Dashboard Overview Screen
const DashboardOverview = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRiders: 0,
    pendingRiders: 0,
    totalTrips: 0,
    activeTrips: 0,
    completedTrips: 0,
    totalEarnings: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      // Fetch customers
      const customersSnapshot = await getDocs(
        query(collection(db, "users"), where("role", "==", "Customer"))
      );
      
      // Fetch riders
      const ridersSnapshot = await getDocs(
        query(collection(db, "users"), where("role", "==", "Rider"))
      );
      
      // Fetch pending riders
      const pendingRidersSnapshot = await getDocs(
        query(collection(db, "users"), where("role", "==", "Rider"), where("status", "==", "pending"))
      );
      
      // Fetch trips
      const tripsSnapshot = await getDocs(collection(db, "trips"));
      const trips = tripsSnapshot.docs.map(doc => doc.data());
      
      const activeTrips = trips.filter(t => t.status === "active" || t.status === "in_progress").length;
      const completedTrips = trips.filter(t => t.status === "completed").length;
      
      // Calculate total earnings
      const totalEarnings = trips
        .filter(t => t.status === "completed")
        .reduce((sum, trip) => sum + (parseFloat(trip.fare) || 0), 0);

      setStats({
        totalCustomers: customersSnapshot.size,
        totalRiders: ridersSnapshot.size,
        pendingRiders: pendingRidersSnapshot.size,
        totalTrips: tripsSnapshot.size,
        activeTrips,
        completedTrips,
        totalEarnings,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const StatCard = ({ icon, title, value, color, onPress }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={32} color={color} />
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>System Overview</Text>
        </View>
        <Ionicons name="shield-checkmark" size={40} color="#2c5aa0" />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="people"
          title="Total Customers"
          value={stats.totalCustomers}
          color="#4CAF50"
          onPress={() => navigation.navigate("Users")}
        />
        <StatCard
          icon="bicycle"
          title="Total Riders"
          value={stats.totalRiders}
          color="#2196F3"
          onPress={() => navigation.navigate("Riders")}
        />
        <StatCard
          icon="time"
          title="Pending Approvals"
          value={stats.pendingRiders}
          color="#FF9800"
          onPress={() => navigation.navigate("Riders")}
        />
        <StatCard
          icon="car"
          title="Total Trips"
          value={stats.totalTrips}
          color="#9C27B0"
          onPress={() => navigation.navigate("Trips")}
        />
        <StatCard
          icon="play-circle"
          title="Active Trips"
          value={stats.activeTrips}
          color="#00BCD4"
        />
        <StatCard
          icon="checkmark-circle"
          title="Completed Trips"
          value={stats.completedTrips}
          color="#4CAF50"
        />
      </View>

      <View style={styles.earningsCard}>
        <Ionicons name="wallet" size={40} color="#FFB800" />
        <View style={styles.earningsInfo}>
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.earningsValue}>Rs {stats.totalEarnings.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Riders")}
        >
          <Ionicons name="person-add" size={24} color="#2c5aa0" />
          <Text style={styles.actionButtonText}>Approve Riders</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Users")}
        >
          <Ionicons name="people" size={24} color="#2c5aa0" />
          <Text style={styles.actionButtonText}>Manage Users</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Trips")}
        >
          <Ionicons name="list" size={24} color="#2c5aa0" />
          <Text style={styles.actionButtonText}>View All Trips</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Admin Settings Screen
const AdminSettings = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.home?.user);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await auth.signOut();
              dispatch(setRole(""));
              dispatch(setUser({}));
              navigation.reset({
                index: 0,
                routes: [{ name: "CustomerLogin" }],
              });
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.settingsContent}>
        <Text style={styles.pageTitle}>Admin Settings</Text>

        {/* Admin Info */}
        <View style={styles.adminInfoCard}>
          <View style={styles.adminAvatar}>
            <Ionicons name="shield-checkmark" size={40} color="#2c5aa0" />
          </View>
          <View style={styles.adminInfo}>
            <Text style={styles.adminName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.adminEmail}>{user?.email}</Text>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Administrator</Text>
            </View>
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>System Settings</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert("System Settings", "Coming soon")}
          >
            <Ionicons name="settings-outline" size={22} color="#000" />
            <Text style={styles.settingText}>System Configuration</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert("Notifications", "Coming soon")}
          >
            <Ionicons name="notifications-outline" size={22} color="#000" />
            <Text style={styles.settingText}>Notification Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert("Backup", "Coming soon")}
          >
            <Ionicons name="cloud-download-outline" size={22} color="#000" />
            <Text style={styles.settingText}>Backup & Restore</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert("Help", "Contact: admin@example.com")}
          >
            <Ionicons name="help-circle-outline" size={22} color="#000" />
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => Alert.alert("About", "Admin Portal v1.0.0")}
          >
            <Ionicons name="information-circle-outline" size={22} color="#000" />
            <Text style={styles.settingText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Admin Portal v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

// Main Admin Dashboard with Tabs
export default function AdminDashboard() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Overview") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Users") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Riders") {
            iconName = focused ? "bicycle" : "bicycle-outline";
          } else if (route.name === "Trips") {
            iconName = focused ? "car" : "car-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2c5aa0",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Overview" component={DashboardOverview} />
      <Tab.Screen name="Users" component={AdminUsersManagement} />
      <Tab.Screen name="Riders" component={AdminRidersManagement} />
      <Tab.Screen name="Trips" component={AdminTripsManagement} />
      <Tab.Screen name="Settings" component={AdminSettings} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statsGrid: {
    padding: 15,
  },
  statCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statInfo: {
    marginLeft: 15,
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  earningsCard: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    padding: 20,
    margin: 15,
    marginTop: 0,
    borderWidth: 2,
    borderColor: "#FFB800",
  },
  earningsInfo: {
    marginLeft: 15,
  },
  earningsLabel: {
    fontSize: 14,
    color: "#666",
  },
  earningsValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFB800",
    marginTop: 4,
  },
  quickActions: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 15,
  },
  // Settings Screen Styles
  settingsContent: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 20,
    marginTop: 20,
  },
  adminInfoCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adminAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  adminInfo: {
    marginLeft: 15,
    flex: 1,
    justifyContent: "center",
  },
  adminName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  adminEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  adminBadge: {
    backgroundColor: "#2c5aa0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  settingsSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 20,
    marginBottom: 30,
  },
});
