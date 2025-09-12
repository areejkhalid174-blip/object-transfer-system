import { useState } from "react";

import AntDesign from "@expo/vector-icons/AntDesign";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useDispatch } from "react-redux";
import { handleSignUp } from "../Helper/firebaseHelper";
import { setRole, setUser } from "../redux/Slices/HomeDataSlice";



const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();


  const goToRigester = async () => {

    const user = await handleSignUp(
      email,
      password,
      { role: "Customer", firstName, lastName }
    )

    if (user?.uid) {
      dispatch(setRole("Customer"))
      dispatch(setUser(user))
    } else {
      alert("Error in sign up")
    }

  }



  return (
    <ScrollView style={{ Height: "100%" }}>
      <View style={{ flex: 1, display: "flex" }}>
        <Text
          style={{
            fontSize: 30,
            color: "black",
            textAlign: "center",
            paddingTop: 10,
            fontWeight: 600,
          }}
        >
          Sign up
        </Text>
        <TextInput
          onChangeText={(e) => setFirstName(e)}
          style={{
            borderColor: "#18181aff",
            borderWidth: 1,
            width: "80%",
            height: 50,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
            backgroundColor: "white",
            paddingLeft: 10,
          }}
          placeholder="First Name"
        />
        <TextInput
          onChangeText={(e) => setLastName(e)}
          style={{
            borderColor: "#1a1a1dff",
            borderWidth: 1,
            width: "80%",
            height: 50,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
            backgroundColor: "white",
            paddingLeft: 10,
          }}
          placeholder="Last Name"
        />

        <TextInput
          onChangeText={(e) => setEmail(e)}
          style={{
            borderColor: "#111113ff",
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
            borderColor: "#1c1b1fff",
            borderWidth: 1,
            width: "80%",
            height: 50,
            alignSelf: "center",
            borderRadius: 10,
            marginTop: 40,
            backgroundColor: "white",
            paddingLeft: 10,
          }}
          placeholder="password"
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
        <AntDesign name="checkcircle" size={24} color="#161518ff" />
        <TouchableOpacity
          onPress={goToRigester}
          style={{
            width: "50%",
            height: 50,
            backgroundColor: "#0e0d0fff",
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
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUp;
