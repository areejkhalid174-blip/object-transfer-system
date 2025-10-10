import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { getAllData } from "../Helper/firebaseHelper";

export default function VehicleSelection({ navigation }) {
  const [selected, setSelected] = useState(null);
const [data, setData] = useState([]);
  // const vehicles = [
  //   { id: 1, name: "Bicycle Delivery", price: "1k.00", time: "60 mins to deliver", icon: "bicycle" },
  //   { id: 2, name: "Motorbike Delivery", price: "2k.00", time: "50 mins to deliver", icon: "motorcycle" },
  //   { id: 3, name: "Car Delivery", price: "3k.00", time: "40 mins to deliver", icon: "car" },
  //   { id: 4, name: "Car-van Delivery", price: "6k.00", : "time 30 mins to deliver", icon: "shuttle-van" },
  // ];
const getCatData = async () => {
    const cDAta = await getAllData("Vehicle");
    setData(cDAta);
  };

  useEffect(() => {
    getCatData();
  }, []);

  const logOut = () =>{
    
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Select a Vehicle Type</Text>

      {data && data.length > 0 ? data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.card, selected === item.id && styles.selectedCard]}
          onPress={() => setSelected(item.id)}
        >
          <View style={styles.iconWrapper}>
            <Icon name={item.icon} size={30} color="#2c5aa0" />
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <View style={styles.radioCircle}>
            {selected === item.id ? <View style={styles.selectedDot} /> : null}
          </View>
        </TouchableOpacity>
      )) : (
        <Text style={{textAlign: 'center', marginTop: 20, color: '#666'}}>
          Loading vehicles...
        </Text>
      )}

      {/* Chat Button */}
      <TouchableOpacity 
        style={styles.chatButton}
        onPress={() => navigation.navigate("CustomerChat")}
      >
        <Icon name="comments" size={20} color="#000000" />
        <Text style={styles.chatButtonText}>Chat with Rider</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#538cc6", padding: 15 },
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#FFFFFF" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4a7ba7",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  selectedCard: { borderColor: "#4a7ba7", backgroundColor: "#e8f2ff", borderWidth: 3 },
  iconWrapper: { marginRight: 15 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  price: { fontSize: 14, fontWeight: "bold", color: "#2c5aa0" },
  time: { fontSize: 12, color: "gray" },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4a7ba7",
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginLeft: 10,
  },
});
