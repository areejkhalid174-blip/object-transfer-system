import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";

const PackageDetail = ({ navigation, route }) => {
  const { OrderName, WeightByKg, Quantity, id } = route?.params || {};

  const [packageDetail, setPackageDetail] = useState("");
  const [addDetail, setAddDetail] = useState("");

  const goToNext = () => {
    navigation.navigate("Payment", { OrderName, WeightByKg, Quantity, id, packageDetail, addDetail });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is in the Package?</Text>
      
      <TextInput
        value={packageDetail}
        onChangeText={setPackageDetail}
        style={styles.input}
        placeholder="What is in the Package ?"
      />
      
      <TextInput
        value={addDetail}
        onChangeText={setAddDetail}
        style={[styles.input, styles.textArea]}
        placeholder="Additional Note (optional)"
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity onPress={goToNext} style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#538cc6',
  },
  title: {
    fontSize: 30,
    color: "#2c5aa0",
    textAlign: "center",
    paddingTop: 10,
    marginBottom: 20,
  },
  input: {
    borderColor: "#0a0c0cff",
    borderWidth: 1,
    width: "80%",
    height: 50,
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: "white",
    paddingLeft: 10,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  button: {
    width: "50%",
    height: 50,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: "#000000",
    textAlign: "center",
  },
});

export default PackageDetail;