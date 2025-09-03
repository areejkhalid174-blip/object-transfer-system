import React from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const Register = ({ navigation }) => {
  const goToNext = () => {
    navigation.navigate("Package");
  };
  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          color: "black",
          textAlign: "center",
          paddingTop: 10,
        }}
      >
        Order detail
      </Text>

      <TextInput
        style={{
          borderColor: "#0e1314ff",
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
          borderColor: "#191c1dff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Order Name"
      />
      <TextInput
        style={{
          borderColor: "#1f2527ff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Weight By Kg"
      />
      <TextInput
        style={{
          borderColor: "#0b1113ff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Quantity"
      />
      <View>
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
      </View>
      <AntDesign name="checkcircle" size={24} color="#131414ff" />
      <TouchableOpacity
        onPress={goToNext}
        style={{
          width: "50%",
          height: 50,
          backgroundColor: "#141616ff",
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

export default Register;
