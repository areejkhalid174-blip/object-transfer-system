import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { getAllData } from "../Helper/firebaseHelper";

export default function VehicleSelection() {
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

      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.card, selected === item.id && styles.selectedCard]}
          onPress={() => setSelected(item.id)}
        >
          <View style={styles.iconWrapper}>
            <Icon name={item.icon} size={30} color="black" />
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
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  selectedCard: { borderColor: "black", backgroundColor: "#f0fff0" },
  iconWrapper: { marginRight: 15 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  price: { fontSize: 14, fontWeight: "bold", color: "black" },
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
    backgroundColor: "black",
  },
});
