import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { addData, uploadImageToCloudinary } from "../Helper/firebaseHelper";

const VehicelInformationr = ({ navigation }) => {
  const [vehicleImage, setVehicleImage] = useState(null);
  const [category, setCategory] = useState("");
  const [modelName, setModelName] = useState("");
  const [numberPlate, setNumberPlate] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Get rider information from Redux
  const user = useSelector((state) => state.home.user);

  console.log("User from Redux:", user);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setVehicleImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    // Validation
    if (!vehicleImage) {
      Alert.alert("Error", "Please upload vehicle image");
      return;
    }
    if (!category.trim()) {
      Alert.alert("Error", "Please enter vehicle category");
      return;
    }
    if (!modelName.trim()) {
      Alert.alert("Error", "Please enter model name");
      return;
    }
    if (!numberPlate.trim()) {
      Alert.alert("Error", "Please enter registration number");
      return;
    }
    if (!color.trim()) {
      Alert.alert("Error", "Please enter vehicle color");
      return;
    }

    setLoading(true);
    try {
      const riderId = user?.uid;
      const riderEmail = user?.email;
      const riderName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

      console.log("Rider ID:", riderId);
      console.log("Rider Email:", riderEmail);
      console.log("Rider Name:", riderName);

      if (!riderId) {
        Alert.alert("Error", "User not found. Please login again.");
        setLoading(false);
        return;
      }

      console.log("Starting image upload to Cloudinary...");
      // Upload image to Cloudinary
      const uploadedImageUrl = await uploadImageToCloudinary(vehicleImage);
      console.log("Image uploaded successfully:", uploadedImageUrl);

      // Save vehicle details to Firebase with rider ID
      const vehicleData = {
        riderId: riderId,
        riderEmail: riderEmail,
        riderName: riderName,
        vehicleImage: uploadedImageUrl,
        category: category,
        modelName: modelName,
        numberPlate: numberPlate.toUpperCase(),
        color: color,
        status: "pending", // pending, approved, rejected
        createdAt: new Date().toISOString(),
      };

      console.log("Saving vehicle data to Firebase:", vehicleData);
      const vehicleId = await addData("vehicles", vehicleData);
      console.log("Vehicle saved successfully with ID:", vehicleId);
      
      Alert.alert(
        "Success",
        "Vehicle details submitted for admin approval!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("SetMode")
          }
        ]
      );
    } catch (error) {
      console.error("Error submitting vehicle:", error);
      console.error("Error details:", error.message);
      Alert.alert("Error", `Failed to submit vehicle details: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
            Verification- 1/2
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
          disabled={loading}
          style={{
            width: "70%",
            height: 50,
            backgroundColor: loading ? "#CCCCCC" : "#FFFFFF",
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
            marginBottom: 20,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {loading && <ActivityIndicator size="small" color="#000000" style={{ marginRight: 10 }} />}
          <Text
            style={{
              fontSize: 18,
              color: "#000000",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {loading ? "Submitting..." : "Submit for Approval"}
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
