import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { db } from "../../firebase"; // apna firebase config
import { collection, addDoc } from "firebase/firestore";
import { useSelector } from "react-redux"; // customerId redux se milega

export default function CustomerBookTrip({ navigation }) {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [fare, setFare] = useState(null);
  const [coords, setCoords] = useState(null);
  const customer = useSelector((state) => state.homeData.user); // logged in user

  // Static Fare Calculation (you can integrate Google Maps API later)
  const calculateFare = () => {
    if (!pickup || !drop) {
      alert("Enter pickup and drop");
      return;
    }
    // simple random fare (in real case => use distance API)
    const estimatedFare = Math.floor(Math.random() * 300) + 100;
    setFare(estimatedFare);
  };

  // Save trip to Firebase
  const bookTrip = async () => {
    if (!pickup || !drop || !fare) {
      alert("Please enter details and calculate fare first");
      return;
    }

    try {
      await addDoc(collection(db, "Trips"), {
        customerId: customer?.uid,
        pickupAddress: pickup,
        dropAddress: drop,
        pickup: coords?.pickup || { latitude: 33.6844, longitude: 73.0479 }, // dummy location
        drop: coords?.drop || { latitude: 33.7380, longitude: 73.0844 },
        fare,
        status: "pending",
        riderId: null,
        createdAt: new Date(),
      });
      alert("Trip booked! Waiting for rider...");
      navigation.navigate("CustomerHome");
    } catch (err) {
      console.log(err);
      alert("Error booking trip");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Book a Trip</Text>

      {/* Pickup Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Pickup Location"
        value={pickup}
        onChangeText={setPickup}
      />

      {/* Drop Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Drop Location"
        value={drop}
        onChangeText={setDrop}
      />

      {/* Calculate Fare */}
      <TouchableOpacity style={styles.calcBtn} onPress={calculateFare}>
        <Text style={styles.calcBtnText}>Calculate Fare</Text>
      </TouchableOpacity>

      {fare && (
        <Text style={styles.fareText}>Estimated Fare: Rs {fare}</Text>
      )}

      {/* Confirm Button */}
      <TouchableOpacity style={styles.bookBtn} onPress={bookTrip}>
        <Text style={styles.bookBtnText}>Book Trip</Text>
      </TouchableOpacity>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 33.6844,
            longitude: 73.0479,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Pickup marker */}
          {pickup ? (
            <Marker
              coordinate={{ latitude: 33.6844, longitude: 73.0479 }}
              title="Pickup"
              pinColor="green"
            />
          ) : null}
          {/* Drop marker */}
          {drop ? (
            <Marker
              coordinate={{ latitude: 33.7380, longitude: 73.0844 }}
              title="Drop"
              pinColor="red"
            />
          ) : null}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  calcBtn: {
    backgroundColor: "orange",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  calcBtnText: { color: "white", fontWeight: "600" },
  fareText: { fontSize: 16, fontWeight: "600", marginBottom: 20 },
  bookBtn: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  bookBtnText: { color: "white", fontSize: 16, fontWeight: "600" },
  mapContainer: {
    marginTop: 20,
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: { flex: 1 },
});
