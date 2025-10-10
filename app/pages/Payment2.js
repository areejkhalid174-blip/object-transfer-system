import React from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const Payment2 = ({ navigation }) => {
  const goToNext = () => {
    navigation.navigate("VehicelInformationr");
  };
  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          color: "#2c5aa0",
          textAlign: "center",
          paddingTop: 10,
        }}
      >
        Setup Payment Option
      </Text>

      <TextInput
        style={{
          borderColor: "#0d0d0eff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="User ID"
      />
      <TextInput
        style={{
          borderColor: "#1f2324ff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Order ID"
      />
      <TextInput
        style={{
          borderColor: "#191b1bff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Price"
      />
      <TextInput
        style={{
          borderColor: "#0b0c0cff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Cash on dilivery"
      />
      <View>
        <Text
          style={{
            fontSize: 12,
            color: "#2c5aa0",
            textAlign: "center",
            paddingTop: 20,
          }}
        >
          I accept the terms and privacy policy
        </Text>
      </View>
      <AntDesign name="checkcircle" size={24} color="#0a0a0aff" />
      <TouchableOpacity
        onPress={goToNext}
        style={{
          width: "80%",
          height: 50,
          backgroundColor: "#1c2122ff",
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
  );
};

export default Payment2;
