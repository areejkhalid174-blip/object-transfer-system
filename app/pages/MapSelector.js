import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { getAllData } from "../Helper/firebaseHelper";

// Distance calculation function
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance; // in km
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const CitySelector = ({ navigation, route }) => {
  const { locationType } = route?.params || {};
  const [cities, setCities] = useState([]);
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [originDropdownOpen, setOriginDropdownOpen] = useState(false);
  const [destinationDropdownOpen, setDestinationDropdownOpen] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [distance, setDistance] = useState(null);
  
  // Sender fields
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  
  // Receiver fields
  const [receiverName, setReceiverName] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedOrigin && selectedDestination && priceData) {
      calculatePrice();
    } else {
      // Clear price and distance if cities are not selected
      setDistance(null);
      setCalculatedPrice(null);
    }
  }, [selectedOrigin, selectedDestination, priceData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [citiesData, priceDataResult] = await Promise.all([
        getAllData("cities"),
        getAllData("price")
      ]);
      
      setCities(citiesData || []);
      if (priceDataResult && priceDataResult.length > 0) {
        setPriceData(priceDataResult[0]); // Assuming price collection has one document
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load cities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!selectedOrigin || !selectedDestination || !priceData) {
      setDistance(null);
      setCalculatedPrice(null);
      return;
    }

    // Check if same city is selected
    if (selectedOrigin.id === selectedDestination.id) {
      Alert.alert("Error", "Origin and destination cities cannot be the same. Please select different cities.");
      setDistance(null);
      setCalculatedPrice(null);
      return;
    }

    const lat1 = selectedOrigin.lat;
    const lon1 = selectedOrigin.lng;
    const lat2 = selectedDestination.lat;
    const lon2 = selectedDestination.lng;

    const calculatedDistance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    setDistance(calculatedDistance);

    // Calculate price based on distance and price per unit
    if (priceData.unit === "km") {
      const totalPrice = calculatedDistance * priceData.price;
      setCalculatedPrice(totalPrice.toFixed(2));
    } else {
      Alert.alert("Error", "Unknown price unit. Please contact support.");
      setCalculatedPrice(null);
    }
  };

  const handleConfirm = () => {
    if (!selectedOrigin || !selectedDestination) {
      Alert.alert("Error", "Please select both origin and destination cities");
      return;
    }

    // Check if same city is selected
    if (selectedOrigin.id === selectedDestination.id) {
      Alert.alert("Error", "Origin and destination cities cannot be the same. Please select different cities.");
      return;
    }

    // Ensure price is calculated
    if (!calculatedPrice || !distance) {
      Alert.alert("Error", "Please wait for price calculation to complete");
      return;
    }

    if (!senderName.trim()) {
      Alert.alert("Error", "Please enter sender name");
      return;
    }

    if (!senderAddress.trim()) {
      Alert.alert("Error", "Please enter sender address");
      return;
    }

    if (!senderPhone.trim()) {
      Alert.alert("Error", "Please enter sender phone number");
      return;
    }

    if (!receiverName.trim()) {
      Alert.alert("Error", "Please enter receiver name");
      return;
    }

    if (!receiverAddress.trim()) {
      Alert.alert("Error", "Please enter receiver address");
      return;
    }

    if (!receiverPhone.trim()) {
      Alert.alert("Error", "Please enter receiver phone number");
      return;
    }

    // Navigate back with selected cities, calculated price, and sender/receiver details
    navigation.navigate(route.params?.returnScreen || "PackageDetail", {
      originCity: selectedOrigin.name,
      originLat: selectedOrigin.lat,
      originLng: selectedOrigin.lng,
      destinationCity: selectedDestination.name,
      destinationLat: selectedDestination.lat,
      destinationLng: selectedDestination.lng,
      distance: distance,
      calculatedPrice: calculatedPrice,
      senderName: senderName.trim(),
      senderAddress: senderAddress.trim(),
      senderPhone: senderPhone.trim(),
      receiverName: receiverName.trim(),
      receiverAddress: receiverAddress.trim(),
      receiverPhone: receiverPhone.trim(),
    });
  };

  const renderCityItem = (item, onSelect, isOrigin) => {
    // Check if this city is already selected in the other dropdown
    const isOtherSelected = isOrigin 
      ? selectedDestination?.id === item.id
      : selectedOrigin?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.cityItem, isOtherSelected && styles.cityItemDisabled]}
        onPress={() => {
          // Prevent selecting the same city that's already selected in the other dropdown
          if (isOtherSelected) {
            Alert.alert("Error", "This city is already selected. Please choose a different city.");
            return;
          }
          
          if (isOrigin) {
            setSelectedOrigin(item);
            setOriginDropdownOpen(false);
          } else {
            setSelectedDestination(item);
            setDestinationDropdownOpen(false);
          }
        }}
        disabled={isOtherSelected}
      >
        <Text style={[styles.cityItemText, isOtherSelected && styles.cityItemTextDisabled]}>
          {item.name}
          {isOtherSelected && " (Already selected)"}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={isOtherSelected ? "#CCC" : "#666"} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Cities</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2c5aa0" />
          <Text style={styles.loadingText}>Loading cities...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Cities</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Origin City Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Origin City</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => {
              setOriginDropdownOpen(true);
              setDestinationDropdownOpen(false);
            }}
          >
            <Text style={[styles.dropdownText, !selectedOrigin && styles.placeholderText]}>
              {selectedOrigin ? selectedOrigin.name : "Select origin city"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Destination City Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Destination City</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => {
              setDestinationDropdownOpen(true);
              setOriginDropdownOpen(false);
            }}
          >
            <Text style={[styles.dropdownText, !selectedDestination && styles.placeholderText]}>
              {selectedDestination ? selectedDestination.name : "Select destination city"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Sender Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sender Details</Text>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Sender Name *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter sender name"
                placeholderTextColor="#999"
                value={senderName}
                onChangeText={setSenderName}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Sender Address *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter sender address"
                placeholderTextColor="#999"
                value={senderAddress}
                onChangeText={setSenderAddress}
                multiline
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Sender Phone Number *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter sender phone number"
                placeholderTextColor="#999"
                value={senderPhone}
                onChangeText={setSenderPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Receiver Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Receiver Details</Text>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Receiver Name *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter receiver name"
                placeholderTextColor="#999"
                value={receiverName}
                onChangeText={setReceiverName}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Receiver Address *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter receiver address"
                placeholderTextColor="#999"
                value={receiverAddress}
                onChangeText={setReceiverAddress}
                multiline
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Receiver Phone Number *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter receiver phone number"
                placeholderTextColor="#999"
                value={receiverPhone}
                onChangeText={setReceiverPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Distance and Price Display */}
        {selectedOrigin && selectedDestination && calculatedPrice && (
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Distance:</Text>
              <Text style={styles.priceValue}>{distance?.toFixed(2)} km</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Price per km:</Text>
              <Text style={styles.priceValue}>₹{priceData?.price}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalPriceRow]}>
              <Text style={styles.totalPriceLabel}>Total Price:</Text>
              <Text style={styles.totalPriceValue}>₹{calculatedPrice}</Text>
            </View>
          </View>
        )}

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedOrigin || !selectedDestination || !calculatedPrice || !distance || selectedOrigin?.id === selectedDestination?.id || !senderName.trim() || !senderAddress.trim() || !senderPhone.trim() || !receiverName.trim() || !receiverAddress.trim() || !receiverPhone.trim()) && styles.confirmButtonDisabled
          ]}
          onPress={handleConfirm}
          disabled={!selectedOrigin || !selectedDestination || !calculatedPrice || !distance || selectedOrigin?.id === selectedDestination?.id || !senderName.trim() || !senderAddress.trim() || !senderPhone.trim() || !receiverName.trim() || !receiverAddress.trim() || !receiverPhone.trim()}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.confirmButtonText}>Confirm Selection</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Origin Dropdown Modal */}
      <Modal
        visible={originDropdownOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setOriginDropdownOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Origin City</Text>
              <TouchableOpacity onPress={() => setOriginDropdownOpen(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={cities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderCityItem(item, setSelectedOrigin, true)}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No cities available</Text>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Destination Dropdown Modal */}
      <Modal
        visible={destinationDropdownOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDestinationDropdownOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Destination City</Text>
              <TouchableOpacity onPress={() => setDestinationDropdownOpen(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={cities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderCityItem(item, setSelectedDestination, false)}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No cities available</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538cc6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#2c5aa0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 4,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  placeholderText: {
    color: "#999",
  },
  priceContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalPriceRow: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 12,
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: "#666",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalPriceLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalPriceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c5aa0",
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2c5aa0",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: "#999",
    opacity: 0.6,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  cityItemText: {
    fontSize: 16,
    color: "#333",
  },
  cityItemDisabled: {
    opacity: 0.5,
    backgroundColor: "#F5F5F5",
  },
  cityItemTextDisabled: {
    color: "#999",
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "#999",
  },
});

export default CitySelector;

