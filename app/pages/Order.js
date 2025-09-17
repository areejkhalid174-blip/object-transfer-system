import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Register = ({ navigation, route }) => {
  const id = route.params.id;
  const [UserId, setUserId] = useState("");
  const [OrderName, setOrderName] = useState("");
  const [WeightByKg, setWeightByKg] = useState("");
  const [Quantity, setQuantity] = useState("");

  const goToContinue = () => {
    console.log(UserId, OrderName, WeightByKg, Quantity);

    navigation.navigate("PackageDetail", { OrderName, WeightByKg, Quantity, id });
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
        onChangeText={(e) => setUserId(e)}
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
        placeholder="UserId"
      />
      <TextInput
        onChangeText={(e) => setOrderName(e)}
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
        onChangeText={(e) => setWeightByKg(e)}
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
        onChangeText={(e) => setQuantity(e)}
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
        onPress={goToContinue}
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
