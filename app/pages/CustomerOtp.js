import { Keyboard, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

const CustomerOtp = ({ navigation }) => {
  const goToNext = () => {
    navigation.navigate("Login");
  };
  return (
    <ScrollView style={{ height: "100%" }}>
      <View
        style={{
          display: "flex",
          flex: 1,
          width: "90%",
          backgroundColor: "#d5d2ddff",
        }}
      >
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>
          {" "}
          Verify your Phone Number
        </Text>

        <Text style={{ color: "#2c5aa0", textAlign: "center" }}>
          Enter Your OTP here
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            // backgroundColor: "green",

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <View
            style={{
              width: 40,
              backgroundColor: "grey",
              height: 40,
              borderRadius: 20,
              margin: 10,
              borderColor: "red",
            }}
          ></View>

          <View
            style={{
              width: 40,
              backgroundColor: "grey",
              height: 40,
              margin: 10,
              borderRadius: 20,
            }}
          ></View>

          <View
            style={{
              width: 40,
              backgroundColor: "grey",
              height: 40,
              margin: 10,
              borderRadius: 20,
              borderColor: "#68181cff",
            }}
          ></View>

          <View
            style={{
              width: 40,
              backgroundColor: "grey",
              height: 40,
              margin: 10,
              borderRadius: 20,
            }}
          ></View> */}

          <OtpInput
            numberOfDigits={6}
            focusColor="green"
            focusStickBlinkingDuration={500}
            onTextChange={(text) => console.log(text)}
            onFilled={(text) => Keyboard.dismiss()}
            textInputProps={{
              accessibilityLabel: "One-Time Password",
            }}
            theme={{
              containerStyle: {
                marginTop: 50,
                alignItems: "center",
                justifyContent: "center",
              },
              pinCodeContainerStyle: {
                width: 50,
                height: 50,
                margin: 5,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: "#1e1d20ff", // Colors.black
                alignItems: "center",
                justifyContent: "center",
              },
              pinCodeTextStyle: {
                fontSize: 18,
                color: "#95969cff", // Colors.black
              },
              focusStickStyle: {
                height: 4,
                width: 50,
                backgroundColor: "#131314ff", // Colors.pacepal_main_green
              },
              focusedPinCodeContainerStyle: {
                borderColor: "#1f1f24ff", // Colors.pacepal_main_green
              },
            }}
          />
        </View>
        <View style={{ display: "flex", alignItems: "center" }}>
          <Text style={{ color: "grey" }}> Didn't receive any code</Text>

          <Text style={{ color: "#0d0d16ff", fontWeight: "bold" }}>
            Resend New Code
          </Text>
          <Text style={{ color: "grey" }}> Didn't receive any code</Text>

          <Text style={{ color: "#0d0d16ff", fontWeight: "bold" }}>
            Login with Password
          </Text>
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

export default CustomerOtp;
