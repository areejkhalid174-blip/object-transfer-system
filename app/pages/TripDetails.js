import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TripDetails = ({ navigation, route }) => {
  const [tripStatus, setTripStatus] = useState("pending"); // pending, accepted, completed
  
  // Sample trip data - this would come from props/route params in real app
  const tripData = route?.params?.tripData || {
    tripId: "TRP12345",
    tripDate: new Date().toLocaleDateString(),
    tripTime: new Date().toLocaleTimeString(),
    pickupLocation: "123 Main Street, Gulshan-e-Iqbal, Karachi",
    pickupCoordinates: { lat: 24.8607, lng: 67.0011 },
    dropLocation: "456 Park Avenue, Clifton, Karachi",
    dropCoordinates: { lat: 24.8138, lng: 67.0294 },
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
    bookingTime: new Date().toLocaleString(),
    priority: "Normal", // Normal, Urgent, Express
  };

  const handleAccept = () => {
    setTripStatus("accepted");
    alert("Trip Accepted! Navigate to pickup location.");
  };

  const handleReject = () => {
    alert("Trip Rejected");
    navigation.goBack();
  };

  const handleCompleteTrip = () => {
    setTripStatus("completed");
    alert("Trip Completed! Payment received.");
    navigation.navigate("RiderHome");
  };

  const handleCall = () => {
    Linking.openURL(`tel:${tripData.customer.phone}`);
  };

  const handleNavigate = (location) => {
    // Open maps for navigation
    alert(`Opening navigation to: ${location}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Trip ID & Status */}
        <View style={styles.card}>
          <View style={styles.tripIdRow}>
            <Text style={styles.tripId}>Trip ID: {tripData.tripId}</Text>
            <View
              style={[
                styles.statusBadge,
                tripStatus === "accepted" && styles.statusAccepted,
                tripStatus === "completed" && styles.statusCompleted,
              ]}
            >
              <Text style={styles.statusText}>
                {tripStatus === "pending"
                  ? "New Request"
                  : tripStatus === "accepted"
                  ? "In Progress"
                  : "Completed"}
              </Text>
            </View>
          </View>
          <View style={styles.tripInfoRow}>
            <View style={styles.tripInfoItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.tripInfoText}>{tripData.tripDate}</Text>
            </View>
            <View style={styles.tripInfoItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.tripInfoText}>{tripData.tripTime}</Text>
            </View>
          </View>
          <View style={styles.tripInfoRow}>
            <View style={styles.tripInfoItem}>
              <Ionicons name="bicycle-outline" size={16} color="#666" />
              <Text style={styles.tripInfoText}>{tripData.vehicleType}</Text>
            </View>
            <View style={styles.tripInfoItem}>
              <Ionicons name="flash-outline" size={16} color="#666" />
              <Text style={styles.tripInfoText}>{tripData.priority}</Text>
            </View>
          </View>
        </View>

        {/* Locations */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Route Information</Text>

          {/* Pickup Location */}
          <View style={styles.locationRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={20} color="#4CAF50" />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Pickup Location</Text>
              <Text style={styles.locationText}>{tripData.pickupLocation}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleNavigate(tripData.pickupLocation)}
            >
              <Ionicons name="navigate" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={styles.routeLine} />

          {/* Drop Location */}
          <View style={styles.locationRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="flag" size={20} color="#FF3B30" />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Drop Location</Text>
              <Text style={styles.locationText}>{tripData.dropLocation}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleNavigate(tripData.dropLocation)}
            >
              <Ionicons name="navigate" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Distance & Time */}
          <View style={styles.distanceRow}>
            <View style={styles.distanceItem}>
              <Ionicons name="speedometer-outline" size={18} color="#666" />
              <Text style={styles.distanceText}>{tripData.distance}</Text>
            </View>
            <View style={styles.distanceItem}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.distanceText}>{tripData.estimatedTime}</Text>
            </View>
          </View>
        </View>

        {/* Package Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Package Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>{tripData.packageDetails.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Size:</Text>
            <Text style={styles.detailValue}>{tripData.packageDetails.size}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Weight:</Text>
            <Text style={styles.detailValue}>{tripData.packageDetails.weight}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity:</Text>
            <Text style={styles.detailValue}>{tripData.packageDetails.quantity}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description:</Text>
            <Text style={styles.detailValue}>
              {tripData.packageDetails.description}
            </Text>
          </View>

          {tripData.packageDetails.fragile && (
            <View style={[styles.instructionsBox, { backgroundColor: "#FFEBEE" }]}>
              <Ionicons name="warning" size={18} color="#D32F2F" />
              <Text style={[styles.instructionsText, { color: "#D32F2F" }]}>
                Fragile - Handle with care
              </Text>
            </View>
          )}

          {tripData.packageDetails.specialInstructions && (
            <View style={styles.instructionsBox}>
              <Ionicons name="alert-circle" size={18} color="#FF9800" />
              <Text style={styles.instructionsText}>
                {tripData.packageDetails.specialInstructions}
              </Text>
            </View>
          )}
        </View>

        {/* Customer Contact */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sender Information</Text>

          <View style={styles.customerRow}>
            <View style={styles.customerAvatar}>
              <Ionicons name="person" size={24} color="#000" />
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{tripData.customer.name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {tripData.customer.rating} ({tripData.customer.totalTrips} trips)
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Ionicons name="call" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.phoneRow}>
            <Ionicons name="call-outline" size={18} color="#666" />
            <Text style={styles.phoneText}>{tripData.customer.phone}</Text>
          </View>

          <View style={styles.phoneRow}>
            <Ionicons name="mail-outline" size={18} color="#666" />
            <Text style={styles.phoneText}>{tripData.customer.email}</Text>
          </View>

          <View style={styles.phoneRow}>
            <Ionicons name="home-outline" size={18} color="#666" />
            <Text style={styles.phoneText}>{tripData.customer.address}</Text>
          </View>
        </View>

        {/* Receiver Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Receiver Information</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{tripData.receiver.name}</Text>
          </View>

          <View style={styles.phoneRow}>
            <Ionicons name="call-outline" size={18} color="#666" />
            <Text style={styles.phoneText}>{tripData.receiver.phone}</Text>
          </View>

          <View style={styles.phoneRow}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <Text style={styles.phoneText}>{tripData.receiver.address}</Text>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Information</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Base Fare:</Text>
            <Text style={styles.detailValue}>{tripData.baseFare}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Distance Fare:</Text>
            <Text style={styles.detailValue}>{tripData.distanceFare}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service Fee:</Text>
            <Text style={styles.detailValue}>{tripData.serviceFee}</Text>
          </View>

          <View style={[styles.fareRow, { borderTopWidth: 1, borderTopColor: "#E0E0E0", paddingTop: 15, marginTop: 10 }]}>
            <Text style={styles.fareLabel}>Total Fare:</Text>
            <Text style={styles.fareAmount}>{tripData.fare}</Text>
          </View>

          <View style={styles.paymentMethodRow}>
            <Ionicons name="wallet-outline" size={18} color="#666" />
            <Text style={styles.paymentMethodText}>
              Payment Method: {tripData.paymentMethod}
            </Text>
          </View>

          <View style={styles.phoneRow}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.phoneText}>Booked: {tripData.bookingTime}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        {tripStatus === "pending" && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={handleReject}
            >
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={handleAccept}
            >
              <Text style={styles.acceptButtonText}>Accept Trip</Text>
            </TouchableOpacity>
          </View>
        )}

        {tripStatus === "accepted" && (
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={handleCompleteTrip}
          >
            <Text style={styles.completeButtonText}>Complete Trip</Text>
          </TouchableOpacity>
        )}

        {tripStatus === "completed" && (
          <View style={styles.completedMessage}>
            <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
            <Text style={styles.completedText}>Trip Completed!</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
  },
  tripIdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  statusBadge: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusAccepted: {
    backgroundColor: "#2196F3",
  },
  statusCompleted: {
    backgroundColor: "#4CAF50",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  tripInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  tripInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  tripInfoText: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: "#E0E0E0",
    marginLeft: 19,
    marginVertical: 5,
  },
  distanceRow: {
    flexDirection: "row",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  distanceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  distanceText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  instructionsBox: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  instructionsText: {
    fontSize: 13,
    color: "#E65100",
    marginLeft: 8,
    flex: 1,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 4,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  phoneText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  fareLabel: {
    fontSize: 16,
    color: "#666666",
  },
  fareAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
  },
  paymentMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  paymentMethodText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#FF3B30",
    marginRight: 10,
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    marginLeft: 10,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  completedMessage: {
    alignItems: "center",
    paddingVertical: 30,
  },
  completedText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4CAF50",
    marginTop: 10,
  },
});

export default TripDetails;
