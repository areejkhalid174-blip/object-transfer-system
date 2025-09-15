import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function CustomerHome() {
  const [selected, setSelected] = useState(null); // state for selected option

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
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              selected === item.id && styles.selectedCard, // highlight if selected
            ]}
            onPress={() => setSelected(item.id)} // update state
          >
            <Icon
              name={item.icon}
              size={40}
              color={selected === item.id ? "#4A90E2" : "black"} // change icon color
            />
            <Text
              style={[
                styles.cardText,
                selected === item.id && { color: "#4A90E2" },
              ]}
            >
              {item.title}
            </Text>
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
  selectedCard: {
    backgroundColor: "#EAF3FF",
    borderColor: "#4A90E2",
  },
  cardText: { fontSize: 16, fontWeight: "600", marginTop: 8, color: "black" },
});
