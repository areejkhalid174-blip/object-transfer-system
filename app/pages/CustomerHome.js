
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Switch, Alert, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { getAllData } from "../Helper/firebaseHelper";
import Colors from "../constants/colors";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { setRole, setUser } from "../redux/Slices/HomeDataSlice";

const Tab = createBottomTabNavigator();

// Dashboard Screen
const DashboardScreen = () => {
  const navigation = useNavigation();
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Notification Bell */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi</Text>
          <Text style={styles.name}>{user?.firstName || user?.displayName || "Guest"}</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => alert("Notifications")}
        >
          <Icon name="notifications-outline" size={28} color="#FFFFFF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitle}>What are you sending today?</Text>

      <View style={styles.grid}>
        {data && data.length > 0 ? data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              selected === item.id && styles.selectedCard, // highlight if selected
            ]}
            onPress={() => {
              console.log("Category clicked:", item.title);
              console.log("Navigation object:", navigation);
              
              // Try multiple navigation methods
              try {
                // Method 1: Direct navigate
                navigation.navigate("PackageDetail", {
                  categoryId: item.id,
                  categoryName: item.title
                });
              } catch (error1) {
                console.error("Method 1 failed:", error1);
                
                try {
                  // Method 2: Using parent navigator
                  const parent = navigation.getParent();
                  if (parent) {
                    parent.navigate("PackageDetail", {
                      categoryId: item.id,
                      categoryName: item.title
                    });
                  }
                } catch (error2) {
                  console.error("Method 2 failed:", error2);
                  Alert.alert("Navigation Error", "Cannot navigate to PackageDetail");
                }
              }
            }} // Navigate to PackageDetail
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

      {/* Send New Package Button */}
      <TouchableOpacity 
        style={styles.sendPackageButton}
        onPress={() => {
          console.log("Send New Package clicked");
          try {
            navigation.navigate("PackageDetail", {
              categoryName: "General Package"
            });
          } catch (error) {
            console.error("Navigation error:", error);
          }
        }}
      >
        <Icon name="cube-outline" size={24} color="#FFFFFF" />
        <Text style={styles.sendPackageText}>Send New Package</Text>
      </TouchableOpacity>

      {/* Book a Trip Button */}
      <TouchableOpacity 
        style={styles.bookTripButton}
        onPress={() => {
          console.log("Book a Trip clicked");
          try {
            navigation.navigate("CustomerBookTrip");
          } catch (error) {
            console.error("Navigation error:", error);
          }
        }}
      >
        <Icon name="car-outline" size={24} color="#000000" />
        <Text style={styles.bookTripText}>Book a Trip</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={logOut}>
        <Text style={{ textAlign: "center", color: "#1c1b1fff", marginTop: 20 }}>
          log OUT
        </Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

