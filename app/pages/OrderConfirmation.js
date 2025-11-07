import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { getDataById, subscribeToDocument, getAllData } from "../Helper/firebaseHelper";

const OrderConfirmation = ({ navigation, route }) => {
  const { orderId } = route?.params || {};
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pricePerKm, setPricePerKm] = useState(null);

  useEffect(() => {
    if (!orderId) {
      Alert.alert("Error", "Order ID not found");
      setLoading(false);
      return;
    }

    // Fetch initial order data
    const fetchOrderData = async () => {
      try {
        const data = await getDataById("orders", orderId);
        if (data) {
          setOrderData(data);
        } else {
          Alert.alert("Error", "Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        Alert.alert("Error", "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();

    // Fetch price data for calculation
    const fetchPriceData = async () => {
      try {
        const priceDataResult = await getAllData("price");
        if (priceDataResult && priceDataResult.length > 0) {
          setPricePerKm(priceDataResult[0].price);
        }
      } catch (error) {
        console.error("Error fetching price data:", error);
      }
    };

    fetchPriceData();

    // Set up real-time listener for status updates
    const unsubscribe = subscribeToDocument("orders", orderId, (data) => {
      if (data) {
        setOrderData(data);
      }
    });

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [orderId]);

  // Calculate estimated delivery time based on distance
  const getEstimatedDelivery = () => {
    if (!orderData?.distance) return "2-4 hours";
    const distance = orderData.distance;
    if (distance < 50) return "2-4 hours";
    if (distance < 100) return "4-6 hours";
    if (distance < 200) return "6-8 hours";
    return "8-12 hours";
  };

  // Format price - also calculate if distance and price per km are available
  const formatPrice = (price, distance, pricePerKm) => {
    // If price exists, use it
    if (price && price > 0) {
      return `₹${parseFloat(price).toFixed(2)}`;
    }
    
    // If price is missing but we have distance and price per km, calculate it
    if (distance && distance > 0 && pricePerKm && pricePerKm > 0) {
      const calculatedPrice = distance * pricePerKm;
      return `₹${calculatedPrice.toFixed(2)}`;
    }
    
    return "Not calculated";
  };

  // Get status color and icon
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { color: "#FF9800", icon: "time-outline", bgColor: "#FFF3E0" };
      case "approved":
        return { color: "#2196F3", icon: "checkmark-circle-outline", bgColor: "#E3F2FD" };
      case "in_transit":
      case "in transit":
        return { color: "#2196F3", icon: "car-outline", bgColor: "#E3F2FD" };
      case "delivered":
        return { color: "#4CAF50", icon: "checkmark-done-circle", bgColor: "#E8F5E9" };
      case "cancelled":
        return { color: "#F44336", icon: "close-circle-outline", bgColor: "#FFEBEE" };
      default:
        return { color: "#666", icon: "help-circle-outline", bgColor: "#F5F5F5" };
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2c5aa0" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!orderData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Ionicons name="alert-circle-outline" size={60} color="#F44336" />
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusStyle = getStatusStyle(orderData.status);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Your order has been placed successfully!</Text>
        
        {/* Order ID */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="receipt-outline" size={24} color="#2c5aa0" />
            <Text style={styles.cardTitle}>Order ID / Tracking ID</Text>
          </View>
          <Text style={styles.orderIdText}>{orderId || "N/A"}</Text>
        </View>

        {/* Order Status */}
        <View style={[styles.card, { backgroundColor: statusStyle.bgColor }]}>
          <View style={styles.cardHeader}>
            <Ionicons name={statusStyle.icon} size={24} color={statusStyle.color} />
            <Text style={styles.cardTitle}>Order Status</Text>
          </View>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {orderData.status?.toUpperCase() || "PENDING"}
          </Text>
        </View>

        {/* Origin Location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={24} color="#4CAF50" />
            <Text style={styles.cardTitle}>Origin City</Text>
          </View>
          <Text style={styles.locationText}>{orderData.originCity || "Not specified"}</Text>
        </View>

        {/* Destination Location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flag" size={24} color="#FF3B30" />
            <Text style={styles.cardTitle}>Destination City</Text>
          </View>
          <Text style={styles.locationText}>{orderData.destinationCity || "Not specified"}</Text>
        </View>

        {/* Sender Details */}
        {(orderData.senderName || orderData.senderAddress || orderData.senderPhone) && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person" size={24} color="#4CAF50" />
              <Text style={styles.cardTitle}>Sender Details</Text>
            </View>
            {orderData.senderName && (
              <Text style={styles.detailText}>Name: {orderData.senderName}</Text>
            )}
            {orderData.senderAddress && (
              <Text style={styles.detailText}>Address: {orderData.senderAddress}</Text>
            )}
            {orderData.senderPhone && (
              <Text style={styles.detailText}>Phone: {orderData.senderPhone}</Text>
            )}
          </View>
        )}

        {/* Receiver Details */}
        {(orderData.receiverName || orderData.receiverAddress || orderData.receiverPhone) && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person" size={24} color="#FF3B30" />
              <Text style={styles.cardTitle}>Receiver Details</Text>
            </View>
            {orderData.receiverName && (
              <Text style={styles.detailText}>Name: {orderData.receiverName}</Text>
            )}
            {orderData.receiverAddress && (
              <Text style={styles.detailText}>Address: {orderData.receiverAddress}</Text>
            )}
            {orderData.receiverPhone && (
              <Text style={styles.detailText}>Phone: {orderData.receiverPhone}</Text>
            )}
          </View>
        )}

        {/* Package Details */}
        {(orderData.packageType || orderData.weight) && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="cube-outline" size={24} color="#666" />
              <Text style={styles.cardTitle}>Package Details</Text>
            </View>
            {orderData.packageType && (
              <Text style={styles.detailText}>Size: {orderData.packageType}</Text>
            )}
            {orderData.weight && (
              <Text style={styles.detailText}>Weight: {orderData.weight} kg</Text>
            )}
            {orderData.categoryName && (
              <Text style={styles.detailText}>Category: {orderData.categoryName}</Text>
            )}
            {orderData.distance && (
              <Text style={styles.detailText}>Distance: {orderData.distance.toFixed(2)} km</Text>
            )}
          </View>
        )}

        {/* Total Charges */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cash-outline" size={24} color="#FF9800" />
            <Text style={styles.cardTitle}>Total Charges</Text>
          </View>
          <Text style={styles.chargesText}>{formatPrice(orderData.price, orderData.distance, pricePerKm)}</Text>
        </View>

        {/* Estimated Delivery Time */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={24} color="#2196F3" />
            <Text style={styles.cardTitle}>Estimated Delivery Time</Text>
          </View>
          <Text style={styles.deliveryText}>{getEstimatedDelivery()}</Text>
        </View>

        {/* Info Message based on Status */}
        <View style={[styles.card, styles.infoCard]}>
          <Ionicons name="information-circle-outline" size={24} color="#666" />
          <Text style={styles.infoText}>
            {orderData.status === "pending" 
              ? "Your order is pending approval. A rider will be assigned once approved."
              : orderData.status === "approved"
              ? "Your order has been approved. A rider will be assigned soon."
              : orderData.status === "in_transit" || orderData.status === "in transit"
              ? "Your package is on the way. You'll receive updates on delivery."
              : orderData.status === "delivered"
              ? "Your package has been delivered successfully!"
              : orderData.status === "cancelled"
              ? "Your order has been cancelled. Please contact support if you have questions."
              : "You'll receive notifications as your order status updates."}
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => {
            // Navigate to CustomerHome and reset to MyOrders tab
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: "CustomerHome",
                    state: {
                      routes: [{ name: "MyOrders" }],
                      index: 0,
                    },
                  },
                ],
              })
            );
          }}
        >
          <Ionicons name="list-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Go to My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => {
            // Navigate to home with tab reset
            navigation.reset({
              index: 0,
              routes: [{ name: "CustomerHome" }],
            });
          }}
        >
          <Ionicons name="home-outline" size={20} color="#2c5aa0" />
          <Text style={styles.secondaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginLeft: 10,
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c5aa0",
    fontFamily: "monospace",
  },
  locationText: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  detailText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  chargesText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF9800",
  },
  deliveryText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2196F3",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    marginLeft: 10,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#2c5aa0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2c5aa0",
    marginBottom: 30,
  },
  secondaryButtonText: {
    color: "#2c5aa0",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    marginTop: 12,
    fontSize: 18,
    color: "#F44336",
    fontWeight: "600",
  },
  statusText: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
});

export default OrderConfirmation;

