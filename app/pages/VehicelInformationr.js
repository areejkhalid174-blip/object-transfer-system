import { useState } from "react";
import React from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ScrollView } from "react-native-web";

const VehicelInformationr = ({ navigation }) => {
  const [uploadVehicelImage, setuploadVehicelImage] = useState("");
  const [category, setCategory] = useState("");
  const [modelName, setModelName] = useState("");
  const [numberPlate, setNumberPlate] = useState("");

  const goToNext = () => {
    console.log(uploadVehicelImage,category, modelName,numberPlate);

    navigation.navigate("RiderVerification");
  };

  return (
    <ScrollView style={{ Height: "100%" }}>
      <View style={{ flex: 1, display: "flex" }}>
        <View>
          <Text
            style={{
              fontSize: 20,
              color: "black",
              textAlign: "center",
              paddingTop: 10,
            }}
          >
            Vehicel Information
          </Text>
          <TextInput
           onChangeText={(e)=>setuploadVehicelImage(e) }

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
            placeholder="Upload vehicel Image"
          />
          <TextInput
          onChangeText={(e)=>setCategory(e) }
            style={{
              borderColor: "#1d1d29ff",
              borderWidth: 1,
              width: "80%",
              height: 50,
              alignSelf: "center",
              borderRadius: 10,
              marginTop: 40,
              backgroundColor: "white",
              paddingLeft: 10,
            }}
            placeholder="Category"
          />
          <TextInput
          onChangeText={(e)=>setModelName(e) }
            style={{
              borderColor: "#0d0d1fff",
              borderWidth: 1,
              width: "80%",
              height: 50,
              alignSelf: "center",
              borderRadius: 10,
              marginTop: 40,
              backgroundColor: "white",
              paddingLeft: 10,
            }}
            placeholder="Model name"
          />
          <TextInput
          onChangeText={(e)=>setNumberPlate(e) }
            style={{
              borderColor: "#0f0e0fff",
              borderWidth: 1,
              width: "80%",
              height: 50,
              alignSelf: "center",
              borderRadius: 10,
              marginTop: 40,
              backgroundColor: "white",
              paddingLeft: 10,
            }}
            placeholder="Number plate"
          />
        </View>
        <Text
          style={{
            fontSize: 12,
            color: "black",
            textAlign: "center",
            paddingTop: 20,
          }}
        >
          I accept the terms and privacy policy
        </Text>

        <AntDesign name="checkcircle" size={24} color="#131316ff" />
        <TouchableOpacity
          onPress={goToNext}
          style={{
            width: "50%",
            height: 50,
            backgroundColor: "#09090aff",
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "white",
              textAlign: "center",
              paddingTop: 10,
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
