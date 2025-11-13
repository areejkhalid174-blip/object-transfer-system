import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";
import { handleSignUp } from "../Helper/firebaseHelper";
import { setRole, setUser } from "../redux/Slices/HomeDataSlice";

const RiderSignup = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cnic, setCnic] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);

  const dispatch = useDispatch();

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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
    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }
    if (!cnic.trim()) {
      alert("Please enter your CNIC number");
      return;
    }
    if (!permanentAddress.trim()) {
      alert("Please enter your permanent address");
      return;
    }
    if (!cnicFront) {
      alert("Please upload CNIC front image");
      return;
    }
    if (!cnicBack) {
      alert("Please upload CNIC back image");
      return;
    }

    try {
      const result = await handleSignUp(email, password, {
        role: "Rider",
        firstName,
        lastName,
        phone,
        cnic,
        permanentAddress,
        cnicFront,
        cnicBack,
        status: "pending",
        earning: 0,
        ratting: 0,
      });

      if (result?.success) {
        dispatch(setRole("Rider"));
        dispatch(setUser(result.data));
        navigation.replace("VehicelInformationr"); // Navigate directly to vehicle information step
      } else {
        alert(result?.error || "Error in sign up");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <ScrollView style={{ Height: "100%", backgroundColor: "#538cc6" }}>
      <View style={{ flex: 1, display: "flex" }}>
        <Text
          style={{
            fontSize: 30,
            color: "#000000",
            textAlign: "center",
            paddingTop: 10,
            fontWeight: 600,
          }}
        >
          Sign up
        </Text>

        {/* First Name */}
        <TextInput
          onChangeText={(e) => setFirstName(e)}
          style={styles.input}
          placeholder="First Name"
        />

        {/* Last Name */}
        <TextInput
          onChangeText={(e) => setLastName(e)}
          style={styles.input}
          placeholder="Last Name"
        />

        {/* Email */}
        <TextInput
          onChangeText={(e) => setEmail(e)}
          style={styles.input}
          placeholder="Email"
        />

        {/* Password */}
        <TextInput
          onChangeText={(e) => setPassword(e)}
          style={styles.input}
          placeholder="Password"
          secureTextEntry
        />

        {/* Phone Number */}
        <TextInput
          onChangeText={(e) => setPhone(e)}
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />

        {/* CNIC */}
        <TextInput
          onChangeText={(e) => setCnic(e)}
          style={styles.input}
          placeholder="CNIC Number"
          keyboardType="numeric"
        />

        {/* Permanent Address */}
        <TextInput
          onChangeText={(e) => setPermanentAddress(e)}
          style={[styles.input, { height: 80, paddingTop: 10 }]}
          placeholder="Permanent Address"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* CNIC Front Upload */}
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => pickImage(setCnicFront)}
        >
          <Text style={{ color: "black" }}>Upload CNIC Front</Text>
        </TouchableOpacity>
        {cnicFront && (
          <Image source={{ uri: cnicFront }} style={styles.previewImg} />
        )}

        {/* CNIC Back Upload */}
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => pickImage(setCnicBack)}
        >
          <Text style={{ color: "black" }}>Upload CNIC Back</Text>
        </TouchableOpacity>
        {cnicBack && (
          <Image source={{ uri: cnicBack }} style={styles.previewImg} />
        )}

        {/* Terms */}
        <View>
          <Text
            style={{
              fontSize: 12,
              color: "#000000",
              textAlign: "center",
              paddingTop: 20,
            }}
          >
            I accept the terms and privacy policy
          </Text>
        </View>
        <AntDesign name="checkcircle" size={24} color="#161518ff" />

        {/* Register Button */}
        <TouchableOpacity onPress={goToRigester} style={styles.registerBtn}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={{ marginTop: 20, marginBottom: 30 }}>
          <TouchableOpacity onPress={() => navigation.navigate("RiderLogin")}>
            <Text
              style={{
                fontSize: 18,
                color: "#000000",
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

const styles = {
  input: {
    borderColor: "#111",
    borderWidth: 1,
    width: "80%",
    height: 50,
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: "white",
    paddingLeft: 10,
  },
  uploadBtn: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    width: "60%",
    alignSelf: "center",
    marginTop: 15,
    alignItems: "center",
  },
  previewImg: {
    width: 120,
    height: 70,
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 6,
  },
  registerBtn: {
    width: "50%",
    height: 50,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 30,
    justifyContent: "center",
  },
  registerText: {
    fontSize: 20,
    color: "#000000",
    textAlign: "center",
  },
};

export default RiderSignup;
