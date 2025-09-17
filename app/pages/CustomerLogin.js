import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { loginWithFB } from "../Helper/firebaseHelper";
import { setRole, setUser } from "../redux/Slices/HomeDataSlice";



const CustomerLogin = ({ navigation }) => {
  const [email, setEmail] = useState("areeej786@gmail.com");
  const [password, setPassword] = useState("areeej1122");

  const dispatch = useDispatch()

  const goToContinue = async () => {
      const user = await loginWithFB(email, password)

      dispatch(setUser(user))
      dispatch(setRole("Customer"))

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
        value={email}
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
        value={password}
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
            fontSize: 20,
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
      <View>
        <TouchableOpacity onPress={()=>navigation.navigate("CustomerSignup")}>
          <Text
            style={{
              fontSize: 25,
              color: "black",
              textAlign: "center",
              paddingTop: 50,
            }}
          >
            don't have an account "SignUp"
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomerLogin;
