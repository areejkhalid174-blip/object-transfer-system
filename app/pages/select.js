import { Text, TouchableOpacity, View } from "react-native";

export default function RoleSelection({navigation}) {


  const handleSelectRole = () =>{
    navigation.navigate("RiderSignup")

  }
  const handleSelectRole2 = () =>{
    navigation.navigate("Signup")

  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F9FF",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 40,
          color: "#333",
        }}
      >
        Select Your Role
      </Text>

      {/* Rider Button */}
      <TouchableOpacity
        style={{
          width: "80%",
          backgroundColor: "#18191aff",
          paddingVertical: 15,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20,
        }}
        onPress={handleSelectRole}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          Rider
        </Text>
      </TouchableOpacity>

      {/* Customer Button */}
      <TouchableOpacity
        style={{
          width: "80%",
          backgroundColor: "#0d0f0eff",
          paddingVertical: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={handleSelectRole2}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          Customer
        </Text>
      </TouchableOpacity>
    </View>
  );
}
