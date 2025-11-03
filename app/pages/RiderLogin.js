import { useState } from "react";
import React from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useDispatch } from "react-redux";
import { loginWithFB } from "../Helper/firebaseHelper";
import { setRole, setUser } from "../redux/Slices/HomeDataSlice";
import Colors from "../constants/colors";

const RiderLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const goToContinue = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const user = await loginWithFB(email, password);
      
      if (user) {
        dispatch(setUser(user));
        dispatch(setRole(user.role));
        
        // Navigate to splash screen with user role
        navigation.navigate("SplashScreen", { userRole: user.role });
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: Colors.background }}>
      <Text
        style={{
          fontSize: 20,
          color: Colors.textSecondary,
          textAlign: "center",
          paddingTop: 10,
          fontWeight: "bold",
        }}
      >
        Login
      </Text>

      <TextInput
        value={email}
        onChangeText={(e) => setEmail(e)}
        style={{
          borderColor: Colors.inputBorder,
          borderWidth: 2,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          backgroundColor: Colors.inputBackground,
          paddingLeft: 10,
        }}
        placeholder="Email"
      />
      <TextInput
        value={password}
        onChangeText={(e) => setPassword(e)}
        secureTextEntry={true}
        style={{
          borderColor: Colors.inputBorder,
          borderWidth: 2,
          width: "80%",
          height: 50,
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 20,
          backgroundColor: Colors.inputBackground,
          paddingLeft: 10,
        }}
        placeholder="Password"
      />
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
        <AntDesign name="checkcircle" size={24} color={Colors.textSecondary} />
        <Text
          style={{
            fontSize: 16,
            color: Colors.textSecondary,
            marginLeft: 10,
          }}
        >
          I accept the terms and privacy policy
        </Text>
      </View>
      <TouchableOpacity
        onPress={goToContinue}
        style={{
          width: "50%",
          height: 50,
          backgroundColor: "#FFFFFF",
          alignSelf: "center",
          borderRadius: 10,
          marginTop: 40,
          borderWidth: 2,
          borderColor: Colors.buttonPrimary,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: Colors.buttonText,
            textAlign: "center",
            paddingTop: 10,
          }}
        >
          {loading ? "Logging in..." : "Continue"}
        </Text>
      </TouchableOpacity>
      <View style={{ marginTop: 30 }}>
        <TouchableOpacity onPress={() => navigation.navigate("RiderSignup")}>
          <Text
            style={{
              fontSize: 18,
              color: Colors.textSecondary,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            Don't have an account? <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity onPress={() => navigation.navigate("CustomerLogin")}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.textSecondary,
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            Are you a Customer? <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>Login as Customer</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RiderLogin;
