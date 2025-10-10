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
import * as ImagePicker from "expo-image-picker";
import DatePicker from "react-native-date-picker";

export default function Verification({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const onDateChange = (selectedDate) => {
    setDob(selectedDate);
    setShowDatePicker(false);
  };

  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#000000" />
        <Text style={styles.headerText}>Verification- 1/3</Text>
      </View>

      {/* Profile Image Picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person" size={40} color="gray" />
        )}
      </TouchableOpacity>
      <Text style={styles.imageText}>Click to Pick Profile Picture</Text>

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
      <TouchableOpacity 
        style={styles.rowDob}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dobLabel}>DOB</Text>
        <Text style={styles.dobValue}>{formatDate(dob)}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={showDatePicker}
        date={dob}
        mode="date"
        onConfirm={onDateChange}
        onCancel={() => setShowDatePicker(false)}
        maximumDate={new Date()}
      />

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
        onPress={() => navigation.navigate("VehicelInformationr")}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#538cc6", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerText: { fontSize: 16, fontWeight: "600", marginLeft: 10, color: "#000000" },
  imagePicker: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#e0e0e0",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  imageText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    color: "#000000",
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  inputSmall: {
    flex: 1,
    backgroundColor: "white",
    borderColor: "#111",
    borderWidth: 1,
    margin: 5,
    borderRadius: 10,
    padding: 12,
  },
  rowDob: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dobLabel: { fontSize: 14, color: "#000000" },
  dobValue: { fontSize: 14, color: "#000000" },
  input: {
    backgroundColor: "white",
    borderColor: "#111",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
    width: "95%",
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#FFFFFF",
    width: "50%",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 30,
  },
  buttonText: { color: "#000000", fontSize: 20, fontWeight: "600", textAlign: "center" },
});
