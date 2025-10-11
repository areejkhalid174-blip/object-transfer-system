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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

const AdminRidersManagement = ({ navigation }) => {
  const [riders, setRiders] = useState([]);
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedRider, setSelectedRider] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRiders = async () => {
    try {
      const ridersSnapshot = await getDocs(
        query(collection(db, "users"), where("role", "==", "Rider"))
      );
      const ridersData = ridersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRiders(ridersData);
      setFilteredRiders(ridersData);
    } catch (error) {
      console.error("Error fetching riders:", error);
      Alert.alert("Error", "Failed to fetch riders");
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  useEffect(() => {
    filterRiders();
  }, [searchQuery, filterStatus, riders]);

  const filterRiders = () => {
    let filtered = riders;

    // Filter by status
    if (filterStatus !== "All") {
      filtered = filtered.filter((rider) => rider.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (rider) =>
          rider.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rider.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rider.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rider.phone?.includes(searchQuery) ||
          rider.cnic?.includes(searchQuery)
      );
    }

    setFilteredRiders(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRiders();
    setRefreshing(false);
  };

  const handleApproveRider = async (rider) => {
    Alert.alert(
      "Approve Rider",
      `Approve ${rider.firstName} ${rider.lastName} as a rider?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            try {
              await updateDoc(doc(db, "users", rider.id), {
                status: "approved",
                approvedAt: new Date().toISOString(),
              });
              Alert.alert("Success", "Rider approved successfully");
              fetchRiders();
            } catch (error) {
              console.error("Error approving rider:", error);
              Alert.alert("Error", "Failed to approve rider");
            }
          },
        },
      ]
    );
  };

  const handleRejectRider = async (rider) => {
    Alert.alert(
      "Reject Rider",
      `Reject ${rider.firstName} ${rider.lastName}'s application?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              await updateDoc(doc(db, "users", rider.id), {
                status: "rejected",
                rejectedAt: new Date().toISOString(),
              });
              Alert.alert("Success", "Rider rejected");
              fetchRiders();
            } catch (error) {
              console.error("Error rejecting rider:", error);
              Alert.alert("Error", "Failed to reject rider");
            }
          },
        },
      ]
    );
  };

  const handleDeleteRider = async (rider) => {
    Alert.alert(
      "Delete Rider",
      `Permanently delete ${rider.firstName} ${rider.lastName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "users", rider.id));
              Alert.alert("Success", "Rider deleted successfully");
              fetchRiders();
            } catch (error) {
              console.error("Error deleting rider:", error);
              Alert.alert("Error", "Failed to delete rider");
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = (rider) => {
    setSelectedRider(rider);
    setDetailModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "rejected":
        return "#FF3B30";
      default:
        return "#999";
    }
  };

  const RiderCard = ({ rider }) => (
    <View style={styles.riderCard}>
      <View style={styles.riderHeader}>
        <View style={styles.riderAvatar}>
          <Ionicons name="bicycle" size={24} color="#2c5aa0" />
        </View>
        <View style={styles.riderInfo}>
          <Text style={styles.riderName}>
            {rider.firstName} {rider.lastName}
          </Text>
          <Text style={styles.riderEmail}>{rider.email}</Text>
          {rider.phone && <Text style={styles.riderPhone}>📱 {rider.phone}</Text>}
          {rider.cnic && <Text style={styles.riderCnic}>🆔 {rider.cnic}</Text>}
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(rider.status) + "20" },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(rider.status) }]}>
            {rider.status || "pending"}
          </Text>
        </View>
      </View>

      <View style={styles.riderStats}>
        <View style={styles.statItem}>
          <Ionicons name="star" size={16} color="#FFB800" />
          <Text style={styles.statText}>{rider.rating || "0.0"}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="wallet" size={16} color="#4CAF50" />
          <Text style={styles.statText}>Rs {rider.earning || "0"}</Text>
        </View>
      </View>

      <View style={styles.riderActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleViewDetails(rider)}
        >
          <Ionicons name="eye-outline" size={20} color="#2196F3" />
          <Text style={[styles.actionBtnText, { color: "#2196F3" }]}>View</Text>
        </TouchableOpacity>

        {rider.status === "pending" && (
          <>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleApproveRider(rider)}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              <Text style={[styles.actionBtnText, { color: "#4CAF50" }]}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleRejectRider(rider)}
            >
              <Ionicons name="close-circle-outline" size={20} color="#FF9800" />
              <Text style={[styles.actionBtnText, { color: "#FF9800" }]}>Reject</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDeleteRider(rider)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          <Text style={[styles.actionBtnText, { color: "#FF3B30" }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riders Management</Text>
        <Text style={styles.headerSubtitle}>
          {filteredRiders.length} riders • {riders.filter((r) => r.status === "pending").length} pending
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, phone, or CNIC..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {["All", "pending", "approved", "rejected"].map((status) => (
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
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Riders List */}
      <ScrollView
        style={styles.ridersList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredRiders.length > 0 ? (
          filteredRiders.map((rider) => <RiderCard key={rider.id} rider={rider} />)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="bicycle-outline" size={60} color="#999" />
            <Text style={styles.emptyText}>No riders found</Text>
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
              <Text style={styles.modalTitle}>Rider Details</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {selectedRider && (
              <ScrollView>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Personal Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Name:</Text>
                    <Text style={styles.detailValue}>
                      {selectedRider.firstName} {selectedRider.lastName}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Email:</Text>
                    <Text style={styles.detailValue}>{selectedRider.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Phone:</Text>
                    <Text style={styles.detailValue}>{selectedRider.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>CNIC:</Text>
                    <Text style={styles.detailValue}>{selectedRider.cnic}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Status & Performance</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Status:</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        { color: getStatusColor(selectedRider.status) },
                      ]}
                    >
                      {selectedRider.status || "pending"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Rating:</Text>
                    <Text style={styles.detailValue}>
                      ⭐ {selectedRider.rating || "0.0"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Earnings:</Text>
                    <Text style={styles.detailValue}>
                      Rs {selectedRider.earning || "0"}
                    </Text>
                  </View>
                </View>

                {selectedRider.cnicFront && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>CNIC Front</Text>
                    <Image
                      source={{ uri: selectedRider.cnicFront }}
                      style={styles.cnicImage}
                      resizeMode="contain"
                    />
                  </View>
                )}

                {selectedRider.cnicBack && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>CNIC Back</Text>
                    <Image
                      source={{ uri: selectedRider.cnicBack }}
                      style={styles.cnicImage}
                      resizeMode="contain"
                    />
                  </View>
                )}

                {selectedRider.status === "pending" && (
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.modalActionBtn, styles.approveBtn]}
                      onPress={() => {
                        setDetailModalVisible(false);
                        handleApproveRider(selectedRider);
                      }}
                    >
                      <Text style={styles.modalActionBtnText}>Approve Rider</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalActionBtn, styles.rejectBtn]}
                      onPress={() => {
                        setDetailModalVisible(false);
                        handleRejectRider(selectedRider);
                      }}
                    >
                      <Text style={styles.modalActionBtnText}>Reject Rider</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
  ridersList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  riderCard: {
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
  riderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  riderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  riderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  riderName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  riderEmail: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  riderPhone: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  riderCnic: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  riderStats: {
    flexDirection: "row",
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  statText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginLeft: 5,
  },
  riderActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
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
  cnicImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  modalActions: {
    marginTop: 20,
  },
  modalActionBtn: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  approveBtn: {
    backgroundColor: "#4CAF50",
  },
  rejectBtn: {
    backgroundColor: "#FF9800",
  },
  modalActionBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default AdminRidersManagement;
