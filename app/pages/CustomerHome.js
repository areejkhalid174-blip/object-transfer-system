
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Switch } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { getAllData } from "../Helper/firebaseHelper";
import Colors from "../constants/colors";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

// Dashboard Screen
const DashboardScreen = ({navigation}) => {
  const [selected, setSelected] = useState(null); // state for selected option
  const [data, setData] = useState([]); // state for data
  const user = useSelector((state) => state.home?.user); // Get logged-in user
  
  // const options = [
  //   { id: 1, title: "Food Delivery", icon: "fast-food-outline" },
  //   { id: 2, title: "Parcel", icon: "cube-outline" },
  //   { id: 3, title: "Groceries", icon: "cart-outline" },
  //   { id: 4, title: "Others", icon: "ellipsis-horizontal-circle-outline" },
  // ];

  const getCatData = async () => {
    const cDAta = await getAllData("categories");
    setData(cDAta);
  };

  useEffect(() => {
    getCatData();
  }, []);

  const logOut = () =>{
    
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#FFFFFF" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.greeting}>Hi</Text>
      <Text style={styles.name}>{user?.firstName || user?.displayName || "Guest"}</Text>
      <Text style={styles.subtitle}>What are you sending today?</Text>

      <View style={styles.grid}>
        {data && data.length > 0 ? data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              selected === item.id && styles.selectedCard, // highlight if selected
            ]}
            onPress={() => navigation.navigate("Order",{id:item.id})} // update state
          >
            <Icon
              name={item.icon}
              size={40}
              color={selected === item.id ? "#4a7ba7" : "#2c5aa0"} // change icon color
            />
            <Text
              style={[
                styles.cardText,
                selected === item.id && { color: "#4a7ba7" },
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )) : (
          <Text style={{textAlign: 'center', marginTop: 20, color: '#666'}}>
            Loading categories...
          </Text>
        )}
      </View>

      {/* Book a Trip Button */}
      <TouchableOpacity 
        style={styles.bookTripButton}
        onPress={() => navigation.navigate("CustomerBookTrip")}
      >
        <Icon name="car-outline" size={24} color="#000000" />
        <Text style={styles.bookTripText}>Book a Trip</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={logOut}>
        <Text style={{ textAlign: "center", color: "#1c1b1fff", marginTop: 20 }}>
          log OUT
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

