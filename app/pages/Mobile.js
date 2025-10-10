import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Mobile = ({ navigation }) => {
  const [phnNum, setPhnNum] = useState("");

  const goToNext = () => {
    
    console.log(phnNum);

    navigation.navigate("VerificationOtp");
  };
  return (
    <ScrollView style={{ Height: "100%" }}>
      <View style={{ display: "flex", flex: 1 }}>
        <Image
          style={{
            width: 100,
            height: 100,
            padding: 200,
            paddingTop: 30,
            justifyContent: "space-between",
            // backgroundColor:"blue",
          }}
          source={require("../../assets/images/car.png")}
        />

        <Text
          style={{
            fontSize: 20,
            color: "#2c5aa0",
            textAlign: "center",
            paddingTop: 60,
          }}
        >
          Enter Your Mobile Number
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "90%",
            alignSelf: "center",
          }}
        >
          <View
            style={{ flexDirection: "row", marginTop: 50, alignSelf: "center" }}
          >
            <Text
              style={{
                borderColor: "#2c5aa0",
                borderWidth: 1,
                width: "18%",
                height: 60,
                paddingVertical: 20,
                alignSelf: "center",
                borderRadius: 10,
                marginTop: 20,
                backgroundColor: "white",
                marginLeft: 20,
                marginTop: "auto",
                marginBottom: "auto",
              }}
            >
              +92
            </Text>

            <TextInput
             onChangeText={(e)=>setPhnNum(e) }

              style={{
                borderColor: "#2c5aa0",
                borderWidth: 1,
                width: 200,
                height: 60,
                paddingVertical: 20,
                alignSelf: "center",
                borderRadius: 10,
                backgroundColor: "white",
                marginLeft: 40,
              }}
              placeholder="Phn num"
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={goToNext}
          style={{
            width: "90%",
            height: 60,
            backgroundColor: "#131418ff",
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 70,
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

export default Mobile;
