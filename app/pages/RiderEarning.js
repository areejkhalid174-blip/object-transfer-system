import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // expo install @expo/vector-icons

export default function IncomeHistory({ navigation }) {
  const deliveries = [
    { id: 1, title: "Delivery", price: "Rs 200", time: "12.18 pm" },
    { id: 2, title: "Delivery", price: "Rs 200", time: "1.10 pm" },
    { id: 3, title: "Delivery", price: "Rs 100", time: "12.18 pm" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#538cc6", padding: 15 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Ionicons name="arrow-back" size={24} color="#2c5aa0" />
        <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 15 }}>
          Income History
        </Text>
      </View>

      {/* Earnings Summary */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 14, color: "#080707ff" }}>Mon, Jan 14</Text>
        <Text style={{ fontSize: 26, fontWeight: "700", color: "#2c5aa0", marginTop: 4 }}>
          Rs 500
        </Text>
        <Text style={{ fontSize: 14, color: "#0f0f0fff" }}>Earnings</Text>
      </View>

      {/* Stats Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#1f1d1dff",
        }}
      >
        <View>
          <Text style={{ fontSize: 14, color: "#1d1b1bff" }}>Time Online</Text>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>2hr,20min</Text>
        </View>
        <View>
          <Text style={{ fontSize: 14, color: "#0a0a0aff" }}>Total Rides</Text>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>3</Text>
        </View>
      </View>

      {/* Ride Earnings */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E5E5",
        }}
      >
        <View>
          <Text style={{ fontSize: 14, color: "#555" }}>Ride Earnings</Text>
          <Text style={{ fontSize: 12, color: "#131111ff" }}>
            Includes surge and tolls
          </Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Rs 500</Text>
      </View>

      {/* Total */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#0e0d0dff",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Total</Text>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Rs 500</Text>
      </View>

      {/* Delivery History */}
      <ScrollView style={{ marginTop: 15 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 10 }}>
          January 14
        </Text>
        {deliveries.map((item) => (
          <View
            key={item.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#0e0d0dff",
            }}
          >
            <Text style={{ fontSize: 14, color: "#2c5aa0" }}>{item.title}</Text>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#2c5aa0" }}>
                {item.price}
              </Text>
              <Text
                style={{ fontSize: 12, color: "#131111ff", textAlign: "right" }}
              >
                {item.time}
              </Text>
            </View>
          </View>
        ))}

        {/* Button to RatingRider Page */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("RatingRider")}
        >
          <Text style={styles.buttonText}>Go to Rating Rider</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#000000", fontSize: 16, fontWeight: "600" },
});
