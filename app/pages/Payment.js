// jsx
// import React from 'react';
// import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { AntDesign } from '@expo/vector-icons';
// import { addData } from '../Helper/firebaseHelper';

// const Register = ({ navigation, route }) => {
//   const { OrderName, WeightByKg, Quantity, packageDetail, addDetail } = route.params;
//   const [Town, setTown] = React.useState('');
//   const [Street, setStreet] = React.useState('');
//   const [RecieverPhonenum, setRecieverPhonenum] = React.useState('');
//   const [NameofReciever, setNameofReciever] = React.useState('');

//   const goToPayment = async () => {
//     console.log(Town, Street, RecieverPhonenum, NameofReciever);
//  await addData('orders', {
//       OrderName,
//       WeightByKg,
//       Quantity,
//       packageDetail,
//       addDetail,
//     });
//     navigation.navigate('Vehicle');
//   };

//   return (
//     <ScrollView>
//       {/* Your existing code here */}
//       <TouchableOpacity onPress={goToPayment} style={{
//         width: '50%',
//         height: 50,
//         backgroundColor: '#0d0f0f',
//         alignSelf: 'center',
//         borderRadius: 10,
//         marginTop: 40,
//   }}>
//         <Text style={{
//           fontSize: 20,
//           color: 'white',
//           textAlign: 'center',
//           paddingTop: 10,
//         }}>Next</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default Register;
