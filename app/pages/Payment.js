import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { addData } from '../Helper/firebaseHelper';

const Payment = ({ navigation, route }) => {
  const { OrderName, WeightByKg, Quantity, packageDetail, addDetail } = route?.params || {};
  const [Town, setTown] = React.useState('');
  const [Street, setStreet] = React.useState('');
  const [RecieverPhonenum, setRecieverPhonenum] = React.useState('');
  const [NameofReciever, setNameofReciever] = React.useState('');

  const goToPayment = async () => {
    console.log(Town, Street, RecieverPhonenum, NameofReciever);
    try {
      await addData('orders', {
        OrderName,
        WeightByKg,
        Quantity,
        packageDetail,
        addDetail,
        Town,
        Street,
        RecieverPhonenum,
        NameofReciever,
      });
      navigation.navigate('Vehicle');
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Error saving order');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Town"
        value={Town}
        onChangeText={setTown}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Street"
        value={Street}
        onChangeText={setStreet}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Receiver Phone Number"
        value={RecieverPhonenum}
        onChangeText={setRecieverPhonenum}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Name of Receiver"
        value={NameofReciever}
        onChangeText={setNameofReciever}
      />
      
      <TouchableOpacity onPress={goToPayment} style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#538cc6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: '50%',
    height: 50,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
  },
});

export default Payment;
