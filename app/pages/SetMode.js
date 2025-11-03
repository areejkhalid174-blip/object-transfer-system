import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function SetMode({ navigation }) {
  const modes = [
    { id: "1", title: "Moto", icon: "motorbike" },
    { id: "2", title: "Car", icon: "car-outline" },
    { id: "3", title: "Rental Vehicle", icon: "car-multiple" },
    { id: "4", title: "Courier Services", icon: "truck-delivery-outline" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#000000" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Verification- 3/3</Text>
      </View>
      <Text style={styles.subHeaderText}>Register your driver mode as:</Text>

      {/* Mode Options */}
      <FlatList
        data={modes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("RiderHome", { mode: item.title })}
          >
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                color="#000"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.optionText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#000" />
          </TouchableOpacity>
        )}
      />

      {/* Complete Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("RiderHome")}
      >
        <Text style={styles.nextText}>Complete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#538cc6", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerText: { fontSize: 16, fontWeight: "600", marginLeft: 10, color: "#000000" },
  subHeaderText: { fontSize: 16, fontWeight: "600", marginBottom: 20, color: "#000" },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionLeft: { flexDirection: "row", alignItems: "center" },
  optionText: { fontSize: 15, color: "#000" },
  nextButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  nextText: { color: "#000000", fontSize: 16, fontWeight: "600" },
});
