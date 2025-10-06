import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// Rider
import HomeRider from "./pages/HomeRider";
import Mobile from "./pages/Mobile";
import Payment2 from "./pages/Payment2";
// import RiderChat from "./pages/RiderChat";
import RiderEarning from "./pages/RiderEarning";
import RiderHistory from "./pages/RiderHistory";
import RiderOtp from "./pages/RiderOtp";
import RiderSignup from "./pages/RiderSignup";
import RiderVerification from "./pages/RiderVerification";
import Setting from "./pages/Setting";
import SupportingDocuments from "./pages/SupportingDocuments";
import VehicelInformationr from "./pages/VehicelInformationr";
import RatingRider from "./pages/RatingRider";
import SetMode from "./pages/SetMode";

// Customer
// import CustomerChat from "./pages/CustomerChat";
import CustomerHome from "./pages/CustomerHome";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerSignup from "./pages/CustomerSignup";
import Order from "./pages/Order";
import Payment from "./pages/Payment";
import Picture1 from "./pages/Picture1";
import Picture2 from "./pages/Picture2";
import RatingCustomer from "./pages/RatingCustomer";
import SelectDate from "./pages/SelectDate";
import Vehicle from "./pages/Vehicle";
import CustomerBookTrip from "./pages/CustomerBookTrip";

import RoleSelection from "./pages/select";
import VehicleSelection from "./pages/Vehicle";
import { persistor, store } from "./redux/store";

const Stack = createNativeStackNavigator();

const RiderStack = () => (
  <Stack.Navigator initialRouteName="HomeRider">
    <Stack.Screen name="Mobile" component={Mobile} />
    <Stack.Screen name="RiderOtp" component={RiderOtp} />
    <Stack.Screen name="VehicelInformationr" component={VehicelInformationr} />
    <Stack.Screen name="RiderVerification" component={RiderVerification} />
    <Stack.Screen name="SupportingDocuments" component={SupportingDocuments} />
    <Stack.Screen name="RiderHistory" component={RiderHistory} />
    <Stack.Screen name="RiderEarning" component={RiderEarning} />
    <Stack.Screen name="HomeRider" component={HomeRider} />
    <Stack.Screen name="Setting" component={Setting} />
   <Stack.Screen name="RatingRider" component={RatingRider} />
   <Stack.Screen name="SetMode" component={SetMode} />

  </Stack.Navigator>
);

const CustomerStack = () => (
  <Stack.Navigator initialRouteName="CustomerHome">
    {/* <Stack.Screen name="Mobile" component={Mobile} /> */}
    {/* <Stack.Screen name="CustomerOtp" component={CustomerOtp} /> */}
    <Stack.Screen name="CustomerHome" component={CustomerHome} />
    <Stack.Screen name="Order" component={Order} />
    <Stack.Screen name="Picture1" component={Picture1} />
    <Stack.Screen name="Picture2" component={Picture2} />
    <Stack.Screen name="Payment" component={Payment} />
    <Stack.Screen name="Payment2" component={Payment2} />
    <Stack.Screen name="SelectDate" component={SelectDate} />
    <Stack.Screen name="Vehicle" component={Vehicle} />
    <Stack.Screen name="RatingCustomer" component={RatingCustomer} />
    <Stack.Screen name="VehicleSelection" component={VehicleSelection} />
    {/* <Stack.Screen name="select" component={select} /> */}
    <Stack.Screen name="CustomerBookTrip" component={CustomerBookTrip} />

  </Stack.Navigator>
);

const App = () => {
  // Choose stack based on role
  const RenderStack = () => {
    const userRole = useSelector((state) => state.home.role);
    // alert(userRole)

    switch (userRole) {
      case "Customer":
        return <CustomerStack />;
      case "Rider":
        return <RiderStack />;
      default:
        return (
          <Stack.Navigator initialRouteName="CusromerLogin">
            <Stack.Screen name="CusromerLogin" component={CustomerLogin} />
            <Stack.Screen name="CustomerSignup" component={CustomerSignup} />
            <Stack.Screen name="RiderSignup" component={RiderSignup} />
            <Stack.Screen name="Select" component={RoleSelection} />

         

            
 
          </Stack.Navigator>
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <RenderStack />
        </Provider>
      </PersistGate>
    </SafeAreaView>
  );
};

export default App;
