import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Verification({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.headerText}>Verification- 1/3</Text>
      </View>

      {/* Profile Image Picker */}
      <TouchableOpacity style={styles.imagePicker}>
        <Ionicons name="person" size={40} color="gray" />
      </TouchableOpacity>
      <Text style={styles.imageText}>Click to Pick</Text>

      {/* Name Row */}
      <View style={styles.row}>
        <TextInput
          placeholder="Firstname"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.inputSmall}
        />
        <TextInput
          placeholder="Lastname"
          value={lastName}
          onChangeText={setLastName}
          style={styles.inputSmall}
        />
      </View>

      {/* DOB */}
      <View style={styles.rowDob}>
        <Text style={styles.dobLabel}>DOB</Text>
        <Text style={styles.dobValue}>10-26-2016</Text>
      </View>

      {/* Address */}
      <TextInput
        placeholder="Permanent Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      {/* Next Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SetMode")}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerText: { fontSize: 16, fontWeight: "600", marginLeft: 10 },
  imagePicker: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#e0e0e0",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  imageText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    color: "gray",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputSmall: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    margin: 5,
    borderRadius: 6,
    padding: 12,
  },
  rowDob: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dobLabel: { fontSize: 14, color: "#000" },
  dobValue: { fontSize: 14, color: "#000" },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    padding: 12,
    marginTop: 15,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
