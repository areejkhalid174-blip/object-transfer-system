import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { addData } from "../Helper/firebaseHelper";

const Register = ({ navigation, route }) => {
  const {id, OrderName, WeightByKg, Quantity, packageDetail, addDetail} = route.params;
  const [EnterPostcode, setEnterPostcode] = useState("");
  const [Town, setTown] = useState("");
  const [Street, setStreet] = useState("");
  const [RecieverPhonenum, setRecieverPhonenum] = useState("");
  const [NameofReciever, setNameofReciever] = useState("");

  const goToPayment = async () => {
    console.log(
      EnterPostcode,
      Town,
      Street,
      RecieverPhonenum,
      NameofReciever
    );
    
    await addData("orders", {
      OrderName,
      WeightByKg,
      Quantity,
      cat:id,
      packageDetail,
      addDetail,
    });

    navigation.navigate("CustomerHome");
  };
  return (
    <ScrollView>
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
      onChangeText={(e) => setEnterPostcode(e)}
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
      onChangeText={(e) => setTown(e)}
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
      onChangeText={(e) => setStreet(e)}
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
      onChangeText={(e) => setRecieverPhonenum(e)}
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
      onChangeText={(e) => setNameofReciever(e)}
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
      {/* <view> */}
      <TextInput
      onChangeText={(e) => setEnterPostcode(e)}
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
      onChangeText={(e) => setLastName(e)}
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
      onChangeText={(e) => setLastName(e)}
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
      {/* </view> */}
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
    </ScrollView>
  );
};

export default Register;
