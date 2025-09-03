import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function RiderVerification() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  console.log(firstName,lastName ,dob,address)

  return (
    <View style={styles.container}>
      
      {/* Title */}
      <Text style={styles.title}>Verification - 1/3</Text>

      <View style={styles.row}>
        <TextInput
          onChangeText={(e)=>setFirstName(e) }
          placeholder="Firstname"
          style={[styles.input, { flex: 1, marginRight: 5 }]}
         
        />
        <TextInput
          onChangeText={(e)=>setLastName(e) }

          placeholder="Lastname"
          style={[styles.input, { flex: 1, marginLeft: 5 }]}
          // value={lastName}
          // onChangeText={setLastName}
        />
      </View>

      {/* Date of Birth */}
      <View style={styles.row}>
        <TextInput
          onChangeText={(e)=>setDob(e) }

          placeholder="DOB"
          style={[styles.input, { flex: 1, marginRight: 5 }]}
          
        />
        <TextInput
          placeholder="10-26-2016"
          style={[styles.input, { flex: 1, marginLeft: 5 }]}
          editable={false}
        />
      </View>

      {/* Address */}
      <TextInput
        onChangeText={(e)=>setAddress(e) }

        placeholder=" Address"
        style={styles.input}
        
      />

      {/* Next Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 20 },
  avatar: { alignItems: "center", marginBottom: 20 },
  avatarText: { color: "#777", marginTop: 5 },
  row: { flexDirection: "row", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
