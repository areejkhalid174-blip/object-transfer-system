import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const OrderConfirmation = ({ navigation, route }) => {
  const { orderId, ...orderData } = route?.params || {};

  // Calculate estimated delivery time (you can make this dynamic later)
  const estimatedDelivery = "2-4 hours";

  // Mock charges calculation (replace with your actual pricing logic)
  const totalCharges = orderData.packageType === "small" 
    ? "Rs. 250" 
    : orderData.packageType === "medium" 
    ? "Rs. 400" 
    : "Rs. 600";

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

        {/* Pickup Location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={24} color="#4CAF50" />
            <Text style={styles.cardTitle}>Pickup Location</Text>
          </View>
          <Text style={styles.locationText}>{orderData.pickupLocation || "Not specified"}</Text>
        </View>

        {/* Drop Location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flag" size={24} color="#FF3B30" />
            <Text style={styles.cardTitle}>Drop Location</Text>
          </View>
          <Text style={styles.locationText}>{orderData.dropLocation || "Not specified"}</Text>
        </View>

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
          </View>
        )}

        {/* Total Charges */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cash-outline" size={24} color="#FF9800" />
            <Text style={styles.cardTitle}>Total Charges</Text>
          </View>
          <Text style={styles.chargesText}>{totalCharges}</Text>
        </View>

        {/* Estimated Delivery Time */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={24} color="#2196F3" />
            <Text style={styles.cardTitle}>Estimated Delivery Time</Text>
          </View>
          <Text style={styles.deliveryText}>{estimatedDelivery}</Text>
        </View>

        {/* Rider Assignment Status */}
        <View style={[styles.card, styles.infoCard]}>
          <Ionicons name="information-circle-outline" size={24} color="#666" />
          <Text style={styles.infoText}>A rider will be assigned soon. You'll receive a notification when your package is picked up.</Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate("MyOrders")}
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
});

export default OrderConfirmation;