// My Orders Screen
const MyOrdersScreen = ({ navigation }) => {
  const orders = [
    {
      orderId: "ORD12345",
      orderDate: "10/10/2024",
      orderTime: "10:30 AM",
      pickupLocation: "123 Main Street, Gulshan-e-Iqbal, Karachi",
      dropLocation: "456 Park Avenue, Clifton, Karachi",
      packageType: "Documents",
      fare: "Rs. 250",
      status: "Delivered",
    },
    {
      orderId: "ORD12346",
      orderDate: "09/10/2024",
      orderTime: "2:45 PM",
      pickupLocation: "789 Garden Road, Saddar, Karachi",
      dropLocation: "321 Beach View, DHA Phase 5, Karachi",
      packageType: "Electronics",
      fare: "Rs. 450",
      status: "Delivered",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>My Orders</Text>
        
        {orders.map((order) => (
          <View key={order.orderId} style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripIdText}>{order.orderId}</Text>
              <View style={[styles.tripStatusBadge, styles.statusCompletedBadge]}>
                <Text style={styles.tripStatusText}>{order.status}</Text>
              </View>
            </View>

            <View style={styles.tripInfoSection}>
              <View style={styles.tripDateRow}>
                <Ionicons name="calendar-outline" size={14} color="#666" />
                <Text style={styles.tripDateText}>
                  {order.orderDate} • {order.orderTime}
                </Text>
              </View>
            </View>

            <View style={styles.tripLocationSection}>
              <View style={styles.tripLocationRow}>
                <Ionicons name="location" size={16} color="#4CAF50" />
                <Text style={styles.tripLocationText} numberOfLines={1}>
                  {order.pickupLocation}
                </Text>
              </View>
              <View style={styles.tripLocationRow}>
                <Ionicons name="flag" size={16} color="#FF3B30" />
                <Text style={styles.tripLocationText} numberOfLines={1}>
                  {order.dropLocation}
                </Text>
              </View>
            </View>

            <View style={styles.tripFooter}>
              <View style={styles.tripPackageInfo}>
                <Ionicons name="cube-outline" size={14} color="#666" />
                <Text style={styles.tripPackageText}>{order.packageType}</Text>
              </View>
              <Text style={styles.tripFareText}>{order.fare}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Chat Screen
const ChatScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Chat</Text>
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={50} color="#888" />
          <Text style={styles.emptyText}>No messages</Text>
          <Text style={styles.emptySubtext}>
            Your conversations will appear here
          </Text>
        </View>
      </View>
    </View>
  );
};

// Profile Screen
const ProfileScreen = ({ navigation }) => {
  const customerData = {
    name: "Ahmed Khan",
    email: "ahmed.customer@example.com",
    phone: "+92 300 1234567",
    totalTrips: 45,
    memberSince: "January 2024",
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={40} color="#000" />
          </View>
          <Text style={styles.profileName}>{customerData.name}</Text>
          <Text style={styles.profileEmail}>{customerData.email}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{customerData.name}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{customerData.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{customerData.phone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{customerData.memberSince}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => alert("Edit Profile functionality coming soon!")}
        >
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Settings Screen
const SettingsScreen = ({ navigation }) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Account Settings</Text>

          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => alert("Change Password functionality coming soon!")}
          >
            <Ionicons name="key-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Notification Settings</Text>

          <View style={styles.toggleItem}>
            <View style={styles.toggleLeft}>
              <Ionicons name="notifications-outline" size={22} color="#000" />
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Push Notifications</Text>
                <Text style={styles.toggleSubtitle}>Receive push notifications</Text>
              </View>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
              thumbColor={pushNotifications ? "#fff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleLeft}>
              <Ionicons name="mail-outline" size={22} color="#000" />
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Email Notifications</Text>
                <Text style={styles.toggleSubtitle}>Get updates via email</Text>
              </View>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
              thumbColor={emailNotifications ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

// Main CustomerHome Component with Bottom Tabs
export default function CustomerHome() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "MyOrders") {
            iconName = focused ? "receipt" : "receipt-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#888888",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="MyOrders" component={MyOrdersScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 8,
    fontWeight: "500",
  },
  greeting: { fontSize: 20, color: Colors.textSecondary },
  name: { fontSize: 26, fontWeight: "700", marginBottom: 10, color: Colors.textSecondary },
  subtitle: { fontSize: 16, fontWeight: "500", marginBottom: 20, color: Colors.textSecondary },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    backgroundColor: Colors.cardBackground,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: Colors.cardSelected,
    borderColor: Colors.primaryDark,
    borderWidth: 3,
  },
  cardText: { fontSize: 16, fontWeight: "600", marginTop: 8, color: Colors.primaryDark },
  bookTripButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.buttonPrimary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  bookTripText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.buttonText,
    marginLeft: 10,
  },
  // New Styles
  content: {
    padding: 0,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 20,
  },
  tripCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tripIdText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  tripStatusBadge: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompletedBadge: {
    backgroundColor: "#4CAF50",
  },
  tripStatusText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  tripInfoSection: {
    marginBottom: 10,
  },
  tripDateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripDateText: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 6,
  },
  tripLocationSection: {
    marginBottom: 12,
  },
  tripLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  tripLocationText: {
    fontSize: 13,
    color: "#000000",
    marginLeft: 8,
    flex: 1,
  },
  tripFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  tripPackageInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripPackageText: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 6,
  },
  tripFareText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#888888",
    marginTop: 10,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888888",
    marginTop: 5,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666666",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#888888",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: "#000000",
    fontWeight: "600",
  },
  editProfileButton: {
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  editProfileButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  optionItem: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    marginLeft: 15,
    fontWeight: "500",
  },
  toggleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    color: "#000000",
    fontWeight: "600",
    marginBottom: 3,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: "#888888",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
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
    color: "#888888",
    marginBottom: 30,
  },
})
