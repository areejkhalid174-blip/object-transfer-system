import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { MapView, Marker, PROVIDER_GOOGLE } from "../../components/MapViewWrapper";
import { getDataById } from "../Helper/firebaseHelper";

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function PickupNavigation({ navigation, route }) {
  const { orderId } = route?.params || {};
  const [order, setOrder] = useState(null);
  const [riderLoc, setRiderLoc] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [etaMin, setEtaMin] = useState(null);

  useEffect(() => {
    let sub;
    const init = async () => {
      try {
        const o = orderId ? await getDataById("orders", orderId) : null;
        if (o) setOrder(o);
      } catch (_) {}
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setRiderLoc({ latitude: 24.8607, longitude: 67.0011 });
          return;
        }
        sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: 10, timeInterval: 2000 }, (pos) => {
          const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setRiderLoc(loc);
        });
      } catch (_) {
        setRiderLoc({ latitude: 24.8607, longitude: 67.0011 });
      }
    };
    init();
    return () => {
      if (sub && sub.remove) sub.remove();
    };
  }, [orderId]);

  useEffect(() => {
    if (!order || !riderLoc) return;
    const olat = order.originLat || 0;
    const olng = order.originLng || 0;
    const d = haversineKm(riderLoc.latitude || 0, riderLoc.longitude || 0, olat, olng);
    setDistanceKm(d);
    const speedKmh = 30;
    const eta = d > 0 ? (d / speedKmh) * 60 : 0;
    setEtaMin(eta);
  }, [order, riderLoc]);

  const callCustomer = () => {
    const phone = order?.senderPhone || order?.receiverPhone || order?.customerPhone || "";
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const initialLat = riderLoc?.latitude || order?.originLat || 24.8607;
  const initialLng = riderLoc?.longitude || order?.originLng || 67.0011;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pickup Navigation</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={{ latitude: initialLat, longitude: initialLng, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
        >
          {riderLoc && (
            <Marker coordinate={{ latitude: riderLoc.latitude, longitude: riderLoc.longitude }} title="You" pinColor="green" />
          )}
          {order && order.originLat && order.originLng && (
            <Marker coordinate={{ latitude: order.originLat, longitude: order.originLng }} title="Pickup" pinColor="red" />
          )}
        </MapView>
        <View style={styles.overlay}>
          <View style={styles.overlayItem}>
            <Ionicons name="speedometer-outline" size={18} color="#000" />
            <Text style={styles.overlayText}>{distanceKm ? `${distanceKm.toFixed(2)} km` : "Calculating"}</Text>
          </View>
          <View style={styles.overlayItem}>
            <Ionicons name="time-outline" size={18} color="#000" />
            <Text style={styles.overlayText}>{etaMin ? `${Math.round(etaMin)} min` : "Calculating"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.callBtn} onPress={callCustomer}>
          <Ionicons name="call" size={20} color="#FFFFFF" />
          <Text style={styles.callText}>Call Customer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#538cc6" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#000000" },
  mapContainer: { flex: 1, marginHorizontal: 16, marginBottom: 12, borderRadius: 12, overflow: "hidden" },
  overlay: { position: "absolute", top: 10, left: 10, right: 10, flexDirection: "row", justifyContent: "space-between" },
  overlayItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  overlayText: { marginLeft: 6, fontSize: 14, fontWeight: "600", color: "#000000" },
  actions: { paddingHorizontal: 16, paddingBottom: 20 },
  callBtn: { backgroundColor: "#4CAF50", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, borderRadius: 10 },
  callText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", marginLeft: 8 },
});