// My Orders Screen
const MyOrdersScreen = ({ navigation, route }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.home?.user);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Refresh orders when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await getAllData("orders");
      
      // Filter orders for current user
      const userOrders = allOrders.filter(order => order.userId === user?.uid || order.customerEmail === user?.email);
      
      // Sort by most recent first
      const sortedOrders = userOrders.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        month: "2-digit", 
        day: "2-digit", 
        year: "numeric" 
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    } catch (error) {
      return "";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "in transit":
      case "in_progress":
        return "#2196F3";
      case "cancelled":
        return "#FF3B30";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>My Orders</Text>
        
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading orders...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={50} color="#888" />
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Your orders will appear here
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <TouchableOpacity 
              key={order.id} 
              style={styles.tripCard}
              onPress={() => {
                navigation.navigate("OrderConfirmation", {
                  orderId: order.id,
                });
              }}
            >
              <View style={styles.tripHeader}>
                <Text style={styles.tripIdText}>Order #{order.id?.slice(0, 8) || "N/A"}</Text>
                <View style={[styles.tripStatusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.tripStatusText}>{order.status || "Pending"}</Text>
                </View>
              </View>

              <View style={styles.tripInfoSection}>
                <View style={styles.tripDateRow}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text style={styles.tripDateText}>
                    {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
                  </Text>
                </View>
              </View>

              <View style={styles.tripLocationSection}>
                <View style={styles.tripLocationRow}>
                  <Ionicons name="location" size={16} color="#4CAF50" />
                  <Text style={styles.tripLocationText} numberOfLines={2}>
                    {order.originCity || order.pickupLocation || "Origin not set"}
                  </Text>
                </View>
                <View style={styles.tripLocationRow}>
                  <Ionicons name="flag" size={16} color="#FF3B30" />
                  <Text style={styles.tripLocationText} numberOfLines={2}>
                    {order.destinationCity || order.dropLocation || "Destination not set"}
                  </Text>
                </View>
              </View>

              {(order.senderName || order.receiverName) && (
                <View style={styles.tripContactSection}>
                  {order.senderName && (
                    <View style={styles.tripContactRow}>
                      <Ionicons name="person-outline" size={14} color="#4CAF50" />
                      <Text style={styles.tripContactText}>
                        From: {order.senderName} {order.senderPhone ? `(${order.senderPhone})` : ""}
                      </Text>
                    </View>
                  )}
                  {order.receiverName && (
                    <View style={styles.tripContactRow}>
                      <Ionicons name="person-outline" size={14} color="#FF3B30" />
                      <Text style={styles.tripContactText}>
                        To: {order.receiverName} {order.receiverPhone ? `(${order.receiverPhone})` : ""}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.tripFooter}>
                <View style={styles.tripPackageInfo}>
                  <Ionicons name="cube-outline" size={14} color="#666" />
                  <Text style={styles.tripPackageText}>
                    {order.categoryName || order.packageType || "Package"}
                  </Text>
                </View>
                <Text style={styles.tripFareText}>
                  {order.price ? `₹${parseFloat(order.price).toFixed(2)}` : order.weight ? `${order.weight}kg` : "N/A"}
                </Text>
              </View>

              {order.additionalNotes && (
                <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#E0E0E0" }}>
                  <Text style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>
                    Note: {order.additionalNotes}
                  </Text>
                </View>
              )}
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
  const user = useSelector((state) => state.home?.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.firstName || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");

  const customerData = {
    name: user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Guest User",
    email: user?.email || "Not provided",
    phone: user?.phone || "Not provided",
    totalTrips: 45,
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
  };

  const handleSaveProfile = () => {
    // TODO: Update user profile in Firebase
    Alert.alert("Success", "Profile updated successfully!");
    setIsEditing(false);
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
          
          {isEditing ? (
            <>
              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Full Name</Text>
                <TextInput
                  style={styles.editInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Email</Text>
                <TextInput
                  style={styles.editInput}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.editRow}>
                <Text style={styles.editLabel}>Phone</Text>
                <TextInput
                  style={styles.editInput}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Enter your phone"
                  keyboardType="phone-pad"
                />
              </View>
            </>
          ) : (
            <>
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

              <View style={styles.infoRow}>
                <Ionicons name="cube-outline" size={20} color="#666" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Total Orders</Text>
                  <Text style={styles.infoValue}>{customerData.totalTrips}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity 
              style={styles.cancelEditButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelEditButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveEditButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveEditButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.orderHistoryButton}
              onPress={() => navigation.navigate("MyOrders")}
            >
              <Ionicons name="time-outline" size={20} color="#2c5aa0" />
              <Text style={styles.orderHistoryButtonText}>View Order History</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

// Settings Screen
const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.home?.user);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogout = () => {
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
          onPress: () => {
            // Clear Redux state
            dispatch(setRole(""));
            dispatch(setUser({}));
            // Navigate to login screen
            navigation.reset({
              index: 0,
              routes: [{ name: "CustomerLogin" }],
            });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>

        {/* Account Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Account</Text>
          
          <View style={styles.accountInfoRow}>
            <Ionicons name="person-circle-outline" size={24} color="#2c5aa0" />
            <View style={styles.accountInfoText}>
              <Text style={styles.accountName}>
                {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Guest User"}
              </Text>
              <Text style={styles.accountEmail}>{user?.email || "Not logged in"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Account Settings</Text>

          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="person-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => Alert.alert("Change Password", "This feature will be available soon")}
          >
            <Ionicons name="key-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => navigation.navigate("MyOrders")}
          >
            <Ionicons name="receipt-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Order History</Text>
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

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Support</Text>

          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => Alert.alert("Help Center", "Contact support at support@example.com")}
          >
            <Ionicons name="help-circle-outline" size={22} color="#000" />
            <Text style={styles.optionText}>Help Center</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => Alert.alert("About", "Object Transfer System v1.0.0")}
          >
            <Ionicons name="information-circle-outline" size={22} color="#000" />
            <Text style={styles.optionText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
  container: { backgroundColor: Colors.background, padding: 20, paddingBottom: 30 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  greeting: { fontSize: 20, color: Colors.textSecondary },
  name: { fontSize: 26, fontWeight: "700", color: Colors.textSecondary },
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
  sendPackageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2c5aa0",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  sendPackageText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 10,
  },
  bookTripButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.buttonPrimary,
    padding: 15,
    borderRadius: 10,
    marginTop: 12,
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
  tripContactSection: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  tripContactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  tripContactText: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 6,
    flex: 1,
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
  // Edit Profile Styles
  editRow: {
    marginBottom: 15,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  editButtonsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  cancelEditButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  cancelEditButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666",
  },
  saveEditButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: "center",
  },
  saveEditButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  orderHistoryButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#2c5aa0",
  },
  orderHistoryButtonText: {
    color: "#2c5aa0",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  // Settings Account Info
  accountInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  accountInfoText: {
    marginLeft: 15,
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  accountEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
})
