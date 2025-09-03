import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function CustomerHome() {
  const options = [
    { id: 1, title: "Food Delivery", icon: "fast-food-outline" },
    { id: 2, title: "Parcel", icon: "cube-outline" },
    { id: 3, title: "Groceries", icon: "cart-outline" },
    { id: 4, title: "Others", icon: "ellipsis-horizontal-circle-outline" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi</Text>
      <Text style={styles.name}>Jiya</Text>
      <Text style={styles.subtitle}>What are you sending today?</Text>

      <View style={styles.grid}>
        {options.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <Icon name={item.icon} size={40} color="black" />
            <Text style={styles.cardText}>{item.title}</Text>
            <Text style={styles.smallText}></Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  greeting: { fontSize: 20, color: "#555" },
  name: { fontSize: 26, fontWeight: "700", marginBottom: 10 },
  subtitle: { fontSize: 16, fontWeight: "500", marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "47%",
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardText: { fontSize: 16, fontWeight: "600", marginTop: 8, color: "black" },
  smallText: { fontSize: 12, color: "#777", marginTop: 2 },
});
