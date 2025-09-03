import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeRider() {
  const goToSignout = () => {
    navigation.navigate("Signup");
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      {/* Header */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 15 }}>
          Account
        </Text>
      </View>

      {/* Profile Info */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Ionicons name="person-circle-outline" size={80} color="#0a0a0aff" />
        <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 8 }}>
          Rider Name
        </Text>
        <Text style={{ fontSize: 14, color: "#555", marginTop: 2 }}>
          +977 98400316029
        </Text>
        <Text style={{ fontSize: 14, color: "#555", marginTop: 2 }}>
          ⭐ 5.0
        </Text>
      </View>

      {/* Balance */}
      <TouchableOpacity
        style={{
          backgroundColor: "#f5f5f5",
          padding: 15,
          borderRadius: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Roadway Cash</Text>
        <Text style={{ fontSize: 16, color: "#000" }}>Npr. 3,000</Text>
      </TouchableOpacity>

      {/* Menu Options */}
      <ScrollView>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
          }}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color="#000"
            style={{ marginRight: 10 }}
          />
          <Text style={{ fontSize: 16, color: "#000", flex: 1 }}>
            Personal details
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
          }}
        >
          <Ionicons
            name="settings-outline"
            size={20}
            color="#000"
            style={{ marginRight: 10 }}
          />
          <Text style={{ fontSize: 16, color: "#000", flex: 1 }}>
            Settings and privacy
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
          }}
        >
          <Ionicons
            name="time-outline"
            size={20}
            color="#000"
            style={{ marginRight: 10 }}
          />
          <Text style={{ fontSize: 16, color: "#000", flex: 1 }}>
            Trips details
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>
      </ScrollView>

      {/* Signout Button */}
      <TouchableOpacity
        onPress={goToSignout}
        style={{
          backgroundColor: "#000",
          paddingVertical: 15,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Signout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
