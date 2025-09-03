import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // for icons (expo install @expo/vector-icons)
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function RiderHistory() {
  const rides = [
    {
      id: 1,
      location: "G-11, Islamabad, Pakistan",
      place: "Hill View Hotel",
      price: "Rs 200",
      date: "Jan 8, 2022 - 3:33",
    },
    {
      id: 2,
      location: "G-11, Islamabad, Pakistan",
      place: "Hill View Hotel",
      price: "Rs 180",
      date: "Jan 8, 2022 - 2:33",
    },
  
  ];

  return (
    <ScrollView style={{height:"100%"}}>
      <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={{ fontSize: 30, fontWeight: "600", marginLeft: 100 }}>
            Rider History
          </Text>
        </View>

        {/* Ride History List */}
        <ScrollView>
          {rides.map((ride) => (
            <View
              key={ride.id}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#181515ff",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 16, color: "#000" }}>

                 <Entypo name="location-pin" size={24} color="black" />
                   {ride.location}
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#000" }}
                >
                  {ride.price}
                </Text>
              </View>
              <Text style={{ fontSize: 14, color: "#0f0e0eff", marginTop: 10,marginLeft:10, }}>

               <FontAwesome5 name="search-location" size={20} color="black" />
                {ride.place}
              </Text>
              <Text style={{ fontSize: 14, color: "#0e0b0bff", marginTop: 10,marginLeft:10, }}>
                {ride.date}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingVertical: 12,
            marginTop:200,
            borderTopWidth: 1,
            borderTopColor: "#1a1717ff",
          }}
        >
          <TouchableOpacity style={{ alignItems: "center" }}>
            <Ionicons name="home-outline" size={22} color="black" />
            <Text style={{ fontSize: 12, marginTop: 4 }}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center" }}>
            <Ionicons name="time-outline" size={22} color="black" />
            <Text style={{ fontSize: 12, marginTop: 4 }}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: "center" }}>
            <Ionicons name="person-outline" size={22} color="black" />
            <Text style={{ fontSize: 12, marginTop: 4 }}>Account</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ScrollView>
  );
}
