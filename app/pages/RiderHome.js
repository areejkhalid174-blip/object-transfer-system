import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../Helper/firebaseHelper";
import { setRole, setUser } from "../redux/Slices/HomeDataSlice";

const Tab = createBottomTabNavigator();

// Dashboard Screen
const DashboardScreen = ({ navigation }) => {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Rider Dashboard</Text>
          <Ionicons name="notifications-outline" size={24} color="#000000" />
        </View>

        {/* Online/Offline Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleContent}>
            <Text style={styles.toggleLabel}>
              {isOnline ? "You are Online" : "You are Offline"}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
              thumbColor={isOnline ? "#fff" : "#f4f3f4"}
            />
          </View>
          <Text style={styles.toggleSubtext}>
            {isOnline
              ? "You can receive trip requests"
              : "Turn on to start receiving trips"}
          </Text>
        </View>

        {/* Earnings Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Earnings</Text>
          <Text style={styles.earningsAmount}>Rs. 0</Text>
          <View style={styles.earningsRow}>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>This Week</Text>
              <Text style={styles.earningValue}>Rs. 0</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>This Month</Text>
              <Text style={styles.earningValue}>Rs. 0</Text>
            </View>
          </View>
        </View>

        {/* Active Trips */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Trips</Text>
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={40} color="#888" />
            <Text style={styles.emptyText}>No active trips</Text>
          </View>
        </View>

        {/* Completed Trips */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Completed Trips</Text>
            <TouchableOpacity onPress={() => navigation.navigate("MyTrips")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// My Trips Screen
const MyTripsScreen = ({ navigation }) => {
  // Sample trips data - this would come from Firebase in real app
  const trips = [
    {
      tripId: "TRP12345",
      tripDate: "10/10/2024",
      tripTime: "10:30 AM",
      pickupLocation: "123 Main Street, Gulshan-e-Iqbal, Karachi",
      dropLocation: "456 Park Avenue, Clifton, Karachi",
      distance: "5.2 km",
      estimatedTime: "15 mins",
      vehicleType: "Bike",
      packageDetails: {
        type: "Documents",
        weight: "Light (< 1kg)",
        size: "Small (A4 envelope)",
        quantity: "1 package",
        description: "Important office documents - Legal papers",
        specialInstructions: "Handle with care, keep dry, urgent delivery",
        fragile: true,
      },
      customer: {
        name: "Ahmed Khan",
        phone: "+92 300 1234567",
        email: "ahmed.khan@example.com",
        rating: 4.5,
        totalTrips: 45,
        address: "House #123, Street 5, Gulshan-e-Iqbal",
      },
      receiver: {
        name: "Sara Ahmed",
        phone: "+92 321 9876543",
        address: "Office #456, Park Avenue Plaza, Clifton",
      },
      fare: "Rs. 250",
      baseFare: "Rs. 150",
      distanceFare: "Rs. 80",
      serviceFee: "Rs. 20",
      paymentMethod: "Cash",
      bookingTime: "10/10/2024, 10:15 AM",
      priority: "Normal",
      status: "Completed",
    },
    {
      tripId: "TRP12346",
      tripDate: "09/10/2024",
      tripTime: "2:45 PM",
      pickupLocation: "789 Garden Road, Saddar, Karachi",
      dropLocation: "321 Beach View, DHA Phase 5, Karachi",
      distance: "8.5 km",
      estimatedTime: "25 mins",
      vehicleType: "Car",
      packageDetails: {
        type: "Electronics",
        weight: "Medium (2-5kg)",
        size: "Medium (Box)",
        quantity: "1 package",
        description: "Laptop and accessories",
        specialInstructions: "Fragile - Handle with extreme care",
        fragile: true,
      },
      customer: {
        name: "Fatima Ali",
        phone: "+92 321 7654321",
        email: "fatima.ali@example.com",
        rating: 4.8,
        totalTrips: 32,
        address: "Apartment 5B, Garden Road, Saddar",
      },
      receiver: {
        name: "Hassan Raza",
        phone: "+92 300 9876543",
        address: "Villa #321, Beach View, DHA Phase 5",
      },
      fare: "Rs. 450",
      baseFare: "Rs. 200",
      distanceFare: "Rs. 200",
      serviceFee: "Rs. 50",
      paymentMethod: "Card",
      bookingTime: "09/10/2024, 2:30 PM",
      priority: "Urgent",
      status: "Completed",
    },
    {
      tripId: "TRP12347",
      tripDate: "08/10/2024",
      tripTime: "11:00 AM",
      pickupLocation: "555 University Road, Karachi",
      dropLocation: "777 Mall Road, Gulshan, Karachi",
      distance: "3.8 km",
      estimatedTime: "12 mins",
      vehicleType: "Bike",
      packageDetails: {
        type: "Food",
        weight: "Light (< 1kg)",
        size: "Small",
        quantity: "2 packages",
        description: "Restaurant food delivery",
        specialInstructions: "Keep upright, deliver hot",
        fragile: false,
      },
      customer: {
        name: "Ali Hassan",
        phone: "+92 333 1234567",
        email: "ali.hassan@example.com",
        rating: 4.2,
        totalTrips: 18,
        address: "Street 12, University Road",
      },
      receiver: {
        name: "Zainab Khan",
        phone: "+92 345 9876543",
        address: "Office Tower, Mall Road, Gulshan",
      },
      fare: "Rs. 180",
      baseFare: "Rs. 100",
      distanceFare: "Rs. 60",
      serviceFee: "Rs. 20",
      paymentMethod: "Cash",
      bookingTime: "08/10/2024, 10:45 AM",
      priority: "Express",
      status: "Completed",
    },
  ];

  const handleTripPress = (trip) => {
    navigation.navigate("TripDetails", { tripData: trip });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>My Trips</Text>
        
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="list-outline" size={50} color="#888" />
            <Text style={styles.emptyText}>No trips yet</Text>
            <Text style={styles.emptySubtext}>
              Your trip history will appear here
            </Text>
          </View>
        ) : (
          trips.map((trip) => (
            <TouchableOpacity
              key={trip.tripId}
              style={styles.tripCard}
              onPress={() => handleTripPress(trip)}
            >
              {/* Trip Header */}
              <View style={styles.tripHeader}>
                <Text style={styles.tripIdText}>{trip.tripId}</Text>
                <View
                  style={[
                    styles.tripStatusBadge,
                    trip.status === "Completed" && styles.statusCompletedBadge,
                  ]}
                >
                  <Text style={styles.tripStatusText}>{trip.status}</Text>
                </View>
              </View>

              {/* Trip Info */}
              <View style={styles.tripInfoSection}>
                <View style={styles.tripDateRow}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text style={styles.tripDateText}>
                    {trip.tripDate} • {trip.tripTime}
                  </Text>
                </View>
              </View>

              {/* Locations */}
              <View style={styles.tripLocationSection}>
                <View style={styles.tripLocationRow}>
                  <Ionicons name="location" size={16} color="#4CAF50" />
                  <Text style={styles.tripLocationText} numberOfLines={1}>
                    {trip.pickupLocation}
                  </Text>
                </View>
                <View style={styles.tripLocationRow}>
                  <Ionicons name="flag" size={16} color="#FF3B30" />
                  <Text style={styles.tripLocationText} numberOfLines={1}>
                    {trip.dropLocation}
                  </Text>
                </View>
              </View>

              {/* Package & Payment */}
              <View style={styles.tripFooter}>
                <View style={styles.tripPackageInfo}>
                  <Ionicons name="cube-outline" size={14} color="#666" />
                  <Text style={styles.tripPackageText}>
                    {trip.packageDetails.type}
                  </Text>
                </View>
                <Text style={styles.tripFareText}>{trip.fare}</Text>
              </View>

              {/* View Details Arrow */}
              <View style={styles.viewDetailsRow}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons name="chevron-forward" size={18} color="#000" />
              </View>
            </TouchableOpacity>
          ))
        )}
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
  // Sample rider data - this would come from Firebase/Redux in real app
  const riderData = {
    name: "Muhammad Ahmed",
    email: "ahmed.rider@example.com",
    phone: "+92 300 1234567",
    cnic: "42101-1234567-8",
    rating: 4.7,
    totalTrips: 156,
    totalEarnings: "Rs. 45,000",
    vehicleInfo: {
      type: "Bike",
      model: "Honda CD 70",
      registrationNumber: "KHI-1234",
      color: "Black",
    },
    status: "Active",
    joinDate: "January 2024",
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Profile Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={40} color="#000" />
          </View>
          <Text style={styles.profileName}>{riderData.name}</Text>
          <Text style={styles.profileEmail}>{riderData.email}</Text>
          
          {/* Rating */}
          <View style={styles.profileRatingRow}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.profileRatingText}>
              {riderData.rating} ({riderData.totalTrips} trips)
            </Text>
          </View>

          {/* Status Badge */}
          <View style={styles.statusBadgeProfile}>
            <Text style={styles.statusBadgeText}>{riderData.status}</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{riderData.name}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{riderData.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{riderData.phone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>CNIC</Text>
              <Text style={styles.infoValue}>{riderData.cnic}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{riderData.joinDate}</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Vehicle Information</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="bicycle-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Vehicle Type</Text>
              <Text style={styles.infoValue}>{riderData.vehicleInfo.type}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="car-sport-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Model</Text>
              <Text style={styles.infoValue}>{riderData.vehicleInfo.model}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Registration Number</Text>
              <Text style={styles.infoValue}>{riderData.vehicleInfo.registrationNumber}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="color-palette-outline" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Color</Text>
              <Text style={styles.infoValue}>{riderData.vehicleInfo.color}</Text>
            </View>
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Performance</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.statValue}>{riderData.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="car-outline" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{riderData.totalTrips}</Text>
              <Text style={styles.statLabel}>Total Trips</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="wallet-outline" size={24} color="#2196F3" />
              <Text style={styles.statValue}>{riderData.totalEarnings}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => alert("Edit Profile functionality coming soon!")}
        >
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Quick Actions</Text>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="document-text-outline" size={22} color="#000" />
            <Text style={styles.optionText}>View Documents</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="wallet-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Earnings History</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="help-circle-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Settings Screen
const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [tripAlerts, setTripAlerts] = useState(true);

  const handleChangePassword = () => {
    alert("Change Password functionality coming soon!");
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Logout from Firebase
              await logout();
              // Clear Redux state
              dispatch(setRole(""));
              dispatch(setUser({}));
            } catch (error) {
              console.error("Logout error:", error);
              // Still clear the state even if Firebase logout fails
              dispatch(setRole(""));
              dispatch(setUser({}));
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>

        {/* Account Settings */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Account Settings</Text>

          <TouchableOpacity 
            style={styles.optionItem}
            onPress={handleChangePassword}
          >
            <Ionicons name="key-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="lock-closed-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Privacy Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Security</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Notification Settings */}
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

          <View style={styles.toggleItem}>
            <View style={styles.toggleLeft}>
              <Ionicons name="chatbox-outline" size={22} color="#000" />
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>SMS Notifications</Text>
                <Text style={styles.toggleSubtitle}>Receive SMS alerts</Text>
              </View>
            </View>
            <Switch
              value={smsNotifications}
              onValueChange={setSmsNotifications}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
              thumbColor={smsNotifications ? "#fff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleLeft}>
              <Ionicons name="car-outline" size={22} color="#000" />
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Trip Alerts</Text>
                <Text style={styles.toggleSubtitle}>New trip notifications</Text>
              </View>
            </View>
            <Switch
              value={tripAlerts}
              onValueChange={setTripAlerts}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
              thumbColor={tripAlerts ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>App Settings</Text>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="language-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Language</Text>
            <View style={styles.optionRight}>
              <Text style={styles.optionRightText}>English</Text>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="moon-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Dark Mode</Text>
            <View style={styles.optionRight}>
              <Text style={styles.optionRightText}>Off</Text>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Support</Text>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="help-circle-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="document-text-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="shield-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="information-circle-outline" size={22} color="#000" />
            <Text style={styles.optionText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

// Main Home Component with Bottom Tabs
const RiderHome = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "MyTrips") {
            iconName = focused ? "list" : "list-outline";
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
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="MyTrips" component={MyTripsScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538cc6",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 20,
  },
  toggleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  toggleContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  toggleLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  toggleSubtext: {
    fontSize: 14,
    color: "#666666",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 15,
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 20,
  },
  earningsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  earningItem: {
    alignItems: "center",
  },
  earningLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 5,
  },
  earningValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#666666",
  },
  viewAllText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
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
  logoutItem: {
    marginTop: 20,
  },
  logoutText: {
    color: "#FF3B30",
  },
  // Trip Card Styles
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
    marginBottom: 8,
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
  viewDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  viewDetailsText: {
    fontSize: 13,
    color: "#000000",
    fontWeight: "600",
    marginRight: 4,
  },
  // Profile Page Styles
  profileRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  profileRatingText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 6,
    fontWeight: "600",
  },
  statusBadgeProfile: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 10,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
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
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
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
  // Settings Page Styles
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
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionRightText: {
    fontSize: 14,
    color: "#666666",
    marginRight: 8,
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
});

export default RiderHome;
