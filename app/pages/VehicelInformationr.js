import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const VehicelInformationr = ({ navigation }) => {
  const [uploadVehicelImage, setUploadVehicelImage] = useState("");
  const [category, setCategory] = useState("");
  const [modelName, setModelName] = useState("");
  const [numberPlate, setNumberPlate] = useState("");

  const goToNext = () => {
    console.log(uploadVehicelImage, category, modelName, numberPlate);
    navigation.navigate("SupportingDocuments"); // ✅ Next page navigation
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <View style={{ flex: 1 }}>
        {/* Heading */}
        <Text
          style={{
            fontSize: 20,
            color: "black",
            textAlign: "center",
            paddingTop: 20,
            fontWeight: "600",
          }}
        >
          Vehicle Information
        </Text>

        {/* Vehicle Image Upload */}
        <TextInput
          value={uploadVehicelImage}
          onChangeText={(e) => setUploadVehicelImage(e)}
          style={{
            borderColor: "#121213ff",
            borderWidth: 1,
            width: "80%",
            height: 150,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
            backgroundColor: "white",
            paddingLeft: 10,
          }}
          placeholder="Upload vehicle image (URL or text)"
        />

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
          placeholder="Number plate"
        />

        {/* Terms */}
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <AntDesign name="checkcircle" size={24} color="#131316ff" />
          <Text
            style={{
              fontSize: 12,
              color: "black",
              textAlign: "center",
              marginTop: 5,
            }}
          >
            I accept the terms and privacy policy
          </Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={goToNext}
          style={{
            width: "50%",
            height: 50,
            backgroundColor: "#09090aff",
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "white",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default VehicelInformationr;
