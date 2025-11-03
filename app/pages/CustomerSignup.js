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
    // Validation
    if (!firstName.trim()) {
      alert("Please enter your first name");
      return;
    }
    if (!lastName.trim()) {
      alert("Please enter your last name");
      return;
    }
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }
    if (!password.trim()) {
      alert("Please enter a password");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const user = await handleSignUp(
        email,
        password,
        { role: "Customer", firstName, lastName }
      );

      if (user?.uid) {
        dispatch(setRole("Customer"));
        dispatch(setUser(user));
        navigation.replace("CustomerHome");
      } else {
        alert("Error in sign up");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  }



  return (
    <ScrollView style={{ height: "100%", backgroundColor: "#538cc6" }}>
      <View style={{ flex: 1, display: "flex", backgroundColor: "#538cc6", paddingBottom: 20 }}>
        <Text
          style={{
            fontSize: 30,
            color: "#FFFFFF",
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
          secureTextEntry={true}
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
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
          {firstName && lastName && email && password && password.length >= 6 ? (
            <AntDesign name="checkcircle" size={24} color="#4CAF50" />
          ) : (
            <AntDesign name="checkcircleo" size={24} color="#999999" />
          )}
          <Text
            style={{
              fontSize: 12,
              color: "#FFFFFF",
              marginLeft: 10,
            }}
          >
            I accept the terms and privacy policy
          </Text>
        </View>
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
        <View style={{ marginTop: 30, marginBottom: 30 }}>
          <TouchableOpacity onPress={() => navigation.navigate("CustomerLogin")}>
            <Text
              style={{
                fontSize: 18,
                color: "#FFFFFF",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Already have an account? <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
