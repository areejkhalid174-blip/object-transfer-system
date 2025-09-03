import { useState } from "react";
import React from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const CustomerLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const goToContinue = () => {
    console.log(email,password);

    navigation.navigate("RiderHome");
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
        Create Account
      </Text>

      <TextInput
        onChangeText={(e) => setEmail(e)}
        style={{
          borderColor: "#171a1bff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Email"
      />
      <TextInput
        onChangeText={(e) => setPassword(e)}
        style={{
          borderColor: "#0b0b0cff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Password"
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
      <AntDesign name="checkcircle" size={24} color="#131314ff" />
      <TouchableOpacity
        onPress={goToContinue}
        style={{
          width: "50%",
          height: 50,
          backgroundColor: "#161618ff",
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
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomerLogin;
