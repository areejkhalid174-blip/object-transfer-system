import { Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/colors";

export default function RoleSelection({navigation}) {


  const handleSelectRole = () =>{
    navigation.navigate("RiderSignup")

  }
  const handleSelectRole2 = () =>{
    navigation.navigate("CustomerSignup")

  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 40,
          color: Colors.textSecondary,
        }}
      >
        Select Your Role
      </Text>

      {/* Rider Button */}
      <TouchableOpacity
        style={{
          width: "80%",
          backgroundColor: Colors.buttonPrimary,
          paddingVertical: 15,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20,
          shadowColor: Colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
        onPress={handleSelectRole}
      >
        <Text style={{ color: Colors.buttonText, fontSize: 18, fontWeight: "600" }}>
          Rider
        </Text>
      </TouchableOpacity>

      {/* Customer Button */}
      <TouchableOpacity
        style={{
          width: "80%",
          backgroundColor: Colors.buttonPrimary,
          paddingVertical: 15,
          borderRadius: 10,
          alignItems: "center",
          shadowColor: Colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
        onPress={handleSelectRole2}
      >
        <Text style={{ color: Colors.buttonText, fontSize: 18, fontWeight: "600" }}>
          Customer
        </Text>
      </TouchableOpacity>
    </View>
  );
}
