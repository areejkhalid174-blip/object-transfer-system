import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const VehicelInformationr = ({ navigation }) => {
  const [vehicleImage, setVehicleImage] = useState(null);
  const [category, setCategory] = useState("");
  const [modelName, setModelName] = useState("");
  const [numberPlate, setNumberPlate] = useState("");
  const [color, setColor] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setVehicleImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    // Save vehicle details to Firebase for admin approval
    console.log({
      vehicleImage,
      category,
      modelName,
      numberPlate,
      color,
    });
    
    alert("Vehicle details submitted for admin approval!");
    navigation.navigate("SetMode"); // ✅ Next page navigation to step 3/3
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#538cc6" }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 20, paddingLeft: 20 }}>
          <Ionicons name="arrow-back" size={24} color="#000000" onPress={() => navigation.goBack()} />
          <Text
            style={{
              fontSize: 20,
              color: "#000000",
              textAlign: "center",
              fontWeight: "600",
              flex: 1,
            }}
          >
            Verification- 2/3
          </Text>
        </View>
        <Text
          style={{
            fontSize: 18,
            color: "#000000",
            textAlign: "center",
            paddingTop: 10,
            fontWeight: "600",
          }}
        >
          Vehicle Information
        </Text>

        {/* Vehicle Image Upload */}
        <TouchableOpacity
          onPress={pickImage}
          style={{
            borderColor: "#121213ff",
            borderWidth: 1,
            width: "80%",
            height: 150,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {vehicleImage ? (
            <Image source={{ uri: vehicleImage }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Ionicons name="camera" size={40} color="gray" />
              <Text style={{ color: "#000000", marginTop: 10 }}>Upload Vehicle Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Category */}
        <TextInput
          value={category}
          onChangeText={(e) => setCategory(e)}
          style={{
            borderColor: "#1d1d29ff",
            borderWidth: 1,
            width: "80%",
            height: 50,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 20,
            backgroundColor: "white",
            paddingLeft: 10,
          }}
          placeholder="Category"
        />

        {/* Model Name */}
        <TextInput
          value={modelName}
          onChangeText={(e) => setModelName(e)}
          style={{
            borderColor: "#0d0d1fff",
            borderWidth: 1,
            width: "80%",
            height: 50,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 20,
            backgroundColor: "white",
            paddingLeft: 10,
          }}
          placeholder="Model name"
        />

        {/* Number Plate */}
        <TextInput
          value={numberPlate}
          onChangeText={(e) => setNumberPlate(e)}
          style={{
            borderColor: "#0f0e0fff",
            borderWidth: 1,
            width: "80%",
            height: 50,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 20,
            backgroundColor: "white",
            paddingLeft: 10,
          }}
          placeholder="Registration Number"
          autoCapitalize="characters"
        />

        {/* Color */}
        <TextInput
          value={color}
          onChangeText={(e) => setColor(e)}
          style={{
            borderColor: "#111",
            borderWidth: 1,
            width: "80%",
            height: 50,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 20,
            backgroundColor: "white",
            paddingLeft: 10,
          }}
          placeholder="Vehicle Color"
        />

        {/* Terms */}
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <AntDesign name="checkcircle" size={24} color="#131316ff" />
          <Text
            style={{
              fontSize: 12,
              color: "#000000",
              textAlign: "center",
              marginTop: 5,
            }}
          >
            I accept the terms and privacy policy
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            width: "70%",
            height: 50,
            backgroundColor: "#FFFFFF",
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
            marginBottom: 20,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#000000",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            Submit for Approval
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 12,
            color: "#000000",
            textAlign: "center",
            paddingHorizontal: 20,
            marginBottom: 30,
          }}
        >
          Your vehicle details will be reviewed by admin. You will be notified once approved.
        </Text>
      </View>
    </ScrollView>
  );
};

export default VehicelInformationr;
