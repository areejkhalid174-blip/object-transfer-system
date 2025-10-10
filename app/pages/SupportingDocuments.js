import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function SupportingDocuments({ navigation }) {
  const [license, setLicense] = useState("");

  const goToNext = () => {
    console.log("License:", license);
    navigation.navigate("RiderVerification"); // ✅ Navigate to Setting page
  };

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Supporting Documents</Text>

      {/* License Section */}
      <Text style={styles.subtitle}>Upload your license photo</Text>
      <TextInput
        placeholder="Enter license number"
        style={styles.input}
        value={license}
        onChangeText={setLicense}
      />

      <View style={styles.row}>
        <TouchableOpacity style={styles.uploadBox}>
          <Text style={styles.plus}>+</Text>
          <Text>Front</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBox}>
          <Text style={styles.plus}>+</Text>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Billbook Section */}
      <Text style={styles.subtitle}>Upload your billbook photo</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.uploadBox}>
          <Text style={styles.plus}>+</Text>
          <Text>Page 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBox}>
          <Text style={styles.plus}>+</Text>
          <Text>Page 2</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.uploadBox}>
          <Text style={styles.plus}>+</Text>
          <Text>Page 3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBox}>
          <Text style={styles.plus}>+</Text>
          <Text>Page 4</Text>
        </TouchableOpacity>
      </View>

      {/* Go to Setting Page Button */}
      <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={goToNext}>
        <Text style={styles.buttonText}>Go to RiderVerification</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  subtitle: { fontSize: 16, fontWeight: "600", marginTop: 10, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  uploadBox: {
    flex: 1,
    height: 100,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  plus: { fontSize: 30, fontWeight: "bold", marginBottom: 5 },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#000000", fontSize: 16, fontWeight: "600" },
});
