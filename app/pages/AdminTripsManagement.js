import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";

const AdminTripsManagement = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrips = async () => {
    try {
      const tripsSnapshot = await getDocs(
        query(collection(db, "trips"), orderBy("createdAt", "desc"))
      );
      const tripsData = tripsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrips(tripsData);
      setFilteredTrips(tripsData);
    } catch (error) {
      console.error("Error fetching trips:", error);
      Alert.alert("Error", "Failed to fetch trips");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [searchQuery, filterStatus, trips]);

  const filterTrips = () => {
    let filtered = trips;

    // Filter by status
    if (filterStatus !== "All") {
      filtered = filtered.filter((trip) => trip.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (trip) =>
          trip.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.riderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.pickupLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.dropLocation?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTrips(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  };

  const handleUpdateStatus = async (trip, newStatus) => {
    try {
      await updateDoc(doc(db, "trips", trip.id), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      Alert.alert("Success", `Trip status updated to ${newStatus}`);
      fetchTrips();
    } catch (error) {
      console.error("Error updating trip:", error);
      Alert.alert("Error", "Failed to update trip status");
    }
  };

  const handleDeleteTrip = async (trip) => {
    Alert.alert(
      "Delete Trip",
      `Permanently delete trip ${trip.orderId}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "trips", trip.id));
              Alert.alert("Success", "Trip deleted successfully");
              fetchTrips();
            } catch (error) {
              console.error("Error deleting trip:", error);
              Alert.alert("Error", "Failed to delete trip");
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setDetailModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "active":
      case "in_progress":
        return "#2196F3";
      case "cancelled":
        return "#FF3B30";
      case "pending":
        return "#FF9800";
      default:
        return "#999";
    }
  };

  const calculateEarnings = () => {
    return trips
      .filter((t) => t.status === "completed")
      .reduce((sum, trip) => sum + (parseFloat(trip.fare) || 0), 0);
  };

  const TripCard = ({ trip }) => (
    <View style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.tripIdContainer}>
          <Ionicons name="receipt-outline" size={20} color="#2c5aa0" />
          <Text style={styles.tripId}>{trip.orderId || trip.id.slice(0, 8)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(trip.status) + "20" },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
            {trip.status || "pending"}
          </Text>
        </View>
      </View>

      <View style={styles.tripInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            Customer: {trip.customerName || "N/A"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="bicycle-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            Rider: {trip.riderName || "Not assigned"}
          </Text>
        </View>
      </View>

      <View style={styles.tripLocations}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color="#4CAF50" />
          <Text style={styles.locationText} numberOfLines={1}>
            {trip.pickupLocation || "N/A"}
          </Text>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="flag" size={16} color="#FF3B30" />
          <Text style={styles.locationText} numberOfLines={1}>
            {trip.dropLocation || "N/A"}
          </Text>
        </View>
      </View>

      <View style={styles.tripFooter}>
        <View style={styles.tripMeta}>
          <Ionicons name="cube-outline" size={14} color="#666" />
          <Text style={styles.metaText}>{trip.packageType || "N/A"}</Text>
        </View>
        <Text style={styles.fareText}>Rs {trip.fare || "0"}</Text>
      </View>

      <View style={styles.tripActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleViewDetails(trip)}
        >
          <Ionicons name="eye-outline" size={18} color="#2196F3" />
          <Text style={[styles.actionBtnText, { color: "#2196F3" }]}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDeleteTrip(trip)}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          <Text style={[styles.actionBtnText, { color: "#FF3B30" }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Trips Management</Text>
          <Text style={styles.headerSubtitle}>
            {filteredTrips.length} trips • Rs {calculateEarnings().toFixed(2)} total
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by order ID, customer, rider, location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabsContainer}>
        <View style={styles.filterTabs}>
          {["All", "pending", "active", "in_progress", "completed", "cancelled"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterTab,
                filterStatus === status && styles.filterTabActive,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filterStatus === status && styles.filterTabTextActive,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Trips List */}
      <ScrollView
        style={styles.tripsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={60} color="#999" />
            <Text style={styles.emptyText}>No trips found</Text>
          </View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Trip Details</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {selectedTrip && (
              <ScrollView>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Trip Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Order ID:</Text>
                    <Text style={styles.detailValue}>
                      {selectedTrip.orderId || selectedTrip.id}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Status:</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        { color: getStatusColor(selectedTrip.status) },
                      ]}
                    >
                      {selectedTrip.status || "pending"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Package Type:</Text>
                    <Text style={styles.detailValue}>
                      {selectedTrip.packageType || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Weight:</Text>
                    <Text style={styles.detailValue}>
                      {selectedTrip.weight || "N/A"} kg
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Fare:</Text>
                    <Text style={styles.detailValue}>
                      Rs {selectedTrip.fare || "0"}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Locations</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Pickup:</Text>
                    <Text style={styles.detailValue}>
                      {selectedTrip.pickupLocation || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Drop:</Text>
                    <Text style={styles.detailValue}>
                      {selectedTrip.dropLocation || "N/A"}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Participants</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Customer:</Text>
                    <Text style={styles.detailValue}>
                      {selectedTrip.customerName || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Rider:</Text>
                    <Text style={styles.detailValue}>
                      {selectedTrip.riderName || "Not assigned"}
                    </Text>
                  </View>
                </View>

                {selectedTrip.additionalNotes && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Additional Notes</Text>
                    <Text style={styles.notesText}>
                      {selectedTrip.additionalNotes}
                    </Text>
                  </View>
                )}

                <View style={styles.modalActions}>
                  <Text style={styles.actionsTitle}>Update Status</Text>
                  <View style={styles.statusButtons}>
                    {["pending", "active", "in_progress", "completed", "cancelled"].map(
                      (status) => (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.statusButton,
                            { backgroundColor: getStatusColor(status) },
                          ]}
                          onPress={() => {
                            setDetailModalVisible(false);
                            handleUpdateStatus(selectedTrip, status);
                          }}
                        >
                          <Text style={styles.statusButtonText}>
                            {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  filterTabsContainer: {
    maxHeight: 50,
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },
  filterTabActive: {
    backgroundColor: "#2c5aa0",
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  filterTabTextActive: {
    color: "#FFFFFF",
  },
  tripsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  tripCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tripIdContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2c5aa0",
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  tripInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
  },
  tripLocations: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  locationText: {
    fontSize: 13,
    color: "#000",
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
    marginBottom: 12,
  },
  tripMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
  },
  fareText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4CAF50",
  },
  tripActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  detailKey: {
    fontSize: 14,
    color: "#666",
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  notesText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  modalActions: {
    marginTop: 10,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  statusButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});

export default AdminTripsManagement;
