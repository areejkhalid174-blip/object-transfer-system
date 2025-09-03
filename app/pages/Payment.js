import React from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const Register = ({ navigation }) => {
  const goToPayment = () => {
    navigation.navigate("Payment");
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
        Where the package being deliverd to?
      </Text>

      <TextInput
        style={{
          borderColor: "#141616ff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Enter Postcode"
      />
      <TextInput
        style={{
          borderColor: "#121414ff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Town"
      />
      <TextInput
        style={{
          borderColor: "#131516ff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Street"
      />
      <TextInput
        style={{
          borderColor: "#121414ff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Reciever Phonenum"
      />
      <TextInput
        style={{
          borderColor: "#0c1011ff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Name of Reciever"
      />

      <view>
        <Text
          style={{
            fontSize: 20,
            color: "black",
            textAlign: "center",
            paddingTop: 10,
          }}
        >
          Pickup location
        </Text>
        <TextInput
          style={{
            borderColor: "#182222ff",
            borderWidth: 1,
            width: "80%",
            height: 50,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
            backgroundColor: "white",
            paddingLeft: 10,
          }}
          placeholder="Enter Postcode"
        />
        <TextInput
          style={{
            borderColor: "#252b2cff",
            borderWidth: 1,
            width: "80%",
            height: 50,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
            backgroundColor: "white",
            paddingLeft: 10,
          }}
          placeholder="Town"
        />
        <TextInput
          style={{
            borderColor: "#121c1fff",
            borderWidth: 1,
            width: "80%",
            height: 50,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
            backgroundColor: "white",
            paddingLeft: 10,
          }}
          placeholder="Street"
        />
      </view>
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
      <AntDesign name="checkcircle" size={24} color="#0b0c0cff" />
      <TouchableOpacity
        onPress={goToPayment}
        style={{
          width: "50%",
          height: 50,
          backgroundColor: "#0d0f0fff",
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
