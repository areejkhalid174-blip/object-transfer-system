import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Register = ({ navigation, route }) => {
  const id = route.params.id;
  const [OrderName, setOrderName] = useState("");
  const [WeightByKg, setWeightByKg] = useState("");
  const [Quantity, setQuantity] = useState("");
 const [PackageDetail , setPackageDetail] = useState("");
  const [AddDetail , setAddDetail] = useState("")

  const goToContinue = () => {
    console.log( OrderName, WeightByKg, Quantity,PackageDetail, AddDetail);

    navigation.navigate("Payment", { OrderName, WeightByKg, Quantity,PackageDetail, AddDetail});
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
        Order detail
      </Text>
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
        
        <TextInput
         onChangeText={(e) => setPackageDetail(e)}
        style={{
          borderColor: "#0a0c0cff",
          borderWidth: 1,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="What is in the Package ?"
      />
      <TextInput
       onChangeText={(e) => setAddDetail(e)}
        style={{
          borderColor: "#0e0f0fff",
          borderWidth: 1,
          width: "80%",
          height: 150,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: "white",
          paddingLeft: 10,
        }}
        placeholder="Additional Note (optional)"
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
      <AntDesign name="checkcircle" size={24} color="#131414ff" />
      <TouchableOpacity
        onPress={goToContinue}
        style={{
          width: "50%",
          height: 50,
          backgroundColor: "#FFFFFF",
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "#000000",
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
