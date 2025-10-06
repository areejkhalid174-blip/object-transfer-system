// import { useState } from "react";
// import { Text, TextInput, TouchableOpacity, View } from "react-native";

// const PackageDetail = ({ navigation , route }) => {

//   const {OrderName, WeightByKg, Quantity, id} = route?.params|| ""

//   const [packageDetail , setPackageDetail] = useState("");
//   const [addDetail , setAddDetail] = useState("")

//   // const id = route.params.id 
//   const goToNext = () => {
//     navigation.navigate("Payment" , {OrderName, WeightByKg, Quantity, id, packageDetail, addDetail});
//   };

//   return (
//     <View>
//       <Text
//         style={{
//           fontSize: 30,
//           color: "black",
//           textAlign: "center",
//           paddingTop: 10,
//         }}
//       >
//         What is in the Package?
//       </Text>
//       <TextInput
//         style={{
//           borderColor: "#0a0c0cff",
//           borderWidth: 1,
//           width: "80%",
//           height: 50,
//           alignSelf: "center",
//           borderRadius: 10,
//           marginTop: 40,
//           backgroundColor: "white",
//           paddingLeft: 10,
//         }}
//         placeholder="What is in the Package ?"
//       />
      
//       <TextInput
//         style={{
//           borderColor: "#0e0f0fff",
//           borderWidth: 1,
//           width: "80%",
//           height: 150,
//           alignSelf: "center",
//           borderRadius: 10,
//           marginTop: 40,
//           backgroundColor: "white",
//           paddingLeft: 10,
//         }}
//         placeholder="Additional Note (optional)"
//       />
//       <TouchableOpacity
//         onPress={goToNext}
//         style={{
//           width: "50%",
//           height: 50,
//           backgroundColor: "#191b1bff",
//           alignSelf: "center",
//           borderRadius: 10,
//           marginTop: 40,
//         }}
//       >
//         <Text
//           style={{
//             fontSize: 20,
//             color: "white",
//             textAlign: "center",
//             paddingTop: 10,
//           }}
//         >
//           Next
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default PackageDetail;
