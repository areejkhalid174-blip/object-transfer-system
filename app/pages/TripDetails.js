import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAllData, getDataById, updateData } from "../Helper/firebaseHelper";

const TripDetails = ({ navigation, route }) => {
  const [tripStatus, setTripStatus] = useState("pending");
  const { orderId } = route?.params || {};
  const [orderData, setOrderData] = useState(null);
  const [tripData, setTripData] = useState(route?.params?.tripData || {
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
  });
  const [pricePerKm, setPricePerKm] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;
      try {
        const order = await getDataById("orders", orderId);
        if (order) {
          setOrderData(order);
          setTripData({
            tripId: orderId,
            tripDate: new Date(order.createdAt || new Date()).toLocaleDateString(),
            tripTime: new Date(order.createdAt || new Date()).toLocaleTimeString(),
            pickupLocation: order.senderAddress || order.originCity || "",
            pickupCoordinates: { lat: order.originLat, lng: order.originLng },
            dropLocation: order.receiverAddress || order.destinationCity || "",
            dropCoordinates: { lat: order.destinationLat, lng: order.destinationLng },
            distance: `${Number(order.distance || 0).toFixed(2)} km`,
            estimatedTime: (() => {
              const d = Number(order.distance || 0);
              if (d < 50) return "2-4 hours";
              if (d < 100) return "4-6 hours";
              if (d < 200) return "6-8 hours";
              return "8-12 hours";
            })(),
            vehicleType: "Bike",
            packageDetails: {
              type: order.categoryName || order.packageType || "",
              weight: `${order.weight || "N/A"}`,
              size: order.packageType || "",
              quantity: "1 package",
              description: order.additionalNotes || "",
              specialInstructions: "",
              fragile: false,
            },
            customer: {
              name: order.customerName || "",
              phone: order.receiverPhone || order.senderPhone || "",
              email: order.customerEmail || "",
              rating: 0,
              totalTrips: 0,
              address: order.senderAddress || "",
            },
            receiver: {
              name: order.receiverName || "",
              phone: order.receiverPhone || "",
              address: order.receiverAddress || "",
            },
            fare: `Rs. ${Number(order.price || 0).toFixed(2)}`,
            baseFare: "",
            distanceFare: "",
            serviceFee: "",
            paymentMethod: "Cash",
            bookingTime: new Date(order.createdAt || new Date()).toLocaleString(),
            priority: "Normal",
          });
          setTripStatus(order.status || "pending");
        }
      } catch (e) {
        // leave default data
      }
    };
    loadOrder();
  }, [orderId]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const priceDataResult = await getAllData("price");
        if (priceDataResult && priceDataResult.length > 0) {
          setPricePerKm(priceDataResult[0].price);
        }
      } catch (e) {
      }
    };
    fetchPrice();
  }, []);

  const displayedDistance = typeof tripData.distance === "string"
    ? tripData.distance
    : `${Number(tripData.distance || 0).toFixed(2)} km`;

  // Calculate and display rider earning
  const [riderEarning, setRiderEarning] = useState(null);
  
  useEffect(() => {
    const calculateEarning = async () => {
      if (!orderData) return;
      
      let earning = 0;
      
      // For within-city orders
      if (orderData.parcelType === "withinCity") {
        const totalKm = parseFloat(orderData.totalKm || 0);
        const pricePerKm = parseFloat(orderData.priceOf1Km || 0);
        if (totalKm > 0 && pricePerKm > 0) {
          earning = totalKm * pricePerKm;
        }
      } 
      // For out-of-city orders
      else if (orderData.parcelType === "outOfCity") {
        const distance = parseFloat(orderData.distance || 0);
        if (distance > 0 && pricePerKm && Number(pricePerKm) > 0) {
          earning = distance * Number(pricePerKm);
        }
      }
      // Fallback
      else {
        const distance = parseFloat(orderData.distance || 0);
        if (distance > 0 && pricePerKm && Number(pricePerKm) > 0) {
          earning = distance * Number(pricePerKm);
        }
      }
      
      // Use stored riderEarning if available, otherwise calculate
      if (orderData.riderEarning !== undefined && orderData.riderEarning !== null) {
        setRiderEarning(parseFloat(orderData.riderEarning));
      } else {
        setRiderEarning(earning);
      }
    };
    
    calculateEarning();
  }, [orderData, pricePerKm]);

  const displayedEarning = riderEarning !== null && riderEarning > 0
    ? `Rs. ${riderEarning.toFixed(2)}`
    : orderData?.riderEarning !== undefined && orderData.riderEarning !== null
    ? `Rs. ${parseFloat(orderData.riderEarning).toFixed(2)}`
    : "Calculating...";

  const handleAccept = async () => {
    if (!orderId) return;
    try {
      await updateData("orders", orderId, {
        status: "accepted",
        updatedAt: new Date().toISOString(),
      });
      setTripStatus("accepted");
      Alert.alert("Success", "Trip Accepted! Navigate to pickup location.");
    } catch (error) {
      console.error("Error accepting trip:", error);
      Alert.alert("Error", "Failed to accept trip");
    }
  };

  const handleReject = () => {
    Alert.alert("Trip Rejected");
    navigation.goBack();
  };

  // Calculate rider earnings based on distance
  const calculateRiderEarning = async () => {
    if (!orderData) return 0;
    
    try {
      let earning = 0;
      
      // For within-city orders
      if (orderData.parcelType === "withinCity") {
        const totalKm = parseFloat(orderData.totalKm || 0);
        const pricePerKm = parseFloat(orderData.priceOf1Km || 0);
        if (totalKm > 0 && pricePerKm > 0) {
          earning = totalKm * pricePerKm;
        }
      } 
      // For out-of-city orders
      else if (orderData.parcelType === "outOfCity") {
        const distance = parseFloat(orderData.distance || 0);
        // Use pricePerKm from state (already fetched)
        if (distance > 0 && pricePerKm && Number(pricePerKm) > 0) {
          earning = distance * Number(pricePerKm);
        } else {
          // Fallback: try to get price per km from price collection
          try {
            const priceDataResult = await getAllData("price");
            if (priceDataResult && priceDataResult.length > 0) {
              const fetchedPricePerKm = parseFloat(priceDataResult[0].price || 0);
              if (distance > 0 && fetchedPricePerKm > 0) {
                earning = distance * fetchedPricePerKm;
              }
            }
          } catch (error) {
            console.error("Error fetching price data:", error);
          }
        }
      }
      // Fallback: use distance if available
      else {
        const distance = parseFloat(orderData.distance || 0);
        if (distance > 0 && pricePerKm && Number(pricePerKm) > 0) {
          earning = distance * Number(pricePerKm);
        }
      }
      
      return earning;
    } catch (error) {
      console.error("Error calculating rider earning:", error);
      return 0;
    }
  };

  const handleMarkAsDelivered = async () => {
    if (!orderId) return;
    try {
      // Calculate rider earning
      const riderEarning = await calculateRiderEarning();
      
      await updateData("orders", orderId, {
        status: "delivered",
        riderEarning: riderEarning,
        riderEarningCalculatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setTripStatus("delivered");
      Alert.alert("Success", `Trip marked as delivered! Your earning: Rs. ${riderEarning.toFixed(2)}`);
      navigation.goBack();
    } catch (error) {
      console.error("Error marking as delivered:", error);
      Alert.alert("Error", "Failed to update status");
    }
  };

  const handleCompleteTrip = async () => {
    if (!orderId) return;
    try {
      // Calculate rider earning
      const riderEarning = await calculateRiderEarning();
      
      await updateData("orders", orderId, {
        status: "completed",
        riderEarning: riderEarning,
        riderEarningCalculatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setTripStatus("completed");
      Alert.alert("Success", `Trip Completed! Your earning: Rs. ${riderEarning.toFixed(2)}`);
      navigation.goBack();
    } catch (error) {
      console.error("Error completing trip:", error);
      Alert.alert("Error", "Failed to complete trip");
    }
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
        {orderId && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trip Request</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer Name:</Text>
            <Text style={styles.detailValue}>{tripData?.customer?.name || ""}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Pickup Location:</Text>
            <Text style={styles.detailValue}>{tripData.pickupLocation || ""}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Drop Location:</Text>
            <Text style={styles.detailValue}>{tripData.dropLocation || ""}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Distance:</Text>
            <Text style={styles.detailValue}>{displayedDistance}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Earning:</Text>
            <Text style={styles.detailValue}>{displayedEarning}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={async () => {
                if (!orderId) return;
                try {
                  await updateData("orders", orderId, { 
                    status: "cancelled", 
                    updatedAt: new Date().toISOString() 
                  });
                  Alert.alert("Success", "Trip cancelled");
                  navigation.goBack();
                } catch (error) {
                  console.error("Error cancelling trip:", error);
                  Alert.alert("Error", "Failed to cancel trip");
                }
              }}
            >
              <Text style={styles.rejectButtonText}>Cancel Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
        )}
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
                (tripStatus === "accepted" || tripStatus === "assigned") && styles.statusAccepted,
                (tripStatus === "in_progress" || tripStatus === "in_transit") && styles.statusInProgress,
                (tripStatus === "completed" || tripStatus === "delivered") && styles.statusCompleted,
                tripStatus === "cancelled" && styles.statusCancelled,
              ]}
            >
              <Text style={styles.statusText}>
                {tripStatus === "pending"
                  ? "New Request"
                  : tripStatus === "accepted" || tripStatus === "assigned"
                  ? "Accepted"
                  : tripStatus === "in_progress" || tripStatus === "in_transit"
                  ? "In Transit"
                  : tripStatus === "completed"
                  ? "Completed"
                  : tripStatus === "delivered"
                  ? "Delivered"
                  : tripStatus === "cancelled"
                  ? "Cancelled"
                  : tripStatus}
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
            <Text style={styles.detailLabel}>Customer Fare:</Text>
            <Text style={styles.detailValue}>{tripData.fare}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Distance:</Text>
            <Text style={styles.detailValue}>
              {orderData?.parcelType === "withinCity" 
                ? `${orderData.totalKm || 0} km`
                : displayedDistance}
            </Text>
          </View>

          <View style={[styles.fareRow, { borderTopWidth: 1, borderTopColor: "#E0E0E0", paddingTop: 15, marginTop: 10 }]}>
            <Text style={styles.fareLabel}>Your Earning:</Text>
            <Text style={[styles.fareAmount, { color: "#4CAF50" }]}>{displayedEarning}</Text>
          </View>
          
          {orderData?.parcelType === "withinCity" && orderData.priceOf1Km && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Rate per km:</Text>
              <Text style={styles.detailValue}>Rs. {parseFloat(orderData.priceOf1Km).toFixed(2)}</Text>
            </View>
          )}

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
        {orderId && tripStatus === "pending" && (
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

        {orderId && (tripStatus === "accepted" || tripStatus === "assigned") && (
          <TouchableOpacity
            style={[styles.button, styles.startTripButton]}
            onPress={async () => {
              if (!orderId) return;
              try {
                await updateData("orders", orderId, {
                  status: "in_progress",
                  updatedAt: new Date().toISOString(),
                });
                setTripStatus("in_progress");
                Alert.alert("Success", "Trip started!");
              } catch (error) {
                console.error("Error starting trip:", error);
                Alert.alert("Error", "Failed to start trip");
              }
            }}
          >
            <Text style={styles.startTripButtonText}>Start Trip</Text>
          </TouchableOpacity>
        )}

        {orderId && (tripStatus === "in_progress" || tripStatus === "in_transit") && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.deliveredButton]}
              onPress={handleMarkAsDelivered}
            >
              <Text style={styles.deliveredButtonText}>Mark as Delivered</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.completeButton]}
              onPress={handleCompleteTrip}
            >
              <Text style={styles.completeButtonText}>Mark as Completed</Text>
            </TouchableOpacity>
          </View>
        )}

        {(tripStatus === "completed" || tripStatus === "delivered") && (
          <View style={styles.completedMessage}>
            <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
            <Text style={styles.completedText}>
              Trip {tripStatus === "completed" ? "Completed" : "Delivered"}!
            </Text>
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
  statusInProgress: {
    backgroundColor: "#FF9800",
  },
  statusCompleted: {
    backgroundColor: "#4CAF50",
  },
  statusCancelled: {
    backgroundColor: "#FF3B30",
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
  startTripButton: {
    backgroundColor: "#2196F3",
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  startTripButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  deliveredButton: {
    backgroundColor: "#FF9800",
    marginRight: 10,
  },
  deliveredButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    marginLeft: 10,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "600",
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
