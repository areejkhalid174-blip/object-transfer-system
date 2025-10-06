import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
// import { db } from "../../"; // apna firebase config import karo
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useSelector } from "react-redux"; // for riderId from redux

import { db } from '../../firebase';

export default function RiderHome() {
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState(null);
  const [trip, setTrip] = useState(null); // current trip
  const rider = useSelector((state) => state.homeData.user); // rider ka uid redux se

  // Get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission denied");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  // Listen for trip requests in Firebase
  useEffect(() => {
    if (!isOnline || !rider?.uid) return;

    const q = query(
      collection(db, "Trips"),
      where("status", "==", "pending") // sirf pending trips aayengi
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.forEach((docSnap) => {
        let tripData = docSnap.data();
        // agar abhi tak rider assign nahi hua
        if (!tripData.riderId) {
          setTrip({ id: docSnap.id, ...tripData });
        }
      });
    });

    return () => unsubscribe();
  }, [isOnline, rider]);

  // Accept trip
  const acceptTrip = async () => {
    if (!trip) return;
    const tripRef = doc(db, "Trips", trip.id);
    await updateDoc(tripRef, {
      riderId: rider.uid,
      status: "accepted",
    });
    alert("Trip accepted!");
  };

  // Reject trip
  const rejectTrip = async () => {
    if (!trip) return;
    const tripRef = doc(db, "Trips", trip.id);
    await updateDoc(tripRef, {
      riderId: null,
      status: "rejected",
    });
    setTrip(null);
    alert("Trip rejected!");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={50} color="black" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name}>Hi, {rider?.firstName}</Text>
          <Text style={styles.rating}>⭐ {rider?.ratting || 0}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "auto" }}>
          <Text style={{ fontSize: 14, fontWeight: "600", marginRight: 5 }}>
            {isOnline ? "Online" : "Offline"}
          </Text>
          <Switch value={isOnline} onValueChange={setIsOnline} />
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* Rider */}
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="You"
              pinColor="blue"
            />

            {/* Pickup & Drop */}
            {trip && (
              <>
                <Marker coordinate={trip.pickup} title="Pickup" pinColor="green" />
                <Marker coordinate={trip.drop} title="Drop" pinColor="red" />
              </>
            )}
          </MapView>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Loading map...</Text>
        )}
      </View>

      {/* Trip Card */}
      {trip && (
        <View style={styles.tripCard}>
          <Text style={styles.tripTitle}>New Trip Request</Text>
          <Text style={styles.tripText}>Pickup: {trip.pickupAddress || "Unknown"}</Text>
          <Text style={styles.tripText}>Drop: {trip.dropAddress || "Unknown"}</Text>
          <Text style={styles.tripText}>Fare: Rs {trip.fare}</Text>
          <View style={styles.tripActions}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: "red" }]} onPress={rejectTrip}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: "green" }]} onPress={acceptTrip}>
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "700" },
  rating: { fontSize: 14, color: "#444" },
  mapContainer: { height: 250, borderRadius: 10, overflow: "hidden", marginBottom: 20 },
  map: { flex: 1 },
  tripCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tripTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  tripText: { fontSize: 14, color: "#333", marginBottom: 5 },
  tripActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  btn: { paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 },
  btnText: { color: "white", fontSize: 16, fontWeight: "600" },
});
 