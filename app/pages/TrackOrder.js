import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from "react-native-maps";

const TrackOrder = ({ navigation, route }) => {
  const {
    categoryName,
    pickupLocation,
    dropLocation,
    packageType,
    weight,
    packagePhoto,
    additionalNotes,
  } = route?.params || {};

  const [orderStatus, setOrderStatus] = useState("searching"); // searching, accepted, picked_up, in_transit, delivered
  const [estimatedTime, setEstimatedTime] = useState("15-20 mins");

  // Mock rider data - in real app, this would come from Firebase
  const riderData = {
    name: "Ahmed Khan",
    phone: "+92 300 1234567",
    rating: 4.8,
    vehicleNumber: "ABC-123",
    vehicleType: "Bike",
    photo: null, // placeholder for rider photo
  };

  const statusSteps = [
    { id: "searching", label: "Finding Rider", icon: "search" },
    { id: "accepted", label: "Rider Accepted", icon: "checkmark-circle" },
    { id: "picked_up", label: "Package Picked", icon: "cube" },
    { id: "in_transit", label: "In Transit", icon: "bicycle" },
    { id: "delivered", label: "Delivered", icon: "checkmark-done-circle" },
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex((step) => step.id === orderStatus);
  };

  const callRider = () => {
    Linking.openURL(`tel:${riderData.phone}`);
  };

  const chatWithRider = () => {
    navigation.navigate("CustomerChat", { riderId: "rider123" });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CustomerHome")}>
          <Ionicons name="home" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={60} color="#666" />
          <Text style={styles.mapPlaceholderText}>Map View</Text>
          <Text style={styles.mapSubtext}>
            Rider location will be shown here
          </Text>
        </View>
      </View>

      {/* Estimated Time */}
      <View style={styles.estimatedTimeCard}>
        <Ionicons name="time-outline" size={24} color="#2c5aa0" />
        <View style={styles.estimatedTimeText}>
          <Text style={styles.estimatedLabel}>Estimated Delivery</Text>
          <Text style={styles.estimatedValue}>{estimatedTime}</Text>
        </View>
      </View>

      {/* Order Status Progress */}
      <View style={styles.statusContainer}>
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.statusSteps}>
          {statusSteps.map((step, index) => {
            const currentIndex = getCurrentStepIndex();
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <View key={step.id} style={styles.statusStep}>
                <View style={styles.stepIndicatorContainer}>
                  <View
                    style={[
                      styles.stepIndicator,
                      isCompleted && styles.stepIndicatorCompleted,
                      isCurrent && styles.stepIndicatorCurrent,
                    ]}
                  >
                    <Ionicons
                      name={step.icon}
                      size={20}
                      color={isCompleted ? "#FFFFFF" : "#999"}
                    />
                  </View>
                  {index < statusSteps.length - 1 && (
                    <View
                      style={[
                        styles.stepLine,
                        isCompleted && styles.stepLineCompleted,
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isCompleted && styles.stepLabelCompleted,
                    isCurrent && styles.stepLabelCurrent,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Rider Information */}
      <View style={styles.riderCard}>
        <Text style={styles.sectionTitle}>Rider Information</Text>
        <View style={styles.riderInfo}>
          <View style={styles.riderAvatar}>
            <Ionicons name="person" size={30} color="#2c5aa0" />
          </View>
          <View style={styles.riderDetails}>
            <Text style={styles.riderName}>{riderData.name}</Text>
            <View style={styles.riderRating}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text style={styles.ratingText}>{riderData.rating}</Text>
            </View>
            <Text style={styles.vehicleInfo}>
              {riderData.vehicleType} • {riderData.vehicleNumber}
            </Text>
          </View>
          <View style={styles.riderActions}>
            <TouchableOpacity style={styles.actionButton} onPress={callRider}>
              <Ionicons name="call" size={24} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={chatWithRider}
            >
              <Ionicons name="chatbubble" size={24} color="#2c5aa0" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Package Details */}
      <View style={styles.packageCard}>
        <Text style={styles.sectionTitle}>Package Details</Text>

        <View style={styles.detailRow}>
          <Ionicons name="pricetag" size={20} color="#666" />
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{categoryName || "N/A"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="cube" size={20} color="#666" />
          <Text style={styles.detailLabel}>Size:</Text>
          <Text style={styles.detailValue}>
            {packageType ? packageType.toUpperCase() : "N/A"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="scale" size={20} color="#666" />
          <Text style={styles.detailLabel}>Weight:</Text>
          <Text style={styles.detailValue}>{weight || "N/A"} kg</Text>
        </View>

        <View style={styles.locationSection}>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={20} color="#4CAF50" />
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationValue} numberOfLines={2}>
                {pickupLocation || "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.locationDivider} />

          <View style={styles.locationRow}>
            <Ionicons name="flag" size={20} color="#FF3B30" />
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>Drop-off</Text>
              <Text style={styles.locationValue} numberOfLines={2}>
                {dropLocation || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {additionalNotes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Additional Notes:</Text>
            <Text style={styles.notesText}>{additionalNotes}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
          <Text style={styles.cancelButtonText}>Cancel Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => alert("Help & Support")}
        >
          <Ionicons name="help-circle-outline" size={24} color="#2c5aa0" />
          <Text style={styles.helpButtonText}>Help</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#538cc6",
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  mapContainer: {
    height: 250,
    backgroundColor: "#E0E0E0",
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 10,
  },
  mapSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  estimatedTimeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  estimatedTimeText: {
    marginLeft: 15,
  },
  estimatedLabel: {
    fontSize: 14,
    color: "#666",
  },
  estimatedValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c5aa0",
    marginTop: 2,
  },
  statusContainer: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 15,
  },
  statusSteps: {
    marginTop: 10,
  },
  statusStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepIndicatorContainer: {
    alignItems: "center",
    marginRight: 15,
  },
  stepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  stepIndicatorCompleted: {
    backgroundColor: "#4CAF50",
  },
  stepIndicatorCurrent: {
    backgroundColor: "#2c5aa0",
  },
  stepLine: {
    width: 2,
    height: 20,
    backgroundColor: "#E0E0E0",
    marginTop: 5,
  },
  stepLineCompleted: {
    backgroundColor: "#4CAF50",
  },
  stepLabel: {
    fontSize: 16,
    color: "#999",
    flex: 1,
  },
  stepLabelCompleted: {
    color: "#000",
    fontWeight: "600",
  },
  stepLabelCurrent: {
    color: "#2c5aa0",
    fontWeight: "700",
  },
  riderCard: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  riderInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  riderAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  riderDetails: {
    flex: 1,
    marginLeft: 15,
  },
  riderName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  riderRating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginLeft: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  riderActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  packageCard: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  locationSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  locationRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  locationText: {
    flex: 1,
    marginLeft: 10,
  },
  locationLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  locationDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  notesSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    margin: 15,
    marginTop: 0,
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#FF3B30",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF3B30",
    marginLeft: 8,
  },
  helpButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2c5aa0",
    padding: 15,
    borderRadius: 12,
    marginLeft: 10,
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
});

export default TrackOrder;
